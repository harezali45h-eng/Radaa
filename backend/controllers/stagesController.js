import { pgQuery } from "../config/pg.js";

export const getStages = async (req, res, next) => {
  try {
    const { rows } = await pgQuery(
      "SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry FROM stages"
    );

    console.log(`[stages] fetched ${rows.length} stages`);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("[stages] Error querying stages table", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stages",
    });
  }
};
