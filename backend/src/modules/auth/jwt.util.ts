// src/modules/auth/jwt.util.ts
import jwt, { type Secret, type SignOptions, type JwtPayload } from "jsonwebtoken";

const ACCESS_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]) ?? "15m";

const REFRESH_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]) ?? "30d";

const JWT_ALG: SignOptions["algorithm"] = "HS256";

export type AccessTokenPayload = {
  sub: string; // userId
  role?: "user" | "admin"; 
};

export type RefreshTokenPayload = {
  sub: string; // userId
  ver: number; // refresh token version (rotation / revoke 대응)
};

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

export const signAccessToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_IN, algorithm: JWT_ALG };
  return jwt.sign(payload, getAccessSecret(), options);
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN, algorithm: JWT_ALG };
  return jwt.sign(payload, getRefreshSecret(), options);
};

const assertJwtPayloadObject = (decoded: string | JwtPayload): JwtPayload => {
  if (typeof decoded === "string") throw new Error("invalid token payload");
  return decoded;
};

export const verifyAccessToken = (token: string): AccessTokenPayload & JwtPayload => {
  const decoded = jwt.verify(token, getAccessSecret(), { algorithms: [JWT_ALG] });
  return assertJwtPayloadObject(decoded) as AccessTokenPayload & JwtPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload & JwtPayload => {
  const decoded = jwt.verify(token, getRefreshSecret(), { algorithms: [JWT_ALG] });
  return assertJwtPayloadObject(decoded) as RefreshTokenPayload & JwtPayload;
};