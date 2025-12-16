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

function normalizeName(rawName) {
  if (typeof rawName !== 'string') {
    return null;
  }
  const trimmed = rawName.trim();
  if (!trimmed) {
    return null;
  }
  const singleSpaced = trimmed.replace(/\s+/g, ' ');
  const canonical = singleSpaced.toLowerCase();
  const words = singleSpaced.split(' ');
  const display = words
    .map(function (word) {
      if (!word) {
        return word;
      }
      var allUpper = word === word.toUpperCase();
      var allLower = word === word.toLowerCase();
      if (!allLower && allUpper) {
        return word;
      }
      if (word.length === 1) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  return { canonical: canonical, display: display };
}

function isMeaningfulCanonicalName(canonical) {
  if (!canonical || typeof canonical !== 'string') {
    return false;
  }
  var value = canonical.trim();
  if (!value) {
    return false;
  }
  var banned = {
    yes: true,
    no: true,
    'bus stop': true,
    busstop: true,
    'bus-stop': true,
    platform: true,
    empty: true
  };
  if (banned[value]) {
    return false;
  }
  if (/^\d+$/.test(value)) {
    return false;
  }
  if (value.length < 2) {
    return false;
  }
  return true;
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  var R = 6371000;
  var phi1 = toRadians(lat1);
  var phi2 = toRadians(lat2);
  var dPhi = toRadians(lat2 - lat1);
  var dLambda = toRadians(lon2 - lon1);
  var a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function dedupeStagesByNameAndDistance(stages, thresholdMeters) {
  var kept = [];
  var duplicates = 0;
  for (var i = 0; i < stages.length; i += 1) {
    var candidate = stages[i];
    var isDuplicate = false;
    for (var j = 0; j < kept.length; j += 1) {
      var existing = kept[j];
      if (candidate.canonical !== existing.canonical) {
        continue;
      }
      var d = distanceMeters(candidate.lat, candidate.lon, existing.lat, existing.lon);
      if (d <= thresholdMeters) {
        isDuplicate = true;
        duplicates += 1;
        break;
      }
    }
    if (!isDuplicate) {
      kept.push(candidate);
    }
  }
  return { stages: kept, duplicates: duplicates };
}

function pointsEqual(a, b) {
  if (!a || !b || a.length !== 2 || b.length !== 2) {
    return false;
  }
  return a[0] === b[0] && a[1] === b[1];
}

function mergeLineStrings(lines) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }
  var result = lines[0].slice();
  var remaining = lines.slice(1);

  while (remaining.length > 0) {
    var attached = false;
    for (var i = 0; i < remaining.length; i += 1) {
      var line = remaining[i];
      if (!line || line.length === 0) {
        remaining.splice(i, 1);
        i -= 1;
        continue;
      }

      var start = result[0];
      var end = result[result.length - 1];
      var lineStart = line[0];
      var lineEnd = line[line.length - 1];

      if (pointsEqual(end, lineStart)) {
        result = result.concat(line.slice(1));
        remaining.splice(i, 1);
        attached = true;
        break;
      }
      if (pointsEqual(end, lineEnd)) {
        var rev = line.slice(0, line.length - 1).reverse();
        result = result.concat(rev);
        remaining.splice(i, 1);
        attached = true;
        break;
      }
      if (pointsEqual(start, lineEnd)) {
        result = line.slice(0, line.length - 1).concat(result);
        remaining.splice(i, 1);
        attached = true;
        break;
      }
      if (pointsEqual(start, lineStart)) {
        var rev2 = line.slice(1).reverse();
        result = rev2.concat(result);
        remaining.splice(i, 1);
        attached = true;
        break;
      }
    }

    if (!attached) {
      for (var j = 0; j < remaining.length; j += 1) {
        var extra = remaining[j];
        if (extra && extra.length > 0) {
          if (pointsEqual(result[result.length - 1], extra[0])) {
            result = result.concat(extra.slice(1));
          } else {
            result = result.concat(extra);
          }
        }
      }
      break;
    }
  }

  return result;
}

function ensureRawStagesCollection(rootDir) {
  var dataDir = path.join(rootDir, 'data');
  var rawPath = path.join(dataDir, 'raw_stages.geojson');
  if (fs.existsSync(rawPath)) {
    var existing = readJsonStrict(rawPath, 'raw_stages.geojson');
    if (!existing || existing.type !== 'FeatureCollection' || !Array.isArray(existing.features)) {
      throw new Error('Expected FeatureCollection in ' + rawPath);
    }
    return existing;
  }
  var fallback = path.join(rootDir, 'backend', 'osm_nairobi_stages.geojson');
  if (!fs.existsSync(fallback)) {
    throw new Error('Missing raw stages at ' + rawPath + ' and fallback source at ' + fallback);
  }
  var source = readJsonStrict(fallback, 'backend/osm_nairobi_stages.geojson');
  if (!source || source.type !== 'FeatureCollection' || !Array.isArray(source.features)) {
    throw new Error('Expected FeatureCollection in fallback raw stages at ' + fallback);
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  writeJson(rawPath, source);
  return source;
}

function loadManualStages(dataDir) {
  var manualPath = path.join(dataDir, 'manual_stages.json');
  if (!fs.existsSync(manualPath)) {
    return [];
  }
  var manual = readJsonStrict(manualPath, 'manual_stages.json');
  if (!Array.isArray(manual)) {
    throw new Error('manual_stages.json must be a JSON array of stage definitions');
  }
  var stages = [];
  for (var i = 0; i < manual.length; i += 1) {
    var item = manual[i];
    if (!item || typeof item !== 'object') {
      throw new Error('Manual stage at index ' + i + ' must be an object');
    }
    var nameValue = item.name;
    var normalized = normalizeName(nameValue);
    if (!normalized || !isMeaningfulCanonicalName(normalized.canonical)) {
      throw new Error('Manual stage at index ' + i + ' must have a meaningful, non-empty name');
    }
    var coords = item.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2) {
      throw new Error('Manual stage at index ' + i + ' must have coordinates [lon, lat]');
    }
    var lon = Number(coords[0]);
    var lat = Number(coords[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      throw new Error('Manual stage at index ' + i + ' must have numeric coordinates');
    }
    var id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : 'manual-' + i;
    stages.push({
      id: id,
      name: normalized.display,
      canonical: normalized.canonical,
      lon: lon,
      lat: lat,
      source: 'manual'
    });
  }
  return stages;
}

function fetchMagadiRoadCorridor() {
  var query = '[out:json][timeout:25]; way["highway"]["name"="Magadi Road"](-1.45,36.65,-1.38,36.77); (._;>;); out geom;';
  var encoded = encodeURIComponent(query);
  var url = 'https://overpass-api.de/api/interpreter?data=' + encoded;
  return new Promise(function (resolve, reject) {
    https
      .get(url, function (res) {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error('Overpass API request failed with status ' + res.statusCode));
          return;
        }
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          var json;
          try {
            json = JSON.parse(body);
          } catch (err) {
            reject(new Error('Failed to parse Overpass response JSON: ' + err.message));
            return;
          }
          if (!json || !Array.isArray(json.elements)) {
            reject(new Error('Unexpected Overpass response structure'));
            return;
          }
          var lines = [];
          for (var i = 0; i < json.elements.length; i += 1) {
            var el = json.elements[i];
            if (!el || el.type !== 'way' || !Array.isArray(el.geometry) || el.geometry.length < 2) {
              continue;
            }
            var coords = [];
            for (var j = 0; j < el.geometry.length; j += 1) {
              var pt = el.geometry[j];
              if (!pt || typeof pt.lon !== 'number' || typeof pt.lat !== 'number') {
                reject(new Error('Invalid coordinate in Overpass geometry'));
                return;
              }
              coords.push([pt.lon, pt.lat]);
            }
            if (coords.length >= 2) {
              lines.push(coords);
            }
          }
          if (!lines.length) {
            reject(new Error('Magadi Road geometry not found in Overpass response'));
            return;
          }
          var mergedCoords = mergeLineStrings(lines);
          if (!Array.isArray(mergedCoords) || mergedCoords.length < 2) {
            reject(new Error('Merged Magadi Road geometry did not contain enough points for a LineString'));
            return;
          }
          var feature = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: mergedCoords
            },
            properties: {
              id: 'magadi-road-kiserian-maasai-lodge',
              name: 'Magadi Road Corridor (Kiserian - Maasai Lodge)',
              type: 'corridor',
              buffer_m: 50,
              source: 'osm_overpass'
            }
          };
          resolve(feature);
        });
      })
      .on('error', function (err) {
        reject(err);
      });
  });
}

