import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
import Vehicle from "../models/Vehicle.js";
import Package from "../models/Package.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import { BOOKING_STATUS } from "../config/constants.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper function to update ratings on a model
const updateRatings = async (Model, id) => {
  if (!id) return;

  const fieldName = Model.modelName.toLowerCase();
  const reviews = await Review.find({ [fieldName]: id });

  const count = reviews.length;
  const average =
    count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  await Model.findByIdAndUpdate(id, {
    ratings: {
      average: Math.round(average * 10) / 10,
      count,
    },
  });
};

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

  // Check for existing review from same user
  const existingQuery = { user: req.user._id };
  if (tour) existingQuery.tour = tour;
  if (vehicle) existingQuery.vehicle = vehicle;
  if (pkg) existingQuery.package = pkg;

  const existingReview = await Review.findOne(existingQuery);
  if (existingReview) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "You have already reviewed this item",
    );
  }

  const eligible = await hasCompletedBooking({
    userId: req.user._id,
    tour,
    vehicle,
    pkg,
  });

  if (!eligible) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You can only review experiences you have completed",
    );
  }

  const review = await Review.create({ ...req.body, user: req.user._id });

  // Update ratings on the associated model
  if (vehicle) await updateRatings(Vehicle, vehicle);
  if (pkg) await updateRatings(Package, pkg);
  if (tour) await updateRatings(Tour, tour);

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

/**
 * Get latest reviews for homepage display
 * Returns reviews from completed bookings only
 */
export const getLatestReviews = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  // Get all reviews, sorted by newest first
  const reviews = await Review.find({})
    .populate("user", "firstName lastName profileImage")
    .populate("vehicle", "title")
    .populate("package", "title")
    .populate("tour", "title")
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  // Calculate overall stats
  const allReviews = await Review.find({});
  const totalCount = allReviews.length;
  const averageRating =
    totalCount > 0
      ? Math.round(
          (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10,
        ) / 10
      : 0;

  return res.status(StatusCodes.OK).json(
    apiResponse({
      data: reviews,
      meta: {
        totalCount,
        averageRating,
      },
    }),
  );
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Review not found");
  }
  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot delete this review");
  }

  const { tour, vehicle, package: pkg } = review;
  await review.deleteOne();

  // Update ratings on the associated model
  if (vehicle) await updateRatings(Vehicle, vehicle);
  if (pkg) await updateRatings(Package, pkg);
  if (tour) await updateRatings(Tour, tour);

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Review removed" }));
});
