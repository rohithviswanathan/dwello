import crypto from "node:crypto";
import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

export const REFRESH_COOKIE_NAME = "dwello_refresh";

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ role }, env.jwtAccessSecret, {
    subject: userId,
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
  });
};

export const getRefreshTokenExpiry = (): Date => {
  const expiry = new Date();

  expiry.setDate(expiry.getDate() + env.refreshTokenExpiresInDays);

  return expiry;
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
};

export const clearRefreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
};
