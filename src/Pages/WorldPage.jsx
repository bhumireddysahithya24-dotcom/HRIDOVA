import React from "react";
import { useNavigate } from "react-router-dom";
import "./WorldPage.css";

function WorldPage({ world }) {
  const navigate = useNavigate();

  if (!world) {
    return (
      <div className="world-page">
        <div className="world-page-content">
          <h1>World not found</h1>

          <button
            className="back-button"
            onClick={() => navigate("/worlds")}
          >
            ← Back to Worlds
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="world-page">

      <button
        className="back-button"
        onClick={() => navigate("/worlds")}
      >
        ← Back
      </button>

      <div className="world-page-content">

        <h1>
          {world.name}'s {world.title}
        </h1>

        <p className="world-welcome">
          Welcome to {world.name}'s {world.title}!
        </p>

        {world.screen && (
          <img
            src={world.screen}
            alt={`${world.name}'s World`}
            className="world-screen"
          />
        )}

      </div>

    </div>
  );
}

export default WorldPage;