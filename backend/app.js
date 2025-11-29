import "./config/env.js";
import http from "http";
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

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://radaa-frontend.vercel.app",
  "https://radaa-frontend-pu8ch5mlr-wesley-jalangos-projects.vercel.app",
  "https://radaa-frontend-git-main-wesley-jalangos-projects.vercel.app",
  "https://radaa-frontend-weld.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS → ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(cors(corsOptions));
app.options("/{*splat}", cors(corsOptions));
app.use(express.json());
app.use(sanitizeInput);
app.use(limiter);

app.use("/uploads", express.static("uploads"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api", healthRoutes);
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
app.use("/api/matatus", matatuRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/admin", adminRoutes);

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
      console.error(" Server startup error:", error);
      process.exit(1);
    }
  });
};

startServer(PORT);
