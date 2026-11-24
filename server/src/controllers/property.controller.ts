import { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createPropertySchema,
  updatePropertySchema,
  publicPropertyQuerySchema,
} from "../validators/property.validator";
import { PropertyStatus, UserRole } from "../generated/prisma/enums";

export const createProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validationResult = createPropertySchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid property data.",
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });

      return;
    }

    const property = await prisma.property.create({
      data: {
        ...validationResult.data,
        availableFrom: new Date(validationResult.data.availableFrom),
        landlordId: userId,
        status: PropertyStatus.DRAFT,
      },
    });
    res.status(201).json({
      success: true,
      message: "Property created successfully.",
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProperties = async (
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

    const properties = await prisma.property.findMany({
      where: {
        landlordId: userId,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        _count: {
          select: {
            enquiries: true,
            favorites: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const propertyId = Array.isArray(req.params.propertyId)
      ? req.params.propertyId[0]
      : req.params.propertyId;

    if (!propertyId) {
      res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });

      return;
    }

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        landlord: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            enquiries: true,
            favorites: true,
          },
        },
      },
    });

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });

      return;
    }

    // Published properties are publicly accessible.
    if (property.status === PropertyStatus.PUBLISHED) {
      res.status(200).json({
        success: true,
        property,
      });

      return;
    }

    // Draft properties require the owning landlord to be authenticated.
    if (
      property.status === PropertyStatus.DRAFT &&
      req.user?.id === property.landlordId &&
      req.user?.role === UserRole.LANDLORD
    ) {
      res.status(200).json({
        success: true,
        property,
      });

      return;
    }

    // Drafts owned by others and archived properties remain inaccessible.
    res.status(404).json({
      success: false,
      message: "Property not found.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawPropertyId = req.params.propertyId;

    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    const userId = req.user?.id;

    if (!propertyId) {
      res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });

      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });

      return;
    }

    const validationResult = updatePropertySchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid property update data.",
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const existingProperty = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      select: {
        id: true,
        landlordId: true,
      },
    });

    if (!existingProperty) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });

      return;
    }

    if (existingProperty.landlordId !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this property.",
      });

      return;
    }

    const { availableFrom, ...otherFields } = validationResult.data;

    const updateData = {
      ...otherFields,
      ...(availableFrom ? { availableFrom: new Date(availableFrom) } : {}),
    };

    const updatedProperty = await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: updateData,
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        _count: {
          select: {
            enquiries: true,
            favorites: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawPropertyId = req.params.propertyId;

    const propertyId = Array.isArray(rawPropertyId)
      ? rawPropertyId[0]
      : rawPropertyId;

    const userId = req.user?.id;

    if (!propertyId) {
      res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });

      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });

      return;
    }

    const existingProperty = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      select: {
        id: true,
        landlordId: true,
      },
    });

    if (!existingProperty) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });

      return;
    }

    if (existingProperty.landlordId !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this property.",
      });

      return;
    }

    await prisma.property.delete({
      where: {
        id: propertyId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Property deleted successfully.",
      propertyId,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validationResult = publicPropertyQuerySchema.safeParse(req.query);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid property search parameters.",
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const {
      page,
      limit,
      city,
      propertyType,
      furnishing,
      bedrooms,
      minRent,
      maxRent,
      sort,
    } = validationResult.data;

    const skip = (page - 1) * limit;

    const where = {
      status: PropertyStatus.PUBLISHED,

      ...(city
        ? {
            city: {
              contains: city,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(propertyType ? { propertyType } : {}),

      ...(furnishing ? { furnishing } : {}),

      ...(bedrooms !== undefined ? { bedrooms } : {}),

      ...(minRent !== undefined || maxRent !== undefined
        ? {
            rent: {
              ...(minRent !== undefined ? { gte: minRent } : {}),
              ...(maxRent !== undefined ? { lte: maxRent } : {}),
            },
          }
        : {}),
    };

    const orderBy =
      sort === "rent_asc"
        ? { rent: "asc" as const }
        : sort === "rent_desc"
          ? { rent: "desc" as const }
          : { createdAt: "desc" as const };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
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
              enquiries: true,
              favorites: true,
            },
          },
        },
      }),

      prisma.property.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      properties,
    });
  } catch (error) {
    next(error);
  }
};
