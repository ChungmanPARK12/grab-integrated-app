// src/types/express/index.d.ts
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: "user" | "admin";
      };
    }
  }
}