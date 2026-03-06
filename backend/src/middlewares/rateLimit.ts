import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Please try again later.",
  },
});