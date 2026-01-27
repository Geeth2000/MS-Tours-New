import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "node:net";

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

dotenv.config();

const app = express();

const DEFAULT_PORT = 5000;

const parsePort = (value) => {
  const portNumber = Number(value);
  if (!Number.isInteger(portNumber) || portNumber <= 0 || portNumber > 65535) {
    throw new Error(`Invalid port value: ${value}`);
  }
  return portNumber;
};

const checkPortAvailability = (port) =>
  new Promise((resolve, reject) => {
    const tester = createServer();

    tester.once("error", (error) => {
      reject(error);
    });

    tester.once("listening", () => {
      tester.close(() => resolve());
    });

    tester.listen(port, "0.0.0.0");
  });

const pickAvailablePort = async (
  initialPort,
  allowFallback,
  maxAttempts = 10,
) => {
  let port = initialPort;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      await checkPortAvailability(port);
      return port;
    } catch (error) {
      if (error.code !== "EADDRINUSE") {
        throw error;
      }

      if (!allowFallback) {
        const portError = new Error(`Port ${port} is already in use.`);
        portError.code = "EADDRINUSE";
        portError.port = port;
        throw portError;
      }

      port += 1;

      if (port > 65535) {
        break;
      }
    }
  }

  const portError = new Error(
    `No free port found starting from ${initialPort}.`,
  );
  portError.code = "EADDRINUSE";
  portError.port = initialPort;
  throw portError;
};

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
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

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "M&S Tours API" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/packages", packageRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const rawPort = process.env.PORT;
const portFromEnv = Boolean(rawPort && rawPort.trim() !== "");
const MONGO_URI = process.env.MONGO_URI || "";

const start = async () => {
  let requestedPort = DEFAULT_PORT;
  try {
    requestedPort = parsePort(portFromEnv ? rawPort : DEFAULT_PORT);

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    const port = await pickAvailablePort(requestedPort, !portFromEnv);

    await connectDB(MONGO_URI);
    const server = app.listen(port, () => {
      if (port !== requestedPort) {
        console.warn(
          `Port ${requestedPort} was busy. Server running on port ${port} instead.`,
        );
      } else {
        console.log(`🚀Server running on port ${port}`);
      }
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} became unavailable.`);
      } else {
        console.error("Unexpected server error", error);
      }
      process.exit(1);
    });
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      const blockedPort = error.port || requestedPort;
      console.error(
        `Failed to start server: port ${blockedPort} is already in use.`,
      );
      console.error(
        "Stop the conflicting process or set the PORT environment variable to a free port.",
      );
    } else if (
      error.message &&
      error.message.startsWith("Invalid port value")
    ) {
      console.error(
        "Failed to start server: PORT must be a number between 1 and 65535.",
      );
    } else {
      console.error("Failed to start server", error);
    }
    process.exit(1);
  }
};

start();
