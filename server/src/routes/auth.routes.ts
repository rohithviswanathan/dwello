import { Router } from "express";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller";

import { changeMyPassword } from "../controllers/password.controller";
import { authRateLimit } from "../middleware/authRateLimit.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", authRateLimit, registerUser);
router.post("/login", authRateLimit, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

// Protected route
router.get("/me", authenticate, getCurrentUser);
router.patch("/change-password", authenticate, changeMyPassword);

export default router;
