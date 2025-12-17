import pg from "pg";

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on("connect", () => {
  console.log("[pg] PostgreSQL client connected");
});

pool.on("error", (err) => {
  console.error("[pg] Unexpected error on idle client", err);
});

export const initPg = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("[pg] connection test successful");
  } catch (error) {
    console.error("[pg] Failed to connect to PostgreSQL", error);
  }
};

export const pgQuery = (text, params) => pool.query(text, params);

export const getPgPool = () => pool;
