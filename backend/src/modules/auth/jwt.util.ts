// src/modules/auth/jwt.util.ts
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const ACCESS_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]) ?? "15m";

const REFRESH_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]) ?? "30d";

const getAccessSecret = (): Secret => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("server misconfigured: missing JWT_ACCESS_SECRET");
  return secret as Secret;
};

const getRefreshSecret = (): Secret => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("server misconfigured: missing JWT_REFRESH_SECRET");
  return secret as Secret;
};

export const signAccessToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_IN };
  return jwt.sign(payload, getAccessSecret(), options);
};

export const signRefreshToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN };
  return jwt.sign(payload, getRefreshSecret(), options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, getAccessSecret());
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, getRefreshSecret());
};