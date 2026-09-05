import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mayaImage from './Maya Screen World.jpeg';
import './MayaMusic.css';

const MayaMusic = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Song list - EMPTY until you add music files
  const songs = [];

  const currentSong = songs.length > 0 ? songs[currentSongIndex] : null;

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, selectedCategory]);

  // Set volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Play specific song
  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  // Next song in same category
  const handleNext = () => {
    if (songs.length === 0) return;
    
    const currentCategory = currentSong.category;
    const sameCategorySongs = songs
      .map((song, idx) => ({ ...song, originalIndex: idx }))
      .filter(song => song.category === currentCategory);
    
    const currentIndexInCategory = sameCategorySongs.findIndex(
      song => song.originalIndex === currentSongIndex
    );
    
    const nextIndexInCategory = (currentIndexInCategory + 1) % sameCategorySongs.length;
    const nextSongIndex = sameCategorySongs[nextIndexInCategory].originalIndex;
    
    setCurrentSongIndex(nextSongIndex);
    setIsPlaying(true);
  };

  // Previous song in same category
  const handlePrevious = () => {
    if (songs.length === 0) return;
    
    const currentCategory = currentSong.category;
    const sameCategorySongs = songs
      .map((song, idx) => ({ ...song, originalIndex: idx }))
      .filter(song => song.category === currentCategory);
    
    const currentIndexInCategory = sameCategorySongs.findIndex(
      song => song.originalIndex === currentSongIndex
    );
    
    const prevIndexInCategory = currentIndexInCategory === 0 
      ? sameCategorySongs.length - 1 
      : currentIndexInCategory - 1;
    
    const prevSongIndex = sameCategorySongs[prevIndexInCategory].originalIndex;
    setCurrentSongIndex(prevSongIndex);
    setIsPlaying(true);
  };

  // Seek through song
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Filter songs by category
  const filteredSongs = selectedCategory
    ? songs.filter(song => song.category === selectedCategory)
    : songs;

  // Format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="maya-music-page">
      {/* Hidden Audio Element */}
      {songs.length > 0 && currentSong && (
        <audio ref={audioRef} src={currentSong.src} />
      )}

      {/* Header */}
      <div className="music-header">
        <button className="back-button" onClick={() => navigate('/maya')}>
          ← Back to Maya
        </button>
        <h1 className="music-title">🎵 Maya's Music</h1>
        <p className="music-subtitle">Choose a little music for your moment 💗</p>
      </div>

      {/* Main Content */}
      <div className="music-content">
        {/* Maya Image Card */}
        <div className="maya-image-card">
          <img src={mayaImage} alt="Maya" className="maya-music-image" />
        </div>

        {/* Categories */}
        <div className="music-categories">
          <button
            className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          <button
            className={`category-btn ${selectedCategory === 'Relax' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Relax')}
          >
            🌸 Relax
          </button>
          <button
            className={`category-btn ${selectedCategory === 'Happy' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Happy')}
          >
            ✨ Happy
          </button>
          <button
            className={`category-btn ${selectedCategory === 'Fashion' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Fashion')}
          >
            💃 Fashion
          </button>
          <button
            className={`category-btn ${selectedCategory === 'Sleepy' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Sleepy')}
          >
            🌙 Sleepy
          </button>
        </div>
      </div>

      {/* Currently Playing Section */}
      <div className="currently-playing">
        <h2 className="playing-title">🎶 Currently Playing</h2>
        
        {songs.length === 0 ? (
          <div className="no-songs">
            <p>🎵 No songs added yet</p>
            <p className="no-songs-hint">Add MP3 files to src/assets/music/ to start listening.</p>
          </div>
        ) : currentSong ? (
          <>
            <div className="song-info">
              <h3 className="now-playing-title">{currentSong.title}</h3>
              <p className="now-playing-category">{currentSong.category}</p>
              <p className="now-playing-desc">{currentSong.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
              <input
                type="range"
                className="progress-bar"
                min="0"
                max="100"
                value={duration > 0 ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
              />
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="player-controls">
              <button className="control-btn" onClick={handlePrevious}>
                ⏮️
              </button>
              <button className="control-btn play-btn" onClick={togglePlay}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button className="control-btn" onClick={handleNext}>
                ⏭️
              </button>
            </div>

            {/* Volume Control */}
            <div className="volume-control">
              <span>🔊</span>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </div>
          </>
        ) : (
          <p className="choose-song">Choose a song to start listening.</p>
        )}
      </div>
    </div>
  );
};

export default MayaMusic;