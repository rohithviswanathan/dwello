import { NextFunction, Request, Response } from "express";

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
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err.stack || err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
