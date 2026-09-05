import React from "react";
import jayScreen from "./Jay Screen World.png";
import "./JayWorld.css";

export default function JayWorld() {
  return (
    <div className="jay-world">

      {/* Existing Jay World image */}
      <img
        src={jayScreen}
        alt="Jay Gaming World"
        className="jay-background"
        draggable="false"
      />

      {/* SETTINGS */}
      <a
        href="/jay/settings"
        className="jay-hotspot jay-settings-hotspot"
        aria-label="Settings"
      />

      {/* BACK */}
      <a
        href="/worlds"
        className="jay-hotspot jay-back-hotspot"
        aria-label="Back"
      />

      {/* TALK */}
      <a
        href="/jay/talk"
        className="jay-hotspot jay-talk-hotspot"
        aria-label="Talk"
      />

      {/* CHAT */}
      <a
        href="/jay/chat"
        className="jay-hotspot jay-chat-hotspot"
        aria-label="Chat"
      />

      {/* PLAY */}
      <a
        href="/jay/play"
        className="jay-hotspot jay-play-hotspot"
        aria-label="Play"
      />

      {/* EXPLORE & UNLOCK */}
      <a
        href="/jay/explore"
        className="jay-hotspot jay-explore-hotspot"
        aria-label="Explore and Unlock"
      />

      {/* SLEEP */}
      <a
        href="/jay/sleep"
        className="jay-hotspot jay-sleep-hotspot"
        aria-label="Sleep"
      />

      {/* MUSIC */}
      <a
        href="/jay/music"
        className="jay-hotspot jay-music-hotspot"
        aria-label="Music"
      />

    </div>
  );
}