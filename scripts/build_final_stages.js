const fs = require('fs');
const path = require('path');
const https = require('https');

function readJsonStrict(filePath, label) {
  const data = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (err) {
    throw new Error('Failed to parse JSON for ' + label + ' at ' + filePath + ': ' + err.message);
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Unexpected JSON structure for ' + label + ' at ' + filePath);
  }
  return parsed;
}

function writeJson(filePath, value) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const json = JSON.stringify(value, null, 2) + '\n';
  fs.writeFileSync(filePath, json, 'utf8');
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const dPhi = toRadians(lat2 - lat1);
  const dLambda = toRadians(lon2 - lon1);
  const a =
    Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isValidPointFeature(feature) {
  if (!feature || feature.type !== 'Feature') {
    return false;
  }
  const geom = feature.geometry;
  if (!geom || geom.type !== 'Point') {
    return false;
  }
  const coords = geom.coordinates;
  if (!Array.isArray(coords) || coords.length !== 2) {
    return false;
  }
  const lon = Number(coords[0]);
  const lat = Number(coords[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    return false;
  }
  return true;
}

function loadPointStagesFromOsm(rootDir) {
  const backendPath = path.join(rootDir, 'backend', 'osm_nairobi_stages.geojson');
  if (!fs.existsSync(backendPath)) {
    throw new Error('Missing backend/osm_nairobi_stages.geojson at ' + backendPath);
  }
  const collection = readJsonStrict(backendPath, 'backend/osm_nairobi_stages.geojson');
  if (!collection || collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
    throw new Error('backend/osm_nairobi_stages.geojson must be a GeoJSON FeatureCollection with a features array');
  }

  const pointStages = [];
  for (let i = 0; i < collection.features.length; i += 1) {
    const feature = collection.features[i];
    if (!isValidPointFeature(feature)) {
      continue;
    }
    const coords = feature.geometry.coordinates;
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    const props = feature.properties && typeof feature.properties === 'object' ? feature.properties : {};
    pointStages.push({
      lon,
      lat,
      properties: props,
      originalFeature: feature
    });
  }

  if (!pointStages.length) {
    throw new Error('No valid Point features found in backend/osm_nairobi_stages.geojson');
  }

  return pointStages;
}

function computeBoundingBox(points, paddingDegrees) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  }
  if (!Number.isFinite(minLat) || !Number.isFinite(maxLat) || !Number.isFinite(minLon) || !Number.isFinite(maxLon)) {
    throw new Error('Failed to compute bounding box for stages');
  }
  const pad = typeof paddingDegrees === 'number' ? paddingDegrees : 0;
  return {
    south: minLat - pad,
    west: minLon - pad,
    north: maxLat + pad,
    east: maxLon + pad
  };
}

function fetchOverpassWays(query, label) {
  const encoded = encodeURIComponent(query);
  const url = 'https://overpass-api.de/api/interpreter?data=' + encoded;
  return new Promise(function (resolve, reject) {
    https
      .get(url, function (res) {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error('Overpass API request for ' + label + ' failed with status ' + res.statusCode));
          return;
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          let json;
          try {
            json = JSON.parse(body);
          } catch (err) {
            reject(new Error('Failed to parse Overpass response JSON for ' + label + ': ' + err.message));
            return;
          }
          if (!json || !Array.isArray(json.elements)) {
            reject(new Error('Unexpected Overpass response structure for ' + label));
            return;
          }
          const ways = [];
          for (let i = 0; i < json.elements.length; i += 1) {
            const el = json.elements[i];
            if (!el || el.type !== 'way' || !Array.isArray(el.geometry) || el.geometry.length < 2) {
              continue;
            }
            const coords = [];
            for (let j = 0; j < el.geometry.length; j += 1) {
              const pt = el.geometry[j];
              if (!pt || typeof pt.lon !== 'number' || typeof pt.lat !== 'number') {
                reject(new Error('Invalid coordinate in Overpass geometry for ' + label));
                return;
              }
              coords.push([pt.lon, pt.lat]);
            }
            if (coords.length >= 2) {
              ways.push({
                id: el.id,
                name: el.tags && typeof el.tags.name === 'string' ? el.tags.name : null,
                coords: coords
              });
            }
          }
          resolve(ways);
        });
      })
      .on('error', function (err) {
        reject(err);
      });
  });
}

