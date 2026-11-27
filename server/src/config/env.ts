import dotenv from "dotenv";

dotenv.config();

// Environment
const nodeEnv = process.env.NODE_ENV || "development";

if (!["development", "test", "production"].includes(nodeEnv)) {
  throw new Error("NODE_ENV must be development, test, or production.");
}

// Port
const portValue = process.env.PORT || "5000";
const port = Number(portValue);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port between 1 and 65535.");
}

// Frontend URL
const clientUrlValue =
  process.env.CLIENT_URL ||
  (nodeEnv === "development" ? "http://localhost:5173" : "");

if (!clientUrlValue) {
  throw new Error("CLIENT_URL is required in production.");
}

let clientUrl: string;

try {
  const parsedUrl = new URL(clientUrlValue);

  if (
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    parsedUrl.pathname !== "/" ||
    parsedUrl.search ||
    parsedUrl.hash
  ) {
    throw new Error();
  }

  clientUrl = parsedUrl.origin;
} catch {
  throw new Error(
    "CLIENT_URL must be a valid frontend origin, such as https://example.com.",
  );
}

// JWT access token
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret || !jwtAccessSecret.trim()) {
  throw new Error("JWT_ACCESS_SECRET is not configured.");
}

const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

if (!/^[1-9]\d*(ms|s|m|h|d|w|y)$/i.test(jwtAccessExpiresIn)) {
  throw new Error(
    "JWT_ACCESS_EXPIRES_IN must be a valid positive duration, such as 15m or 1h.",
  );
}

// Refresh token
const refreshTokenExpiresInDays = Number(
  process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7,
);

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
