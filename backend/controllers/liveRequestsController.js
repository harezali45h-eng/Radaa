import { AuthError } from "../utils/errors.js";
import {
  createLiveRequest as createLiveRequestService,
  getActiveLiveRequestForUser,
  cancelLiveRequest as cancelLiveRequestService,
  listVisibleLiveRequestsForDriver
} from "../services/liveRequestService.js";

export const createLiveRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const { location } = req.body || {};

    const data = await createLiveRequestService({
      userId: req.user._id,
      location
    });

    return res.status(201).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getActiveLiveRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const data = await getActiveLiveRequestForUser(req.user._id);

    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const cancelLiveRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const { id } = req.params;

    const data = await cancelLiveRequestService({
      userId: req.user._id,
      requestId: id
    });

    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getVisibleLiveRequests = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    if (req.user.role !== "driver" && req.user.role !== "admin") {
      throw new AuthError("Driver access required", 403);
    }

    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    const data = await listVisibleLiveRequestsForDriver({
      location: { lat, lng }
    });

    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
