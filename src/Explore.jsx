import React, { useEffect, useMemo, useState } from "react";

const defaultProgress = {
    stars: 0,
    completedGames: [],
    unlockedRewards: [],
};

const characterThemes = {
    kairo: {
        name: "Kairo",
        title: "Kairo's Adventure Trail",
        subtitle: "Discover magical places, collect stars, and unlock surprises!",
        icon: "🐺",
        className: "kairo-theme",
        rewards: [
            "🐾 Explorer Paw Badge",
            "🧭 Magical Compass",
            "🌲 Forest Friend Sticker",
            "⭐ Night Sky Cape",
        ],
    },

    alakananda: {
        name: "Alakananda",
        title: "Alakananda's Ocean of Wonders",
        subtitle: "Dive into magical discoveries, kind memories, and glowing rewards!",
        icon: "🌊",
        className: "alakananda-theme",
        rewards: [
            "🐚 Ocean Pearl Badge",
            "🪷 Lotus Crown",
            "🫧 Bubble Trail",
            "✨ Starlight Wave",
        ],
    },
};

function safeReadProgress() {
    try {
        const savedProgress = localStorage.getItem("hridovaProgress");

        if (!savedProgress) {
            return defaultProgress;
        }

        const parsedProgress = JSON.parse(savedProgress);

        return {
            stars: Number(parsedProgress.stars) || 0,
            completedGames: Array.isArray(parsedProgress.completedGames)
                ? parsedProgress.completedGames
                : [],
            unlockedRewards: Array.isArray(parsedProgress.unlockedRewards)
                ? parsedProgress.unlockedRewards
                : [],
        };
    } catch {
        return defaultProgress;
    }
}

