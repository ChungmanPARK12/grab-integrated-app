// src/modules/auth/auth.service.ts
import { prisma } from "../../libs/prisma";
import { authLogger } from "../../libs/authLogger";
import { generateOtp, hashOtp } from "./otp.util";
import jwt from "jsonwebtoken";
import {
  findValidRefreshToken,
  revokeRefreshToken,
  storeRefreshToken,
} from "./refreshToken.util";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt.util";
import { cleanupExpiredRefreshTokens } from "./refreshToken.util";

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

type RequestLoginOtpInput = {
  phone: string;
  ip?: string;
  userAgent?: string;
};

type VerifyLoginOtpInput = {
  requestId: string;
  otp: string;
  ip?: string;
  userAgent?: string;
};

type SignupUsernameInput = {
  username: string;
  authHeader: string;
};

type RefreshAuthTokensInput = {
  refreshToken: string;
};

type LogoutInput = {
  refreshToken: string;
};

const OTP_TTL_MINUTES = 1;
const OTP_RATE_LIMIT_SECONDS = 60;

// Temp token TTL (used only for the next step: username registration)
const TEMP_TOKEN_TTL_MINUTES = 10;

// Token purposes
const TEMP_PURPOSE = "SIGNUP_USERNAME" as const;

const httpError = (statusCode: number, message: string) => {
  const e: any = new Error(message);
  e.statusCode = statusCode;
  return e;
};

const addMinutes = (minutes: number) => new Date(Date.now() + minutes * 60 * 1000);

const verifyTempToken = (authHeader: string) => {
  if (!authHeader.startsWith("Bearer ")) {
    throw httpError(401, "missing bearer token");
  }

  const token = authHeader.slice("Bearer ".length);

  const secret = process.env.JWT_TEMP_SECRET;
  if (!secret) {
    throw httpError(500, "server misconfigured: missing JWT_TEMP_SECRET");
  }

  try {
    const payload = jwt.verify(token, secret) as any;

    if (payload?.purpose !== TEMP_PURPOSE) {
      throw httpError(401, "invalid temp token purpose");
    }

    const userId = payload?.sub as string | undefined;
    if (!userId) {
      throw httpError(401, "invalid temp token payload");
    }

    return { userId };
  } catch {
    throw httpError(401, "invalid or expired temp token");
  }
};

const getJwtExpAsDate = (token: string): Date => {
  const payloadPart = token.split(".")[1];
  const decoded = JSON.parse(Buffer.from(payloadPart, "base64").toString());
  if (!decoded?.exp) {
    throw httpError(500, "failed to read token exp");
  }
  return new Date(decoded.exp * 1000);
};

export const requestSignupOtp = async ({
  phone,
  ip,
  userAgent,
}: RequestSignupOtpInput) => {
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
      purpose: "SIGNUP",
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
  const expiresAt = addMinutes(OTP_TTL_MINUTES);

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

  authLogger.info("signup_otp_requested", {
    phone: normalizedPhone,
    requestId: created.id,
    ip,
  });

  const isDev = process.env.NODE_ENV !== "production";

  return {
    requestId: created.id,
    expiresAt: created.expiresAt.toISOString(),
    ...(isDev ? { devOtp: otp } : {}),
  };
};

