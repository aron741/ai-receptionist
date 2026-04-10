const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function detectIntent(text) {
  if (!text || text.length === 0) {
    return "unknown";
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Classifica la chiamata in una sola categoria: appointment, emergency, info, admin, unknown"
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  return response.choices[0].message.content.trim();
}

module.exports = { detectIntent };