import { v2 as cloudinary } from "cloudinary";
import { ValidationError } from "./errors.js";

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_URL,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const getExtensionFromMime = (mimeType) => {
  if (!mimeType) return null;
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return null;
};

export const validateMatatuImage = ({ mimeType, sizeBytes }) => {
  const ext = getExtensionFromMime(mimeType);

  if (!ext || !ALLOWED_FORMATS.includes(ext)) {
    throw new ValidationError("Unsupported image type. Use JPG, JPEG, PNG, or WebP.");
  }

  if (sizeBytes != null && Number.isFinite(sizeBytes)) {
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError("Image is too large. Max size is 2MB.");
    }
  }
};

export const uploadMatatuImage = async (buffer, { mimeType }) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new ValidationError("Invalid image buffer for upload.");
  }

  validateMatatuImage({ mimeType, sizeBytes: buffer.length });

  const enabled = Boolean(
    CLOUDINARY_URL || (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET),
  );

  if (!enabled) {
    throw new ValidationError("Cloudinary is not configured on the server.");
  }

  const folder = "radaa/matatu-photos";
  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error("[cloudinary] upload error", error);
          reject(new ValidationError("Failed to upload image to Cloudinary."));
          return;
        }

        if (!result) {
          reject(new ValidationError("Cloudinary did not return a result."));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteMatatuImage = async (publicId) => {
  if (!publicId) return;

  const enabled = Boolean(
    CLOUDINARY_URL || (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET),
  );

  if (!enabled) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[cloudinary] Failed to delete image", publicId, err);
  }
};
