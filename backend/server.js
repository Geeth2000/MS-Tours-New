import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import customRequestRoutes from "./routes/customRequestRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (_, res) =>
  res.status(200).json({ success: true, message: "M&S Tours API" }),
);

const API_ROOT = "/api/v1";
app.use(`${API_ROOT}/auth`, authRoutes);
app.use(`${API_ROOT}/admin`, adminRoutes);
app.use(`${API_ROOT}/tours`, tourRoutes);
app.use(`${API_ROOT}/vehicles`, vehicleRoutes);
app.use(`${API_ROOT}/packages`, packageRoutes);
app.use(`${API_ROOT}/bookings`, bookingRoutes);
app.use(`${API_ROOT}/reviews`, reviewRoutes);
app.use(`${API_ROOT}/ai`, aiRoutes);
app.use(`${API_ROOT}/custom-requests`, customRequestRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    process.exit(1);
  }
};

start();
