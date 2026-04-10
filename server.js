const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// TEST ROOT
app.get("/", (req, res) => {
  res.send("AI Receptionist online");
});

// VOICE WEBHOOK
app.post("/voice", (req, res) => {
  res.set("Content-Type", "text/xml");

  res.send(`
    <Response>
      <Say voice="alice">Ciao, la segreteria automatica è attiva.</Say>
    </Response>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});