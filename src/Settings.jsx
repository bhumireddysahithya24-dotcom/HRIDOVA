import React, { useEffect, useState } from "react";
import "./Settings.css";

const DEFAULT_SETTINGS = {
    soundEffects: true,
    backgroundMusic: true,
    notifications: true,
    animations: true,
};

function Settings({
    character = "kairo",
    onBack,
    onStore,
}) {
    const characterName =
        character === "kairo" ? "Kairo" : "Alakananda";

    const [settings, setSettings] = useState(
        DEFAULT_SETTINGS
    );

    useEffect(() => {
        const savedSettings = localStorage.getItem(
            "hridovaSettings"
        );

        if (savedSettings) {
            try {
                setSettings({
                    ...DEFAULT_SETTINGS,
                    ...JSON.parse(savedSettings),
                });
            } catch (error) {
                console.error(
                    "Could not load settings:",
                    error
                );
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "hridovaSettings",
            JSON.stringify(settings)
        );
    }, [settings]);

    const toggleSetting = (setting) => {
        setSettings((previous) => ({
            ...previous,
            [setting]: !previous[setting],
        }));
    };

    /* =========================================================
       CLEAR CHAT
    ========================================================= */

    const handleClearChat = () => {
        const confirmed = window.confirm(
            "Clear your current chat conversation?"
        );

        if (!confirmed) {
            return;
        }

        window.dispatchEvent(
            new Event("hridova-clear-chat")
        );
    };

    /* =========================================================
       RESET SETTINGS
    ========================================================= */

    const handleReset = () => {
        const confirmed = window.confirm(
            "Reset all settings to their default values?"
        );

        if (!confirmed) {
            return;
        }

        setSettings(DEFAULT_SETTINGS);

        localStorage.setItem(
            "hridovaSettings",
            JSON.stringify(DEFAULT_SETTINGS)
        );

        window.dispatchEvent(
            new Event("hridova-reset-settings")
        );
    };

    /* =========================================================
       STORE
    ========================================================= */

    const handleStore = () => {
        if (onStore) {
            onStore();
        } else {
            window.alert(
                "The HRIDOVA Store is coming soon! 🛍️✨"
            );
        }
    };

    return (
        <div className={`settings-page ${character}`}>

            {/* BACK */}
            <button
                className="settings-back"
                onClick={onBack}
                aria-label="Back to world"
            >
                ←
            </button>

            <div className="settings-container">

                {/* HEADER */}
                <div className="settings-header">

                    <div className="settings-icon-container">
                        <span className="settings-icon">
                            ⚙️
                        </span>
                    </div>

                    <h1 className="settings-title">
                        {characterName} Settings
                    </h1>

                    <p className="settings-subtitle">
                        Make {characterName}'s world feel
                        comfortable for you. 💙
                    </p>

                </div>

                {/* SETTINGS CARD */}
                <div className="settings-card">

                    {/* SOUND EFFECTS */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-name">
                                🔊 Sound Effects
                            </span>

                            <span className="setting-description">
                                Enable sound effects for
                                interactions
                            </span>
                        </div>

                        <button
                            className={`toggle-btn ${settings.soundEffects
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                toggleSetting(
                                    "soundEffects"
                                )
                            }
                            aria-label="Toggle sound effects"
                        >
                            <span className="toggle-slider" />
                        </button>
                    </div>

                    {/* BACKGROUND MUSIC */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-name">
                                🎵 Background Music
                            </span>

                            <span className="setting-description">
                                Play ambient music in the
                                background
                            </span>
                        </div>

                        <button
                            className={`toggle-btn ${settings.backgroundMusic
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                toggleSetting(
                                    "backgroundMusic"
                                )
                            }
                            aria-label="Toggle background music"
                        >
                            <span className="toggle-slider" />
                        </button>
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-name">
                                🔔 Notifications
                            </span>

                            <span className="setting-description">
                                Receive notifications from{" "}
                                {characterName}
                            </span>
                        </div>

                        <button
                            className={`toggle-btn ${settings.notifications
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                toggleSetting(
                                    "notifications"
                                )
                            }
                            aria-label="Toggle notifications"
                        >
                            <span className="toggle-slider" />
                        </button>
                    </div>

                    {/* ANIMATIONS */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-name">
                                ✨ Animations
                            </span>

                            <span className="setting-description">
                                Enable smooth animations
                                and transitions
                            </span>
                        </div>

                        <button
                            className={`toggle-btn ${settings.animations
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                toggleSetting(
                                    "animations"
                                )
                            }
                            aria-label="Toggle animations"
                        >
                            <span className="toggle-slider" />
                        </button>
                    </div>

                    {/* =================================================
                        EXTRA ACTIONS
                    ================================================= */}

                    <div className="settings-divider" />

                    {/* CLEAR CHAT */}
                    <button
                        className="settings-action clear-action"
                        onClick={handleClearChat}
                    >
                        <span className="action-icon">
                            🗑️
                        </span>

                        <span className="setting-info">
                            <span className="setting-name">
                                Clear Chat
                            </span>

                            <span className="setting-description">
                                Delete your current
                                conversation
                            </span>
                        </span>

                        <span className="action-arrow">
                            →
                        </span>
                    </button>

                    {/* RESET */}
                    <button
                        className="settings-action reset-action"
                        onClick={handleReset}
                    >
                        <span className="action-icon">
                            🔄
                        </span>

                        <span className="setting-info">
                            <span className="setting-name">
                                Reset
                            </span>

                            <span className="setting-description">
                                Restore all settings to
                                their defaults
                            </span>
                        </span>

                        <span className="action-arrow">
                            →
                        </span>
                    </button>

                    {/* STORE */}
                    <button
                        className="settings-action store-action"
                        onClick={handleStore}
                    >
                        <span className="action-icon">
                            🛍️
                        </span>

                        <span className="setting-info">
                            <span className="setting-name">
                                Store
                            </span>

                            <span className="setting-description">
                                Explore HRIDOVA items
                                and rewards
                            </span>
                        </span>

                        <span className="action-arrow">
                            →
                        </span>
                    </button>

                </div>

                {/* CHARACTER LABEL */}
                <div className="settings-character">
                    {character === "kairo"
                        ? "🐺 Kairo's Adventure"
                        : "🌊 Alakananda's World"}
                </div>

            </div>
        </div>
    );
}

export default Settings;