import User from "../models/User.js";

// GET /api/gallery/drivers
// Returns public driver gallery items based on uploaded profilePhotoUrl.
export const getDriverGallery = async (req, res, next) => {
  try {
    const drivers = await User.find({
      role: "driver",
      "driverProfile.profilePhotoUrl": { $exists: true, $ne: "" },
    })
      .select(
        "driverProfile.saccoName driverProfile.vehicleRegistration driverProfile.profilePhotoUrl",
      )
      .lean();

    const items = drivers.map((doc) => {
      const profile = doc.driverProfile || {};

      return {
        id: doc._id?.toString?.() || String(doc._id),
        profilePhotoUrl: profile.profilePhotoUrl || null,
        vehicleRegistration: profile.vehicleRegistration || null,
        saccoName: profile.saccoName || null,
      };
    });

    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
};
