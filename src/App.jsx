import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import alakanandaTalkImage from "./assets/alakananda-talk.png";
import kairoTalkImage from "./assets/kairo-talk.png";
import Sleep from "./Sleep";
import Music from "./Music";
import Settings from "./Settings";
import Games from "./Games";
import Explore from "./Explore";
// JAY
import JayWorld from "./Pages/JayWorld";
import JayTalk from "./Pages/JayTalk";
import JayChat from "./Pages/JayChat";
import JayPlay from "./Pages/JayPlay";
import JayExplore from "./Pages/JayExplore";
import JaySleep from "./Pages/JaySleep";
import JayMusic from "./Pages/JayMusic";
import JaySettings from "./Pages/JaySettings";

// MAYA
import MayaWorld from "./Pages/MayaWorld";
import MayaTalk from "./Pages/MayaTalk";
import MayaChat from "./Pages/MayaChat";
import MayaPlay from "./Pages/MayaPlay";
import MayaExplore from "./Pages/MayaExplore";
import MayaSleep from "./Pages/MayaSleep";
import MayaMusic from "./Pages/MayaMusic";
import MayaSettings from "./Pages/MayaSettings";

/* =========================================================
   CHARACTERS
========================================================= */

const characters = {
  kairo: {
    name: "Kairo",
    image: "/characters/kairo/kairo.png",
    talkImage: kairoTalkImage,
    background: "/backgrounds/kairo-chat.png",
  },
  alakananda: {
    name: "Alakananda",
    image: "/characters/alakananda/alakananda.png",
    talkImage: alakanandaTalkImage,
    background: "/backgrounds/alakananda-chat.png",
  },
};

/* =========================================================
   INITIAL CHAT MESSAGES
========================================================= */

const initialMessages = {
  kairo: [
    {
      role: "assistant",
      text: "Hey there, explorer! 🐾",
    },
    {
      role: "assistant",
      text: "Ready for a little adventure? 🧭✨",
    },
  ],

  alakananda: [
    {
      role: "assistant",
      text: "Hi there, little one! 💙",
    },
    {
      role: "assistant",
      text: "How are you feeling today? 🌊✨",
    },
  ],
};

/* =========================================================
   APP
========================================================= */

