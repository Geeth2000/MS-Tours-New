import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import { BOOKING_STATUS } from "../config/constants.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const hasCompletedBooking = async ({ userId, tour, vehicle, pkg }) => {
  const query = { user: userId, status: BOOKING_STATUS.COMPLETED };
  if (tour) query.tour = tour;
  if (vehicle) query.vehicle = vehicle;
  if (pkg) query.package = pkg;
  const count = await Booking.countDocuments(query);
  return count > 0;
};

export const createReview = asyncHandler(async (req, res) => {
  const { tour, vehicle, package: pkg } = req.body;

  const eligible = await hasCompletedBooking({
    userId: req.user._id,
    tour,
    vehicle,
    pkg,
  });

  if (!eligible) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You can only review experiences you have completed"
    );
  }

  const review = await Review.create({ ...req.body, user: req.user._id });
  return res
    .status(StatusCodes.CREATED)
    .json(apiResponse({ message: "Review submitted", data: review }));
});

export const getReviews = asyncHandler(async (req, res) => {
  const { tour, vehicle, package: pkg } = req.query;
  const query = {};
  if (tour) query.tour = tour;
  if (vehicle) query.vehicle = vehicle;
  if (pkg) query.package = pkg;

  const reviews = await Review.find(query)
    .populate("user", "firstName lastName profileImage")
    .sort({ createdAt: -1 });

  return res.status(StatusCodes.OK).json(apiResponse({ data: reviews }));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Review not found");
  }
  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot delete this review");
  }
  await review.deleteOne();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Review removed" }));
});
