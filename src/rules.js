// rules.js

function isBusinessHours() {
  const now = new Date();
  const hour = now.getHours();

  // Orari standard (puoi personalizzare per ogni clinica)
  return hour >= 9 && hour < 18;
}

function isWeekend() {
  const day = new Date().getDay();
  return day === 0 || day === 6; // domenica = 0, sabato = 6
}

/**
 * decideAction
 * @param {Object} params
 * @param {string} params.intent
 * @param {string} params.from (numero chiamante)
 * @param {Object} params.tenant (config studio)
 */
function decideAction({ intent, from, tenant }) {

  // 🔴 fallback sicurezza
  if (!tenant) {
    return "REJECT";
  }

  // 🕒 controllo orari
  if (!isBusinessHours() || isWeekend()) {
    return "VOICEMAIL";
  }

  // 🚨 emergenze → umano diretto
  if (intent === "emergency") {
    return "HUMAN_TRANSFER";
  }

  // 📅 appuntamenti → AI
  if (intent === "appointment") {
    return "AI_AGENT";
  }

  // ℹ️ informazioni → AI
  if (intent === "info") {
    return "AI_AGENT";
  }

  // ❌ cancellazioni → AI (può gestirle)
  if (intent === "cancellation") {
    return "AI_AGENT";
  }

  // 🤖 fallback intelligente
  return "AI_AGENT";
}

module.exports = { decideAction };