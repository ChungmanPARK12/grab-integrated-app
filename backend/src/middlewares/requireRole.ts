// src/middlewares/requireRole.ts
import type { Request, Response, NextFunction } from "express";

class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message = "Forbidden") {
    super(message);
  }
}

export const requireRole =
  (role: "user" | "admin") => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.userId) return next(new ForbiddenError("Auth required"));
    if (req.user.role !== role) return next(new ForbiddenError("Insufficient permissions"));
    return next();
  };