export const requestLoginOtp = async ({
  phone,
  ip,
  userAgent,
}: RequestLoginOtpInput) => {
  const normalizedPhone = phone.trim();

  if (normalizedPhone.length < 8) {
    throw httpError(400, "invalid phone format");
  }

  const existingUser = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
    select: {
      id: true,
      isVerified: true,
      signupCompleted: true,
    },
  });

  if (!existingUser) {
    throw httpError(404, "user not found");
  }

  if (!existingUser.isVerified) {
    throw httpError(403, "user is not verified");
  }

  if (!existingUser.signupCompleted) {
    throw httpError(403, "signup is not completed");
  }

  const since = new Date(Date.now() - OTP_RATE_LIMIT_SECONDS * 1000);

  const recent = await prisma.otpRequest.findFirst({
    where: {
      phone: normalizedPhone,
      purpose: "LOGIN",
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
  const expiresAt = addMinutes(OTP_TTL_MINUTES);

  const created = await prisma.otpRequest.create({
    data: {
      phone: normalizedPhone,
      purpose: "LOGIN",
      codeHash,
      expiresAt,
      ip,
      userAgent,
    },
    select: { id: true, expiresAt: true },
  });

  authLogger.info("login_otp_requested", {
    phone: normalizedPhone,
    requestId: created.id,
    ip,
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
export const verifySignupOtp = async ({
  requestId,
  otp,
  ip,
  userAgent,
}: VerifySignupOtpInput) => {
  const otpTrimmed = otp.trim();

  if (!/^\d{6}$/.test(otpTrimmed)) {
    throw httpError(400, "invalid otp format");
  }

  const reqRow = await prisma.otpRequest.findUnique({
    where: { id: requestId },
  });

  if (!reqRow) {
    throw httpError(404, "otp request not found");
  }

  if (reqRow.purpose !== "SIGNUP") {
    throw httpError(400, "invalid otp purpose");
  }

  if (reqRow.consumedAt) {
    throw httpError(400, "otp already used");
  }

  if (reqRow.expiresAt.getTime() < Date.now()) {
    throw httpError(400, "otp expired");
  }

  if (reqRow.attempts >= reqRow.maxAttempts) {
    throw httpError(429, "too many attempts");
  }

  const secret = process.env.JWT_TEMP_SECRET;
  if (!secret) {
    throw httpError(500, "server misconfigured: missing JWT_TEMP_SECRET");
  }

  const expectedHash = hashOtp(reqRow.phone, otpTrimmed, secret);

  if (expectedHash !== reqRow.codeHash) {
    const nextAttempts = reqRow.attempts + 1;

    await prisma.otpRequest.update({
      where: { id: reqRow.id },
      data: {
        attempts: nextAttempts,
        ip,
        userAgent,
      },
    });

    authLogger.warn("signup_otp_failed", {
      requestId,
      phone: reqRow.phone,
      nextAttempts,
      ip,
    });

    if (nextAttempts >= reqRow.maxAttempts) {
      throw httpError(429, "too many attempts");
    }

    throw httpError(400, "invalid otp");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.otpRequest.update({
      where: { id: reqRow.id },
      data: {
        consumedAt: new Date(),
        ip,
        userAgent,
      },
    });

    const user = await tx.user.upsert({
      where: { phone: reqRow.phone },
      update: { isVerified: true },
      create: { phone: reqRow.phone, isVerified: true },
      select: { id: true, phone: true },
    });

    const tempToken = jwt.sign(
      {
        sub: user.id,
        phone: user.phone,
        purpose: TEMP_PURPOSE,
      },
      secret,
      { expiresIn: `${TEMP_TOKEN_TTL_MINUTES}m` }
    );

    return { tempToken, userId: user.id };
  });

  authLogger.info("signup_otp_verified", {
    requestId,
    userId: result.userId,
    ip,
  });

  return {
    verified: true,
    tempToken: result.tempToken,
  };
};

export const verifyLoginOtp = async ({
  requestId,
  otp,
  ip,
  userAgent,
}: VerifyLoginOtpInput) => {
  const otpTrimmed = otp.trim();

  if (!/^\d{6}$/.test(otpTrimmed)) {
    throw httpError(400, "invalid otp format");
  }

  const reqRow = await prisma.otpRequest.findUnique({
    where: { id: requestId },
  });

  if (!reqRow) {
    throw httpError(404, "otp request not found");
  }

  if (reqRow.purpose !== "LOGIN") {
    throw httpError(400, "invalid otp purpose");
  }

  if (reqRow.consumedAt) {
    throw httpError(400, "otp already used");
  }

  if (reqRow.expiresAt.getTime() < Date.now()) {
    throw httpError(400, "otp expired");
  }

  if (reqRow.attempts >= reqRow.maxAttempts) {
    throw httpError(429, "too many attempts");
  }

  const secret = process.env.JWT_TEMP_SECRET;
  if (!secret) {
    throw httpError(500, "server misconfigured: missing JWT_TEMP_SECRET");
  }

  const expectedHash = hashOtp(reqRow.phone, otpTrimmed, secret);

  if (expectedHash !== reqRow.codeHash) {
    const nextAttempts = reqRow.attempts + 1;

    await prisma.otpRequest.update({
      where: { id: reqRow.id },
      data: {
        attempts: nextAttempts,
        ip,
        userAgent,
      },
    });

    authLogger.warn("login_otp_failed", {
      requestId,
      phone: reqRow.phone,
      nextAttempts,
      ip,
    });

    if (nextAttempts >= reqRow.maxAttempts) {
      throw httpError(429, "too many attempts");
    }

    throw httpError(400, "invalid otp");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.otpRequest.update({
      where: { id: reqRow.id },
      data: {
        consumedAt: new Date(),
        ip,
        userAgent,
      },
    });

    const user = await tx.user.findUnique({
      where: { phone: reqRow.phone },
      select: {
        id: true,
        phone: true,
        username: true,
        isVerified: true,
        signupCompleted: true,
        role: true,
      },
    });

    if (!user) {
      throw httpError(404, "user not found");
    }

    if (!user.isVerified) {
      throw httpError(403, "user is not verified");
    }

    if (!user.signupCompleted) {
      throw httpError(403, "signup is not completed");
    }

    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
      ver: 0,
    });

    await storeRefreshToken({
      userId: user.id,
      refreshToken,
      expiresAt: getJwtExpAsDate(refreshToken),
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  });

  authLogger.info("login_success", {
    requestId,
    userId: result.user.id,
    ip,
  });

  return {
    ok: true,
    ...result,
  };
};

export const signupUsername = async ({
  username,
  authHeader,
}: SignupUsernameInput) => {
  const normalized = username.trim().toLowerCase();

  if (normalized.length < 3 || normalized.length > 20) {
    throw httpError(400, "invalid username length");
  }
  if (!/^[a-z0-9._]+$/.test(normalized)) {
    throw httpError(400, "invalid username format");
  }

  const { userId } = verifyTempToken(authHeader);

  let updatedUser: {
    id: string;
    phone: string;
    username: string | null;
    role: "user" | "admin";
    isVerified: boolean;
    signupCompleted: boolean;
  };

  try {
    updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: normalized,
        signupCompleted: true,
      },
      select: {
        id: true,
        phone: true,
        username: true,
        role: true,
        isVerified: true,
        signupCompleted: true,
      },
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      throw httpError(409, "username already taken");
    }
    throw e;
  }

  const accessToken = signAccessToken({
    sub: updatedUser.id,
    role: updatedUser.role,
  });

  const refreshToken = signRefreshToken({ sub: updatedUser.id, ver: 0 });

  await storeRefreshToken({
    userId: updatedUser.id,
    refreshToken,
    expiresAt: getJwtExpAsDate(refreshToken),
  });

  authLogger.info("signup_completed", {
    userId: updatedUser.id,
    phone: updatedUser.phone,
  });

  return {
    ok: true,
    user: updatedUser,
    accessToken,
    refreshToken,
  };
};

/**
 * POST /auth/refresh
 * - verify refresh JWT (signature/expiry + typ)
 * - check DB session (not revoked, not expired)
 * - rotate (revoke old, issue new pair, store new refresh hash)
 */
export const refreshAuthTokens = async ({
  refreshToken,
}: RefreshAuthTokensInput) => {
  await cleanupExpiredRefreshTokens();

  const decoded = verifyRefreshToken(refreshToken);
  const userId = decoded.sub;

  const session = await findValidRefreshToken(refreshToken);
  if (!session) {
    throw httpError(401, "refresh token revoked or not found");
  }

  if (session.userId !== userId) {
    throw httpError(401, "token user mismatch");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw httpError(404, "user not found");
  }

  await revokeRefreshToken(refreshToken);
  
  const newAccessToken = signAccessToken({
    sub: user.id,
    role: user.role,
  });

  const newRefreshToken = signRefreshToken({
    sub: user.id,
    ver: decoded.ver ?? 0,
  });

  await storeRefreshToken({
    userId: user.id,
    refreshToken: newRefreshToken,
    expiresAt: getJwtExpAsDate(newRefreshToken),
  });

  authLogger.info("refresh_rotated", {
    userId,
  });

  return {
    ok: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * POST /auth/logout
 * - revoke refresh session (idempotent)
 */
export const logout = async ({ refreshToken }: LogoutInput) => {
  await revokeRefreshToken(refreshToken);

  authLogger.info("logout", {
    action: "refresh_session_revoked",
  });

  return { ok: true };
};

export const getAuthMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw httpError(404, "user not found");
  }

  return user;
};