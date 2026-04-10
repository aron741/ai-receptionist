const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./calls.db");

// crea tabella
db.serialize(() => {
  db.run(
    `INSERT INTO calls (tenant_id, from_number, to_number, type, raw_text, time)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tenantId, from, to, callType, userText, time]
  );
});

module.exports = db;