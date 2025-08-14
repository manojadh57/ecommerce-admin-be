import express from "express";
import { adminAuth } from "../middleware/authMiddleware.js";
import { ensureAdmin } from "../middleware/roleMiddleware.js"; // ← change to roleMiddleware

import {
  listReviews,
  setReviewApproval,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();
router.use(adminAuth, ensureAdmin);

router.get("/", listReviews);
router.put("/:id/approve", setReviewApproval); // body.approved true|false (default true)
router.delete("/:id", deleteReview);

export default router;
