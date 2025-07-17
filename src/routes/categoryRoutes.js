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

export default router;
