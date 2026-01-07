import User from "../models/User.js";
import Matatu from "../models/Matatu.js";

// GET /api/gallery/drivers
// Returns public driver gallery items based primarily on Matatu photos,
// with a fallback to legacy User.driverProfile.profilePhotoUrl where needed.
export const getDriverGallery = async (req, res, next) => {
  try {
    console.log("[GALLERY] getDriverGallery called");

    const matatus = await Matatu.find({
      isVisible: { $ne: false },
      photos: { $exists: true, $ne: [] },
    })
      .select("plate numberPlate sacco photos")
      .lean();

    const matatuItems = (matatus || [])
      .map((m) => {
        const rawPhotos = Array.isArray(m.photos) ? m.photos : [];
        const approvedPhotos = rawPhotos
          .filter((p) => p && (!p.status || p.status === "approved"))
          .map((p) => p.url)
          .filter((url) => typeof url === "string" && url.length > 0);

        if (!approvedPhotos.length) {
          return null;
        }

        const primaryPhotoUrl = approvedPhotos[0] || null;
        const plate = m.plate || m.numberPlate || null;
        const numberPlate = m.numberPlate || m.plate || null;
        const sacco = m.sacco || null;

        return {
          id: m._id?.toString?.() || String(m._id),
          photos: approvedPhotos,
          plate,
          numberPlate,
          sacco,
          // Legacy-compatible fields so existing gallery page mapping continues
          // to work while we expose a TinderGallery-friendly shape.
          profilePhotoUrl: primaryPhotoUrl,
          vehicleRegistration: plate,
          saccoName: sacco,
        };
      })
      .filter(Boolean);

    // Legacy fallback: keep existing behavior so older profilePhotoUrl-based
    // gallery items still work if any.
    const legacyDrivers = await User.find({
      role: "driver",
      "driverProfile.profilePhotoUrl": { $exists: true, $ne: "" },
    })
      .select(
        "driverProfile.saccoName driverProfile.vehicleRegistration driverProfile.profilePhotoUrl",
      )
      .lean();

    const legacyItems = (legacyDrivers || []).map((doc) => {
      const profile = doc.driverProfile || {};
      const profileUrl = profile.profilePhotoUrl || null;
      const plate = profile.vehicleRegistration || null;
      const sacco = profile.saccoName || null;

      return {
        id: doc._id?.toString?.() || String(doc._id),
        photos: profileUrl ? [profileUrl] : [],
        plate,
        numberPlate: plate,
        sacco,
        profilePhotoUrl: profileUrl,
        vehicleRegistration: plate,
        saccoName: sacco,
      };
    });

    const allItems = [...matatuItems, ...legacyItems];

    console.log("[GALLERY] getDriverGallery returning items:", allItems.length);

    return res.json({ success: true, data: allItems });
  } catch (error) {
    return next(error);
  }
};
