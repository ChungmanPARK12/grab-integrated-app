// src/modules/auth/auth.service.ts
import { prisma } from "../../libs/prisma";
import { generateOtp, hashOtp } from "./otp.util";

/**
 * Service input type for OTP request.
 */
type RequestSignupOtpInput = {
  phone: string;
  ip?: string;
  userAgent?: string;
};

/**
 * How long OTP is valid.
 */
const OTP_TTL_MINUTES = 5;

/**
 * Basic rate limit window (same phone cannot request OTP too frequently).
 */
const OTP_RATE_LIMIT_SECONDS = 60;

/**
 * A small helper to throw typed errors that controllers can map to HTTP status.
 */
const httpError = (statusCode: number, message: string) => {
  const e: any = new Error(message);
  e.statusCode = statusCode;
  return e;
};

/**
 * Requests an OTP for signup by phone.
 * - Applies a simple rate limit per phone (last 60s)
 * - Stores ONLY the hashed OTP in DB
 * - Returns devOtp only in development (for testing)
 */
export const requestSignupOtp = async ({ phone, ip, userAgent }: RequestSignupOtpInput) => {
  // Basic normalization (you can improve this later)
  const normalizedPhone = phone.trim();

  // Very lightweight sanity check. (Better: libphonenumber parsing)
  if (normalizedPhone.length < 8) {
    throw httpError(400, "invalid phone format");
  }

  // If a verified user already exists, you can either:
  // - block signup, or
  // - treat it as login flow.
  // For now: block to keep signup flow strict.
  const existingUser = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
    select: { id: true, isVerified: true },
  });

  if (existingUser?.isVerified) {
    throw httpError(409, "phone is already registered");
  }

  // Simple rate limit: if there is a recent unconsumed request, block it.
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

  // Generate OTP and hash it with server secret
  const otp = generateOtp();

  const secret = process.env.JWT_TEMP_SECRET;
  if (!secret) {
    // Configuration error - should not happen in a properly set env
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

  // In production, never return OTP.
  const isDev = process.env.NODE_ENV !== "production";

  return {
    requestId: created.id,
    expiresAt: created.expiresAt.toISOString(),
    ...(isDev ? { devOtp: otp } : {}),
  };
};
