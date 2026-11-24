import { Router } from "express";

import {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPublicProperties,
  publishProperty,
  archiveProperty,
  unarchiveProperty,
  uploadPropertyImagesController,
  getPropertyImagesController,
} from "../controllers/property.controller";

import {
  authenticate,
  requireRole,
  optionalAuthenticate,
} from "../middleware/auth.middleware";

import { UserRole } from "../generated/prisma/enums";
import { uploadPropertyImages } from "../middleware/upload.middleware";
import { validatePropertyImages } from "../middleware/image-validation.middleware";

const router = Router();

// Public property listings
router.get("/", getPublicProperties);

// Create property
router.post("/", authenticate, requireRole(UserRole.LANDLORD), createProperty);

// Landlord's properties
router.get(
  "/my-properties",
  authenticate,
  requireRole(UserRole.LANDLORD),
  getMyProperties,
);

// Upload property images
router.post(
  "/:propertyId/images",
  authenticate,
  requireRole(UserRole.LANDLORD),
  uploadPropertyImages,
  validatePropertyImages,
  uploadPropertyImagesController,
);

// Publish property
router.patch(
  "/:propertyId/publish",
  authenticate,
  requireRole(UserRole.LANDLORD),
  publishProperty,
);

// Archive property
router.patch(
  "/:propertyId/archive",
  authenticate,
  requireRole(UserRole.LANDLORD),
  archiveProperty,
);

// Unarchive property
router.patch(
  "/:propertyId/unarchive",
  authenticate,
  requireRole(UserRole.LANDLORD),
  unarchiveProperty,
);

// Get single property
router.get("/:propertyId", optionalAuthenticate, getPropertyById);

router.get(
  "/:propertyId/images",
  optionalAuthenticate,
  getPropertyImagesController,
);

// Update property
router.put(
  "/:propertyId",
  authenticate,
  requireRole(UserRole.LANDLORD),
  updateProperty,
);

// Delete property
router.delete(
  "/:propertyId",
  authenticate,
  requireRole(UserRole.LANDLORD),
  deleteProperty,
);

export default router;
