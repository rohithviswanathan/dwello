import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Multer upload errors
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Image exceeds the maximum allowed size of 10 MB.",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 10 images per request.",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected upload field. Use the 'images' field.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid file upload.",
    });
  }

  // Custom errors carrying an HTTP status code
  if (
    err instanceof Error &&
    "statusCode" in err &&
    typeof err.statusCode === "number" &&
    err.statusCode >= 400 &&
    err.statusCode < 500
  ) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected errors
  if (err instanceof Error) {
    console.error(err.stack || err.message);
  } else {
    console.error("Unknown error:", err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
