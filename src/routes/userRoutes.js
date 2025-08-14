import express from "express";
import { adminAuth } from "../middleware/authMiddleware.js";
import { ensureAdmin } from "../middleware/roleMiddleware.js";
import {
  listUsers,
  setUserActive,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();
router.use(adminAuth, ensureAdmin);

router.get("/", listUsers);
router.put("/:id/active", setUserActive); // body: { active: true|false }
router.delete("/:id", deleteUser);

export default router;
