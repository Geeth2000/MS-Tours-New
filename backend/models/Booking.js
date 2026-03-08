import mongoose from "mongoose";
import { BOOKING_STATUS } from "../config/constants.js";

const bookingSchema = new mongoose.Schema(
  {
    referenceCode: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    vehicleOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    packageOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Customer-confirmed booking details
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dropoffLocation: {
      type: String,
      trim: true,
    },
    pickupTime: {
      type: String,
      trim: true,
    },
    travelerCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    travelers: {
      adults: {
        type: Number,
        default: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    commissionPercent: {
      type: Number,
      default: 0,
    },
    adminEarnings: {
      type: Number,
      default: 0,
    },
    ownerEarnings: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    payment: {
      method: {
        type: String,
        enum: ["cash", "online"],
        default: "cash",
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      paidAt: Date,
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

bookingSchema.pre("save", function computeEarnings(next) {
  if (this.isModified("totalPrice") || this.isModified("commissionPercent")) {
    const commissionRate = (this.commissionPercent || 0) / 100;
    this.adminEarnings =
      Math.round(this.totalPrice * commissionRate * 100) / 100;
    this.ownerEarnings =
      Math.round((this.totalPrice - this.adminEarnings) * 100) / 100;
  }
  if (!this.referenceCode) {
    this.referenceCode = `MS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ vehicleOwner: 1 });
bookingSchema.index({ packageOwner: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
