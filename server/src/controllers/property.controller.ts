import { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { createPropertySchema } from "../validators/property.validator";
import { PropertyStatus } from "../generated/prisma/enums";

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
