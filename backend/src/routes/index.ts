// src/routes/index.ts
import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { signupRouter } from "../modules/auth/signup.routes";

const router = Router();

// Signup
router.use("/signup", signupRouter);

// Auth(Session)
router.use("/auth", authRouter);

export default router;