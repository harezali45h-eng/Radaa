import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  // eslint-disable-next-line no-console
  console.error("MONGO_URI is not set");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("OK");
    return mongoose.disconnect();
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
