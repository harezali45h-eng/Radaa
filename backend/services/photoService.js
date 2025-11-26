import fs from "fs";
import path from "path";
import crypto from "crypto";
import Matatu from "../models/Matatu.js";
import { ValidationError } from "../utils/errors.js";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export const getUploadMode = () => {
  const base = process.env.IMAGE_CDN_BASE;
  const key = process.env.IMAGE_CDN_KEY;
  const secret = process.env.IMAGE_CDN_SECRET;

  if (base && key && secret) {
    return "cdn";
  }

  return "local";
};

export const validateImageInfo = ({ mimeType, sizeBytes }) => {
  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new ValidationError("Unsupported image type. Use JPEG, PNG, or WebP");
  }

  if (sizeBytes != null && Number.isFinite(sizeBytes)) {
    if (sizeBytes > MAX_SIZE_BYTES) {
      throw new ValidationError("Image is too large. Max size is 5MB");
    }
  }
};

const ensureUploadsDir = () => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch {
    // best-effort only
  }
};

const addPhotoToMatatu = async ({ matatuId, uploadedBy, url, caption }) => {
  const matatu = await Matatu.findById(matatuId);

  if (!matatu) {
    throw new ValidationError("Matatu not found");
  }

  const photo = {
    url,
    uploadedBy,
    caption: caption || undefined
  };

  matatu.photos.push(photo);
  await matatu.save();

  const saved = matatu.photos[matatu.photos.length - 1];

  return { matatu, photo: saved };
};

export const createCdnUploadForMatatu = async ({
  matatuId,
  uploadedBy,
  mimeType,
  sizeBytes,
  caption
}) => {
  const size = typeof sizeBytes === "number" ? sizeBytes : Number(sizeBytes);
  validateImageInfo({ mimeType, sizeBytes: Number.isNaN(size) ? undefined : size });

  const base = process.env.IMAGE_CDN_BASE;
  const key = process.env.IMAGE_CDN_KEY;
  const secret = process.env.IMAGE_CDN_SECRET;

  if (!base || !key || !secret) {
    throw new ValidationError("Image CDN is not configured");
  }

  const publicId = `matatu-${matatuId}-${Date.now().toString(36)}`;
  const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60;
  const toSign = `${publicId}:${mimeType}:${expiresAt}:${key}`;
  const signature = crypto.createHmac("sha256", secret).update(toSign).digest("hex");

  const normalizedBase = base.replace(/\/$/, "");
  const uploadUrl = `${normalizedBase}/upload`;
  const publicUrl = `${normalizedBase}/${publicId}`;

  const { photo } = await addPhotoToMatatu({
    matatuId,
    uploadedBy,
    url: publicUrl,
    caption
  });

  return {
    mode: "cdn",
    photoId: photo._id,
    uploadUrl,
    publicUrl,
    publicId,
    mimeType,
    expiresAt,
    signature,
    key
  };
};

export const saveLocalMatatuPhoto = async ({ matatuId, uploadedBy, file, caption }) => {
  if (!file) {
    throw new ValidationError("photo file is required");
  }

  validateImageInfo({ mimeType: file.mimetype, sizeBytes: file.size });

  ensureUploadsDir();

  const relativePath = `/uploads/${file.filename}`;
  const url = relativePath;

  const { photo } = await addPhotoToMatatu({
    matatuId,
    uploadedBy,
    url,
    caption
  });

  return {
    mode: "local",
    photoId: photo._id,
    url
  };
};
