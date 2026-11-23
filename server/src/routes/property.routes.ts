import { Router } from "express";

import { createProperty } from "../controllers/property.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../generated/prisma/enums";

const router = Router();

router.post("/", authenticate, requireRole(UserRole.LANDLORD), createProperty);

export default router;
