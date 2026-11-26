import { Router } from "express";
import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "../controllers/favourite.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

// All favorite routes require an authenticated tenant.
router.use(authenticate, requireRole("TENANT"));

// Add a property to favorites.
router.post("/:propertyId", addFavorite);

// Get the authenticated tenant's favorites.
router.get("/", getMyFavorites);

// Remove a property from favorites.
router.delete("/:propertyId", removeFavorite);

export default router;
