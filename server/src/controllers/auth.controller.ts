import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
  clearRefreshCookieOptions,
} from "../utils/auth.utils";

// ======================================================
// VALIDATION
// ======================================================

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100),

    email: z
      .string()
      .trim()
      .max(255, "Email must not exceed 255 characters.")
      .pipe(z.email("Please provide a valid email address.")),

    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^\+?[0-9]{7,15}$/.test(value),
        "Please provide a valid phone number.",
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "Password cannot exceed 72 bytes.",
      ),

    role: z.enum(["tenant", "landlord"]),
  })
  .strict();

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .pipe(z.email("Please provide a valid email address.")),

    password: z.string().min(1, "Password is required."),
  })
  .strict();

// ======================================================
// REGISTER
// ======================================================

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const { name, email, phone, password, role } = parsed.data;

    const normalizedEmail = email.toLowerCase();
    const normalizedPhone = phone || null;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
      },
      select: {
        email: true,
        phone: true,
      },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? "An account with this email already exists."
            : "An account with this phone number already exists.",
      });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        role: role === "tenant" ? UserRole.TENANT : UserRole.LANDLORD,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "An account with this email or phone number already exists.",
      });

      return;
    }

    next(error);
  }
};

// ======================================================
// LOGIN
// ======================================================

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

      return;
    }

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await prisma.session.create({
      data: {
        refreshTokenHash,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

    const accessToken = generateAccessToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken || typeof refreshToken !== "string") {
      res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);

      res.status(401).json({
        success: false,
        message: "Refresh token is missing.",
      });

      return;
    }

    const currentTokenHash = hashRefreshToken(refreshToken);

    const session = await prisma.session.findUnique({
      where: {
        refreshTokenHash: currentTokenHash,
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      if (session && !session.revokedAt) {
        await prisma.session.update({
          where: {
            id: session.id,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      }

      res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);

      res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired.",
      });

      return;
    }

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
    const now = new Date();

    // Conditional update ensures a refresh token can only be rotated once.
    const rotation = await prisma.session.updateMany({
      where: {
        id: session.id,
        refreshTokenHash: currentTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        lastUsedAt: now,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    if (rotation.count !== 1) {
      res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);

      res.status(401).json({
        success: false,
        message: "Refresh token is no longer valid.",
      });

      return;
    }

    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, refreshCookieOptions);

    const accessToken = generateAccessToken(session.user.id, session.user.role);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// LOGOUT
// ======================================================

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (refreshToken && typeof refreshToken === "string") {
      const refreshTokenHash = hashRefreshToken(refreshToken);

      await prisma.session.updateMany({
        where: {
          refreshTokenHash,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });

      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
