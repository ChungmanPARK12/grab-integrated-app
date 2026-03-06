// src/routes/index.ts
import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { signupRouter } from "../modules/auth/signup.routes";
import { loginRouter } from "../modules/auth/login.routes";

const router = Router();

// Signup
router.use("/signup", signupRouter);

// Auth(Session)
router.use("/auth", authRouter);
router.use("/login", loginRouter);

export default router;