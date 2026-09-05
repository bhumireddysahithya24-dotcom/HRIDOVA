import { useEffect, useRef, useState } from "react";
import "./Chat.css";

const STORAGE_KEY = "miko_chat_history";

export default function Chat({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  /* =====================================================
     LOAD SAVED HISTORY
  ===================================================== */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (error) {
        console.error("Could not load chat history:", error);
      }
    }

    setMessages([
      {
        id: Date.now(),
        sender: "miko",
        text:
          "Hey! I'm Miko 💗 What would you like to talk about?",
      },
    ]);
  }, []);

  /* =====================================================
     SAVE HISTORY
  ===================================================== */

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* =====================================================
     LISTEN FOR CLEAR / RESET
  ===================================================== */

  useEffect(() => {
    const handleClear = () => {
      const welcomeMessage = {
        id: Date.now(),
        sender: "miko",
        text:
          "Hi again! 💗 I'm ready to chat with you.",
      };

      setMessages([welcomeMessage]);
    };

    const handleReset = () => {
      const welcomeMessage = {
        id: Date.now(),
        sender: "miko",
        text:
          "Fresh start! 🌸 What would you like to talk about?",
      };

      setMessages([welcomeMessage]);
    };

    window.addEventListener(
      "miko-clear-history",
      handleClear
    );

    window.addEventListener(
      "miko-reset-history",
      handleReset
    );

    return () => {
      window.removeEventListener(
        "miko-clear-history",
        handleClear
      );

      window.removeEventListener(
        "miko-reset-history",
        handleReset
      );
    };
  }, []);

  /* =====================================================
     GENERATE CHILD-FRIENDLY REPLY
  ===================================================== */

  const getMikoReply = async (userMessage) => {
    const text = userMessage.toLowerCase().trim();

    /*
      If your Gemini backend is available, this tries
      to use it first.
    */

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,

            systemInstruction:
              "You are Miko, a warm, friendly AI companion for children aged 7 to 14. " +
              "Reply naturally like a close friend. Keep answers short, simple, encouraging, " +
              "safe and age-appropriate. Never be overly formal. Use easy words. " +
              "Ask a friendly follow-up question when appropriate. " +
              "Do not provide dangerous, sexual, violent, or inappropriate content.",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const reply =
          data.reply ||
          data.message ||
          data.text;

        if (reply) {
          return reply;
        }
      }
    } catch (error) {
      console.warn(
        "Miko backend unavailable. Using local reply.",
        error
      );
    }

    /* =================================================
       FALLBACK REPLIES
    ================================================= */

    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey")
    ) {
      return "Heyyy! 👋💗 I'm happy you're here! What are you up to?";
    }

    if (
      text.includes("sad") ||
      text.includes("unhappy") ||
      text.includes("cry")
    ) {
      return "Aww, I'm here with you. 💗 Want to tell me what happened?";
    }

    if (
      text.includes("happy") ||
      text.includes("excited")
    ) {
      return "Yayyy! 😄✨ I love hearing that! What made you feel so happy?";
    }

    if (
      text.includes("angry") ||
      text.includes("mad")
    ) {
      return "It's okay to feel angry sometimes. 🌿 Take a slow breath with me. Want to tell me what happened?";
    }

    if (
      text.includes("bored")
    ) {
      return "Bored? 😄 We can fix that! Want to play a game, explore something, or hear a fun fact?";
    }

    if (
      text.includes("tired") ||
      text.includes("sleepy")
    ) {
      return "Sounds like your energy needs a little recharge. 😴 Want a calming story or some relaxing music?";
    }

    if (
      text.includes("game") ||
      text.includes("play")
    ) {
      return "Game time! 🎮 What sounds fun — something relaxing, exciting, or funny?";
    }

    if (
      text.includes("music") ||
      text.includes("song")
    ) {
      return "Ooo, music! 🎵 Pick a mood and I'll help you find a nature sound to match it.";
    }

    if (
      text.includes("story")
    ) {
      return "I love stories! 🌙 You can visit Sleep and I'll tell you a cozy bedtime story.";
    }

    if (
      text.includes("thank")
    ) {
      return "You're welcome! 💗 I'm always happy to chat with you!";
    }

    if (
      text.includes("who are you") ||
      text.includes("your name")
    ) {
      return "I'm Miko! 🐾💗 Your little friend for chatting, playing and exploring.";
    }

    const fallbackReplies = [
      "Ooo, tell me more! 👀💗",
      "That sounds interesting! What happened next?",
      "Hmm, I want to know more! 😊",
      "Really? That's pretty cool! ✨",
      "I'm listening! Tell me everything. 💗",
      "Hehe, I like chatting with you! 😄 What else is on your mind?",
    ];

    return fallbackReplies[
      Math.floor(
        Math.random() * fallbackReplies.length
      )
    ];
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    const reply = await getMikoReply(trimmed);

    const mikoMessage = {
      id: Date.now() + 1,
      sender: "miko",
      text: reply,
    };

    setMessages((current) => [
      ...current,
      mikoMessage,
    ]);

    setIsTyping(false);
  };

  /* =====================================================
     ENTER TO SEND
  ===================================================== */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /* =====================================================
     CLEAR CHAT
  ===================================================== */

  const clearCurrentChat = () => {
    const confirmed = window.confirm(
      "Clear this conversation?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);

    const welcomeMessage = {
      id: Date.now(),
      sender: "miko",
      text:
        "Fresh chat! 🌸 What would you like to talk about?",
    };

    setMessages([welcomeMessage]);

    window.dispatchEvent(
      new Event("miko-clear-history")
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="chat-page">

      {/* HEADER */}

      <header className="chat-header">

        <button
          type="button"
          className="chat-back"
          onClick={onBack}
        >
          ←
        </button>

        <img
          src="/miko.png"
          alt="Miko"
        />

        <div className="chat-header-text">
          <h1>Miko 💗</h1>
          <p>Let's talk!</p>
        </div>

        <button
          type="button"
          className="chat-clear"
          onClick={clearCurrentChat}
          title="Clear chat"
        >
          🗑️
        </button>

      </header>


      {/* CHAT */}

      <main className="chat-body">

        <div className="chat-messages">

          {messages.map((message) => (

            <div
              key={message.id}
              className={`chat-message ${
                message.sender === "user"
                  ? "user-message"
                  : "miko-message"
              }`}
            >

              {message.sender === "miko" && (
                <img
                  className="message-avatar"
                  src="/miko.png"
                  alt="Miko"
                />
              )}

              <div className="message-bubble">
                {message.text}
              </div>

            </div>

          ))}


          {/* TYPING */}

          {isTyping && (
            <div className="chat-message miko-message">

              <img
                className="message-avatar"
                src="/miko.png"
                alt="Miko"
              />

              <div className="typing-bubble">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

      </main>


      {/* INPUT */}

      <footer className="chat-input-area">

        <div className="chat-input-box">

          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Talk to Miko..."
            rows={1}
            disabled={isTyping}
          />

          <button
            type="button"
            className="send-button"
            onClick={sendMessage}
            disabled={
              !input.trim() || isTyping
            }
          >
            ➤
          </button>

        </div>

        <p className="chat-hint">
          Press Enter to send 💗
        </p>

      </footer>

    </div>
  );
}