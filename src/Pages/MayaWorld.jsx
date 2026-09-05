import React from "react";
import { useNavigate } from "react-router-dom";
import "./MayaWorld.css";

import mayaWorldImage from "./Maya Screen World.jpeg";

function MayaWorld() {
  const navigate = useNavigate();

  return (
    <div className="maya-world-page">
      <div className="maya-world-image-wrapper">

        {/* EXACT MAYA WORLD SCREEN */}
        <img
          src={mayaWorldImage}
          alt="Maya's World"
          className="maya-world-screen-image"
        />

        {/* =================================================
            TRANSPARENT CLICKABLE AREAS
            These sit ON TOP of the buttons in the image.
           ================================================= */}

        {/* Back */}
        <button
          className="maya-overlay maya-back-overlay"
          onClick={() => navigate("/worlds")}
          aria-label="Back to Worlds"
        />

        {/* Settings */}
        <button
          className="maya-overlay maya-settings-overlay"
          onClick={() => navigate("/maya/settings")}
          aria-label="Settings"
        />

        {/* Talk */}
        <button
          className="maya-overlay maya-talk-overlay"
          onClick={() => navigate("/maya/talk")}
          aria-label="Talk with Maya"
        />

        {/* Chat */}
        <button
          className="maya-overlay maya-chat-overlay"
          onClick={() => navigate("/maya/chat")}
          aria-label="Chat with Maya"
        />

        {/* Play */}
        <button
          className="maya-overlay maya-play-overlay"
          onClick={() => navigate("/maya/play")}
          aria-label="Play with Maya"
        />

        {/* Explore & Unlock */}
        <button
          className="maya-overlay maya-explore-overlay"
          onClick={() => navigate("/maya/explore")}
          aria-label="Explore and Unlock"
        />

        {/* Sleep */}
        <button
          className="maya-overlay maya-sleep-overlay"
          onClick={() => navigate("/maya/sleep")}
          aria-label="Sleep"
        />

        {/* Music */}
        <button
          className="maya-overlay maya-music-overlay"
          onClick={() => navigate("/maya/music")}
          aria-label="Music"
        />

      </div>
    </div>
  );
}

export default MayaWorld;