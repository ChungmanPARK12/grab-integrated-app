import { Router } from "express";
import { postAuthRefresh, postAuthLogout, getAuthMe } from "./auth.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { authRateLimit } from "../../middlewares/rateLimit";

export const authRouter = Router();

/**
 * Session management
 */
authRouter.post("/refresh", authRateLimit, postAuthRefresh);
authRouter.post("/logout", postAuthLogout);

/**
 * Protected route
 * Returns current authenticated user
 */
authRouter.get("/me", requireAuth, getAuthMe);