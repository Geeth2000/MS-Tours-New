import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    startDate: Date,
    endDate: Date,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["car", "van", "bus", "suv", "jeep", "tuk", "other"],
      required: true,
    },
    make: String,
    model: String,
    year: Number,
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "hybrid", "electric"],
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    images: [String],
    features: [String],
    description: String,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    availability: [availabilitySchema],
    location: {
      city: String,
      district: String,
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
  { timestamps: true }
);

vehicleSchema.index({ owner: 1 });
vehicleSchema.index({ type: 1, pricePerDay: 1 });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
