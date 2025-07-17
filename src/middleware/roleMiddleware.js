import { getUserByEmail } from "../models/user/UserModel.js";

export const ensureAdmin = async (req, res, next) => {
  try {
    const { email } = req.adminInfo ?? {};
    if (!email) {
      return res
        .status(403)
        .json({ status: "error", message: "Forbidden: no admin info" });
    }

    const user = await getUserByEmail(email);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ status: "error", message: "Forbidden: Admins only" });
    }

    // all good
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Role check failed" });
  }
};
