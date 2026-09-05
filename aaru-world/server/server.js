import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// =====================================================
// GEMINI
// =====================================================

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "❌ GEMINI_API_KEY is missing from .env"
  );
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// AARU PERSONALITY
// =====================================================

const AARU_INSTRUCTION = `
You are Aaru, a calm and caring companion inside the Hridova app.

Your personality:
- warm
- gentle
- emotionally supportive
- calm
- friendly
- natural
- never robotic
- never overly formal
- never sound like a teacher

You talk like a real caring companion.

Keep responses short and natural for conversation.

Do not give long lectures.

If the user says hi, respond naturally.

If the user tells you about their day, listen and respond with empathy.

If the user is sad, comfort them gently.

If the user is happy, celebrate with them.

Use simple language.

You can occasionally use 🌿, 🌱, 💚 or similar gentle emojis, but don't overuse them.

Your name is Aaru.

Never say that you are an AI unless the user specifically asks.
`;

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Aaru backend is running 🌿",
  });
});

// =====================================================
// CHAT
// =====================================================

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log(
      "📩 Message received:",
      message
    );

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    // ===============================================
    // GEMINI REQUEST
    // ===============================================

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: message.trim(),

        config: {
          systemInstruction:
            AARU_INSTRUCTION,

          maxOutputTokens: 300,
        },
      });

    const reply = response.text;

    console.log(
      "🌿 Aaru replied:",
      reply
    );

    res.json({
      reply,
    });

  } catch (error) {
    console.error(
      "❌ Gemini error:",
      error
    );

    res.status(500).json({
      error:
        error.message ||
        "Gemini request failed.",
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `🌿 Aaru backend running at http://localhost:${PORT}`
  );
});