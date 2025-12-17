import { pgQuery } from "../config/pg.js";

export const getStages = async (req, res, next) => {
  try {
    const { rows } = await pgQuery(
      "SELECT id, name, stage_type, source, ST_AsGeoJSON(geom) AS geom_geojson FROM stages"
    );

    const features = rows.map((row) => {
      let geometry = null;

      if (row.geom_geojson) {
        try {
          geometry = JSON.parse(row.geom_geojson);
        } catch (err) {
          console.error("[pg] Failed to parse GeoJSON for stage id", row.id, err);
        }
      }

      return {
        type: "Feature",
        geometry,
        properties: {
          id: row.id,
          name: row.name,
          stage_type: row.stage_type,
          source: row.source,
        },
      };
    });

    return res.json({
      type: "FeatureCollection",
      features,
    });
  } catch (error) {
    console.error("[pg] Error querying stages table", error);
    return next(error);
  }
};
