import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const nodeEnv = process.env.NODE_ENV || "development";

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

const refreshTokenExpiresInDays = Number(
  process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7,
);

if (!jwtAccessSecret) {
  throw new Error("JWT_ACCESS_SECRET is not configured.");
}

if (
  !Number.isFinite(refreshTokenExpiresInDays) ||
  refreshTokenExpiresInDays <= 0
) {
  throw new Error("REFRESH_TOKEN_EXPIRES_IN_DAYS must be a positive number.");
}

export const env = {
  port,
  clientUrl,
  nodeEnv,
  jwtAccessSecret,
  jwtAccessExpiresIn,
  refreshTokenExpiresInDays,
};
