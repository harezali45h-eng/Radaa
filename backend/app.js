import "./config/env.js";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { sanitizeInput } from "./middleware/sanitizeMiddleware.js";
import { openapiSpec } from "./utils/openapi.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./realtime/socket.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkRoutes from "./routes/checkRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import matatuRoutes from "./routes/matatuRoutes.js";
import paymentRoutes from "./routes/payments.js";
import tripRoutes from "./routes/tripRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import routesRoutes from "./routes/routesRoutes.js";
import requestsRoutes from "./routes/requestsRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import matatuApiRoutes from "./routes/matatuApiRoutes.js";
import saccoRoutes from "./routes/saccoRoutes.js";
import featureFlagRoutes from "./routes/featureFlagRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

/* -------------------------------------------
   TRUST PROXY (Render, Vercel, Nginx)
-------------------------------------------- */
app.set("trust proxy", 1);

/* -------------------------------------------
   CORS
-------------------------------------------- */
const DEV_FRONTEND_URL = process.env.DEV_FRONTEND_URL || "http://localhost:3000";
const PROD_FRONTEND_URL =
  process.env.PROD_FRONTEND_URL ||
  "https://radaa.vercel.app";
const RAW_CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "";

const baseOrigins = [
  PROD_FRONTEND_URL,
  ...RAW_CLIENT_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
];

const devOrigins =
  process.env.NODE_ENV !== "production"
    ? [DEV_FRONTEND_URL]
    : [];

const allowedOrigins = Array.from(new Set([...baseOrigins, ...devOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------------------------------
   SECURITY + PERFORMANCE
-------------------------------------------- */
app.use(helmet());
app.use(compression());

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* -------------------------------------------
   PARSERS
-------------------------------------------- */
app.use(express.json({ limit: "2mb" }));
app.use(sanitizeInput);

/* -------------------------------------------
   STATIC + API DOCS
-------------------------------------------- */
app.use("/uploads", express.static("uploads"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

/* -------------------------------------------
   ROUTES
-------------------------------------------- */
app.use("/api/health", healthRoutes);
app.use("/api/debug", debugRoutes);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", checkRoutes);

app.use("/api/rides", rideRoutes);
app.use("/api/routes", routesRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/map", mapRoutes);

app.use("/api/feature-flags", featureFlagRoutes);
app.use("/api/ratings", ratingRoutes);

app.use("/api/matatus", matatuApiRoutes);
app.use("/api/sacco", saccoRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/trips", tripRoutes);

app.use("/api/matatu-system", matatuRoutes);

/* -------------------------------------------
   ERROR HANDLING
-------------------------------------------- */
app.use(notFound);
app.use(errorHandler);

/* -------------------------------------------
   SERVER STARTUP
-------------------------------------------- */
const PORT = process.env.PORT || 5001;

connectDB();

const startServer = (port, triedFallback = false) => {
  const server = http.createServer(app);

  const io = initSocket(server);

  app.set("io", io);

  server.listen(port, () => {
    console.log(`Radaa backend running on port ${port}`);
  });

  server.on("error", error => {
    if (error.code === "EADDRINUSE" && !triedFallback) {
      const fallback = 5002;
      console.warn(`Port ${port} busy → switching to ${fallback}`);
      startServer(fallback, true);
    } else {
      console.error("Server startup error:", error);
      process.exit(1);
    }
  });

  // graceful shutdown (important for Render)
  process.on("SIGTERM", () => {
    console.log("Shutting down cleanly...");
    server.close(() => process.exit(0));
  });
};

startServer(PORT);

export default app;
