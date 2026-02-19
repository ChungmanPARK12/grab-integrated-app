// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { postSignupPhone, postSignupOtp } from "./auth.controller";

export const authRouter = Router();

/**
 * Signup flow:
 * 1) POST /signup/phone     -> request OTP
 * 2) POST /signup/otp       -> verify OTP (next step)
 * 3) POST /signup/username  -> set username + issue JWT (later)
 */
authRouter.post("/signup/phone", postSignupPhone);
authRouter.post("/signup/otp", postSignupOtp);
authRouter.post("/signup/username", (_req, res) => res.json({ message: "TODO" }));