function buildStages() {
  var rootDir = path.join(__dirname, '..');
  var dataDir = path.join(rootDir, 'data');
  var finalPath = path.join(dataDir, 'final_stages.json');

  var rawCollection = ensureRawStagesCollection(rootDir);
  if (!rawCollection || rawCollection.type !== 'FeatureCollection' || !Array.isArray(rawCollection.features)) {
    throw new Error('Raw stages collection must be a GeoJSON FeatureCollection with a features array');
  }

  var rawFeatures = rawCollection.features;
  var rawCount = rawFeatures.length;

  var osmStages = [];
  for (var i = 0; i < rawFeatures.length; i += 1) {
    var feature = rawFeatures[i];
    if (!feature || !feature.geometry || feature.geometry.type !== 'Point') {
      continue;
    }
    var geom = feature.geometry;
    var coords = geom.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2) {
      continue;
    }
    var lon = Number(coords[0]);
    var lat = Number(coords[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      continue;
    }
    var props = feature.properties || {};
    var nameValue = null;
    if (typeof props.name === 'string' && props.name.trim()) {
      nameValue = props.name;
    } else if (typeof props.local_ref === 'string' && props.local_ref.trim()) {
      nameValue = props.local_ref;
    } else if (typeof props.ref === 'string' && props.ref.trim()) {
      nameValue = props.ref;
    } else if (typeof props.designation === 'string' && props.designation.trim()) {
      nameValue = props.designation;
    } else {
      nameValue = '';
    }
    var normalized = normalizeName(nameValue);
    if (!normalized || !isMeaningfulCanonicalName(normalized.canonical)) {
      continue;
    }
    var id = null;
    if (typeof props['@id'] === 'string' && props['@id'].trim()) {
      id = props['@id'].trim();
    } else if (typeof feature.id === 'string' && feature.id.trim()) {
      id = feature.id.trim();
    } else {
      id = 'osm-' + i;
    }
    osmStages.push({
      id: id,
      name: normalized.display,
      canonical: normalized.canonical,
      lon: lon,
      lat: lat,
      source: 'osm'
    });
  }

  var manualStages = loadManualStages(dataDir);
  var combined = manualStages.concat(osmStages);

  var deduped = dedupeStagesByNameAndDistance(combined, 30);
  var keptStages = deduped.stages;
  var duplicatesRemoved = deduped.duplicates;

  var pointFeatures = [];
  for (var j = 0; j < keptStages.length; j += 1) {
    var s = keptStages[j];
    pointFeatures.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [s.lon, s.lat]
      },
      properties: {
        id: s.id,
        name: s.name,
        type: 'stage',
        source: s.source
      }
    });
  }

  return fetchMagadiRoadCorridor().then(function (corridorFeature) {
    var corridorStages = [corridorFeature];
    var corridorCount = corridorStages.length;
    var collection = {
      type: 'FeatureCollection',
      features: pointFeatures.concat(corridorStages)
    };
    writeJson(finalPath, collection);

    var validKept = keptStages.length;
    console.log('Raw features:', rawCount);
    console.log('Valid stages kept:', validKept);
    console.log('Duplicates removed:', duplicatesRemoved);
    console.log('Corridor stages added:', corridorCount);
  });
}

buildStages().catch(function (err) {
  console.error(err && err.stack ? err.stack : String(err));
  process.exitCode = 1;
});
