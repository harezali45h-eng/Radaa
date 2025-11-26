import Matatu from "../models/Matatu.js";
import { AuthError, ValidationError } from "../utils/errors.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";
import { getUploadMode, createCdnUploadForMatatu, saveLocalMatatuPhoto } from "../services/photoService.js";

export const uploadMatatuPhoto = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    if (req.user.role !== "driver" && req.user.role !== "admin") {
      throw new AuthError("Driver or admin access required", 403);
    }

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.MATATU_PHOTOS_V1, req.user._id);
    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Matatu photos feature disabled" });
    }

    const matatuId = req.params.id;
    if (!matatuId) {
      throw new ValidationError("matatu id is required");
    }

    const mode = getUploadMode();

    if (mode === "cdn") {
      const { mimeType, sizeBytes, caption } = req.body || {};

      if (!mimeType) {
        throw new ValidationError("mimeType is required for CDN uploads");
      }

      const result = await createCdnUploadForMatatu({
        matatuId,
        uploadedBy: req.user._id,
        mimeType,
        sizeBytes,
        caption
      });

      return res.status(201).json({ success: true, data: result });
    }

    const file = req.file;
    const caption = (req.body && req.body.caption) || undefined;

    const result = await saveLocalMatatuPhoto({
      matatuId,
      uploadedBy: req.user._id,
      file,
      caption
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const getMatatuPhotos = async (req, res, next) => {
  try {
    const matatuId = req.params.id;

    const matatu = await Matatu.findById(matatuId).select("photos").lean();

    if (!matatu) {
      return res.status(404).json({ success: false, message: "Matatu not found" });
    }

    const role = req.user?.role || null;

    let photos = Array.isArray(matatu.photos) ? matatu.photos : [];

    if (role !== "admin") {
      photos = photos.filter((p) => p && p.status === "approved");
    }

    return res.json({ success: true, data: photos });
  } catch (error) {
    return next(error);
  }
};

const ensureAdmin = (user) => {
  if (!user || user.role !== "admin") {
    throw new AuthError("Admin access required", 403);
  }
};

export const approveMatatuPhoto = async (req, res, next) => {
  try {
    ensureAdmin(req.user);

    const { id, photoId } = req.params;

    const matatu = await Matatu.findOneAndUpdate(
      { _id: id, "photos._id": photoId },
      {
        $set: {
          "photos.$.status": "approved",
          "photos.$.rejectionReason": undefined
        }
      },
      { new: true }
    ).select("photos");

    if (!matatu) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    return res.json({ success: true, data: matatu.photos });
  } catch (error) {
    return next(error);
  }
};

export const rejectMatatuPhoto = async (req, res, next) => {
  try {
    ensureAdmin(req.user);

    const { id, photoId } = req.params;
    const { reason } = req.body || {};

    const matatu = await Matatu.findOneAndUpdate(
      { _id: id, "photos._id": photoId },
      {
        $set: {
          "photos.$.status": "rejected",
          "photos.$.rejectionReason": reason || "rejected"
        }
      },
      { new: true }
    ).select("photos");

    if (!matatu) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    return res.json({ success: true, data: matatu.photos });
  } catch (error) {
    return next(error);
  }
};
