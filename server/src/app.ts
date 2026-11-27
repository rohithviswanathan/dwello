import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env";

import healthRoutes from "./routes/health.routes";
import databaseRoutes from "./routes/database.routes";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import favoriteRoutes from "./routes/favourite.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import userRoutes from "./routes/user.routes";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Limit regular request body sizes to prevent oversized payloads.
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/health/db", databaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
