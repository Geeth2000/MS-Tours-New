import { StatusCodes } from "http-status-codes";
import Package from "../models/Package.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_ROLES } from "../config/constants.js";

const ensureAccess = (pkg, user) => {
  if (!pkg) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Package not found");
  }
  if (user.role === USER_ROLES.ADMIN) return;
  if (pkg.owner.toString() !== user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not own this package");
  }
};

export const createPackage = asyncHandler(async (req, res) => {
  const data = { ...req.body, owner: req.user._id };
  // Remove empty vehicle field to avoid ObjectId cast errors
  if (!data.vehicle) delete data.vehicle;
  const pkg = await Package.create(data);
  return res
    .status(StatusCodes.CREATED)
    .json(apiResponse({ message: "Package created", data: pkg }));
});

export const getPackages = asyncHandler(async (req, res) => {
  const {
    packageType,
    minPrice,
    maxPrice,
    owner,
    status = "published",
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};
  if (packageType) query.packageType = packageType;
  if (owner) query.owner = owner;
  if (status) query.status = status;
  if (minPrice || maxPrice) {
    query.$or = [];
    const priceConditions = [];
    if (minPrice)
      priceConditions.push({ pricePerPerson: { $gte: Number(minPrice) } });
    if (maxPrice)
      priceConditions.push({ pricePerPerson: { $lte: Number(maxPrice) } });
    if (minPrice || maxPrice) {
      query.$or.push(...priceConditions);
      query.$or.push({
        pricePerGroup: {
          ...(minPrice ? { $gte: Number(minPrice) } : {}),
          ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
        },
      });
    }
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Package.find(query)
      .populate({ path: "owner", select: "firstName lastName email" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Package.countDocuments(query),
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

export const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id).populate({
    path: "owner",
    select: "firstName lastName email onboarding",
  });
  if (!pkg) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Package not found");
  }
  return res.status(StatusCodes.OK).json(apiResponse({ data: pkg }));
});

export const getMyPackages = asyncHandler(async (req, res) => {
  const items = await Package.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });
  return res.status(StatusCodes.OK).json(apiResponse({ data: items }));
});

export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  ensureAccess(pkg, req.user);

  const data = { ...req.body };
  // Remove empty vehicle field to avoid ObjectId cast errors
  if (!data.vehicle) delete data.vehicle;

  Object.assign(pkg, data);
  await pkg.save();

  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Package updated", data: pkg }));
});

export const changePackageStatus = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Package not found");
  }
  pkg.status = req.body.status;
  await pkg.save();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Status updated", data: pkg }));
});

export const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  ensureAccess(pkg, req.user);
  await pkg.deleteOne();
  return res
    .status(StatusCodes.OK)
    .json(apiResponse({ message: "Package deleted" }));
});
