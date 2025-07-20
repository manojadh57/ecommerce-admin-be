import express from "express";
import { adminAuth } from "../middleware/authMiddleware.js";
import { ensureAdmin } from "../middleware/roleMiddleware.js";
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { validate } from "../middleware/validate.js";
import { productSchema } from "../validators/productValidation.js";

const router = express.Router();

// Protect all routes
router.use(adminAuth, ensureAdmin);

// CRUD routes
router.post("/", createProduct);
router.get("/", listProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(productSchema), updateProduct);

export default router;
