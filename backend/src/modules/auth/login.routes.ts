// src/modules/auth/login.routes.ts
import { Router } from "express";
import { postLoginPhone, postLoginOtp } from "./auth.controller";
import { authRateLimit } from "../../middlewares/rateLimit";

export const loginRouter = Router();

/**
 * Login flow
 */
loginRouter.post("/phone", authRateLimit, postLoginPhone);
loginRouter.post("/otp", authRateLimit, postLoginOtp);