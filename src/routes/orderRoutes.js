import express from "express";
import { adminAuth } from "../middleware/authMiddleware.js";
import { ensureAdmin } from "../middleware/roleMiddleware.js";
import {
  listOrders,
  updateOrderStatus,
  getOrderDetail, // 👈 add
} from "../controllers/orderController.js";

const router = express.Router();
router.use(adminAuth, ensureAdmin);

router.get("/", listOrders);
router.get("/:id", getOrderDetail); // 👈 NEW
router.put("/:id/status", updateOrderStatus);

export default router;
