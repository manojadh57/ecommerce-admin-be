import { verifyAccessToken } from "../utils/jwtHelper.js";
import { findToken } from "../models/session/SessionSchema.js";

export const adminAuth = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization || "";
    const token = bearer.split(" ")[1];

    const decoded = verifyAccessToken(token);
    if (decoded === "invalid token") throw new Error("Unauthorized");

    req.adminInfo = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: err.message });
  }
};
