import mongoose from "mongoose";

mongoose.set("strictQuery", false);

mongoose.connection.on("connected", () => {
  console.log("[mongo] connection established");
});

mongoose.connection.on("disconnected", () => {
  console.warn("[mongo] connection lost");
});

mongoose.connection.on("error", () => {
  console.error("[mongo] connection error event");
});

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export const connectDB = async () => {
  const nodeEnv = process.env.NODE_ENV || "development";

  let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    if (nodeEnv !== "production") {
      uri = "mongodb://localhost:27017/radaa";
      console.warn(
        "[mongo] No MONGO_URI/MONGODB_URI set. Using default local MongoDB at mongodb://localhost:27017/radaa for development."
      );
    } else {
      console.error(
        "[mongo] No MongoDB URI configured (expected MONGO_URI or MONGODB_URI). Database features will be unavailable until this is set."
      );
      process.exit(1);
    }
  }

  const isAuthError = (error) => {
    const msg = (error && error.message) || "";
    return (
      msg.toLowerCase().includes("auth") ||
      msg.toLowerCase().includes("authentication failed") ||
      msg.toLowerCase().includes("bad auth")
    );
  };

  const isNetworkError = (error) => {
    const msg = (error && error.message) || "";
    return (
      msg.includes("ECONNREFUSED") ||
      msg.includes("ENOTFOUND") ||
      msg.toLowerCase().includes("failed to connect") ||
      msg.toLowerCase().includes("timed out") ||
      msg.toLowerCase().includes("network")
    );
  };

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      attempt += 1;
      console.log(`[mongo] Connecting to MongoDB (attempt ${attempt}/${MAX_RETRIES})...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      return;
    } catch (error) {
      const message = error && error.message ? error.message : "";

      console.error("[mongo] Failed to connect to MongoDB.");

      if (isAuthError(error)) {
        console.error(
          "Hint: Authentication issues often mean the username/password or database name in MONGODB_URI is wrong, or the database user lacks access. If you're using MongoDB Atlas, try regenerating the database user password and updating the URI."
        );
        break;
      }

      if (isNetworkError(error)) {
        console.error(
          "Hint: This looks like a network issue. If you are using Atlas, ensure your current IP is allowed in Network Access and that your internet/DNS is reachable."
        );
      }

      if (attempt >= MAX_RETRIES) {
        console.error(
          "[mongo] MongoDB connection failed after maximum retries. Database-dependent endpoints will continue to fail until connectivity/auth is restored."
        );
        if (nodeEnv === "production") {
          process.exit(1);
        }
        break;
      }

      console.log(
        `[mongo] Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};
