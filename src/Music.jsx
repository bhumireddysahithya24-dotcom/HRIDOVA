import React, { useEffect, useRef, useState } from "react";
import "./Music.css";

const natureSounds = {
    kairo: [
        {
            title: "Gentle Rain",
            description: "Soft peaceful rain",
            emoji: "🌧️",
            src: "/music/boons_freak-rain-sound-188158.mp3",
        },
        {
            title: "Flowing Water",
            description: "Calm flowing water",
            emoji: "🌊",
            src: "/music/a_a2005-flowing-water-345171.mp3",
        },
        {
            title: "Forest Night",
            description: "Peaceful forest night",
            emoji: "🌲",
            src: "/music/capaholiczsfx-forest-soundscape-night-time-403609.mp3",
        },
        {
            title: "Flowing Water",
            description: "Relaxing water sounds",
            emoji: "💦",
            src: "/music/creative_spark-flowing-water-246403.mp3",
        },
        {
            title: "Night Forest",
            description: "Frogs and peaceful night sounds",
            emoji: "🌙",
            src: "/music/eryliaa-night-forest-with-frogs-and-crickets-for-sleep-451153.mp3",
        },
        {
            title: "Forest Birds",
            description: "Birds in the forest",
            emoji: "🐦",
            src: "/music/soundreality-birds-forest-nature-445379.mp3",
        },
        {
            title: "Campfire",
            description: "Warm cozy fire sounds",
            emoji: "🔥",
            src: "/music/soundreality-fire-crackling-528620.mp3",
        },
        {
            title: "Deep Forest",
            description: "Peaceful forest ambience",
            emoji: "🌳",
            src: "/music/soundreality-nature-forest-sound-537925.mp3",
        },
        {
            title: "Waterfall",
            description: "Relaxing waterfall sounds",
            emoji: "💧",
            src: "/music/tramp963-waterfall-sounds-259625.mp3",
        },
    ],

    alakananda: [
        {
            title: "Ocean Waves",
            description: "Soothing ocean waves",
            emoji: "🌊",
            src: "/music/dragon-studio-soothing-ocean-waves-372489.mp3",
        },
        {
            title: "Gentle Rain",
            description: "Soft relaxing rain",
            emoji: "🌧️",
            src: "/music/boons_freak-rain-sound-188158.mp3",
        },
        {
            title: "Flowing Water",
            description: "Peaceful flowing water",
            emoji: "💧",
            src: "/music/a_a2005-flowing-water-345171.mp3",
        },
        {
            title: "Water Sounds",
            description: "Calm flowing water",
            emoji: "🐚",
            src: "/music/creative_spark-flowing-water-246403.mp3",
        },
        {
            title: "Dreamy Night",
            description: "Peaceful night ambience",
            emoji: "🫧",
            src: "/music/eryliaa-night-forest-with-frogs-and-crickets-for-sleep-451153.mp3",
        },
        {
            title: "Nature Ambience",
            description: "Relaxing natural sounds",
            emoji: "✨",
            src: "/music/soundreality-nature-forest-sound-537925.mp3",
        },
        {
            title: "Forest Birds",
            description: "Beautiful birds and nature",
            emoji: "🐦",
            src: "/music/soundreality-birds-forest-nature-445379.mp3",
        },
        {
            title: "Waterfall",
            description: "Peaceful waterfall",
            emoji: "💦",
            src: "/music/tramp963-waterfall-sounds-259625.mp3",
        },
        {
            title: "Soft Fire",
            description: "Gentle cozy fire",
            emoji: "🔥",
            src: "/music/soundreality-fire-crackling-528620.mp3",
        },
    ],
};

function Music({ character = "kairo", onBack }) {
    const audioRef = useRef(null);

    const sounds = natureSounds[character] || natureSounds.kairo;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);

    const currentSound = sounds[currentIndex];

    const background =
        character === "kairo"
            ? "/backgrounds/kairo-music.png"
            : "/backgrounds/alakananda-music.png";

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        setCurrentIndex(0);
        setIsPlaying(false);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [character]);

    const togglePlay = async () => {
        if (!audioRef.current) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                await audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Audio could not play:", error);
            setIsPlaying(false);
        }
    };

    const selectSound = (index) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setCurrentIndex(index);
        setIsPlaying(false);
    };

    const previousSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setCurrentIndex((previous) =>
            previous === 0 ? sounds.length - 1 : previous - 1
        );

        setIsPlaying(false);
    };

    const nextSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setCurrentIndex((previous) =>
            previous === sounds.length - 1 ? 0 : previous + 1
        );

        setIsPlaying(false);
    };

    const handleEnded = () => {
        setCurrentIndex((previous) =>
            previous === sounds.length - 1 ? 0 : previous + 1
        );

        setIsPlaying(false);
    };

    return (
        <div
            className={`music-page ${character}`}
            style={{
                backgroundImage: `url("${background}")`,
            }}
        >
            {/* BACK BUTTON */}
            <button
                className="music-back-button"
                onClick={onBack}
                aria-label="Back to world"
            >
                ←
            </button>

            {/* PREVIOUS */}
            <button
                className="music-hotspot music-previous-hotspot"
                onClick={previousSound}
                aria-label="Previous sound"
            />

            {/* PLAY */}
            <button
                className="music-hotspot music-play-hotspot"
                onClick={togglePlay}
                aria-label="Play or pause"
            />

            {/* NEXT */}
            <button
                className="music-hotspot music-next-hotspot"
                onClick={nextSound}
                aria-label="Next sound"
            />

            {/* SOUND LIST */}
            <div className="nature-sounds-panel">
                <div className="nature-sounds-heading">
                    <div className="current-sound-icon">
                        {currentSound.emoji}
                    </div>

                    <div>
                        <h1>
                            {character === "kairo"
                                ? "Kairo's Nature Sounds"
                                : "Alakananda's Ocean Sounds"}
                        </h1>

                        <p>
                            Relax, listen and enjoy the sounds of nature ✨
                        </p>
                    </div>
                </div>

                <div className="nature-sound-list">
                    {sounds.map((sound, index) => (
                        <button
                            key={sound.title + index}
                            className={`nature-sound-card ${index === currentIndex ? "selected" : ""
                                }`}
                            onClick={() => selectSound(index)}
                        >
                            <span className="sound-icon">
                                {sound.emoji}
                            </span>

                            <span className="sound-details">
                                <strong>{sound.title}</strong>

                                <small>{sound.description}</small>
                            </span>

                            <span className="sound-play">
                                {index === currentIndex && isPlaying
                                    ? "🔊"
                                    : "▶"}
                            </span>
                        </button>
                    ))}
                </div>

                {/* CONTROLS */}
                <div className="music-controls">
                    <button
                        onClick={previousSound}
                        aria-label="Previous"
                    >
                        ⏮
                    </button>

                    <button
                        className="main-play-button"
                        onClick={togglePlay}
                        aria-label="Play or pause"
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>

                    <button
                        onClick={nextSound}
                        aria-label="Next"
                    >
                        ⏭
                    </button>
                </div>

                {/* VOLUME */}
                <div className="music-volume">
                    <span>🔈</span>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(event) =>
                            setVolume(Number(event.target.value))
                        }
                    />

                    <span>🔊</span>
                </div>
            </div>

            {/* AUDIO PLAYER */}
            <audio
                ref={audioRef}
                src={currentSound.src}
                onEnded={handleEnded}
                preload="metadata"
            />
        </div>
    );
}

export default Music;