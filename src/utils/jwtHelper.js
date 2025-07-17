import jwt from "jsonwebtoken";

// SIGN
export const signAccessJWT = (
  payload,
  expiresIn = process.env.JWT_EXPIRE || "1d"
) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });

export const signRefreshJWT = (payload, expiresIn = "7d") =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });

// VERIFY
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    return "invalid token";
  }
};

export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return "invalid token";
  }
};
