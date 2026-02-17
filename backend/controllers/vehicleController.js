import { StatusCodes } from "http-status-codes";
import Vehicle from "../models/Vehicle.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_ROLES } from "../config/constants.js";

const ensureOwnership = (vehicle, user) => {
  if (!vehicle) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Vehicle not found");
  }
  if (user.role === USER_ROLES.ADMIN) {
    return;
  }
  if (vehicle.owner.toString() !== user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not own this vehicle");
  }
};

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create({ ...req.body, owner: req.user._id });
  return res
    .status(StatusCodes.CREATED)
    .json(apiResponse({ message: "Vehicle listed", data: vehicle }));
});

export const getVehicles = asyncHandler(async (req, res) => {
  const {
    type,
    minPrice,
    maxPrice,
    seats,
    city,
    district,
    owner,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { status: "active" };

  if (type) query.type = type;
  if (owner) query.owner = owner;
  if (city) query["location.city"] = city;
  if (district) query["location.district"] = district;
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }
  if (seats) {
    query.seatingCapacity = { $gte: Number(seats) };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Vehicle.find(query)
      .populate({ path: "owner", select: "firstName lastName email" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Vehicle.countDocuments(query),
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
    }),
  );
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate({
    path: "owner",
    select: "firstName lastName email phone profileImage",
  });
  if (!vehicle) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Vehicle not found");
  }
  return res.status(StatusCodes.OK).json(apiResponse({ data: vehicle }));
});

export const getMyVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });
  return res.status(StatusCodes.OK).json(apiResponse({ data: vehicles }));
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  ensureOwnership(vehicle, req.user);

  Object.assign(vehicle, req.body);
  await vehicle.save();

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Vehicle updated", data: vehicle }));
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  ensureOwnership(vehicle, req.user);

  await vehicle.deleteOne();

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Vehicle removed" }));
});