function Explore({ character, onBack }) {
    const [progress, setProgress] = useState(safeReadProgress);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [showCollection, setShowCollection] = useState(false);

    const theme = characterThemes[character] || characterThemes.kairo;

    useEffect(() => {
        const updateProgress = () => {
            setProgress(safeReadProgress());
        };

        window.addEventListener("focus", updateProgress);
        window.addEventListener("storage", updateProgress);

        return () => {
            window.removeEventListener("focus", updateProgress);
            window.removeEventListener("storage", updateProgress);
        };
    }, []);

    const exploredMoods = useMemo(() => {
        const moodGames = {
            happy: ["pet-puppy", "balloon-pop", "sun-shine"],
            angry: ["pillow-fight", "fire-water", "angry-doodle"],
            sad: ["blow-clouds", "memory-garden", "sunshine-hearts"],
            confused: ["choose-path", "color-match", "treasure-hunt"],
            alone: ["catch-stars", "friendship-puzzle", "campfire-cozy"],
        };

        return Object.values(moodGames).filter((games) =>
            games.some((gameId) => progress.completedGames.includes(gameId))
        ).length;
    }, [progress.completedGames]);

    const places = [
        {
            id: "kindness-forest",
            icon: "🌳",
            name: "Kindness Forest",
            description: "A gentle place where kind thoughts grow like glowing leaves.",
            unlockText: "Complete 1 game",
            unlocked: progress.completedGames.length >= 1,
            message: `You brought kindness into ${theme.name}'s world. Every caring choice helps the forest glow. 💛`,
            reward: theme.rewards[0],
        },
        {
            id: "rainbow-bridge",
            icon: "🌈",
            name: "Rainbow Bridge",
            description: "A bright bridge made from courage, curiosity, and color.",
            unlockText: "Earn 60 stars",
            unlocked: progress.stars >= 60,
            message: `You followed your colorful path with ${theme.name}. Keep being curious! 🌈`,
            reward: theme.rewards[1],
        },
        {
            id: "calm-moon-lake",
            icon: "🌙",
            name: "Calm Moon Lake",
            description: "A quiet lake where you can take slow, peaceful breaths.",
            unlockText: "Complete 3 games",
            unlocked: progress.completedGames.length >= 3,
            message:
                character === "kairo"
                    ? "Even explorers need a quiet moment. Breathe in slowly... and breathe out gently. 🐺🌙"
                    : "Like waves, feelings come and go. Breathe in softly... and let the water become still. 🌊🌙",
            reward: theme.rewards[2],
            isBreathingPlace: true,
        },
        {
            id: "star-garden",
            icon: "⭐",
            name: "Star Garden",
            description: "A magical garden where every completed game helps a new star bloom.",
            unlockText: "Complete 5 games",
            unlocked: progress.completedGames.length >= 5,
            message: `You are growing a beautiful Star Garden with ${theme.name}. Each star remembers that you tried. ✨`,
            reward: theme.rewards[3],
        },
        {
            id: "courage-castle",
            icon: "🏰",
            name: "Courage Castle",
            description: "A special place that opens when you have explored many feelings.",
            unlockText: "Try all 5 moods",
            unlocked: exploredMoods >= 5,
            message: `You explored so many feelings with ${theme.name}. Every feeling belongs here, and you are growing stronger every day. 🏰✨`,
            reward: "🏆 HRIDOVA Courage Explorer Badge",
        },
    ];

    const unlockedPlaces = places.filter((place) => place.unlocked);
    const unlockedRewards = unlockedPlaces.map((place) => place.reward);

    function openPlace(place) {
        if (!place.unlocked) {
            return;
        }

        setSelectedPlace(place);
    }

    function closePlace() {
        setSelectedPlace(null);
    }

    return (
        <div className={`explore-screen ${theme.className}`}>
            <div className="explore-sparkles" aria-hidden="true">
                {Array.from({ length: 24 }).map((_, index) => (
                    <span
                        className="explore-sparkle"
                        key={index}
                        style={{
                            left: `${(index * 17) % 100}%`,
                            top: `${(index * 31) % 100}%`,
                            animationDelay: `${(index % 8) * 0.35}s`,
                        }}
                    />
                ))}
            </div>

            <button className="explore-back-button" type="button" onClick={onBack}>
                ← Back
            </button>

            <header className="explore-header">
                <p className="explore-character">
                    {theme.icon} Exploring with {theme.name}
                </p>

                <h1>{theme.title}</h1>

                <p>{theme.subtitle}</p>
            </header>

            <section className="explore-progress-row">
                <article className="progress-card">
                    <span className="progress-icon">⭐</span>
                    <div>
                        <small>Total Stars</small>
                        <strong>{progress.stars}</strong>
                    </div>
                </article>

                <article className="progress-card">
                    <span className="progress-icon">🎮</span>
                    <div>
                        <small>Games Completed</small>
                        <strong>{progress.completedGames.length}</strong>
                    </div>
                </article>

                <article className="progress-card">
                    <span className="progress-icon">🌈</span>
                    <div>
                        <small>Moods Explored</small>
                        <strong>{exploredMoods} / 5</strong>
                    </div>
                </article>

                <button
                    className="collection-button"
                    type="button"
                    onClick={() => setShowCollection(true)}
                >
                    🎒 My Collection
                </button>
            </section>

            <section className="explore-map">
                <div className="map-path path-one" />
                <div className="map-path path-two" />
                <div className="map-path path-three" />
                <div className="map-path path-four" />

                {places.map((place, index) => (
                    <button
                        key={place.id}
                        className={`place-card ${place.unlocked ? "unlocked" : "locked"} place-${index + 1}`}
                        type="button"
                        onClick={() => openPlace(place)}
                        aria-label={
                            place.unlocked
                                ? `Open ${place.name}`
                                : `${place.name} is locked. ${place.unlockText}`
                        }
                    >
                        <span className="place-icon">{place.unlocked ? place.icon : "🔒"}</span>

                        <strong>{place.name}</strong>

                        <span className="place-description">{place.description}</span>

                        <span className="place-status">
                            {place.unlocked ? "✨ Explore" : `🔒 ${place.unlockText}`}
                        </span>
                    </button>
                ))}
            </section>

            <section className="explore-tip">
                <span>💡</span>
                <p>
                    Play mood-based Games to earn stars and discover new magical places.
                    Every small step counts!
                </p>
            </section>

            {selectedPlace && (
                <div className="explore-modal-overlay">
                    <section className="explore-modal">
                        <button
                            className="modal-close-button"
                            type="button"
                            onClick={closePlace}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="modal-place-icon">{selectedPlace.icon}</div>

                        <h2>{selectedPlace.name}</h2>

                        <p>{selectedPlace.message}</p>

                        {selectedPlace.isBreathingPlace && (
                            <div className="breathing-activity">
                                <div className="breathing-orb" />
                                <p>
                                    Breathe in as the moon grows.
                                    <br />
                                    Breathe out as it becomes small.
                                </p>
                            </div>
                        )}

                        <div className="reward-unlocked">
                            <span>🎁</span>
                            <div>
                                <small>Reward discovered</small>
                                <strong>{selectedPlace.reward}</strong>
                            </div>
                        </div>

                        <button
                            className="modal-action-button"
                            type="button"
                            onClick={closePlace}
                        >
                            Keep Exploring ✨
                        </button>
                    </section>
                </div>
            )}

            {showCollection && (
                <div className="explore-modal-overlay">
                    <section className="explore-modal collection-modal">
                        <button
                            className="modal-close-button"
                            type="button"
                            onClick={() => setShowCollection(false)}
                            aria-label="Close collection"
                        >
                            ×
                        </button>

                        <div className="modal-place-icon">🎒</div>

                        <h2>My Magical Collection</h2>

                        <p>
                            These are the rewards you have discovered on your HRIDOVA journey.
                        </p>

                        {unlockedRewards.length > 0 ? (
                            <div className="collection-grid">
                                {unlockedRewards.map((reward) => (
                                    <div className="collection-item" key={reward}>
                                        {reward}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-collection">
                                <span>✨</span>
                                <p>
                                    Play your first Games activity to unlock a magical reward.
                                </p>
                            </div>
                        )}

                        <button
                            className="modal-action-button"
                            type="button"
                            onClick={() => setShowCollection(false)}
                        >
                            Back to Map
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}

export default Explore;