import { StatusCodes } from "http-status-codes";
import Tour from "../models/Tour.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTour = asyncHandler(async (req, res) => {
  const tour = await Tour.create({ ...req.body, createdBy: req.user._id });
  return res
    .status(StatusCodes.CREATED)
    .json(apiResponse({ message: "Tour created", data: tour }));
});

export const getTours = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    search,
    isFeatured,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  if (category) {
    query.category = category;
  }
  if (typeof isFeatured !== "undefined") {
    query.isFeatured = isFeatured === "true";
  }
  if (minPrice || maxPrice) {
    query.pricePerPerson = {};
    if (minPrice) query.pricePerPerson.$gte = Number(minPrice);
    if (maxPrice) query.pricePerPerson.$lte = Number(maxPrice);
  }
  if (minDuration || maxDuration) {
    query.durationDays = {};
    if (minDuration) query.durationDays.$gte = Number(minDuration);
    if (maxDuration) query.durationDays.$lte = Number(maxDuration);
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { locations: { $elemMatch: { $regex: search, $options: "i" } } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Tour.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Tour.countDocuments(query),
  ]);

  return res.status(StatusCodes.OK).json(
    apiResponse({
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit || 1)),
      },
    })
  );
});

export const getTourBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug });
  if (!tour) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
  }
  return res.status(StatusCodes.OK).json(apiResponse({ data: tour }));
});

export const updateTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
  }
  Object.assign(tour, req.body);
  await tour.save();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Tour updated", data: tour }));
});

export const deleteTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
  }
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Tour deleted" }));
});
