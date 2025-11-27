import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "❗ DB Connection Error: MongoDB URI is not defined in env (expected MONGO_URI or MONGODB_URI)."
    );
    process.exit(1);
  }

  try {
    const protocol = uri.split("://")[0];
    let host = "";
    try {
      const parsed = new URL(uri);
      host = parsed.hostname;
    } catch {
      host = "<unparseable>";
    }
    console.log(`MongoDB connection debug -> protocol: ${protocol}, host: ${host}`);
  } catch {
    console.log("MongoDB connection debug -> unable to parse URI");
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
      console.log(`Connecting to MongoDB (attempt ${attempt}/${MAX_RETRIES})...`);
      await mongoose.connect(uri);
      console.log("🔥 Radaa DB Connected Successfully");
      return;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      console.error(`❗ DB Connection Error: ${message}`);

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
        console.error("MongoDB connection failed after maximum retries");
        break;
      }

      console.log(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  console.error(
    "MongoDB connection was not established. The backend will continue running, but any endpoint that requires the database will fail until connectivity/auth is fixed."
  );
};
