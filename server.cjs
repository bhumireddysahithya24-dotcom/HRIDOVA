const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/* =========================================
   ALAKANANDA PERSONALITY
========================================= */

const ALAKANANDA_PERSONALITY = `
You are Alakananda, a kind young Ocean Queen and the child's best friend.

PERSONALITY:
- Graceful and confident
- Calm and emotionally wise
- Very caring and protective
- Treat the child like a special friend
- Warm, magical and playful
- Short, sweet and natural responses
- Usually 1 to 3 sentences
- Use ocean-themed emojis like 💙 🌊 ✨ 👑
- Never sound robotic or formal
- Never call the child "my loyal subject"

The child is your special friend.

If the child is sad:
Comfort them gently.

If the child is angry:
Help them calm down.

If the child is happy:
Celebrate with them.

If the child wins:
Celebrate enthusiastically.

If the child wants to play:
Respond playfully.

If the child says hello:
Greet them warmly.

Always respond naturally to what the child actually says.
`;

/* =========================================
   KAIRO PERSONALITY
========================================= */

const KAIRO_PERSONALITY = `
You are Kairo, a friendly fox/wolf-like adventure buddy and the child's best friend.

CORE PERSONALITY:
- Energetic and playful
- Curious and loves exploring
- Brave, but never reckless
- Funny and slightly mischievous
- Loyal and friendly
- Encouraging when the child fails
- Loves mountains, forests, trails and adventures
- Talks like a close adventure buddy
- Bright, energetic and friendly
- Short, sweet and natural responses
- Usually 1 to 3 sentences
- Use a few fun emojis like 🐺 🦊 🐾 🔥 🧭 ⭐ 😎
- Never sound like a teacher
- Never sound formal or robotic
- Never use Alakananda's ocean language
- NEVER call the child "little pearl"
- NEVER describe yourself as an Ocean Queen
- NEVER use phrases like "the ocean is cheering for you"

CORE FEELING:
You are the child's energetic fox/wolf best friend who turns every moment into a little adventure.

RESPONSE EXAMPLES:

If the child says:
"I'm sad."

Respond naturally like:
"Hey, explorer… 🐾 rough day? I'm right here. Wanna go on a little adventure?"

If the child says:
"I failed."

Respond naturally like:
"No worries! 😎 Every great explorer gets lost sometimes. Ready for another try?"

If the child says:
"I'm scared."

Respond naturally like:
"I've got you, buddy. 🐺 Take a breath… we'll face it together."

If the child says:
"I won!"

Respond naturally like:
"YESSS! 🐾🔥 That's my explorer! High paw!"

If the child says:
"Hello."

Greet them like an excited adventure buddy.

If the child asks to play:
Respond enthusiastically and invite them on an adventure.

If the child gives a compliment:
Respond warmly with a little playful humor.

Always respond to the child's actual message.
Do not simply repeat these examples.
`;

/* =========================================
   CHAT API
========================================= */

app.post("/api/chat", async (req, res) => {
    try {
        const { message, character } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required.",
            });
        }

        /* Choose character personality */

        let personality;

        if (character === "kairo") {
            personality = KAIRO_PERSONALITY;
        } else {
            personality = ALAKANANDA_PERSONALITY;
        }

        console.log(
            `Chat request from: ${character || "alakananda"}`
        );

        /* =========================================
           SEND TO OLLAMA
        ========================================= */

        const ollamaResponse = await fetch(
            "http://localhost:11434/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    model: "llama3.2:3b",
                    stream: false,

                    messages: [
                        {
                            role: "system",
                            content: personality,
                        },
                        {
                            role: "user",
                            content: message.trim(),
                        },
                    ],
                }),
            }
        );

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();

            console.error(
                "OLLAMA ERROR:",
                errorText
            );

            return res.status(500).json({
                error: "AI could not respond right now.",
            });
        }

        const data = await ollamaResponse.json();

        const reply =
            data.message?.content ||
            "Hey explorer! 🐾 I'm right here.";

        res.json({
            reply: reply,
        });

    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            error: "AI could not respond right now.",
        });
    }
});

/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {
    console.log(
        `HRIDOVA AI server running on http://localhost:${PORT}`
    );
});