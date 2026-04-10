// server.js

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

// controllers
const {
  handleIncomingCall,
  processIntent
} = require("./src/twilioController");

const app = express();

// middleware per Twilio (IMPORTANTISSIMO)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 🏠 route base (test server)
app.get("/", (req, res) => {
  res.send("🚀 AI Receptionist Server is running");
});

// 📞 webhook principale Twilio (incoming call)
app.post("/voice", handleIncomingCall);

// 🧠 gestione intent / routing
app.post("/process-intent", processIntent);

// ❤️ health check (utile per deploy)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🚀 start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});