function App() {
  const [character, setCharacter] = useState("kairo");

  const [screen, setScreen] = useState("world");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState(
    initialMessages.kairo
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  const recognitionRef = useRef(null);

  const currentCharacter = characters[character];

  useEffect(() => {
    const handleClearChat = () => {
      setMessages(initialMessages[character]);
      setMessage("");
    };

    window.addEventListener(
      "hridova-clear-chat",
      handleClearChat
    );

    return () => {
      window.removeEventListener(
        "hridova-clear-chat",
        handleClearChat
      );
    };
  }, [character]);

  /* =========================================================
     SPEECH CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /* =========================================================
     CHANGE CHARACTER
  ========================================================= */

  const changeCharacter = (newCharacter) => {
    setCharacter(newCharacter);

    setMessages(initialMessages[newCharacter]);

    setMessage("");

    setScreen("world");
  };

  /* =========================================================
     OPEN ACTIVITY
  ========================================================= */

  const openActivity = (activity) => {
    setScreen(activity);
  };

  /* =========================================================
     GO BACK TO WORLD
  ========================================================= */

  const goBack = () => {
    setScreen("world");
  };



  /* =========================================================
     SEND CHAT MESSAGE
  ========================================================= */

  const sendMessage = async (
    textOverride = null,
    shouldSpeak = false
  ) => {
    const text = (textOverride ?? message).trim();

    if (!text || isLoading) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        text,
      },
    ]);

    setMessage("");
    setIsLoading(true);
    setSpeechError("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            character,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "AI response failed"
        );
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);

      /*
        CHAT:
        sendMessage(text, false)
        → text reply only
  
        TALK:
        sendMessage(text, true)
        → text reply + character voice
      */
      if (shouldSpeak && data.reply) {
        window.speechSynthesis.cancel();

        const cleanText = data.reply
          .replace(
            /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
            ""
          )
          .replace(/[\uFE0F\u200D]/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (cleanText) {
          const speakCharacter = () => {
            const voices =
              window.speechSynthesis.getVoices();

            let selectedVoice;

            if (character === "kairo") {
              selectedVoice =
                voices.find((voice) =>
                  /guy|ryan|david|mark|george|daniel|alex|male/i.test(
                    voice.name
                  )
                ) ||
                voices.find((voice) =>
                  /^en(-|_)/i.test(voice.lang)
                );
            } else {
              selectedVoice =
                voices.find((voice) =>
                  /zira|jenny|aria|samantha|hazel|susan|ava|sara|female/i.test(
                    voice.name
                  )
                ) ||
                voices.find(
                  (voice) =>
                    /^en(-|_)/i.test(voice.lang) &&
                    !/male|david|mark/i.test(voice.name)
                );
            }

            const speech =
              new SpeechSynthesisUtterance(cleanText);

            if (selectedVoice) {
              speech.voice = selectedVoice;
              speech.lang = selectedVoice.lang;
            } else {
              speech.lang = "en-IN";
            }

            speech.rate =
              character === "kairo" ? 1.0 : 0.95;

            speech.pitch =
              character === "kairo" ? 1.0 : 1.3;

            speech.volume = 1;

            speech.onstart = () => {
              setIsSpeaking(true);
            };

            speech.onend = () => {
              setIsSpeaking(false);
            };

            speech.onerror = () => {
              setIsSpeaking(false);
            };

            window.speechSynthesis.speak(speech);
          };

          if (
            window.speechSynthesis.getVoices().length === 0
          ) {
            window.speechSynthesis.onvoiceschanged =
              speakCharacter;
          } else {
            speakCharacter();
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text:
            character === "kairo"
              ? "Oops, explorer! 🐾 Something went wrong. Let's try again!"
              : "Oops, little one 🌊💙 Something went wrong. Please try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        "Voice input works best in Google Chrome. Please type your message for now."
      );
      return;
    }

    if (isListening || isLoading) {
      return;
    }

    setSpeechError("");

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0].transcript;

      setMessage(spokenText);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === "not-allowed") {
        setSpeechError(
          "Microphone permission is blocked. Allow microphone access in Chrome."
        );
      } else if (event.error === "no-speech") {
        setSpeechError(
          "I could not hear you. Please tap the microphone and speak again."
        );
      } else {
        setSpeechError(
          "Voice input had a problem. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  /* =========================================================
   GAMES SCREEN
========================================================= */

  if (screen === "games") {
    return (
      <Games
        character={character}
        onBack={() => setScreen("world")}
      />
    );
  }
  /* =========================================================
   SLEEP SCREEN
========================================================= */

  if (screen === "sleep") {
    return (
      <Sleep
        character={character}
        onBack={() => setScreen("world")}
      />
    );
  }
  /* =========================================================
     MUSIC SCREEN
  ========================================================= */

  if (screen === "music") {
    return (
      <Music
        character={character}
        onBack={() => setScreen("world")}
      />
    );
  }

  /* =========================================================
     SETTINGS SCREEN
  ========================================================= */

  if (screen === "settings") {
    return (
      <Settings
        character={character}
        onBack={() => setScreen("world")}
      />
    );
  }

  /* =========================================================
     CHAT SCREEN
  ========================================================= */

  if (screen === "chat") {
    return (
      <div
        className={`chat-screen ${character}`}
        style={{
          "--chat-background": `url(${currentCharacter.background})`,
        }}
      >

        {/* BACK BUTTON */}

        <button
          className="chat-back"
          onClick={goBack}
          aria-label="Back"
        >
          ←
        </button>

        {/* HEADER */}

        <div className="chat-header">

          <h1>Chat 💬</h1>

          <p>
            Talk with {currentCharacter.name}
          </p>

        </div>

        {/* CHAT MESSAGES */}

        <div className="chat-messages">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === "user"
                ? "user-message"
                : "character-message"
                }`}
            >
              {msg.text}
            </div>
          ))}

          {isLoading && (
            <div className="message character-message typing">

              {character === "kairo"
                ? "Kairo is thinking... 🐾"
                : "Alakananda is thinking... 🌊✨"}

            </div>
          )}

        </div>

        {/* INPUT */}

        <div className="chat-input-area">

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage(null, false);
              }
            }}

            placeholder={`Talk to ${currentCharacter.name}...`}
            disabled={isLoading}
          />

          <button
            className="send-button"
            onClick={() => sendMessage(null, false)}
            disabled={isLoading}
            aria-label="Send"
          >
            {isLoading ? "..." : "➤"}
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     PLAY SCREEN
  ========================================================= */

  if (screen === "play") {
    return (
      <div className={`activity-screen ${character}`}>
        <button
          className="activity-back"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="activity-content">
          <h1>
            🎮 {currentCharacter.name} — Play
          </h1>

          <p>
            Choose a game and start your
            adventure with {currentCharacter.name}! ✨
          </p>

          <button
            className="return-button"
            onClick={() => setScreen("play")}
          >
            🎮 Games
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
   TALK SCREEN
  ========================================================= */

  if (screen === "talk") {
    return (
      <div className={`talk-screen ${character}`}>

        {/* BACK */}
        <button
          className="talk-back"
          onClick={goBack}
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="talk-header">
          <h1>{character === "kairo" ? "🐺 Talk with Kairo" : "🌊 Talk with Alakananda"}</h1>

          <p>
            {isSpeaking
              ? character === "kairo"
                ? "Kairo is speaking... 🐾"
                : "Alakananda is speaking... 💙"
              : "Talk to me. I'm listening ✨"}
          </p>
        </div>

        {/* CHARACTER */}
        <div className="talk-character-area">

          <img
            className="talk-character-image"
            src={currentCharacter.talkImage}
            alt={currentCharacter.name}
          />

          {isSpeaking && (
            <div className="talking-indicator">
              🔊
            </div>
          )}

        </div>

        {/* MESSAGE - BELOW CHARACTER */}
        <div className="talk-message-box">

          {messages.length > 0 && (
            <div className="talk-last-message">
              {messages[messages.length - 1].text}
            </div>
          )}

        </div>

        {/* CONTROLS */}
        <div className="talk-controls">
          <button
            type="button"
            className={`talk-mic-button ${isListening ? "listening" : ""
              }`}
            onClick={startVoiceInput}
            disabled={isLoading || isListening}
          >
            {isListening ? "🎙️ Listening..." : "🎤 Speak"}
          </button>

          <input
            className="talk-text-input"
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage(null, true);
              }
            }}
            placeholder={`Speak or type to ${currentCharacter.name}...`}
            disabled={isLoading || isListening}
          />

          <button
            className="talk-send-button"
            type="button"
            onClick={() => sendMessage(null, true)}
            disabled={isLoading || isListening}
          >
            {isLoading ? "..." : "➤"}
          </button>
        </div>

        {speechError && (
          <p className="talk-voice-error">
            {speechError}
          </p>
        )}
        {speechError && (
          <p className="talk-voice-error">
            {speechError}
          </p>
        )}

      </div>
    );
  }

  /* =========================================================
        EXPLORE SCREEN
        ========================================================= */
  if (screen === "explore") {
    return (
      <Explore
        character={character}
        onBack={() => setScreen("world")}
      />
    );
  }


  /* =========================================================
     WORLD SCREEN
  ========================================================= */

  return (
    <div className="world-wrapper">

      {/* WORLD IMAGE */}

      <img
        className="world-image"
        src={currentCharacter.image}
        alt={`${currentCharacter.name} World`}
      />

      {/* =====================================================
          CHARACTER SWITCH
      ===================================================== */}

      <div className="character-switch">

        <button
          className={
            character === "kairo"
              ? "active"
              : ""
          }
          onClick={() =>
            changeCharacter("kairo")
          }
        >
          🐺 Kairo
        </button>

        <button
          className={
            character === "alakananda"
              ? "active"
              : ""
          }
          onClick={() =>
            changeCharacter("alakananda")
          }
        >
          🌊 Alakananda
        </button>
        <button
          className={character === "aaru" ? "active" : ""}
          onClick={() => window.location.href = "/worlds/aaru/index.html"}
        >
          🐻 Aaru
        </button>

        <button
          className={character === "eka" ? "active" : ""}
          onClick={() => window.location.href = "/worlds/eka/index.html"}
        >
          🌟 Eka
        </button>

      </div>

      {/* =====================================================
          SETTINGS
      ===================================================== */}

      <button
        className="hotspot settings-hotspot"
        onClick={() =>
          openActivity("settings")
        }
        aria-label="Settings"
      />

      {/* =====================================================
          BACK
      ===================================================== */}

      <button
        className="hotspot back-hotspot"
        onClick={goBack}
        aria-label="Back"
      />

      {/* =====================================================
          TALK
      ===================================================== */}

      <button
        className="hotspot talk-hotspot"
        onClick={() =>
          openActivity("talk")
        }
        aria-label="Talk"
      />

      {/* =====================================================
          CHAT
      ===================================================== */}

      <button
        className="hotspot chat-hotspot"
        onClick={() =>
          openActivity("chat")
        }
        aria-label="Chat"
      />

      {/* =====================================================
          PLAY
      ===================================================== */}

      <button
        className="hotspot play-hotspot"
        onClick={() =>
          openActivity("games")
        }
        aria-label="Play"
      />

      {/* =====================================================
          EXPLORE
      ===================================================== */}

      <button
        className="hotspot explore-hotspot"
        onClick={() =>
          openActivity("explore")
        }
        aria-label="Explore and Unlock"
      />

      {/* =====================================================
          SLEEP
      ===================================================== */}

      <button
        className="hotspot sleep-hotspot"
        onClick={() =>
          openActivity("sleep")
        }
        aria-label="Sleep"
      />

      {/* =====================================================
          MUSIC
      ===================================================== */}

      <button
        className="hotspot music-hotspot"
        onClick={() =>
          openActivity("music")
        }
        aria-label="Music"
      />

    </div>
  );

}

export default App;