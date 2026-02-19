// src/modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { requestSignupOtp, verifySignupOtp } from "./auth.service";

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
