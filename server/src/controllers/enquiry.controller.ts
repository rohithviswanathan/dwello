import type { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

// ======================================================
// CREATE ENQUIRY
// POST /api/enquiries/:propertyId
// ======================================================

export const createEnquiry = async (
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

    const message =
      typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      res.status(400).json({
        success: false,
        message: "Enquiry message is required.",
      });
      return;
    }

    if (message.length > 2000) {
      res.status(400).json({
        success: false,
        message: "Enquiry message cannot exceed 2000 characters.",
      });
      return;
    }

    // Verify that the property is publicly available.
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        landlordId: true,
      },
    });

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });
      return;
    }

    // Prevent a tenant from enquiring about their own property.
    if (property.landlordId === tenantId) {
      res.status(400).json({
        success: false,
        message: "You cannot enquire about your own property.",
      });
      return;
    }

    // Prevent multiple pending enquiries for the same property.
    const existingEnquiry = await prisma.enquiry.findFirst({
      where: {
        tenantId,
        propertyId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    });

    if (existingEnquiry) {
      res.status(409).json({
        success: false,
        message: "You already have a pending enquiry for this property.",
      });
      return;
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        message,
        tenantId,
        propertyId,
      },
      select: {
        id: true,
        message: true,
        status: true,
        propertyId: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Enquiry sent successfully.",
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET MY ENQUIRIES
// GET /api/enquiries/my-enquiries
// ======================================================

export const getMyEnquiries = async (
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

    const enquiries = await prisma.enquiry.findMany({
      where: {
        tenantId,
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
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET RECEIVED ENQUIRIES
// GET /api/enquiries/received
// ======================================================

export const getReceivedEnquiries = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const landlordId = req.user?.id;

    if (!landlordId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
      return;
    }

    const enquiries = await prisma.enquiry.findMany({
      where: {
        property: {
          landlordId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        property: {
          include: {
            images: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE ENQUIRY STATUS
// PATCH /api/enquiries/:enquiryId/status
// ======================================================

export const updateEnquiryStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawEnquiryId = req.params.enquiryId;

    const enquiryId = Array.isArray(rawEnquiryId)
      ? rawEnquiryId[0]
      : rawEnquiryId;

    const landlordId = req.user?.id;

    if (!enquiryId) {
      res.status(400).json({
        success: false,
        message: "Enquiry ID is required.",
      });
      return;
    }

    if (!landlordId) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
      return;
    }

    const status = req.body?.status;

    if (status !== "ACCEPTED" && status !== "REJECTED") {
      res.status(400).json({
        success: false,
        message: "Status must be either ACCEPTED or REJECTED.",
      });
      return;
    }

    // Find the enquiry and verify property ownership.
    const existingEnquiry = await prisma.enquiry.findUnique({
      where: {
        id: enquiryId,
      },
      select: {
        id: true,
        status: true,
        property: {
          select: {
            landlordId: true,
          },
        },
      },
    });

    if (!existingEnquiry) {
      res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
      return;
    }

    if (existingEnquiry.property.landlordId !== landlordId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this enquiry.",
      });
      return;
    }

    // Only pending enquiries can be accepted or rejected.
    if (existingEnquiry.status !== "PENDING") {
      res.status(400).json({
        success: false,
        message: "Only pending enquiries can be updated.",
      });
      return;
    }

    const enquiry = await prisma.enquiry.update({
      where: {
        id: enquiryId,
      },
      data: {
        status,
      },
      select: {
        id: true,
        message: true,
        status: true,
        tenantId: true,
        propertyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Enquiry ${status.toLowerCase()} successfully.`,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};
