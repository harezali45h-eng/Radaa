import { AuthError, ValidationError } from "../utils/errors.js";
import { addMatatuPhoto, listMatatuPhotos, deleteMatatuPhoto } from "../services/matatuPhotoService.js";

const ensureDriverOrAdmin = (user) => {
  if (!user) {
    throw new AuthError("Not authorized", 401);
  }

  if (user.role !== "driver" && user.role !== "admin") {
    throw new AuthError("Driver or admin access required", 403);
  }
};

export const uploadMatatuPhotoV2 = async (req, res, next) => {
  try {
    ensureDriverOrAdmin(req.user);

    const matatuId = req.params.id;
    const file = req.file;

    if (!file || !file.buffer) {
      throw new ValidationError("photo file is required");
    }

    const result = await addMatatuPhoto({
      matatuId,
      uploadedBy: req.user._id,
      buffer: file.buffer,
      mimeType: file.mimetype,
      caption: (req.body && req.body.caption) || undefined,
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const listMatatuPhotosV2 = async (req, res, next) => {
  try {
    const matatuId = req.params.id;
    const role = req.user?.role || null;

    const photos = await listMatatuPhotos({
      matatuId,
      includeAll: role === "admin" || role === "driver",
      isAdmin: role === "admin",
    });

    return res.json({ success: true, data: photos });
  } catch (error) {
    return next(error);
  }
};

export const deleteMatatuPhotoV2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const matatuId = req.params.id;
    const photoId = req.params.photoId;

    const result = await deleteMatatuPhoto({
      matatuId,
      photoId,
      actorUserId: req.user._id,
      actorRole: req.user.role,
    });

    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
