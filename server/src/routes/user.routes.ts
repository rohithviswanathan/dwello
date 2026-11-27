import { Router } from "express";
import { updateMyProfile } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.patch("/me", authenticate, updateMyProfile);

export default router;
