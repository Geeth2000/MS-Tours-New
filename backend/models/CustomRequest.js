import mongoose from "mongoose";

const customRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Connects this request to a specific User
      required: true,
    },
    destinations: {
      type: String, // e.g., "Kandy, Ella, Mirissa"
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    travelers: {
      type: Number,
      default: 1,
    },
    budgetRange: {
      type: String, // Kept as String to allow "50k-100k" or exact numbers
    },
    notes: {
      type: String, // For special requirements
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt
);

const CustomRequest = mongoose.model("CustomRequest", customRequestSchema);

export default CustomRequest;
