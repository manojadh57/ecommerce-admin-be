import express from "express";
import { adminAuth } from "../middleware/authMiddleware.js";
import { ensureAdmin } from "../middleware/roleMiddleware.js";

import {
  listReviews,
  setReviewApproval,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();
router.use(adminAuth, ensureAdmin);

router.get("/", listReviews);
router.put("/:id/approve", setReviewApproval);
router.delete("/:id", deleteReview);

export default router;
