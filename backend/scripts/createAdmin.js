import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import { USER_ROLES } from "../config/constants.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to Database");

    const adminEmail = "admin@mstours.live";
    const adminPassword = "MstoursAdmin2026!";

    // Check if user already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log(`⚠️ User with email ${adminEmail} already exists. Updating role to admin...`);
      existingUser.role = USER_ROLES.ADMIN;
      await existingUser.save();
      console.log("✅ User role updated to admin.");
    } else {
      await User.create({
        firstName: "Super",
        lastName: "Admin",
        email: adminEmail,
        password: adminPassword,
        role: USER_ROLES.ADMIN,
        isActive: true
      });
      console.log("✅ New Admin account created successfully.");
    }

    console.log("\n-----------------------------------");
    console.log("Admin Credentials:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("-----------------------------------\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
