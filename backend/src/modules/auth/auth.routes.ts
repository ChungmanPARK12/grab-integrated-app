// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { postAuthRefresh, postAuthLogout } from "./auth.controller";

export const authRouter = Router();

/**
 * Session management
 */
authRouter.post("/refresh", postAuthRefresh);
authRouter.post("/logout", postAuthLogout);