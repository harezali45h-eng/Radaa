import fs from "fs";
import path from "path";
import Matatu from "../models/Matatu.js";
import { ValidationError } from "../utils/errors.js";
import { uploadMatatuImage, validateMatatuImage, deleteMatatuImage } from "../utils/cloudinary.js";

const MAX_PHOTOS_PER_MATATU = 3;

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_URL,
} = process.env;

const isCloudinaryEnabled = Boolean(
  CLOUDINARY_URL || (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET),
);

const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

const getExtensionFromMime = (mimeType) => {
  if (!mimeType) return "jpg";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
};

const derivePublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex === -1 || segments.length <= uploadIndex + 1) {
      return null;
    }

    const afterUpload = segments.slice(uploadIndex + 1);

    if (afterUpload[0] && afterUpload[0].startsWith("v") && afterUpload.length > 1) {
      afterUpload.shift();
    }

    if (afterUpload.length === 0) return null;

    const last = afterUpload[afterUpload.length - 1];
    const dotIndex = last.lastIndexOf(".");
    const lastWithoutExt = dotIndex > 0 ? last.slice(0, dotIndex) : last;
    afterUpload[afterUpload.length - 1] = lastWithoutExt;

    return afterUpload.join("/");
  } catch {
    return null;
  }
};

export const addMatatuPhoto = async ({ matatuId, uploadedBy, buffer, mimeType, caption }) => {
  if (!matatuId) {
    throw new ValidationError("matatuId is required");
  }

  if (!uploadedBy) {
    throw new ValidationError("uploadedBy is required");
  }

  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new ValidationError("photo buffer is required");
  }

  if (!mimeType) {
    throw new ValidationError("mimeType is required");
  }

  const matatu = await Matatu.findById(matatuId);

  if (!matatu) {
    throw new ValidationError("Matatu not found");
  }

  const photos = Array.isArray(matatu.photos) ? matatu.photos : [];
  if (photos.length >= MAX_PHOTOS_PER_MATATU) {
    throw new ValidationError("Maximum number of photos reached for this matatu");
  }

  validateMatatuImage({ mimeType, sizeBytes: buffer.length });

  let url;
  let mode;

  if (isCloudinaryEnabled) {
    const result = await uploadMatatuImage(buffer, { mimeType });
    url = result.secure_url || result.url;
    if (!url) {
      throw new ValidationError("Cloudinary upload did not return a URL");
    }
    mode = "cloudinary";
  } else {
    const uploadsDir = ensureUploadsDir();
    const ext = getExtensionFromMime(mimeType);
    const filename = `matatu-${matatuId}-${Date.now().toString(36)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    url = `/uploads/${filename}`;
    mode = "local";
  }

  matatu.photos.push({
    url,
    uploadedBy,
    caption: caption || undefined,
  });

  await matatu.save();

  const saved = matatu.photos[matatu.photos.length - 1];

  return {
    mode,
    photoId: saved._id,
    url: saved.url,
  };
};

export const listMatatuPhotos = async ({ matatuId, includeAll, isAdmin }) => {
  if (!matatuId) {
    throw new ValidationError("matatuId is required");
  }

  const matatu = await Matatu.findById(matatuId).select("photos").lean();

  if (!matatu) {
    throw new ValidationError("Matatu not found");
  }

  const photos = Array.isArray(matatu.photos) ? matatu.photos : [];

  if (includeAll || isAdmin) {
    return photos;
  }

  return photos.filter((p) => p && p.status === "approved");
};

export const deleteMatatuPhoto = async ({ matatuId, photoId, actorUserId, actorRole }) => {
  if (!matatuId || !photoId) {
    throw new ValidationError("matatuId and photoId are required");
  }

  const actorId = actorUserId ? actorUserId.toString() : null;

  const matatu = await Matatu.findById(matatuId);

  if (!matatu) {
    throw new ValidationError("Matatu not found");
  }

  const photos = Array.isArray(matatu.photos) ? matatu.photos : [];
  const target = photos.find((p) => p && p._id && p._id.toString() === photoId.toString());

  if (!target) {
    throw new ValidationError("Photo not found");
  }

  const isAdmin = actorRole === "admin";
  const isUploader = actorId && target.uploadedBy && target.uploadedBy.toString() === actorId;
  const isDriverOwner = actorId && matatu.driver && matatu.driver.toString() === actorId;

  if (!isAdmin && !isUploader && !isDriverOwner) {
    throw new ValidationError("Not allowed to delete this photo");
  }

  matatu.photos = photos.filter((p) => !p || !p._id || p._id.toString() !== photoId.toString());
  await matatu.save();

  const publicId = derivePublicIdFromUrl(target.url);
  if (publicId) {
    await deleteMatatuImage(publicId).catch(() => {});
  }

  return { ok: true };
};
