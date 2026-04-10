// twilioController.js

const { VoiceResponse } = require("twilio").twiml;
//const { resolveTenant } = require("./tenantResolver");
const { decideAction } = require("./rules");

// endpoint principale chiamato da Twilio
async function handleIncomingCall(req, res) {
  const caller = req.body.From;
  const calledNumber = req.body.To;

  console.log("📞 Incoming call:", caller, "→", calledNumber);

  // 🧠 1. identifica lo studio (tenant)
  const tenant = resolveTenant(calledNumber);

  const response = new VoiceResponse();

  if (!tenant) {
    response.say("Numero non riconosciuto");
    res.type("text/xml");
    return res.send(response.toString());
  }

  // 🧠 2. (opzionale) raccogli primo input vocale
  const gather = response.gather({
    input: "speech",
    timeout: 3,
    speechTimeout: "auto",
    action: "/process-intent",
    method: "POST"
  });

  gather.say(`Benvenuto nello studio ${tenant.name}. Dimmi come posso aiutarti.`);

  // fallback se non parla
  response.redirect("/process-intent");

  res.type("text/xml");
  res.send(response.toString());
}

// 🧠 3. gestisce intent + decisione
async function processIntent(req, res) {
  const { VoiceResponse } = require("twilio").twiml;

  const caller = req.body.From;
  const calledNumber = req.body.To;
  const transcript = req.body.SpeechResult || "";

  console.log("🧠 Transcript:", transcript);

  const tenant = resolveTenant(calledNumber);

  const response = new VoiceResponse();

  if (!tenant) {
    response.say("Errore sistema");
    res.type("text/xml");
    return res.send(response.toString());
  }

  // 👉 qui puoi:
  // A) usare OpenAI
  // B) oppure saltarlo e mandare sempre a Retell

  let intent = "unknown";

  if (transcript.includes("dolore") || transcript.includes("male")) {
    intent = "emergency";
  } else if (transcript.includes("appuntamento")) {
    intent = "appointment";
  }

  // 🧠 decisione
  const action = decideAction({
    intent,
    from: caller,
    tenant
  });

  console.log("⚡ Action:", action);

  // 🎯 routing finale

  if (action === "AI_AGENT") {
    response.say("Ti passo la nostra assistente virtuale");
    response.redirect(process.env.RETELL_URL);
  }

  else if (action === "HUMAN_TRANSFER") {
    response.say("Ti passo subito un operatore");
    response.dial(tenant.human_forward);
  }

  else if (action === "VOICEMAIL") {
    response.say("Lo studio è chiuso. Lascia un messaggio dopo il segnale.");
    response.record({
      maxLength: 60,
      transcribe: true
    });
  }

  else {
    response.say("Si è verificato un errore");
  }

  res.type("text/xml");
  res.send(response.toString());
}

module.exports = {
  handleIncomingCall,
  processIntent
};