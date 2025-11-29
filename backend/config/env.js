import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";

dotenv.config({ path: envFile, override: true });

console.log("[env] Using env file:", envFile);
console.log("[env] PORT=", process.env.PORT);
console.log("[env] NODE_ENV=", process.env.NODE_ENV);
console.log(
  "[env] Mongo URI present=",
  Boolean(process.env.MONGO_URI || process.env.MONGODB_URI)
);
