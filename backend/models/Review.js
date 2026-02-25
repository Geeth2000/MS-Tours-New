import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
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
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    response: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      respondedAt: Date,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ tour: 1, createdAt: -1 });
reviewSchema.index({ vehicle: 1, createdAt: -1 });
reviewSchema.index({ package: 1, createdAt: -1 });

// Unique indexes to prevent duplicate reviews from same user
reviewSchema.index({ user: 1, tour: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, vehicle: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, package: 1 }, { unique: true, sparse: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
