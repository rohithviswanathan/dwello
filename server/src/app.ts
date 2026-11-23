import express from "express";
import cors from "cors";

import { env } from "./config/env";
import healthRoutes from "./routes/health.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(
  cors({
    origin: env.clientUrl,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/health", healthRoutes);

// Handle unknown routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
