import http from "http";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const httpRequest = (method, path) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
    };

    const req = http.request(options, (res) => {
      let raw = "";

      res.on("data", (chunk) => {
        raw += chunk;
      });

      res.on("end", () => {
        let json = null;
        if (raw) {
          try {
            json = JSON.parse(raw);
          } catch {
            json = null;
          }
        }
        resolve({ status: res.statusCode, body: json });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
};

const run = async () => {
  const res = await httpRequest("GET", "/api/bolt/live?limit=1");

  if (res.status !== 200) {
    throw new Error(`/api/bolt/live did not return 200 (got ${res.status})`);
  }

  if (!res.body || res.body.success !== true || !Array.isArray(res.body.data)) {
    throw new Error("/api/bolt/live payload is not in the expected { success, data: [] } format");
  }

  // eslint-disable-next-line no-console
  console.log("Bolt live endpoint test passed");
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
