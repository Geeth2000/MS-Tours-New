import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import Package from "../models/Package.js";
import Tour from "../models/Tour.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_ROLES } from "../config/constants.js";

export const getPendingVehicleOwners = asyncHandler(async (req, res) => {
  const owners = await User.find({
    role: USER_ROLES.VEHICLE_OWNER,
    "onboarding.approvalStatus": { $in: ["pending", "rejected"] },
  }).sort({ createdAt: -1 });

  return res.status(StatusCodes.OK).json(apiResponse({ data: owners }));
});

export const updateVehicleOwnerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const user = await User.findById(id);
  if (!user || user.role !== USER_ROLES.VEHICLE_OWNER) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Vehicle owner not found");
  }

  user.onboarding.approvalStatus = status;
  user.onboarding.isApproved = status === "approved";
  user.onboarding.rejectionReason = status === "rejected" ? reason : undefined;
  await user.save();

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Owner status updated", data: user }));
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const query = role ? { role } : {};
  const users = await User.find(query).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(apiResponse({ data: users }));
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [totalUsers, totalBookings, totalVehicles, totalPackages, totalTours, earnings] = await Promise.all([
    User.countDocuments({}),
    Booking.countDocuments({}),
    Vehicle.countDocuments({}),
    Package.countDocuments({}),
    Tour.countDocuments({}),
    Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          adminEarnings: { $sum: "$adminEarnings" },
        },
      },
    ]),
  ]);

  return res.status(StatusCodes.OK).json(
    apiResponse({
      data: {
        totalUsers,
        totalBookings,
        totalVehicles,
        totalPackages,
        totalTours,
        totalRevenue: earnings[0]?.totalRevenue || 0,
        adminEarnings: earnings[0]?.adminEarnings || 0,
      },
    })
  );
});
