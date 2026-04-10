const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// 📊 memoria ultima chiamata
let lastCall = null;

// 🏠 TEST ROOT
app.get("/", (req, res) => {
  res.send("AI Receptionist online");
});

// 📞 VOICE WEBHOOK (UNO SOLO)
app.post("/voice", (req, res) => {

  // salva chiamata
  lastCall = {
    from: req.body.From,
    to: req.body.To,
    time: new Date()
  };

  res.set("Content-Type", "text/xml");

  res.send(`
    <Response>
      <Say voice="alice">Ciao, la segreteria automatica è attiva.</Say>
    </Response>
  `);
});

// 📊 STATUS API (dashboard)
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    lastCall
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});