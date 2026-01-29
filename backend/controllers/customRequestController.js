import { StatusCodes } from "http-status-codes";
import CustomRequest from "../models/CustomRequest.js";
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
