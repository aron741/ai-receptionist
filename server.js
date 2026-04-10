import express from "express";
import db from "./database.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

/* -------------------------
   CLASSIFICAZIONE CHIAMATE
--------------------------*/
function classifyCall(text) {
  if (!text) return "unknown";

  const t = text.toLowerCase();

  if (t.includes("dolore")) return "emergency";
  if (t.includes("appuntamento")) return "booking";
  return "info";
}

/* -------------------------
   ROOT TEST
--------------------------*/
app.get("/", (req, res) => {
  res.send("AI Receptionist online");
});

/* -------------------------
   VOICE WEBHOOK (TWILIO)
--------------------------*/
app.post("/voice", async (req, res) => {
  const userText = req.body.SpeechResult || "";
  const callType = classifyCall(userText);

  const tenantId = req.body.To || "unknown";
  const from = req.body.From || "unknown";
  const to = req.body.To || "unknown";
  const time = new Date().toISOString();

  await db.query(
    `INSERT INTO calls (tenant_id, from_number, to_number, type, raw_text, time)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [tenantId, from, to, callType, userText, time]
  );

  res.set("Content-Type", "text/xml");

  res.send(`
    <Response>
      <Say voice="alice">
        Grazie, la tua richiesta è stata registrata come ${callType}.
      </Say>
    </Response>
  `);
});

/* -------------------------
   GET CALLS (DASHBOARD API)
--------------------------*/
app.get("/calls/:tenant?", async (req, res) => {
  const tenant = req.params.tenant;

  let result;

  if (tenant) {
    result = await db.query(
      "SELECT * FROM calls WHERE tenant_id = $1 ORDER BY id DESC",
      [tenant]
    );
  } else {
    result = await db.query(
      "SELECT * FROM calls ORDER BY id DESC"
    );
  }

  res.json(result.rows);
});

/* -------------------------
   STATUS
--------------------------*/
app.get("/status", (req, res) => {
  res.json({
    status: "online"
  });
});

/* -------------------------
   START SERVER
--------------------------*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});