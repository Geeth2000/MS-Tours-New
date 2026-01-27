import { StatusCodes } from "http-status-codes";
import { differenceInCalendarDays, isAfter } from "date-fns";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import Vehicle from "../models/Vehicle.js";
import Package from "../models/Package.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS, DEFAULT_COMMISSION_PERCENT, USER_ROLES } from "../config/constants.js";

const resolveCommission = () => {
  const commission = Number(process.env.COMMISSION_PERCENT || DEFAULT_COMMISSION_PERCENT);
  return Number.isNaN(commission) ? DEFAULT_COMMISSION_PERCENT : commission;
};

const calculatePrice = ({ bookingData, tour, vehicle, pkg }) => {
  const travelersCount =
    (bookingData.travelers?.adults || 1) + (bookingData.travelers?.children || 0) * 0.5;

  if (tour) {
    return Math.max(tour.pricePerPerson * travelersCount, tour.pricePerPerson);
  }

  if (vehicle) {
    const start = new Date(bookingData.startDate);
    const end = bookingData.endDate ? new Date(bookingData.endDate) : new Date(bookingData.startDate);
    if (isAfter(start, end)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "End date must be after start date");
    }
    const days = Math.max(differenceInCalendarDays(end, start) + 1, 1);
    return days * vehicle.pricePerDay;
  }

  if (pkg) {
    if (pkg.pricePerGroup) {
      return pkg.pricePerGroup;
    }
    if (pkg.pricePerPerson) {
      const peopleCount = (bookingData.travelers?.adults || 1) + (bookingData.travelers?.children || 0);
      return Math.max(pkg.pricePerPerson * peopleCount, pkg.pricePerPerson);
    }
  }

  return bookingData.totalPrice || 0;
};

const ensureCanView = (booking, user) => {
  if (user.role === USER_ROLES.ADMIN) return;
  if (booking.user.toString() === user._id.toString()) return;
  if (booking.vehicleOwner?.toString() === user._id.toString()) return;
  if (booking.packageOwner?.toString() === user._id.toString()) return;
  throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
};

export const createBooking = asyncHandler(async (req, res) => {
  const { tour: tourId, vehicle: vehicleId, package: packageId } = req.body;

  const [tour, vehicle, pkg] = await Promise.all([
    tourId ? Tour.findById(tourId) : null,
    vehicleId ? Vehicle.findById(vehicleId) : null,
    packageId ? Package.findById(packageId) : null,
  ]);

  if (tourId && !tour) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid tour selected");
  if (vehicleId && !vehicle)
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid vehicle selected");
  if (packageId && !pkg) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid package selected");

  const totalPrice = calculatePrice({ bookingData: req.body, tour, vehicle, pkg });

  const commissionPercent =
    vehicle || pkg ? req.body.commissionPercent || resolveCommission() : 0;

  const payload = {
    ...req.body,
    totalPrice,
    commissionPercent,
    user: req.user._id,
    vehicleOwner: vehicle?.owner,
    packageOwner: pkg?.owner,
  };

  if (!payload.endDate && payload.startDate) {
    const start = new Date(payload.startDate);
    if (pkg?.durationDays) {
      const end = new Date(start);
      end.setDate(end.getDate() + (pkg.durationDays - 1));
      payload.endDate = end;
    } else if (tour?.durationDays) {
      const end = new Date(start);
      end.setDate(end.getDate() + (tour.durationDays - 1));
      payload.endDate = end;
    } else if (!vehicle) {
      payload.endDate = start;
    }
  }

  const booking = await Booking.create(payload);

  return res
    .status(StatusCodes.CREATED)
    .json(apiResponse({ message: "Booking created", data: booking }));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("tour")
    .populate({ path: "vehicle", populate: { path: "owner", select: "firstName lastName" } })
    .populate({ path: "package", populate: { path: "owner", select: "firstName lastName" } })
    .sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(apiResponse({ data: bookings }));
});

export const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ $or: [{ vehicleOwner: req.user._id }, { packageOwner: req.user._id }] })
    .populate("user", "firstName lastName email")
    .populate("vehicle")
    .populate("package")
    .sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(apiResponse({ data: bookings }));
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { referenceCode: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Booking.find(query)
      .populate("user", "firstName lastName email role")
      .populate("tour")
      .populate("vehicle")
      .populate("package")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query),
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

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  if (req.user.role === USER_ROLES.TOURIST && booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot modify this booking");
  }

  if (req.user.role === USER_ROLES.VEHICLE_OWNER) {
    const ownsVehicle = booking.vehicleOwner?.toString() === req.user._id.toString();
    const ownsPackage = booking.packageOwner?.toString() === req.user._id.toString();
    if (!ownsVehicle && !ownsPackage) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Cannot update unrelated bookings");
    }
  }

  booking.status = req.body.status;
  if (req.body.notes) {
    booking.notes = req.body.notes;
  }
  await booking.save();

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Status updated", data: booking }));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot cancel this booking");
  }
  booking.status = BOOKING_STATUS.CANCELLED;
  await booking.save();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Booking cancelled", data: booking }));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "firstName lastName email role")
    .populate("tour")
    .populate("vehicle")
    .populate("package");
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
  }
  ensureCanView(booking, req.user);
  return res.status(StatusCodes.OK).json(apiResponse({ data: booking }));
});
