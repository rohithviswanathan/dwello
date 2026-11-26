import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

// ======================================================
// ADD FAVORITE
// POST /api/favorites/:propertyId
// ======================================================

export const addFavorite = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawPropertyId = req.params.propertyId;

    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    const tenantId = req.user?.id;

    if (!propertyId) {
      res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });
      return;
    }

    if (!tenantId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
      return;
    }

    // Verify the property exists and is publicly available.
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        status: "PUBLISHED",
      },
      select: {
        id: true,
      },
    });

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });
      return;
    }

    // Check whether the property is already favorited.
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId,
          propertyId,
        },
      },
    });

    if (existingFavorite) {
      res.status(409).json({
        success: false,
        message: "Property is already in your favorites.",
      });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: {
        tenantId,
        propertyId,
      },
      select: {
        id: true,
        propertyId: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Property added to favorites successfully.",
      favorite,
    });
  } catch (error) {
    // Handle concurrent duplicate requests safely.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "Property is already in your favorites.",
      });
      return;
    }

    next(error);
  }
};

// ======================================================
// GET MY FAVORITES
// GET /api/favorites
// ======================================================

export const getMyFavorites = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tenantId = req.user?.id;

    if (!tenantId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
      return;
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        tenantId,
        property: {
          status: "PUBLISHED",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        property: {
          include: {
            images: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
            landlord: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                favorites: true,
                enquiries: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// REMOVE FAVORITE
// DELETE /api/favorites/:propertyId
// ======================================================

export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawPropertyId = req.params.propertyId;

    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    const tenantId = req.user?.id;

    if (!propertyId) {
      res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });
      return;
    }

    if (!tenantId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
      return;
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId,
          propertyId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!favorite) {
      res.status(404).json({
        success: false,
        message: "Favorite not found.",
      });
      return;
    }

    await prisma.favorite.delete({
      where: {
        tenantId_propertyId: {
          tenantId,
          propertyId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Property removed from favorites successfully.",
      propertyId,
    });
  } catch (error) {
    next(error);
  }
};
