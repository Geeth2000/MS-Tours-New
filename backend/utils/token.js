import jwt from "jsonwebtoken";

export const signToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, secret, { expiresIn, ...options });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.verify(token, secret);
};
