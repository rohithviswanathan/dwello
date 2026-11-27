import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateUuidParams = (...paramNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const paramName of paramNames) {
      const value = req.params[paramName];

      if (typeof value !== "string" || !z.uuid().safeParse(value).success) {
        res.status(400).json({
          success: false,
          message: `Invalid ${paramName}. A valid UUID is required.`,
        });
        return;
      }
    }

    next();
  };
};
