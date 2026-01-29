import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Tour from "../models/Tour.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js"; // Ensure Booking model is imported
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

// --- SUMMARY STATS ---
export const getAdminSummary = asyncHandler(async (req, res) => {
  // 1. Run counts in parallel for performance
  const [totalUsers, totalTours, totalVehicles, totalPackages] =
    await Promise.all([
      User.countDocuments(),
      Tour.countDocuments(),
      Vehicle.countDocuments(),
      Package.countDocuments(),
    ]);

  // 2. Calculate Real Revenue via Aggregation
  // We match only 'confirmed' or 'completed' bookings to avoid counting cancelled/pending ones.
  const revenueStats = await Booking.aggregate([
    {
      $match: {
        status: { $in: ["confirmed", "completed"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        // totalEarnings: { $sum: "$adminEarnings" } // Uncomment if you want only admin commission
      },
    },
  ]);

  // If there are no bookings, default to 0
  const totalRevenue =
    revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

  res.status(StatusCodes.OK).json(
    apiResponse({
      data: {
        totalUsers,
        totalTours,
        totalVehicles,
        totalPackages,
        totalRevenue,
      },
    }),
  );
});

// --- DELETE OPERATIONS ---
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  await user.deleteOne();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "User deleted" }));
});

export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
  await tour.deleteOne();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Tour deleted" }));
});

export const adminDeleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) throw new ApiError(StatusCodes.NOT_FOUND, "Vehicle not found");
  await vehicle.deleteOne();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Vehicle deleted" }));
});

export const adminDeletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) throw new ApiError(StatusCodes.NOT_FOUND, "Package not found");
  await pkg.deleteOne();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Package deleted" }));
});

// --- OTHER READ OPERATIONS ---
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(apiResponse({ data: users }));
});

export const getPendingOwners = asyncHandler(async (req, res) => {
  const owners = await User.find({
    role: "vehicleOwner",
    "onboarding.approvalStatus": "pending",
  });
  return res.status(StatusCodes.OK).json(apiResponse({ data: owners }));
});

export const updateOwnerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  if (user.onboarding) {
    user.onboarding.approvalStatus = status;
    await user.save();
  }

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: `Owner ${status}` }));
});
