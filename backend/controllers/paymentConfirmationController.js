import PaymentConfirmation from "../models/PaymentConfirmation.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";
import { AuthError } from "../utils/errors.js";

export const listPaymentConfirmations = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const enabled = await isFeatureEnabled(
      FEATURE_FLAG_KEYS.PAYMENT_CONFIRM_V1,
      req.user._id,
    );

    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Payment confirm feature disabled" });
    }

    const limitRaw = req.query?.limit;
    const limit = Math.min(50, Number(limitRaw) || 20);

    const docs = await PaymentConfirmation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
};

export const markPaymentConfirmationSeen = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const enabled = await isFeatureEnabled(
      FEATURE_FLAG_KEYS.PAYMENT_CONFIRM_V1,
      req.user._id,
    );

    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Payment confirm feature disabled" });
    }

    const { id } = req.params;

    const doc = await PaymentConfirmation.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Confirmation not found" });
    }

    if (!doc.seenAt) {
      doc.seenAt = new Date();
    }

    await doc.save();

    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};
