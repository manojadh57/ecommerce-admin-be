import {
  createNewUser,
  getUserByEmail,
  updateUser,
} from "../models/user/UserModel.js";
import {
  signAccessJWT,
  signRefreshJWT,
  verifyAccessToken,
} from "../utils/jwtHelper.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { sendVerificationEmail } from "../helpers/emailHelper.js";

//sign u
export const signup = async (req, res) => {
  try {
    const { fName, lName, email, password } = req.body;

    // Prevent duplicate registrations
    if (await getUserByEmail(email)) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already registered" });
    }

    // Create a short-lived JWT for email verification
    const verificationToken = signAccessJWT({ email }, "15m");

    // Persist the new user (unverified)
    await createNewUser({
      fName,
      lName,
      email,
      password: hashPassword(password),
      verificationToken,
      isVerified: false,
    });

    // Send them a verification email
    await sendVerificationEmail(email, verificationToken);

    return res
      .status(201)
      .json({ status: "success", message: "Signup OK – verify email" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * VERIFY EMAIL
 * GET /api/admin/v1/auth/verify/:token
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = verifyAccessToken(token);
    if (decoded === "invalid token") throw new Error("Bad token");

    const { email } = decoded;
    const user = await getUserByEmail(email);

    if (!user || user.isVerified) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or already verified" });
    }

    // Mark them as verified & clear the token
    await updateUser({ email }, { isVerified: true, verificationToken: "" });

    return res.json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
};

/**
 * LOGIN
 * POST /api/admin/v1/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) throw new Error("Invalid login details");
    if (!user.isVerified) throw new Error("Please verify email first");
    if (!comparePassword(password, user.password))
      throw new Error("Invalid login details");

    // Issue new tokens
    const accessJWT = signAccessJWT({ email, role: user.role });
    const refreshJWT = signRefreshJWT({ email, role: user.role });

    // Persist the current refresh token
    await updateUser({ email }, { refreshJWT });

    return res.json({
      status: "success",
      message: "User authenticated",
      tokens: { accessJWT, refreshJWT },
    });
  } catch (err) {
    return res.status(401).json({ status: "error", message: err.message });
  }
};

/**
 * REFRESH ACCESS TOKEN
 * POST /api/admin/v1/auth/refresh
 */
export const refreshAccess = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("refreshToken missing");

    const decoded = verifyAccessToken(refreshToken);
    if (decoded === "invalid token") throw new Error("Invalid refresh token");

    const { email } = decoded;
    const user = await getUserByEmail(email);

    if (!user || user.refreshJWT !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Issue a fresh access token
    const newAccess = signAccessJWT({ email, role: user.role });
    return res.json({ status: "success", accessJWT: newAccess });
  } catch (err) {
    return res.status(401).json({ status: "error", message: err.message });
  }
};
