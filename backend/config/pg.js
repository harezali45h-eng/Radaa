import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || "radaa_gis",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD,
});

pool.on("error", (err) => {
  console.error("[pg] Unexpected error on idle client", err);
});

export const initPg = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("[pg] connection established");
  } catch (error) {
    console.error("[pg] Failed to connect to PostgreSQL (radaa_gis)", error);
  }
};

export const pgQuery = (text, params) => pool.query(text, params);

export const getPgPool = () => pool;