function isStageNearLine(lat, lon, coords, thresholdMeters) {
  for (let i = 0; i < coords.length; i += 1) {
    const c = coords[i];
    const d = distanceMeters(lat, lon, c[1], c[0]);
    if (d <= thresholdMeters) {
      return true;
    }
  }
  return false;
}

function buildMagadiRoadCorridors() {
  const query =
    '[out:json][timeout:25]; ' +
    'way["highway"]["name"="Magadi Road"](-1.45,36.65,-1.38,36.77); ' +
    '(._;>;); out geom;';
  return fetchOverpassWays(query, 'Magadi Road').then(function (ways) {
    const features = [];
    for (let i = 0; i < ways.length; i += 1) {
      const way = ways[i];
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: way.coords
        },
        properties: {
          stage_type: 'corridor',
          boarding: 'yes',
          buffer_m: 50,
          source: 'osm',
          road_name: way.name || 'Magadi Road'
        }
      });
    }
    return features;
  });
}

function buildConnectingRoadCorridors(points, bbox, distanceThresholdMeters) {
  const south = bbox.south;
  const west = bbox.west;
  const north = bbox.north;
  const east = bbox.east;
  const query =
    '[out:json][timeout:60]; ' +
    'way["highway"]["name"!="Magadi Road"](' +
    south +
    ',' +
    west +
    ',' +
    north +
    ',' +
    east +
    '); (._;>;); out geom;';

  return fetchOverpassWays(query, 'connecting highways').then(function (ways) {
    const corridorFeatures = [];
    for (let i = 0; i < ways.length; i += 1) {
      const way = ways[i];
      let nearCount = 0;
      for (let j = 0; j < points.length; j += 1) {
        const stage = points[j];
        if (isStageNearLine(stage.lat, stage.lon, way.coords, distanceThresholdMeters)) {
          nearCount += 1;
          if (nearCount >= 2) {
            break;
          }
        }
      }
      if (nearCount >= 2) {
        corridorFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: way.coords
          },
          properties: {
            stage_type: 'corridor',
            boarding: 'yes',
            buffer_m: 50,
            source: 'osm',
            road_name: way.name || 'Unnamed Road'
          }
        });
      }
    }
    return corridorFeatures;
  });
}

function buildFinalStages() {
  const rootDir = path.join(__dirname, '..');
  const dataDir = path.join(rootDir, 'data');
  const finalPath = path.join(dataDir, 'final_stages.json');

  const pointStages = loadPointStagesFromOsm(rootDir);

  const pointFeatures = [];
  for (let i = 0; i < pointStages.length; i += 1) {
    const s = pointStages[i];
    const originalProps = s.properties || {};
    const props = Object.assign({}, originalProps, {
      stage_type: 'point',
      boarding: 'yes',
      source: 'osm'
    });
    pointFeatures.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [s.lon, s.lat]
      },
      properties: props
    });
  }

  const bbox = computeBoundingBox(pointStages, 0.02);

  const distanceThresholdMeters = 50;

  return Promise.all([
    buildMagadiRoadCorridors(),
    buildConnectingRoadCorridors(pointStages, bbox, distanceThresholdMeters)
  ]).then(function (results) {
    const magadiCorridors = results[0] || [];
    const otherCorridors = results[1] || [];
    const corridorFeatures = magadiCorridors.concat(otherCorridors);

    if (!corridorFeatures.length) {
      throw new Error('No corridor stages were generated; refusing to write final_stages.json');
    }

    const allFeatures = pointFeatures.concat(corridorFeatures);

    const hasPoint = allFeatures.some(function (f) {
      return f && f.geometry && f.geometry.type === 'Point';
    });
    const hasLineString = allFeatures.some(function (f) {
      return f && f.geometry && f.geometry.type === 'LineString';
    });

    if (!hasPoint) {
      throw new Error('Final collection does not contain any Point geometries');
    }
    if (!hasLineString) {
      throw new Error('Final collection does not contain any LineString geometries');
    }

    const collection = {
      type: 'FeatureCollection',
      features: allFeatures
    };

    writeJson(finalPath, collection);

    const pointCount = pointFeatures.length;
    const corridorCount = corridorFeatures.length;
    const total = collection.features.length;

    console.log('Point stages:', pointCount);
    console.log('Corridor stages:', corridorCount);
    console.log('Total features:', total);
  });
}

buildFinalStages().catch(function (err) {
  console.error(err && err.stack ? err.stack : String(err));
  process.exitCode = 1;
});
