// src/modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { requestSignupOtp } from "./auth.service";

/**
 * POST /signup/phone
 * Body: { phone: string }
 */
export const postSignupPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body as { phone?: string };

    // Basic validation (keep it simple; upgrade later to libphonenumber)
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
    // Keep error handling predictable for the client
    const message = err?.message ?? "Internal Server Error";
    const status = err?.statusCode ?? 500;

    return res.status(status).json({ message });
  }
};
