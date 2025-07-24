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
import { upload } from "../utils/multerConfig.js";

const router = express.Router();

router.use(adminAuth, ensureAdmin);

router.post(
  "/",
  upload.single("image"),
  validate(productSchema),
  createProduct
);

router.get("/", listProducts);

router.get("/:id", getProductById);

router.put(
  "/:id",
  upload.single("image"),
  validate(productSchema),
  updateProduct
);

router.delete("/:id", deleteProduct);

export default router;
