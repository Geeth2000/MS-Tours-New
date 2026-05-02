import jwt from "jsonwebtoken";

export const signToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    console.error("❌ CRITICAL: JWT_SECRET is not defined in environment variables!");
    throw new Error("JWT_SECRET is not configured. Please check your .env file.");
  }

  return jwt.sign(payload, secret, { expiresIn, ...options });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ CRITICAL: JWT_SECRET is not defined in environment variables!");
    throw new Error("JWT_SECRET is not configured. Please check your .env file.");
  }
  return jwt.verify(token, secret);
};
