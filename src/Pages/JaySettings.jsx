import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JaySettings.css";

function JaySettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    soundEffects: true,
    backgroundMusic: true,
    notifications: true,
    animations: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("jaySettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("jaySettings", JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="jay-settings-page">
      <button
        className="jay-settings-back"
        onClick={() => navigate("/jay")}
      >
        ← Back to Jay
      </button>

      <div className="jay-settings-container">
        <div className="settings-header">
          <div className="settings-icon-container">
            <span className="settings-icon">⚙️</span>
          </div>
          <h1 className="settings-title">Jay Settings</h1>
          <p className="settings-subtitle">
            Make Jay's world feel comfortable for you. 💙
          </p>
        </div>

        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-name">🔊 Sound Effects</span>
              <span className="setting-description">
                Enable sound effects for interactions
              </span>
            </div>
            <button
              className={`toggle-btn ${settings.soundEffects ? "active" : ""}`}
              onClick={() => toggleSetting("soundEffects")}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-name">🎵 Background Music</span>
              <span className="setting-description">
                Play ambient music in the background
              </span>
            </div>
            <button
              className={`toggle-btn ${settings.backgroundMusic ? "active" : ""}`}
              onClick={() => toggleSetting("backgroundMusic")}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-name">🔔 Notifications</span>
              <span className="setting-description">
                Receive notifications from Jay
              </span>
            </div>
            <button
              className={`toggle-btn ${settings.notifications ? "active" : ""}`}
              onClick={() => toggleSetting("notifications")}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-name">✨ Animations</span>
              <span className="setting-description">
                Enable smooth animations and transitions
              </span>
            </div>
            <button
              className={`toggle-btn ${settings.animations ? "active" : ""}`}
              onClick={() => toggleSetting("animations")}
            >
              <span className="toggle-slider" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JaySettings;