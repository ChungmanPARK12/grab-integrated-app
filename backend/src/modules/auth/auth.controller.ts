import type { Request, Response } from "express";
import { asyncHandler } from "../../libs/asyncHandler";
import {
  checkSignupPhoneAvailability,
  requestSignupOtp,
  verifySignupOtp,
  signupUsername,
  requestLoginOtp,
  verifyLoginOtp,
  refreshAuthTokens,
  logout,
  getAuthMe as getAuthMeService,
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
 * POST /signup/check-phone
 * Body: { phone: string }
 */
export const postSignupCheckPhone = asyncHandler(async (req: Request, res: Response) => {
  const phone = requireString((req.body as any)?.phone, "phone");

  const result = await checkSignupPhoneAvailability({ phone });

  return res.status(200).json(result);
});

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
 * POST /login/phone
 * Body: { phone: string }
 */
export const postLoginPhone = asyncHandler(async (req: Request, res: Response) => {
  const phone = requireString((req.body as any)?.phone, "phone");

  const result = await requestLoginOtp({
    phone,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  });

  return res.status(200).json(result);
});

/**
 * POST /login/otp
 * Body: { requestId: string, otp: string }
 */
export const postLoginOtp = asyncHandler(async (req: Request, res: Response) => {
  const requestId = requireString((req.body as any)?.requestId, "requestId");
  const otp = requireString((req.body as any)?.otp, "otp");

  const result = await verifyLoginOtp({
    requestId,
    otp,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  });

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

/**
 * GET /auth/me
 * Authorization: Bearer <accessToken>
 */
export const getAuthMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw httpError(401, "unauthorized");

  const user = await getAuthMeService(req.user.userId);

  return res.status(200).json(user);
});