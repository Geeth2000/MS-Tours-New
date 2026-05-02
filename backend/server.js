import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
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

/* ================================
   ✅ CORS CONFIG (FIXED)
================================ */

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [
      "https://mstours.live",
      "https://www.mstours.live",
      "http://localhost:5173",
      "http://localhost:3000"
    ];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin);

    // Allow Postman / mobile apps (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ❗ DO NOT THROW ERROR → just block silently
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

/* ================================
   ✅ MIDDLEWARE
================================ */

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ================================
   ✅ HEALTH CHECK
================================ */

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "M&S Tours API Running"
  });
});

/* ================================
   ✅ ROUTES
================================ */

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

/* ================================
   ❌ ERROR HANDLING
================================ */

app.use(notFoundHandler);
app.use(errorHandler);

/* ================================
   🚀 START SERVER
================================ */

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI missing");
      process.exit(1);
    }

    await connectDB(process.env.MONGO_URI);
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    process.exit(1);
  }
};

startServer();