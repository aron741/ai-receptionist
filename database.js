const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// crea tabella se non esiste
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calls (
      id SERIAL PRIMARY KEY,
      tenant_id TEXT,
      from_number TEXT,
      to_number TEXT,
      type TEXT,
      raw_text TEXT,
      time TEXT
    )
  `);
}

initDB();

module.exports = pool;