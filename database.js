const Database = require("better-sqlite3");

// crea / apre il database
const db = new Database("calls.db");

// crea tabella se non esiste
db.exec(`
  CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT,
    from_number TEXT,
    to_number TEXT,
    type TEXT,
    raw_text TEXT,
    time TEXT
  )
`);

module.exports = db;