// src/middlewares/requireAuth.ts
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../modules/auth/jwt.util";

class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message = "Unauthorized") {
    super(message);
  }
}

const parseBearer = (req: Request): string => {
  const header = req.headers.authorization;

  if (!header) throw new UnauthorizedError("Missing Authorization header");

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("Invalid Authorization header format");
  }

  return token;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = parseBearer(req);

    const decoded = verifyAccessToken(token);

    req.user = {
      userId: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (err) {
    next(err);
  }
};