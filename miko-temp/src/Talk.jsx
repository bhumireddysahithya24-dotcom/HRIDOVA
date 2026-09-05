import React, { useEffect, useRef, useState } from "react";
import "./Talk.css";

function Talk({ goHome, onBack }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // =========================
  // BACK
  // =========================

  const handleBack = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    window.speechSynthesis.cancel();

    if (onBack) {
      onBack();
    } else if (goHome) {
      goHome();
    }
  };

  // =========================
  // SPEAK MIKO RESPONSE
  // =========================

  const speakText = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // =========================
  // SEND TO BACKEND
  // =========================

  const sendToMiko = async (text) => {
    if (!text.trim()) return;

    setIsThinking(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: text,
          character: "Miko",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const reply =
        data.reply ||
        data.response ||
        data.message ||
        "I'm here with you. Tell me more.";

      setMessages((previous) => [
        ...previous,
        {
          type: "miko",
          text: reply,
        },
      ]);

      speakText(reply);
    } catch (err) {
      console.error(err);

      const fallback =
        "I'm here with you. I heard what you said, but my connection is having a little trouble right now.";

      setMessages((previous) => [
        ...previous,
        {
          type: "miko",
          text: fallback,
        },
      ]);

      speakText(fallback);

      setError(
        "Miko's AI connection is unavailable. Make sure the backend is running on port 5000."
      );
    } finally {
      setIsThinking(false);
    }
  };

  // =========================
  // SPEECH RECOGNITION
  // =========================

  const startListening = () => {
    setError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    if (listening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}

      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;

    // English by default
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      const currentText =
        finalText || interimText;

      setTranscript(currentText);

      // When speech is finalized, show user's words
      if (finalText.trim()) {
        const cleanText = finalText.trim();

        setMessages((previous) => [
          ...previous,
          {
            type: "user",
            text: cleanText,
          },
        ]);

        setTranscript("");

        sendToMiko(cleanText);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Allow microphone access in Chrome."
        );
      } else if (event.error === "no-speech") {
        setError("I didn't hear anything. Try speaking again.");
      } else {
        setError(
          "I couldn't hear you. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error(err);
      setListening(false);
    }
  };

  // =========================
  // REPLAY LAST MIKO MESSAGE
  // =========================

  const replayMessage = (text) => {
    speakText(text);
  };

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, transcript]);

  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}

      window.speechSynthesis.cancel();
    };
  }, []);

  // =========================
  // SCREEN
  // =========================

  return (
    <div className="talk-page">

      {/* BACKGROUND */}

      <div className="talk-background" />

      {/* =========================
          TOP BAR
      ========================= */}

      <div className="talk-topbar">

        <button
          type="button"
          className="talk-back"
          onClick={handleBack}
        >
          <span>←</span>
          Back
        </button>

        <div className="talk-title">
          <h1>MIKO</h1>

          <p>Your Calm Companion</p>
        </div>

      </div>


      {/* =========================
          MIKO CHARACTER
      ========================= */}

      <div className="talk-character">

        <img
          src="/miko.png"
          alt="Miko"
        />

        <div className="miko-status">

          {listening && (
            <>
              <span className="status-dot listening-dot" />
              Listening...
            </>
          )}

          {!listening && speaking && (
            <>
              <span className="status-dot speaking-dot" />
              Miko is talking...
            </>
          )}

          {!listening && !speaking && !isThinking && (
            <>
              <span className="status-dot ready-dot" />
              I'm listening
            </>
          )}

          {isThinking && (
            <>
              <span className="status-dot thinking-dot" />
              Thinking...
            </>
          )}

        </div>

      </div>


      {/* =========================
          CONVERSATION
      ========================= */}

      <div className="talk-conversation">

        {messages.length === 0 && !transcript && (
          <div className="welcome-message">

            <div className="welcome-heart">
              ♥
            </div>

            <h2>
              Talk with Miko
            </h2>

            <p>
              Press the microphone and start talking.
            </p>

          </div>
        )}


        {messages.map((message, index) => (

          <div
            className={`talk-message ${
              message.type === "user"
                ? "user-message"
                : "miko-message"
            }`}
            key={index}
          >

            <div className="message-label">

              {message.type === "user"
                ? "You"
                : "Miko"}

            </div>

            <div className="message-content">

              <span>
                {message.text}
              </span>

              {message.type === "miko" && (
                <button
                  type="button"
                  className="replay-button"
                  onClick={() =>
                    replayMessage(message.text)
                  }
                  title="Replay Miko"
                >
                  🔊
                </button>
              )}

            </div>

          </div>

        ))}


        {/* LIVE WORDS WHILE TALKING */}

        {transcript && (
          <div className="live-transcript">

            <div className="live-label">
              You're saying...
            </div>

            <div className="live-words">
              {transcript}
            </div>

          </div>
        )}


        <div ref={messagesEndRef} />

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="talk-error">
          {error}
        </div>
      )}


      {/* =========================
          MICROPHONE
      ========================= */}

      <div className="talk-controls">

        <button
          type="button"
          className={`microphone-button ${
            listening ? "active" : ""
          }`}
          onClick={startListening}
          disabled={isThinking}
        >

          <span className="microphone-icon">
            🎙️
          </span>

        </button>

        <div className="microphone-text">

          {listening
            ? "I'm listening..."
            : isThinking
            ? "Miko is thinking..."
            : "Tap to Talk"}

        </div>

      </div>


      {/* =========================
          BOTTOM HINT
      ========================= */}

      <div className="talk-hint">

        <span>🎙️</span>

        Speak naturally — Miko will listen,
        reply, and speak back.

      </div>

    </div>
  );
}

export default Talk;