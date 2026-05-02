import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";
import { ApiError } from "./utils/apiError.js";

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
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "https://mstours.live",
  "https://www.mstours.live",
  "http://localhost:5173",
  "http://localhost:3000"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// 1. Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 2. Health Check
app.get("/", (_, res) =>
  res.status(200).json({ success: true, message: "M&S Tours API" }),
);

// 3. Routes
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

// 4. Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// 5. Server Initialization
const startServer = async () => {
  try {
    // Attempt Database Connection
    if (!process.env.MONGO_URI) {
      console.error("❌ Error: MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    await connectDB(process.env.MONGO_URI);
    console.log("✅ Database connected successfully");

    // Start listening on the port ONLY ONCE
    app.listen(PORT, () => {
      console.log(`🚀 Server is live at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Critical Server Startup Error:", error.message);
    // If we can't connect to DB or start, exit so PM2 can attempt a clean restart
    process.exit(1);
  }
};

startServer();
