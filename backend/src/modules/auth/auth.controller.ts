// src/modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { requestSignupOtp, verifySignupOtp, signupUsername } from "./auth.service";
import { asyncHandler } from "../../libs/asyncHandler";

/**
 * POST /signup/phone
 * Body: { phone: string }
 */
export const postSignupPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body as { phone?: string };

    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ message: "phone is required" });
    }

    const result = await requestSignupOtp({
      phone,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? undefined,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    const message = err?.message ?? "Internal Server Error";
    const status = err?.statusCode ?? 500;
    return res.status(status).json({ message });
  }
};

/**
 * POST /signup/otp
 * Body: { requestId: string, otp: string }
 */
export const postSignupOtp = async (req: Request, res: Response) => {
  try {
    const { requestId, otp } = req.body as { requestId?: string; otp?: string };

    if (!requestId || typeof requestId !== "string") {
      return res.status(400).json({ message: "requestId is required" });
    }
    if (!otp || typeof otp !== "string") {
      return res.status(400).json({ message: "otp is required" });
    }

    const result = await verifySignupOtp({
      requestId,
      otp,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? undefined,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    const message = err?.message ?? "Internal Server Error";
    const status = err?.statusCode ?? 500;
    return res.status(status).json({ message });
  }
};

/**
 * POST /signup/username
 * Authorization: Bearer <tempToken>
 * Body: { username: string }
 */

export const postSignupUsername = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const e: any = new Error("missing authorization");
    e.statusCode = 401;
    throw e;
  }

  const { username } = req.body as { username?: string };
  if (!username) {
    const e: any = new Error("username is required");
    e.statusCode = 400;
    throw e;
  }

  const result = await signupUsername({ username, authHeader });
  return res.status(200).json(result);
});
