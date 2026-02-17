import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";
import { USER_ROLES } from "../config/constants.js";

const buildAuthResponse = (user) => {
  const token = signToken({ id: user._id, role: user.role });
  return apiResponse({
    message: "Authentication successful",
    data: {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        onboarding: user.onboarding,
      },
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already registered");
  }

  const user = await User.create(req.body);

  if (role === USER_ROLES.VEHICLE_OWNER) {
    user.onboarding.isApproved = false;
    user.onboarding.approvalStatus = "pending";
    await user.save();
  }

  return res.status(StatusCodes.CREATED).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save();

  if (user.role === USER_ROLES.VEHICLE_OWNER && !user.onboarding.isApproved) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      `Account pending approval. Status: ${user.onboarding.approvalStatus}`,
    );
  }

  return res.status(StatusCodes.OK).json(buildAuthResponse(user));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return res.status(StatusCodes.OK).json(apiResponse({ data: user }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Profile updated", data: user }));
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Google credential is required",
    );
  }

  // Decode the JWT token from Google
  const decoded = JSON.parse(
    Buffer.from(credential.split(".")[1], "base64").toString(),
  );

  const { sub: googleId, email, given_name, family_name, picture } = decoded;

  // Check if user exists
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Update googleId if not set (user registered with email first)
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  } else {
    // Create new user
    user = await User.create({
      googleId,
      email,
      firstName: given_name || "User",
      lastName: family_name || "",
      profileImage: picture,
      role: USER_ROLES.TOURIST,
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  if (user.role === USER_ROLES.VEHICLE_OWNER && !user.onboarding.isApproved) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      `Account pending approval. Status: ${user.onboarding.approvalStatus}`,
    );
  }

  return res.status(StatusCodes.OK).json(buildAuthResponse(user));
});
