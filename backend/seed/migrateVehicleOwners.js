/**
 * Migration script to approve all existing vehicle owners
 * Run with: node seed/migrateVehicleOwners.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const migrateVehicleOwners = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await connectDB(process.env.MONGO_URI);
    console.log("Connected to database");

    // Find all vehicle owners with pending or unapproved status
    const result = await User.updateMany(
      {
        role: "vehicleOwner",
        $or: [
          { "onboarding.isApproved": false },
          { "onboarding.approvalStatus": { $ne: "approved" } },
        ],
      },
      {
        $set: {
          "onboarding.isApproved": true,
          "onboarding.approvalStatus": "approved",
        },
      },
    );

    console.log(
      `Migration complete: ${result.modifiedCount} vehicle owners updated to approved status`,
    );

    // Disconnect from database
    await mongoose.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

migrateVehicleOwners();
