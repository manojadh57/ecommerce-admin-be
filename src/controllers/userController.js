import mongoose from "mongoose";
import User from "../models/user/CustomerUserModel.js";

// GET /api/admin/v1/users
export const listUsers = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim().toLowerCase();
    const filter = q
      ? {
          email: {
            $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        }
      : {};
    const users = await User.find(filter).select(
      "email role verified active createdAt"
    );
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/v1/users/:id/active  { active: true|false }
export const setUserActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    const active =
      typeof req.body?.active === "boolean" ? req.body.active : false;
    const user = await User.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    ).select("email role verified active createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/v1/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
