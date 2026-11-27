import { Router } from "express";

import {
  createEnquiry,
  getMyEnquiries,
  getReceivedEnquiries,
  updateEnquiryStatus,
} from "../controllers/enquiry.controller";

import { authenticate, requireRole } from "../middleware/auth.middleware";
import { validateUuidParams } from "../middleware/validate-uuid.middleware";

const router = Router();

// Tenant: create enquiries.
router.post(
  "/:propertyId",
  authenticate,
  requireRole("TENANT"),
  validateUuidParams("propertyId"),
  createEnquiry,
);

// Tenant: view submitted enquiries.
router.get(
  "/my-enquiries",
  authenticate,
  requireRole("TENANT"),
  getMyEnquiries,
);

// Landlord: view enquiries received on their own properties.
router.get(
  "/received",
  authenticate,
  requireRole("LANDLORD"),
  getReceivedEnquiries,
);

// Landlord: accept or reject a pending enquiry.
router.patch(
  "/:enquiryId/status",
  authenticate,
  requireRole("LANDLORD"),
  validateUuidParams("enquiryId"),
  updateEnquiryStatus,
);

export default router;
