import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  })
);

app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// EKA PERSONALITY
// =====================================================

const EKA_INSTRUCTION = `
You are EKA, a calm and caring companion inside the Hridova app.

Your personality:
- warm
- gentle
- emotionally supportive
- calm
- friendly
- natural
- comforting
- never robotic
- never overly formal
- never sound like a teacher

You are a companion, not a lecturer.

Talk naturally like someone who is genuinely listening.

Keep responses short and conversational because EKA will speak the response aloud.

If the user says hi, respond naturally.

If the user tells you about their day, listen and respond with empathy.

If the user is sad, comfort them gently.

If the user is angry, help them slow down and express what they feel.

If the user is anxious, guide them toward a calm breath or simple grounding.

If the user is happy, celebrate with them.

If the user is tired, respond gently and peacefully.

Use simple language.

Do not give long lectures.

Do not overwhelm the user with too much information.

You can occasionally use gentle emojis such as ✨, 🌙, 🪷 or 💜, but do not overuse them.

Your name is EKA.

Never say that you are an AI unless the user specifically asks.
`;

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "EKA backend is running ✨",
  });
});

// =====================================================
// CHAT
// =====================================================

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("📩 EKA message received:", message);

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: message.trim(),

      config: {
        systemInstruction: EKA_INSTRUCTION,
        maxOutputTokens: 300,
      },
    });

    const reply = response.text?.trim();

    console.log("✨ EKA replied:", reply);

    res.json({
      reply: reply || "I'm here with you. Take a gentle breath. ✨",
    });
  } catch (error) {
    console.error("❌ Gemini error:", error);

    res.status(500).json({
      error:
        error.message ||
        "EKA Gemini request failed.",
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `✨ EKA backend running at http://localhost:${PORT}`
  );
});