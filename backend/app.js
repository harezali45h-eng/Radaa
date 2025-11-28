import http from "http";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { sanitizeInput } from "./middleware/sanitizeMiddleware.js";
import { openapiSpec } from "./utils/openapi.js";
import { connectDB } from "./config/db.js";
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
import { initSocket } from "./realtime/socket.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";

dotenv.config({ path: envFile, override: true });

console.log("[env] Using env file:", envFile);
console.log("[env] PORT=", process.env.PORT);
console.log("[env] NODE_ENV=", process.env.NODE_ENV);
console.log(
  "[env] Mongo URI present=",
  Boolean(process.env.MONGO_URI || process.env.MONGODB_URI)
);

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
  })
);
app.use(express.json());
app.use(sanitizeInput);
app.use(limiter);

app.use("/uploads", express.static("uploads"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api", healthRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/debug", debugRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", checkRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api", routesRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api", mapRoutes);
app.use("/api", featureFlagRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/matatus", matatuApiRoutes);
app.use("/api/sacco", saccoRoutes);
app.use("/matatus", matatuRoutes);
app.use("/payments", paymentRoutes);
app.use("/trips", tripRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB();

const startServer = (port, triedFallback = false) => {
  const server = http.createServer(app);

  const io = initSocket(server);
  app.set("io", io);

  server.listen(port, () => {
    const address = server.address();
    const actualPort = typeof address === "string" ? address : address?.port;
    console.log(`Server running on port ${actualPort}`);
  });

  server.on("error", (error) => {
    if (error && error.code === "EADDRINUSE" && !triedFallback) {
      const fallbackPort = 5002;
      console.warn(
        `Port ${port} is already in use. Attempting to start Radaa backend on fallback port ${fallbackPort}...`
      );
      startServer(fallbackPort, true);
    } else {
      console.error("❗ Server startup error:", error);
      process.exit(1);
    }
  });
};

startServer(PORT);
