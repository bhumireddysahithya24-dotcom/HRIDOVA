import React, { useState } from "react";
import "./App.css";

import Talk from "./Talk";
import Chat from "./Chat";
import Games from "./Games";
import Sleep from "./Sleep";
import Music from "./Music";
import Settings from "./Settings";

function App() {
  const [page, setPage] = useState("home");

  const goHome = () => {
    setPage("home");
  };

  /* =========================
     TALK
  ========================= */
  if (page === "talk") {
    return (
      <Talk
        goHome={goHome}
        onBack={goHome}
      />
    );
  }

  /* =========================
     CHAT
  ========================= */
  if (page === "chat") {
    return (
      <Chat
        goHome={goHome}
        onBack={goHome}
      />
    );
  }

  /* =========================
     PLAY
  ========================= */
  if (page === "games") {
    return (
      <Games
        goHome={goHome}
        onBack={goHome}
      />
    );
  }

  /* =========================
     SLEEP
  ========================= */
  if (page === "sleep") {
    return (
      <Sleep
        goHome={goHome}
        onBack={goHome}
      />
    );
  }

  /* =========================
     MUSIC
  ========================= */
  if (page === "music") {
    return (
      <Music
        goHome={goHome}
        onBack={goHome}
      />
    );
  }

  /* =========================
     SETTINGS
  ========================= */
  if (page === "settings") {
    return (
      <Settings
        onBack={goHome}
        goHome={goHome}
      />
    );
  }

  /* =========================
     MIKO HOME
  ========================= */

  return (
    <div className="miko-home">

      {/* =========================
          BACKGROUND IMAGE
      ========================= */}

      <img
        src="/miko-background.png"
        alt=""
        className="miko-background-image"
      />

      <div className="miko-overlay"></div>


      {/* =========================
          LEVEL CARD
      ========================= */}

      <div className="level-card">

        <div className="level-avatar">
          <img
            src="/miko.png"
            alt="Miko"
          />
        </div>

        <div className="level-info">

          <div className="level-name">
            MIKO
          </div>

          <div className="level-number">
            Level 5
          </div>

          <div className="xp-bar">
            <div className="xp-progress"></div>
          </div>

          <div className="xp-number">
            335 / 500 XP
          </div>

        </div>

      </div>


      {/* =========================
          MIKO TITLE
      ========================= */}

      <div className="miko-header">

        <h1>
          MIKO
          <span>♥</span>
        </h1>

        <div className="miko-subtitle">
          <span>♥</span>
          Your Calm Companion
          <span>♥</span>
        </div>

      </div>


      {/* =========================
          SETTINGS
      ========================= */}

      <button
        type="button"
        className="settings-box"
        onClick={() => setPage("settings")}
      >

        <div className="settings-icon">
          ⚙
        </div>

        <div className="settings-text">
          Settings
        </div>

      </button>


      {/* =========================
          YOU MATTER
      ========================= */}

      <div className="you-matter">

        <div className="matter-icon">
          🌿
        </div>

        <h2>
          You Matter
        </h2>

        <div className="matter-heart">
          ♥
        </div>

        <p>
          Settings will open here.
        </p>

        <div className="matter-decoration">
          ♡
        </div>

      </div>


      {/* =========================
          MIKO CHARACTER
      ========================= */}

      <div className="miko-character-container">

        <img
          src="/miko.png"
          alt="Miko"
          className="miko-character"
        />

      </div>


      {/* =========================
          BOTTOM BUTTONS
      ========================= */}

      <div className="bottom-buttons">

        {/* BACK */}

        <button
          type="button"
          className="home-button back-button"
          onClick={goHome}
        >
          <span className="button-icon">
            ←
          </span>

          <span>
            Back
          </span>
        </button>


        {/* TALK */}

        <button
          type="button"
          className="home-button talk-button"
          onClick={() => setPage("talk")}
        >
          <span className="button-icon">
            🎙️
          </span>

          <span>
            Talk
          </span>
        </button>


        {/* CHAT */}

        <button
          type="button"
          className="home-button chat-button"
          onClick={() => setPage("chat")}
        >
          <span className="button-icon">
            💬
          </span>

          <span>
            Chat
          </span>
        </button>


        {/* PLAY */}

        <button
          type="button"
          className="home-button play-button"
          onClick={() => setPage("games")}
        >
          <span className="button-icon">
            🎮
          </span>

          <span>
            Play
          </span>
        </button>


        {/* EXPLORE */}

        <button
          type="button"
          className="home-button explore-button"
          onClick={() => {
            alert("Explore & Unlock");
          }}
        >
          <span className="button-icon">
            🔓
          </span>

          <span>
            Explore &
            <br />
            Unlock
          </span>
        </button>


        {/* SLEEP */}

        <button
          type="button"
          className="home-button sleep-button"
          onClick={() => setPage("sleep")}
        >
          <span className="button-icon">
            🌙
          </span>

          <span>
            Sleep
          </span>
        </button>


        {/* MUSIC */}

        <button
          type="button"
          className="home-button music-button"
          onClick={() => setPage("music")}
        >
          <span className="button-icon">
            🎵
          </span>

          <span>
            Music
          </span>
        </button>

      </div>

    </div>
  );
}

export default App;