import User from "../models/User.js";
import Matatu from "../models/Matatu.js";
import { AuthError, ValidationError } from "../utils/errors.js";
import { getSaccoOverview as getSaccoOverviewService } from "../services/saccoAnalyticsService.js";

export const setDriverEnabled = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new AuthError("Admin access required", 403);
    }

    const { driverId } = req.params;
    const { enabled } = req.body || {};

    if (typeof enabled !== "boolean") {
      throw new ValidationError("enabled must be a boolean");
    }

    const driver = await User.findByIdAndUpdate(
      driverId,
      {
        $set: {
          enabled
        }
      },
      { new: true }
    ).select("_id username email phone role enabled driverProfile driverVerificationStatus");

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    return res.json({ success: true, data: driver });
  } catch (error) {
    return next(error);
  }
};

export const getSaccoOverview = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new AuthError("Admin access required", 403);
    }

    const { id } = req.params;

    const overview = await getSaccoOverviewService(id);

    return res.json({ success: true, data: overview });
  } catch (error) {
    return next(error);
  }
};

export const getSaccoDrivers = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new AuthError("Admin access required", 403);
    }

    const saccoName = (user.saccoProfile && user.saccoProfile.saccoName) || undefined;

    const filter = { role: "driver" };
    if (saccoName) {
      filter["driverProfile.saccoName"] = saccoName;
    }

    const drivers = await User.find(filter)
      .select("_id username email phone role enabled driverProfile driverVerificationStatus")
      .lean();

    return res.json({ success: true, data: drivers });
  } catch (error) {
    return next(error);
  }
};

export const getSaccoMatatus = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new AuthError("Admin access required", 403);
    }

    const saccoName = (user.saccoProfile && user.saccoProfile.saccoName) || undefined;
    const { status } = req.query || {};

    const filter = {};
    if (saccoName) {
      filter.sacco = saccoName;
    }
    if (status && typeof status === "string") {
      filter.approvalStatus = status;
    }

    const matatus = await Matatu.find(filter)
      .select("plate route numberPlate sacco driver approvalStatus photos")
      .lean();

    return res.json({ success: true, data: matatus });
  } catch (error) {
    return next(error);
  }
};

export const uploadSaccoDoc = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new AuthError("Admin access required", 403);
    }

    const { id } = req.params;

    if (!req.file) {
      throw new ValidationError("file is required");
    }

    const { type } = req.body || {};

    const fieldMap = {
      logo: "logoUrl",
      permit: "permitUrl",
      insurance: "insuranceUrl",
      compliance: "complianceDocUrl"
    };

    const field = fieldMap[type];

    if (!field) {
      throw new ValidationError(
        "type must be one of: logo, permit, insurance, compliance"
      );
    }

    const publicPath = `/uploads/${req.file.filename}`;

    const updated = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          [`saccoProfile.${field}`]: publicPath
        }
      },
      { new: true }
    ).select("_id email saccoProfile");

    if (!updated) {
      return res.status(404).json({ success: false, message: "SACCO not found" });
    }

    return res.status(201).json({ success: true, data: updated.saccoProfile });
  } catch (error) {
    return next(error);
  }
};

export const setDriverVerificationStatus = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new AuthError("Admin access required", 403);
    }

    const { driverId } = req.params;
    const { status } = req.body || {};

    if (!status || typeof status !== "string") {
      throw new ValidationError("status is required");
    }

    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(status)) {
      throw new ValidationError("status must be pending, approved, or rejected");
    }

    const driver = await User.findByIdAndUpdate(
      driverId,
      {
        $set: {
          driverVerificationStatus: status
        }
      },
      { new: true }
    ).select("_id username email phone role enabled driverProfile driverVerificationStatus");

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    return res.json({ success: true, data: driver });
  } catch (error) {
    return next(error);
  }
};

export const setMatatuApprovalStatus = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new AuthError("Admin access required", 403);
    }

    const { matatuId } = req.params;
    const { status } = req.body || {};

    if (!status || typeof status !== "string") {
      throw new ValidationError("status is required");
    }

    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(status)) {
      throw new ValidationError("status must be pending, approved, or rejected");
    }

    const matatu = await Matatu.findByIdAndUpdate(
      matatuId,
      {
        $set: {
          approvalStatus: status
        }
      },
      { new: true }
    ).select("plate route numberPlate sacco driver approvalStatus photos");

    if (!matatu) {
      return res.status(404).json({ success: false, message: "Matatu not found" });
    }

    return res.json({ success: true, data: matatu });
  } catch (error) {
    return next(error);
  }
};
