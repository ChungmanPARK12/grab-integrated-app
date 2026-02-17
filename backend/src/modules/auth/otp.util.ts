// src/modules/auth/otp.util.ts
import crypto from "crypto";

export const generateOtp = (): string => {
  // 000000 ~ 999999
  const n = crypto.randomInt(0, 1_000_000);
  return String(n).padStart(6, "0");
};

export const hashOtp = (phone: string, otp: string, secret: string): string => {
  // phone not reuse + server secret HMAC
  return crypto.createHmac("sha256", secret).update(`${phone}:${otp}`).digest("hex");
};
