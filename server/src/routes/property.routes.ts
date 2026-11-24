import { Router } from "express";

import {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPublicProperties,
} from "../controllers/property.controller";

import {
  authenticate,
  requireRole,
  optionalAuthenticate,
} from "../middleware/auth.middleware";

import { UserRole } from "../generated/prisma/enums";

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

// Get single property
router.get("/:propertyId", optionalAuthenticate, getPropertyById);

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
