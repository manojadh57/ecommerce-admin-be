import express from "express";
import { adminAuth } from "../middleware/authMiddleware.js";
import { ensureAdmin } from "../middleware/roleMiddleware.js";
import {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { validate } from "../middleware/validate.js";
import { categorySchema } from "../validators/categoryValidation.js";

const router = express.Router();

// Protect all category routes: valid token + admin role
router.use(adminAuth, ensureAdmin);

// CREATE
router.post("/", createCategory);

// READ
router.get("/", listCategories);
router.get("/:id", getCategoryById);

// UPDATE
router.put("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

///joi validation//
router.post("/", validate(categorySchema), createCategory);
router.put("/:id", validate(categorySchema), updateCategory);

export default router;
