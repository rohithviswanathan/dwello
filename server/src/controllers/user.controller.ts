import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { updateUserProfileSchema } from "../validators/user.validator";

export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const validation = updateUserProfileSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const data = validation.data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        ...(data.phone !== undefined && {
          phone: data.phone === "" ? null : data.phone,
        }),
        ...(data.location !== undefined && {
          location: data.location === "" ? null : data.location,
        }),
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

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message: "This phone number is already in use.",
      });
    }

    next(error);
  }
};
