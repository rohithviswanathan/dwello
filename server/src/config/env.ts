import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const nodeEnv = process.env.NODE_ENV || "development";

export const env = {
  port,
  clientUrl,
  nodeEnv,
};
