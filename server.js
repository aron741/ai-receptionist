const express = require("express");
const app = express();
const db = require("./database");

/* =========================
   MIDDLEWARE
========================= */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

/* =========================
   MEMORY STORAGE (TEMP DB)
========================= */
const calls = [];

/* =========================
   🧠 CALL CLASSIFICATION ENGINE
========================= */
function classifyCall(text) {
  if (!text) return "unknown";

  const t = text.toLowerCase();

  if (t.includes("dolore") || t.includes("male")) return "emergency";
  if (t.includes("appuntamento") || t.includes("prenot")) return "booking";
  if (t.includes("orari") || t.includes("aperto")) return "info";

  return "info";
}

/* =========================
   🏠 ROOT TEST
========================= */
app.get("/", (req, res) => {
  res.send("AI Receptionist online");
});

/* =========================
   📞 TWILIO WEBHOOK
========================= */
app.post("/voice", (req, res) => {

  const userText = req.body.SpeechResult || "";
  const callType = classifyCall(userText);

  // 🔥 SIMULAZIONE MULTI-STUDIO
  // (poi lo sostituiamo con numero Twilio o mapping reale)
  const tenantId = req.body.To;

  const from = req.body.From || "unknown";
  const to = req.body.To || "unknown";
  const time = new Date().toISOString();

  db.run(
    `INSERT INTO calls (from_number, to_number, type, raw_text, time)
     VALUES (?, ?, ?, ?, ?)`,
    [from, to, callType, userText, time]
  );

  res.set("Content-Type", "text/xml");

  res.send(`
    <Response>
      <Say voice="alice">
        Studio ${tenantId}. Chiamata registrata come ${callType}.
      </Say>
    </Response>
  `);
});

/* =========================
   📊 DASHBOARD API
========================= */
app.get("/calls", (req, res) => {

  db.all(`SELECT * FROM calls ORDER BY id DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
  
  app.get("/calls/:tenant", (req, res) => {

    const tenant = req.params.tenant;
  
    db.all(
      `SELECT * FROM calls WHERE tenant_id = ? ORDER BY id DESC`,
      [tenant],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        res.json(rows);
      }
    );
  });
});

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    totalCalls: calls.length,
    lastCall: calls[calls.length - 1] || null
  });
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});