// middlewares/errorHandler
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err?.statusCode ?? 500;
  const code =
    err?.code ??
    (statusCode >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST");

  const message = statusCode >= 500 ? "internal server error" : (err?.message ?? "error");

  if (statusCode >= 500) {
    console.error("[ERROR]", err);
  }

  return res.status(statusCode).json({ code, message });
};