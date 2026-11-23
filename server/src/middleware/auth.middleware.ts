import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";
import { UserRole } from "../generated/prisma/enums";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });

    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication token is missing.",
    });

    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret);

    if (typeof decoded === "string") {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });

      return;
    }

    const payload = decoded as JwtPayload;

    const userId = payload.sub;
    const role = payload.role;

    if (!userId || (role !== UserRole.TENANT && role !== UserRole.LANDLORD)) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token payload.",
      });

      return;
    }

    req.user = {
      id: userId,
      role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });

    return;
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });

      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });

      return;
    }

    next();
  };
};
