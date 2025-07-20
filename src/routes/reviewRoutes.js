import express from "express";
import { adminAuth } from "../middleware/authMiddleware.js";
import { ensureAdmin } from "../middleware/roleMiddleware.js";

import {
  approveReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// protect everything
router.use(adminAuth, ensureAdmin);

// PUT  /api/admin/v1/reviews/:id/approve
router.put("/:id/approve", approveReview);

// DELETE /api/admin/v1/reviews/:id
router.delete("/:id", deleteReview);

export default router;
