// src/modules/auth/auth.routes.ts
import { Router } from "express";
import {
  postSignupPhone,
  postSignupOtp,
  postSignupUsername,
  postAuthRefresh,
  postAuthLogout,
} from "./auth.controller";

export const authRouter = Router();

/**
 * Signup flow:
 * 1) POST /signup/phone     -> request OTP
 * 2) POST /signup/otp       -> verify OTP (next step)
 * 3) POST /signup/username  -> set username + issue JWT
 */
authRouter.post("/signup/phone", postSignupPhone);
authRouter.post("/signup/otp", postSignupOtp);
authRouter.post("/signup/username", postSignupUsername);

/**
 * Session management:
 * 4) POST /auth/refresh     -> rotate refresh token, issue new access token
 * 5) POST /auth/logout      -> revoke refresh token
 */
authRouter.post("/auth/refresh", postAuthRefresh);
authRouter.post("/auth/logout", postAuthLogout);