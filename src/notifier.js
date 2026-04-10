const axios = require("axios");

async function sendEmailLog(caller, intent) {
  await axios.post(process.env.ZAPIER_WEBHOOK_URL, {
    caller,
    intent,
    timestamp: new Date().toISOString()
  });
}

module.exports = { sendEmailLog };