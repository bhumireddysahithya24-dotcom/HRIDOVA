import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JayMusic.css";

// Comment out this line if the image doesn't exist:
// import jayCharacter from "./Jay Character.png";

function JayMusic() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const sleepTimerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [sleepTimer, setSleepTimer] = useState(null);
  const [sleepTimeLeft, setSleepTimeLeft] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const moods = [
    { id: "happy", label: "Happy", emoji: "😊", color: "#fbbf24" },
    { id: "sad", label: "Sad", emoji: "😢", color: "#60a5fa" },
    { id: "angry", label: "Angry", emoji: "😡", color: "#f87171" },
    { id: "scared", label: "Scared", emoji: "😨", color: "#a78bfa" },
    { id: "confused", label: "Confused", emoji: "😕", color: "#34d399" }
  ];

  const categories = [
    { id: "all", name: "All", icon: "🎵" },
    { id: "calm", name: "Calm", icon: "🌙" },
    { id: "happy", name: "Happy", icon: "❤️" },
    { id: "focus", name: "Focus", icon: "🎯" },
    { id: "sleep", name: "Sleep", icon: "💤" },
    { id: "nature", name: "Nature", icon: "🌿" },
    { id: "relax", name: "Relax", icon: "🧘" }
  ];

  const tracks = [
    { 
      id: 1, 
      title: "Gentle Rain", 
      category: "nature", 
      mood: ["sad", "relax"],
      icon: "🌧️", 
      duration: 135,
      description: "Soft rainfall for peaceful moments",
      audio: "/music/gentle-rain.mp3"
    },
    { 
      id: 2, 
      title: "Ocean Waves", 
      category: "nature", 
      mood: ["calm", "relax"],
      icon: "🌊", 
      duration: 140,
      description: "Calming ocean sounds",
      audio: "/music/ocean-waves.mp3"
    },
    { 
      id: 3, 
      title: "Forest Calm", 
      category: "nature", 
      mood: ["calm", "focus"],
      icon: "🌲", 
      duration: 128,
      description: "Peaceful forest ambience",
      audio: "/music/forest-calm.mp3"
    },
    { 
      id: 4, 
      title: "Morning Birds", 
      category: "nature", 
      mood: ["happy", "calm"],
      icon: "🐦", 
      duration: 118,
      description: "Cheerful morning melodies",
      audio: "/music/morning-birds.mp3"
    },
    { 
      id: 5, 
      title: "Cozy Campfire", 
      category: "calm", 
      mood: ["calm", "relax"],
      icon: "🔥", 
      duration: 145,
      description: "Warm crackling fire sounds",
      audio: "/music/campfire.mp3"
    },
    { 
      id: 6, 
      title: "Dreamy Night", 
      category: "sleep", 
      mood: ["sad", "calm"],
      icon: "✨", 
      duration: 150,
      description: "Ethereal nighttime soundscapes",
      audio: "/music/dreamy-night.mp3"
    },
    { 
      id: 7, 
      title: "Peaceful Piano", 
      category: "calm", 
      mood: ["sad", "relax"],
      icon: "🎹", 
      duration: 132,
      description: "Serene piano melodies",
      audio: "/music/peaceful-piano.mp3"
    },
    { 
      id: 8, 
      title: "Deep Relaxation", 
      category: "relax", 
      mood: ["angry", "scared", "relax"],
      icon: "🧘", 
      duration: 158,
      description: "Deep meditative sounds",
      audio: "/music/deep-relaxation.mp3"
    },
    { 
      id: 9, 
      title: "Uplifting Vibes", 
      category: "happy", 
      mood: ["happy"],
      icon: "☀️", 
      duration: 125,
      description: "Energetic and cheerful",
      audio: "/music/uplifting.mp3"
    },
    { 
      id: 10, 
      title: "Focus Flow", 
      category: "focus", 
      mood: ["confused", "focus"],
      icon: "🎯", 
      duration: 142,
      description: "Concentration-enhancing beats",
      audio: "/music/focus-flow.mp3"
    }
  ];

  // Filter tracks
  const filteredTracks = showFavorites
    ? tracks.filter(track => favorites.includes(track.id))
    : selectedCategory === "all"
      ? selectedMood
        ? tracks.filter(track => track.mood.includes(selectedMood))
        : tracks
      : tracks.filter(track => track.category === selectedCategory);

  // Get recommended tracks for mood
  const getRecommendedTracks = (moodId) => {
    return tracks.filter(track => track.mood.includes(moodId));
  };

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current.currentTime);
    });

    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current.duration);
    });

    audioRef.current.addEventListener("ended", () => {
      setPlaying(false);
      handleNext();
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Play track
  const playTrack = (track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.audio;
      audioRef.current.play().catch(err => {
        console.log("Audio file not available:", track.audio);
        // Still update UI even if audio fails
        setCurrentTrack(track);
        setPlaying(true);
      });
      setCurrentTrack(track);
      setPlaying(true);
      
      // Add to recently played
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(id => id !== track.id);
        return [track.id, ...filtered].slice(0, 5);
      });
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentTrack || !audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.log("Audio playback failed");
      });
      setPlaying(true);
    }
  };

  // Next track
  const handleNext = () => {
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    playTrack(filteredTracks[nextIndex]);
  };

  // Previous track
  const handlePrevious = () => {
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
    playTrack(filteredTracks[prevIndex]);
  };

  // Seek
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Toggle favorite
  const toggleFavorite = (trackId) => {
    setFavorites(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  // Sleep timer
  const startSleepTimer = (minutes) => {
    setSleepTimer(minutes);
    setSleepTimeLeft(minutes * 60);

    sleepTimerRef.current = setInterval(() => {
      setSleepTimeLeft(prev => {
        if (prev <= 1) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setPlaying(false);
          setSleepTimer(null);
          setSleepTimeLeft(null);
          clearInterval(sleepTimerRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }
    setSleepTimer(null);
    setSleepTimeLeft(null);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("jayMusicFavorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("jayMusicFavorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="jay-music-page">
      {/* Animated Background */}
      <div className="music-bg-animation"></div>
      <div className="music-bg-overlay"></div>

      {/* Header */}
      <header className="music-header">
        <button className="back-btn" onClick={() => navigate("/jay")}>
          ← Back to Jay
        </button>
        <div className="header-center">
          <span className="music-icon-large">🎵</span>
          <h1>Jay's Music Zone</h1>
          <p className="subtitle">Pick a sound that matches how you feel</p>
        </div>
        <div className="header-spacer"></div>
      </header>

      {/* Main Content */}
      <main className="music-main">
        {/* Jay Character Section - Optional, shows emoji if no image */}
        <section className="jay-character-section">
          <div className="jay-character-container">
            {/* If you have the image, uncomment this: */}
            {/* <img 
              src={jayCharacter} 
              alt="Jay relaxing" 
              className="jay-character-img"
            /> */}
            
            {/* Placeholder emoji if no image */}
            <div className="jay-character-placeholder">🎵</div>
            <div className="character-glow"></div>
          </div>
          <div className="character-quote">
            <p>"Music is the soundtrack to your emotions 🎶"</p>
          </div>
        </section>

        {/* Mood Selection */}
        <section className="mood-section">
          <h2 className="section-title">How are you feeling?</h2>
          <div className="mood-grid">
            {moods.map(mood => (
              <button
                key={mood.id}
                className={`mood-card ${selectedMood === mood.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedMood(mood.id);
                  setSelectedCategory("all");
                  setShowFavorites(false);
                }}
                style={{
                  "--mood-color": mood.color
                }}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <button 
              className="clear-mood-btn"
              onClick={() => setSelectedMood(null)}
            >
              Clear Selection
            </button>
          )}
        </section>

        {/* Categories */}
        <section className="category-section">
          <div className="category-scroll">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-card ${
                  (selectedCategory === cat.id && !showFavorites) ? "selected" : ""
                } ${showFavorites && cat.id === "all" ? "" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowFavorites(false);
                  setSelectedMood(null);
                }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
            <button
              className={`category-card ${showFavorites ? "selected" : ""}`}
              onClick={() => {
                setShowFavorites(true);
                setSelectedMood(null);
              }}
            >
              <span className="category-icon">❤️</span>
              <span className="category-name">Favorites</span>
            </button>
          </div>
        </section>

        {/* Recently Played */}
        {recentlyPlayed.length > 0 && !showFavorites && selectedCategory === "all" && !selectedMood && (
          <section className="recent-section">
            <h3 className="section-subtitle">🕐 Recently Played</h3>
            <div className="recent-grid">
              {recentlyPlayed.map(trackId => {
                const track = tracks.find(t => t.id === trackId);
                if (!track) return null;
                return (
                  <button
                    key={track.id}
                    className="recent-card"
                    onClick={() => playTrack(track)}
                  >
                    <span className="recent-icon">{track.icon}</span>
                    <span className="recent-title">{track.title}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommended Tracks for Mood */}
        {selectedMood && (
          <section className="tracks-section">
            <h3 className="section-subtitle">
              {moods.find(m => m.id === selectedMood)?.emoji} Recommended for {moods.find(m => m.id === selectedMood)?.label}
            </h3>
            <div className="tracks-grid">
              {getRecommendedTracks(selectedMood).map(track => (
                <div
                  key={track.id}
                  className={`track-card ${currentTrack?.id === track.id && playing ? "playing" : ""}`}
                >
                  <div className="track-icon">{track.icon}</div>
                  <div className="track-info">
                    <h4 className="track-title">{track.title}</h4>
                    <p className="track-desc">{track.description}</p>
                    <div className="track-meta">
                      <span className="track-category">{track.category}</span>
                      <span className="track-duration">{formatTime(track.duration)}</span>
                    </div>
                  </div>
                  <div className="track-actions">
                    <button
                      className="favorite-btn"
                      onClick={() => toggleFavorite(track.id)}
                    >
                      {favorites.includes(track.id) ? "❤️" : "🤍"}
                    </button>
                    <button
                      className="play-btn"
                      onClick={() => playTrack(track)}
                    >
                      {currentTrack?.id === track.id && playing ? "⏸" : "▶"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Tracks / Category Tracks / Favorites */}
        {!selectedMood && (
          <section className="tracks-section">
            <h3 className="section-subtitle">
              {showFavorites ? "❤️ Your Favorites" : selectedCategory === "all" ? "🎵 All Tracks" : `${categories.find(c => c.id === selectedCategory)?.icon} ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h3>
            {filteredTracks.length > 0 ? (
              <div className="tracks-grid">
                {filteredTracks.map(track => (
                  <div
                    key={track.id}
                    className={`track-card ${currentTrack?.id === track.id && playing ? "playing" : ""}`}
                  >
                    <div className="track-icon">{track.icon}</div>
                    <div className="track-info">
                      <h4 className="track-title">{track.title}</h4>
                      <p className="track-desc">{track.description}</p>
                      <div className="track-meta">
                        <span className="track-category">{track.category}</span>
                        <span className="track-duration">{formatTime(track.duration)}</span>
                      </div>
                    </div>
                    <div className="track-actions">
                      <button
                        className="favorite-btn"
                        onClick={() => toggleFavorite(track.id)}
                      >
                        {favorites.includes(track.id) ? "❤️" : "🤍"}
                      </button>
                      <button
                        className="play-btn"
                        onClick={() => playTrack(track)}
                      >
                        {currentTrack?.id === track.id && playing ? "⏸" : "▶"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-tracks">
                <p>🎵 No tracks found</p>
                {showFavorites && <p>Click the heart on any track to add it here!</p>}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Persistent Music Player */}
      {currentTrack && (
        <div className="music-player">
          <div className="player-content">
            <div className="player-track-info">
              <span className="player-track-icon">{currentTrack.icon}</span>
              <div className="player-track-details">
                <span className="player-track-title">{currentTrack.title}</span>
                <span className="player-track-status">
                  {playing ? "Now Playing" : "Paused"}
                </span>
              </div>
            </div>

            <div className="player-controls">
              <button className="control-btn" onClick={handlePrevious}>
                ⏮
              </button>
              <button 
                className="control-btn play-pause-btn" 
                onClick={togglePlay}
              >
                {playing ? "⏸" : "▶"}
              </button>
              <button className="control-btn" onClick={handleNext}>
                ⏭
              </button>
            </div>

            <div className="player-progress">
              <span className="time-current">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="progress-bar"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
              />
              <span className="time-total">{formatTime(duration || currentTrack.duration)}</span>
            </div>

            <div className="player-volume">
              <span>🔊</span>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
              />
            </div>

            <button
              className="player-favorite"
              onClick={() => toggleFavorite(currentTrack.id)}
            >
              {favorites.includes(currentTrack.id) ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Sleep Timer */}
          <div className="sleep-timer-section">
            {!sleepTimer ? (
              <>
                <span className="sleep-label">🌙 Sleep Timer:</span>
                <div className="sleep-options">
                  {[5, 10, 20, 30].map(mins => (
                    <button
                      key={mins}
                      className="sleep-btn"
                      onClick={() => startSleepTimer(mins)}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="sleep-active">
                <span className="sleep-label">⏰ Stops in:</span>
                <span className="sleep-time">{formatTime(sleepTimeLeft)}</span>
                <button className="sleep-cancel" onClick={cancelSleepTimer}>
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JayMusic;