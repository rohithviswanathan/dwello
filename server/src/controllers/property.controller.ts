import { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createPropertySchema,
  updatePropertySchema,
  publicPropertyQuerySchema,
} from "../validators/property.validator";
import { PropertyStatus, UserRole } from "../generated/prisma/enums";

import {
  uploadPropertyImage,
  deletePropertyImage,
} from "../services/cloudinary.service";

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
      keyword,
      city,
      propertyType,
      furnishing,
      bedrooms,
      bathrooms,
      minRent,
      maxRent,
      minArea,
      maxArea,
      availableBefore,
      sort,
    } = validationResult.data;

    const skip = (page - 1) * limit;

    const normalizedKeyword = keyword?.trim();

    const availabilityDate = availableBefore
      ? new Date(`${availableBefore}T23:59:59.999Z`)
      : undefined;

    const where = {
      status: PropertyStatus.PUBLISHED,

      ...(normalizedKeyword
        ? {
            OR: [
              {
                title: {
                  contains: normalizedKeyword,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: normalizedKeyword,
                  mode: "insensitive" as const,
                },
              },
              {
                city: {
                  contains: normalizedKeyword,
                  mode: "insensitive" as const,
                },
              },
              {
                address: {
                  contains: normalizedKeyword,
                  mode: "insensitive" as const,
                },
              },
              {
                pincode: {
                  contains: normalizedKeyword,
                },
              },
            ],
          }
        : {}),

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

      ...(bathrooms !== undefined ? { bathrooms } : {}),

      ...(minRent !== undefined || maxRent !== undefined
        ? {
            rent: {
              ...(minRent !== undefined ? { gte: minRent } : {}),
              ...(maxRent !== undefined ? { lte: maxRent } : {}),
            },
          }
        : {}),

      ...(minArea !== undefined || maxArea !== undefined
        ? {
            areaSqFt: {
              ...(minArea !== undefined ? { gte: minArea } : {}),
              ...(maxArea !== undefined ? { lte: maxArea } : {}),
            },
          }
        : {}),

      ...(availabilityDate
        ? {
            availableFrom: {
              lte: availabilityDate,
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

export const publishProperty = async (
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

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        landlordId: true,
        status: true,
      },
    });

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });
      return;
    }

    if (property.landlordId !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to publish this property.",
      });
      return;
    }

    if (property.status !== PropertyStatus.DRAFT) {
      res.status(400).json({
        success: false,
        message: "Only draft properties can be published.",
      });
      return;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.PUBLISHED },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
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
      message: "Property published successfully.",
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const archiveProperty = async (
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

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        landlordId: true,
        status: true,
      },
    });

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });
      return;
    }

    if (property.landlordId !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to archive this property.",
      });
      return;
    }

    if (property.status !== PropertyStatus.PUBLISHED) {
      res.status(400).json({
        success: false,
        message: "Only published properties can be archived.",
      });
      return;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.ARCHIVED },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
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
      message: "Property archived successfully.",
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const unarchiveProperty = async (
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

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        landlordId: true,
        status: true,
      },
    });

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });
      return;
    }

    if (property.landlordId !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to unarchive this property.",
      });
      return;
    }

    if (property.status !== PropertyStatus.ARCHIVED) {
      res.status(400).json({
        success: false,
        message: "Only archived properties can be unarchived.",
      });
      return;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.DRAFT },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
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
      message: "Property restored to draft successfully.",
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPropertyImagesController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const uploadedAssets: string[] = [];

  try {
    const propertyId = Array.isArray(req.params.propertyId)
      ? req.params.propertyId[0]
      : req.params.propertyId;

    const landlordId = req.user?.id;

    const files = req.files as Express.Multer.File[] | undefined;

    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required.",
      });
    }

    // Verify property existence and ownership.
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        landlordId: true,
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    if (property.landlordId !== landlordId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this property.",
      });
    }

    // Check current image count.
    const existingImages = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        sortOrder: true,
        isPrimary: true,
      },
    });

    const MAX_IMAGES_PER_PROPERTY = 10;

    if (existingImages.length + files.length > MAX_IMAGES_PER_PROPERTY) {
      return res.status(400).json({
        success: false,
        message: `A property can have a maximum of ${MAX_IMAGES_PER_PROPERTY} images.`,
      });
    }

    const existingPrimary = existingImages.some((image) => image.isPrimary);

    // Upload images to Cloudinary.
    const cloudinaryResults = await Promise.all(
      files.map(async (file) => {
        const result = await uploadPropertyImage(file.buffer, propertyId);

        uploadedAssets.push(result.publicId);

        return result;
      }),
    );

    // Save uploaded image metadata in the database.
    const createdImages = await prisma.$transaction(async (tx) => {
      await tx.propertyImage.createMany({
        data: cloudinaryResults.map((image, index) => ({
          propertyId,
          url: image.url,
          publicId: image.publicId,
          isPrimary: !existingPrimary && index === 0,
          sortOrder: existingImages.length + index,
        })),
      });

      return tx.propertyImage.findMany({
        where: {
          propertyId,
          publicId: {
            in: cloudinaryResults.map((image) => image.publicId),
          },
        },
        orderBy: { sortOrder: "asc" },
      });
    });

    return res.status(201).json({
      success: true,
      message: "Property images uploaded successfully.",
      data: createdImages,
    });
  } catch (error) {
    // Attempt to remove Cloudinary assets if the operation failed.
    if (uploadedAssets.length > 0) {
      const cleanupResults = await Promise.allSettled(
        uploadedAssets.map((publicId) => deletePropertyImage(publicId)),
      );

      cleanupResults.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Failed to clean up Cloudinary asset:", result.reason);
        }
      });
    }

    next(error);
  }
};

export const getPropertyImagesController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const propertyId = Array.isArray(req.params.propertyId)
      ? req.params.propertyId[0]
      : req.params.propertyId;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        landlordId: true,
        status: true,
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    // Published properties are publicly accessible.
    // Draft and archived properties require owner authorization.
    if (property.status !== PropertyStatus.PUBLISHED) {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (
        !userId ||
        userRole !== UserRole.LANDLORD ||
        property.landlordId !== userId
      ) {
        return res.status(404).json({
          success: false,
          message: "Property not found.",
        });
      }
    }

    const images = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};
