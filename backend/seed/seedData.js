import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Tour from "../models/Tour.js";
import Vehicle from "../models/Vehicle.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import { USER_ROLES } from "../config/constants.js";

dotenv.config();

const seed = async () => {
  try {
    const { MONGO_URI, ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD } =
      process.env;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }
    await connectDB(MONGO_URI);

    await Promise.all([
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Tour.deleteMany({}),
      Vehicle.deleteMany({}),
      Package.deleteMany({}),
      User.deleteMany({}),
    ]);

    const admin = await User.create({
      firstName: "System",
      lastName: "Admin",
      email: ADMIN_DEFAULT_EMAIL || "admin@mstours.lk",
      password: ADMIN_DEFAULT_PASSWORD || "ChangeMe123!",
      role: USER_ROLES.ADMIN,
    });

    const tours = await Tour.insertMany([
      {
        title: "Cultural Highlights of Sri Lanka",
        description:
          "Experience the cultural triangle with visits to Sigiriya, Polonnaruwa, and the Temple of the Tooth.",
        durationDays: 5,
        pricePerPerson: 55000,
        category: "culture",
        locations: ["Sigiriya", "Kandy", "Dambulla"],
        highlights: ["Sigiriya Rock", "Temple of the Tooth", "Cave Temple"],
        includes: ["Transport", "4-star accommodation", "Breakfast"],
        excludes: ["Lunch", "Dinner"],
        createdBy: admin._id,
        isFeatured: true,
      },
      {
        title: "Southern Beach Getaway",
        description:
          "Relax on the golden beaches of the south coast with optional whale watching in Mirissa.",
        durationDays: 4,
        pricePerPerson: 45000,
        category: "beach",
        locations: ["Galle", "Mirissa", "Hikkaduwa"],
        highlights: ["Galle Fort", "Whale Watching", "Surfing"],
        includes: ["Beachfront hotel", "Daily breakfast"],
        excludes: ["Watersport fees"],
        createdBy: admin._id,
        isFeatured: true,
      },
    ]);

    const owner = await User.create({
      firstName: "Nimal",
      lastName: "Perera",
      email: "nimal.driver@mstours.lk",
      password: "Driver123!",
      role: USER_ROLES.VEHICLE_OWNER,
      onboarding: {
        isApproved: true,
        approvalStatus: "approved",
      },
    });

    const vehicles = await Vehicle.insertMany([
      {
        owner: owner._id,
        title: "Toyota Hiace 10-seater",
        type: "van",
        make: "Toyota",
        model: "Hiace",
        year: 2019,
        transmission: "automatic",
        fuelType: "diesel",
        seatingCapacity: 10,
        pricePerDay: 18000,
        features: ["Dual A/C", "Comfortable seats"],
        location: { city: "Colombo", district: "Western" },
        isFeatured: true,
      },
      {
        owner: owner._id,
        title: "Nissan X-Trail",
        type: "suv",
        seatingCapacity: 5,
        pricePerDay: 15000,
        fuelType: "petrol",
        transmission: "automatic",
        location: { city: "Negombo", district: "Western" },
      },
    ]);

    await Package.insertMany([
      {
        owner: owner._id,
        vehicle: vehicles[0]._id,
        title: "Hill Country Explorer",
        description:
          "Three-day journey covering Kandy, Nuwara Eliya, and Ella.",
        packageType: "multiDay",
        durationDays: 3,
        pricePerGroup: 120000,
        includes: ["Vehicle", "Driver", "Fuel"],
        excludes: ["Accommodation", "Meals"],
        locations: ["Kandy", "Nuwara Eliya", "Ella"],
        status: "published",
        isFeatured: true,
      },
      {
        owner: owner._id,
        vehicle: vehicles[1]._id,
        title: "Colombo City Day Tour",
        description:
          "Full-day chauffeur-driven tour covering Colombo city highlights.",
        packageType: "dayTrip",
        durationDays: 1,
        pricePerGroup: 40000,
        includes: ["Vehicle", "Driver", "Parking"],
        excludes: ["Entrance fees", "Meals"],
        locations: ["Colombo"],
        status: "published",
      },
    ]);

    console.log("Seed data created successfully");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed error", error);
    process.exit(1);
  }
};

seed();
