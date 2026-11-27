import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
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

  // Custom errors carrying a valid HTTP 4xx status code
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

  // Oversized request bodies
  if (
    err instanceof Error &&
    "type" in err &&
    err.type === "entity.too.large"
  ) {
    return res.status(413).json({
      success: false,
      message: "Request body exceeds the maximum allowed size of 100 KB.",
    });
  }

  // Malformed JSON request bodies
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  if (err instanceof Error) {
    console.error("[API Error]", err.stack || err.message);
  } else {
    console.error("[API Error] Unknown error:", err);
  }

  // Never expose internal server error details to clients
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
