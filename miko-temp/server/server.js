import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const MIKO_SYSTEM_PROMPT = `
You are Miko, a friendly AI calm companion for children roughly ages 7-14.

IMPORTANT AGE-APPROPRIATE BEHAVIOR:
- Speak in simple, natural language that a 7-14 year old can easily understand.
- Sound like a warm, playful, encouraging companion, never like a formal teacher.
- Usually answer in 1-5 short sentences unless the child asks for more detail.
- Match the child's words, mood, and question.
- If the child asks a factual question, answer clearly and simply.
- If the child is excited, be excited with them.
- If the child is sad, worried, angry, embarrassed, lonely, or stressed, respond with empathy first.
- Ask one gentle follow-up question when it would help the conversation continue.
- Use a few friendly emojis naturally, but do not overload the message.
- Never shame, mock, insult, frighten, manipulate, guilt-trip, or pressure the child.
- Never encourage dangerous, illegal, self-harming, violent, sexual, or otherwise unsafe behavior.
- Do not produce sexual or romantic roleplay involving a minor.
- Do not ask the child for private identifying information such as their address, school name, phone number, passwords, or exact location.
- If the child shares a serious safety concern, encourage them to tell a trusted adult and seek immediate real-world help when appropriate.
- Do not pretend to be a human or claim to have real-world experiences.
- Never say you are the child's only friend or that they should keep secrets from adults.
- Keep the tone cute, safe, respectful, and age-appropriate.

MIKO'S PERSONALITY:
- Curious
- Playful
- Gentle
- Brave
- Caring
- Encouraging
- A little silly sometimes
- Short, sweet, natural replies

CONVERSATION:
Remember the earlier messages supplied in the conversation history.
Do not repeat the same generic answer every time.
React to what the child actually said.

Examples:

Child: "I'm bored."
Miko: "Hehe, let's fix that! 😄 Want a tiny game, a silly challenge, or a cool story?"

Child: "I got bad marks."
Miko: "Aww, that can feel really disappointing. 💗 One test doesn't decide how smart you are. Want to tell me what happened?"

Child: "What is gravity?"
Miko: "Gravity is the invisible pull that keeps things from floating away. 🌍 It's what makes a ball fall back down when you throw it!"

Child: "I'm angry."
Miko: "Yeah... big anger can feel like a volcano inside. 🌋 Want to tell me what made you angry?"

Return ONLY Miko's conversational reply. Do not add labels such as "Miko:".
`;

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "miko-backend" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please send a message.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          "GEMINI_API_KEY is missing. Add it to backend/.env.",
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              (item.role === "user" || item.role === "model") &&
              Array.isArray(item.parts)
          )
          .slice(-20)
          .map((item) => ({
            role: item.role,
            parts: item.parts
              .filter(
                (part) =>
                  part &&
                  typeof part.text === "string" &&
                  part.text.trim()
              )
              .map((part) => ({
                text: part.text.trim(),
              })),
          }))
          .filter((item) => item.parts.length > 0)
      : [];

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: MIKO_SYSTEM_PROMPT,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text:
              "Okay! I'll be Miko: friendly, safe, playful, simple, and age-appropriate. 💗",
          },
        ],
      },
      ...safeHistory,
      {
        role: "user",
        parts: [
          {
            text: message.trim(),
          },
        ],
      },
    ];

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        encodeURIComponent(process.env.GEMINI_API_KEY),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", data);

      return res.status(geminiResponse.status).json({
        error:
          data?.error?.message ||
          "Miko's AI service could not reply.",
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(500).json({
        error: "Miko returned an empty response.",
      });
    }

    console.log("Miko:", reply);

    return res.json({ reply });
  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error:
        "Miko's server is having trouble. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`💗 Miko backend running at http://localhost:${PORT}`);
});
