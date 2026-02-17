import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_ROLES } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.TOURIST,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      district: String,
      country: {
        type: String,
        default: "Sri Lanka",
      },
    },
    profileImage: String,
    preferences: {
      budget: {
        type: Number,
        default: 0,
      },
      durationDays: {
        type: Number,
        default: 0,
      },
      interests: [
        {
          type: String,
          enum: [
            "beach",
            "nature",
            "culture",
            "wildlife",
            "adventure",
            "wellness",
          ],
        },
      ],
    },
    onboarding: {
      isApproved: {
        type: Boolean,
        default: true,
      },
      approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "approved",
      },
      rejectionReason: String,
      documents: {
        nicNumber: String,
        drivingLicenseNumber: String,
        vehicleRegistrationNumber: String,
      },
    },
    stats: {
      totalBookings: {
        type: Number,
        default: 0,
      },
      totalEarnings: {
        type: Number,
        default: 0,
      },
      ratingAverage: {
        type: Number,
        default: 0,
      },
      ratingCount: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.virtual("fullName").get(function getFullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
