import mongoose from "mongoose";
import { PACKAGE_TYPES } from "../config/constants.js";

const packageSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      enum: Object.values(PACKAGE_TYPES),
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    pricePerGroup: Number,
    pricePerPerson: Number,
    includes: [String],
    excludes: [String],
    locations: [String],
    images: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "archived"],
      default: "pending",
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

packageSchema.index({ owner: 1 });
packageSchema.index({ packageType: 1, durationDays: 1 });

const Package = mongoose.model("Package", packageSchema);

export default Package;
