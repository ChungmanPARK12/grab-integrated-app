// src/modules/auth/auth.service.ts
import { prisma } from "../../libs/prisma";
import { generateOtp, hashOtp } from "./otp.util";
import jwt from "jsonwebtoken";

type RequestSignupOtpInput = {
  phone: string;
  ip?: string;
  userAgent?: string;
};

type VerifySignupOtpInput = {
  requestId: string;
  otp: string;
  ip?: string;
  userAgent?: string;
};

const OTP_TTL_MINUTES = 1;
const OTP_RATE_LIMIT_SECONDS = 60;

// Temp token TTL (used only for the next step: username registration)
const TEMP_TOKEN_TTL_MINUTES = 10;

const httpError = (statusCode: number, message: string) => {
  const e: any = new Error(message);
  e.statusCode = statusCode;
  return e;
};

export const requestSignupOtp = async ({ phone, ip, userAgent }: RequestSignupOtpInput) => {
  const normalizedPhone = phone.trim();

  if (normalizedPhone.length < 8) {
    throw httpError(400, "invalid phone format");
  }

  const existingUser = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
    select: { id: true, isVerified: true },
  });

  if (existingUser?.isVerified) {
    throw httpError(409, "phone is already registered");
  }

  const since = new Date(Date.now() - OTP_RATE_LIMIT_SECONDS * 1000);

  const recent = await prisma.otpRequest.findFirst({
    where: {
      phone: normalizedPhone,
      consumedAt: null,
      createdAt: { gte: since },
    },
    select: { id: true, expiresAt: true },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    throw httpError(429, "too many requests. please wait a moment");
  }

  const otp = generateOtp();

  const secret = process.env.JWT_TEMP_SECRET;
  if (!secret) {
    throw httpError(500, "server misconfigured: missing JWT_TEMP_SECRET");
  }

  const codeHash = hashOtp(normalizedPhone, otp, secret);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  const created = await prisma.otpRequest.create({
    data: {
      phone: normalizedPhone,
      purpose: "SIGNUP",
      codeHash,
      expiresAt,
      ip,
      userAgent,
    },
    select: { id: true, expiresAt: true },
  });

  const isDev = process.env.NODE_ENV !== "production";

  return {
    requestId: created.id,
    expiresAt: created.expiresAt.toISOString(),
    ...(isDev ? { devOtp: otp } : {}),
  };
};

/**
 * Verifies signup OTP.
 * - Validates request existence, expiry, consumption
 * - Hash-compares OTP
 * - Increments attempts on failure
 * - On success: marks consumedAt + upserts verified user + returns temp token
 */
export const verifySignupOtp = async ({ requestId, otp, ip, userAgent }: VerifySignupOtpInput) => {
  const otpTrimmed = otp.trim();

  // Minimal sanity check
  if (!/^\d{6}$/.test(otpTrimmed)) {
    throw httpError(400, "invalid otp format");
  }

  const reqRow = await prisma.otpRequest.findUnique({
    where: { id: requestId },
  });

  if (!reqRow) {
    throw httpError(404, "otp request not found");
  }

  if (reqRow.consumedAt) {
    throw httpError(400, "otp already used");
  }

  if (reqRow.expiresAt.getTime() < Date.now()) {
    throw httpError(400, "otp expired");
  }

  // Block if already exceeded attempts
  if (reqRow.attempts >= reqRow.maxAttempts) {
    throw httpError(429, "too many attempts");
  }

  const secret = process.env.JWT_TEMP_SECRET;
  if (!secret) {
    throw httpError(500, "server misconfigured: missing JWT_TEMP_SECRET");
  }

  const expectedHash = hashOtp(reqRow.phone, otpTrimmed, secret);

  // If OTP is wrong: increase attempts and return error
  if (expectedHash !== reqRow.codeHash) {
    const nextAttempts = reqRow.attempts + 1;

    await prisma.otpRequest.update({
      where: { id: reqRow.id },
      data: {
        attempts: nextAttempts,
        // Optionally record metadata on verification attempts
        ip,
        userAgent,
      },
    });

    if (nextAttempts >= reqRow.maxAttempts) {
      throw httpError(429, "too many attempts");
    }

    throw httpError(400, "invalid otp");
  }

  // OTP is correct -> finalize in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const consumed = await tx.otpRequest.update({
      where: { id: reqRow.id },
      data: {
        consumedAt: new Date(),
        ip,
        userAgent,
      },
    });

    // Create user only after OTP verification (recommended strategy)
    const user = await tx.user.upsert({
      where: { phone: reqRow.phone },
      update: { isVerified: true },
      create: { phone: reqRow.phone, isVerified: true },
      select: { id: true, phone: true },
    });

    // Issue a short-lived temp token for the username step
    const tempToken = jwt.sign(
      {
        sub: user.id,
        phone: user.phone,
        purpose: "SIGNUP_USERNAME",
      },
      secret,
      { expiresIn: `${TEMP_TOKEN_TTL_MINUTES}m` }
    );

    return { user, consumed, tempToken };
  });

  return {
    verified: true,
    tempToken: result.tempToken,
  };
};
