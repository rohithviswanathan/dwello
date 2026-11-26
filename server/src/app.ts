import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";

import healthRoutes from "./routes/health.routes";
import databaseRoutes from "./routes/database.routes";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import favoriteRoutes from "./routes/favourite.routes";
import enquiryRoutes from "./routes/enquiry.routes";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/health/db", databaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
