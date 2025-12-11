import dotenv from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production" ? ".env.production" : ".env";

dotenv.config({
  path: envFile,
  override: true,
  quiet: nodeEnv === "production"
});

if (nodeEnv !== "test") {
  const hasMongoUri = Boolean(process.env.MONGODB_URI || process.env.MONGO_URI);

  if (!hasMongoUri && nodeEnv === "production") {
    console.error(
      "[startup] MongoDB URI is not set (expected MONGO_URI or MONGODB_URI). The backend will not be able to connect to the database."
    );
  }

  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  const anyCloudinaryValue = Boolean(
    cloudinaryUrl || cloudinaryCloudName || cloudinaryApiKey || cloudinaryApiSecret
  );

  const fullCloudinaryConfig = Boolean(
    cloudinaryUrl || (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret)
  );

  if (!fullCloudinaryConfig) {
    if (anyCloudinaryValue) {
      console.warn(
        "[startup] Cloudinary environment variables are partially configured. Matatu photo uploads using Cloudinary may fail until all required values are set."
      );
    } else {
      console.warn(
        "[startup] Cloudinary environment variables are not set. Matatu photo uploads will fall back to local storage where supported."
      );
    }
  }

  const mpesaEnvVars = [
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_SHORTCODE",
    "MPESA_PASSKEY",
    "MPESA_CALLBACK_URL"
  ];

  const missingMpesa = mpesaEnvVars.filter((key) => !process.env[key]);

  if (missingMpesa.length > 0) {
    console.warn(
      "[startup] Mpesa environment variables are incomplete. Mpesa payment features may not work until configuration is finished."
    );
  }
}
