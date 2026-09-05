import React from "react";
import { useNavigate } from "react-router-dom";
import "./Worlds.css";

import mayaWorld from "../../assets/worlds/Maya World.jpeg";
import jayWorld from "../../assets/worlds/Jay World.jpeg";

const worlds = [
  {
    id: "maya",
    name: "Maya",
    image: mayaWorld,
    description: "Step into Maya's magical fashion world",
    path: "/maya",
  },
  {
    id: "jay",
    name: "Jay",
    image: jayWorld,
    description: "Join Jay on exciting gaming adventures",
    path: "/jay",
  },
];

export default function Worlds() {
  const navigate = useNavigate();

  return (
    <div className="worlds-page">
      {/* Decorative stars */}
      <div className="worlds-stars" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className={`world-star world-star-${index + 1}`} />
        ))}
      </div>

      <div className="worlds-content">
        {/* HEADER */}
        <header className="worlds-header">
          <h1 className="worlds-title">Choose a World</h1>
          <p className="worlds-subtitle">
            Step into Maya or Jay's magical world
          </p>
        </header>

        {/* WORLD CARDS */}
        <section className="worlds-grid">
          {worlds.map((world) => (
            <article className="world-card" key={world.id}>
              <div className="world-image-container">
                <img
                  src={world.image}
                  alt={`${world.name} World`}
                  className="world-image"
                />
              </div>

              <div className="world-info">
                <h2 className="world-name">{world.name}</h2>

                <p className="world-description">
                  {world.description}
                </p>

                <button
                  type="button"
                  className="world-enter-button"
                  onClick={() => navigate(world.path)}
                >
                  <span>Enter World</span>
                  <span className="world-arrow">→</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}