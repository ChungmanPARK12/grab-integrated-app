// src/modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../../libs/asyncHandler";
import {
  requestSignupOtp,
  verifySignupOtp,
  signupUsername,
  refreshAuthTokens,
  logout,
} from "./auth.service";

const httpError = (statusCode: number, message: string) => {
  const e: any = new Error(message);
  e.statusCode = statusCode;
  return e;
};

const requireString = (value: unknown, fieldName: string) => {
  if (!value || typeof value !== "string") {
    throw httpError(400, `${fieldName} is required`);
  }
  return value;
};

/**
 * POST /signup/phone
 * Body: { phone: string }
 */
export const postSignupPhone = asyncHandler(async (req: Request, res: Response) => {
  const phone = requireString((req.body as any)?.phone, "phone");

  const result = await requestSignupOtp({
    phone,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  });

  return res.status(200).json(result);
});

/**
 * POST /signup/otp
 * Body: { requestId: string, otp: string }
 */
export const postSignupOtp = asyncHandler(async (req: Request, res: Response) => {
  const requestId = requireString((req.body as any)?.requestId, "requestId");
  const otp = requireString((req.body as any)?.otp, "otp");

  const result = await verifySignupOtp({
    requestId,
    otp,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  });

  return res.status(200).json(result);
});

/**
 * POST /signup/username
 * Authorization: Bearer <tempToken>
 * Body: { username: string }
 */
export const postSignupUsername = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw httpError(401, "missing authorization");

  const username = requireString((req.body as any)?.username, "username");

  const result = await signupUsername({ username, authHeader });
  return res.status(200).json(result);
});

/**
 * POST /auth/refresh
 * Body: { refreshToken: string }
 */
export const postAuthRefresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = requireString((req.body as any)?.refreshToken, "refreshToken");

  const result = await refreshAuthTokens({ refreshToken });
  return res.status(200).json(result);
});

/**
 * POST /auth/logout
 * Body: { refreshToken: string }
 */
export const postAuthLogout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = requireString((req.body as any)?.refreshToken, "refreshToken");

  await logout({ refreshToken });
  return res.sendStatus(204);
});