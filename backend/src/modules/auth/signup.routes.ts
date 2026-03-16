// src/modules/auth/signup.routes.ts
import { Router } from "express";
import {
  postSignupPhone,
  postSignupOtp,
  postSignupUsername,
} from "./auth.controller";
import { authRateLimit } from "../../middlewares/rateLimit";

export const signupRouter = Router();

/**
 * Signup flow
 */
signupRouter.post("/phone", postSignupPhone);
signupRouter.post("/otp", postSignupOtp);
signupRouter.post("/username", postSignupUsername);