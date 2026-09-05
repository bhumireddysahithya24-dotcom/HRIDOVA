import { useState } from "react";
import "./Settings.css";

export default function Settings({ onBack, onHistory }) {
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem("miko_sound_enabled") !== "false"
  );

  const [volume, setVolume] = useState(
    Number(localStorage.getItem("miko_volume") || 0.65)
  );

  /* =========================
     SOUND
  ========================= */

  const saveSound = (value) => {
    setSoundEnabled(value);

    localStorage.setItem(
      "miko_sound_enabled",
      String(value)
    );

    window.dispatchEvent(
      new CustomEvent("miko-sound-change", {
        detail: {
          enabled: value,
          volume,
        },
      })
    );
  };

  const changeVolume = (value) => {
    const newVolume = Number(value);

    setVolume(newVolume);

    localStorage.setItem(
      "miko_volume",
      String(newVolume)
    );

    window.dispatchEvent(
      new CustomEvent("miko-sound-change", {
        detail: {
          enabled: soundEnabled,
          volume: newVolume,
        },
      })
    );
  };


  /* =========================
     CLEAR CHAT HISTORY
  ========================= */

  const clearChatHistory = () => {
    const confirmed = window.confirm(
      "Clear Miko's chat history?\n\nYour previous conversations will be removed."
    );

    if (!confirmed) return;

    localStorage.removeItem("miko_chat_history");
    localStorage.removeItem("mikoChatHistory");
    localStorage.removeItem("chat_history");
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("miko_messages");
    localStorage.removeItem("miko_conversation");
    localStorage.removeItem("messages");

    window.dispatchEvent(
      new Event("miko-clear-history")
    );

    alert("Miko's chat history has been cleared. 💗");
  };


  /* =========================
     RESET HISTORY
  ========================= */

  const resetHistory = () => {
    const confirmed = window.confirm(
      "Reset Miko's history?\n\nThis will remove all saved Miko conversation history."
    );

    if (!confirmed) return;

    const keysToRemove = [
      "miko_chat_history",
      "mikoChatHistory",
      "chat_history",
      "chatHistory",
      "miko_messages",
      "miko_conversation",
      "conversation",
      "messages",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    window.dispatchEvent(
      new Event("miko-reset-history")
    );

    alert("Miko's history has been reset. 🌸");
  };


  /* =========================
     VIEW HISTORY
  ========================= */

  const handleViewHistory = () => {
    if (typeof onHistory === "function") {
      onHistory();
    } else {
      alert(
        "Miko's chat history will appear here."
      );
    }
  };


  return (
    <div className="settings-page">

      {/* ================= HEADER ================= */}

      <header className="settings-header">

        <button
          type="button"
          className="settings-back"
          onClick={onBack}
        >
          ←
        </button>

        <img
          src="/miko.png"
          alt="Miko"
        />

        <div>
          <h1>Settings</h1>

          <p>
            Make Miko feel right for you.
          </p>
        </div>

      </header>


      {/* ================= CONTENT ================= */}

      <main className="settings-content">

        {/* MIKO IMAGE */}

        <div className="settings-miko">
          <img
            src="/miko.png"
            alt="Miko"
          />
        </div>


        <h2>
          Miko Settings ⚙️
        </h2>

        <p className="settings-subtitle">
          Customize your experience.
        </p>


        {/* ================= SOUND ================= */}

        <section className="settings-section">

          <div className="section-title">

            <span>🔊</span>

            <div>
              <h3>Sound</h3>

              <p>
                Control Miko's sounds.
              </p>
            </div>

          </div>


          {/* SOUND TOGGLE */}

          <div className="setting-row">

            <div className="setting-info">

              <strong>
                Sounds
              </strong>

              <small>
                Enable or disable music and sounds.
              </small>

            </div>


            <button
              type="button"
              className={`toggle ${
                soundEnabled ? "active" : ""
              }`}
              onClick={() =>
                saveSound(!soundEnabled)
              }
              aria-label="Toggle sounds"
            >
              <span />
            </button>

          </div>


          {/* VOLUME */}

          <div className="setting-row volume-row">

            <div className="setting-info">

              <strong>
                Volume
              </strong>

              <small>
                {Math.round(volume * 100)}%
              </small>

            </div>


            <div className="volume-box">

              <span>🔈</span>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                disabled={!soundEnabled}
                onChange={(event) =>
                  changeVolume(event.target.value)
                }
              />

              <span>🔊</span>

            </div>

          </div>

        </section>


        {/* ================= CHAT HISTORY ================= */}

        <section className="settings-section">

          <div className="section-title">

            <span>💬</span>

            <div>

              <h3>
                Chat History
              </h3>

              <p>
                Manage Miko's saved conversations.
              </p>

            </div>

          </div>


          {/* VIEW HISTORY */}

          <button
            type="button"
            className="settings-action"
            onClick={handleViewHistory}
          >

            <div className="action-icon">
              👁️
            </div>

            <div className="action-text">

              <strong>
                View Chat History
              </strong>

              <small>
                See your previous conversations with Miko.
              </small>

            </div>

            <span className="action-arrow">
              ›
            </span>

          </button>


          {/* CLEAR HISTORY */}

          <button
            type="button"
            className="settings-action"
            onClick={clearChatHistory}
          >

            <div className="action-icon">
              🗑️
            </div>

            <div className="action-text">

              <strong>
                Clear Chat History
              </strong>

              <small>
                Remove your previous conversations.
              </small>

            </div>

            <span className="action-arrow">
              ›
            </span>

          </button>


          {/* RESET HISTORY */}

          <button
            type="button"
            className="settings-action reset-action"
            onClick={resetHistory}
          >

            <div className="action-icon">
              🔄
            </div>

            <div className="action-text">

              <strong>
                Reset History
              </strong>

              <small>
                Completely reset saved Miko conversations.
              </small>

            </div>

            <span className="action-arrow">
              ›
            </span>

          </button>

        </section>


        {/* ================= FOOTER ================= */}

        <p className="settings-footer">
          Miko is always here for you. 💗
        </p>

      </main>

    </div>
  );
}