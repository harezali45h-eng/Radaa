import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pgQuery } from "../config/pg.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedStagesGeoJson = null;
let cachedStagesGeoJsonMtimeMs = 0;

async function loadStagesGeoJson() {
  const rootDir = path.resolve(__dirname, "..", "..");
  const filePath = path.join(rootDir, "data", "final_stages.json");

  const stats = await fs.promises.stat(filePath);

  if (!cachedStagesGeoJson || cachedStagesGeoJsonMtimeMs !== stats.mtimeMs) {
    const raw = await fs.promises.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.type !== "FeatureCollection" ||
      !Array.isArray(parsed.features)
    ) {
      throw new Error(
        "final_stages.json must be a GeoJSON FeatureCollection with a features array",
      );
    }

    cachedStagesGeoJson = parsed;
    cachedStagesGeoJsonMtimeMs = stats.mtimeMs;
  }

  return cachedStagesGeoJson;
}

export const getStages = async (req, res, next) => {
  try {
    const { rows } = await pgQuery(
      "SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry FROM stages",
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

export const getStagesGeoJson = async (req, res, next) => {
  try {
    const collection = await loadStagesGeoJson();
    return res.status(200).json(collection);
  } catch (error) {
    console.error("[stages] Error loading final_stages.json", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load stages GeoJSON",
    });
  }
};
