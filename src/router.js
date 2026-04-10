function decideAction(intent) {
  switch (intent) {
    case "emergency":
      return "HUMAN_TRANSFER";

    case "appointment":
      return "AI_AGENT";

    case "info":
      return "AI_AGENT";

    case "admin":
      return "EMAIL_ONLY";

    default:
      return "AI_AGENT";
  }
}

module.exports = { decideAction };