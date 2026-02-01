import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import CustomRequest from "../models/CustomRequest.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new custom tour request
// @route   POST /api/v1/custom-requests
// @access  Private (Tourist)
export const createCustomRequest = asyncHandler(async (req, res) => {
  const request = await CustomRequest.create({
    ...req.body,
    user: req.user._id, // Attach the logged-in user's ID
  });

  return res
    .status(StatusCodes.CREATED)
    .json(
      apiResponse({ message: "Request sent successfully!", data: request }),
    );
});

// @desc    Get all custom requests
// @route   GET /api/v1/custom-requests
// @access  Private (Admin)
export const getCustomRequests = asyncHandler(async (req, res) => {
  // Fetch requests and populate user details (name, email, phone)
  // Sort by newest first
  const requests = await CustomRequest.find()
    .populate("user", "firstName lastName email phone")
    .sort("-createdAt");

  return res.status(StatusCodes.OK).json(apiResponse({ data: requests }));
});

// @desc    Get logged-in user's own custom requests
// @route   GET /api/v1/custom-requests/my-requests
// @access  Private (Tourist)
export const getMyCustomRequests = asyncHandler(async (req, res) => {
  // Fetch only the logged-in user's requests
  const requests = await CustomRequest.find({ user: req.user._id }).sort(
    "-createdAt",
  );

  return res.status(StatusCodes.OK).json(apiResponse({ data: requests }));
});

// @desc    Update custom request status
// @route   PATCH /api/v1/custom-requests/:id
// @access  Private (Admin)
export const updateCustomRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid request ID");
  }

  const allowedStatuses = CustomRequest.schema.path("status").enumValues;

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
    );
  }

  const request = await CustomRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  ).populate("user", "firstName lastName email phone");

  if (!request) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(apiResponse({ message: "Request not found" }));
  }

  return res
    .status(StatusCodes.OK)
    .json(
      apiResponse({ message: "Status updated successfully", data: request }),
    );
});

// @desc    Delete custom request
// @route   DELETE /api/v1/custom-requests/:id
// @access  Private (Admin)
export const deleteCustomRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await CustomRequest.findByIdAndDelete(id);

  if (!request) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(apiResponse({ message: "Request not found" }));
  }

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Request deleted successfully" }));
});

// @desc    Delete user's own custom request
// @route   DELETE /api/v1/custom-requests/my-requests/:id
// @access  Private (User)
export const deleteMyCustomRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid request ID");
  }

  // Find and delete only if the request belongs to the logged-in user
  const request = await CustomRequest.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!request) {
    return res.status(StatusCodes.NOT_FOUND).json(
      apiResponse({
        message: "Request not found or you don't have permission",
      }),
    );
  }

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Request deleted successfully" }));
});

// @desc    Update user's own custom request
// @route   PATCH /api/v1/custom-requests/my-requests/:id
// @access  Private (User)
export const updateMyCustomRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid request ID");
  }

  // Only allow updating certain fields
  const allowedFields = [
    "destinations",
    "startDate",
    "durationDays",
    "travelers",
    "budgetRange",
    "notes",
    "whatsappNumber",
  ];

  const filteredData = {};
  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });

  // Find and update only if the request belongs to the logged-in user
  const request = await CustomRequest.findOneAndUpdate(
    {
      _id: id,
      user: req.user._id,
      status: "pending", // Only allow editing pending requests
    },
    filteredData,
    { new: true, runValidators: true },
  );

  if (!request) {
    return res.status(StatusCodes.NOT_FOUND).json(
      apiResponse({
        message:
          "Request not found, you don't have permission, or it cannot be edited",
      }),
    );
  }

  return res
    .status(StatusCodes.OK)
    .json(
      apiResponse({ message: "Request updated successfully", data: request }),
    );
});
