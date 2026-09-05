import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MayaSettings.css';

// Import Maya image
import mayaImage from "../assets/worlds/Maya World.jpeg";

const MayaSettings = () => {
  const navigate = useNavigate();
  
  // Settings state
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(70);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState('normal');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [bedtimeReminder, setBedtimeReminder] = useState(false);
  const [bedtimeTime, setBedtimeTime] = useState('21:00');
  const [imageError, setImageError] = useState(false);
  
  // Modals
  const [showClearChatModal, setShowClearChatModal] = useState(false);
  const [showResetSettingsModal, setShowResetSettingsModal] = useState(false);
  const [showResetProgressModal, setShowResetProgressModal] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const storedMusic = localStorage.getItem('mayaMusicEnabled');
      const storedVolume = localStorage.getItem('mayaMusicVolume');
      const storedVoice = localStorage.getItem('mayaVoiceEnabled');
      const storedSpeed = localStorage.getItem('mayaVoiceSpeed');
      const storedAnimations = localStorage.getItem('mayaAnimationsEnabled');
      const storedNight = localStorage.getItem('mayaNightMode');
      const storedBedtime = localStorage.getItem('mayaBedtimeReminder');
      const storedBedtimeTime = localStorage.getItem('mayaBedtimeTime');

      if (storedMusic !== null) setMusicEnabled(storedMusic === 'true');
      if (storedVolume !== null) setMusicVolume(parseInt(storedVolume, 10));
      if (storedVoice !== null) setVoiceEnabled(storedVoice === 'true');
      if (storedSpeed !== null) setVoiceSpeed(storedSpeed);
      if (storedAnimations !== null) setAnimationsEnabled(storedAnimations === 'true');
      if (storedNight !== null) setNightMode(storedNight === 'true');
      if (storedBedtime !== null) setBedtimeReminder(storedBedtime === 'true');
      if (storedBedtimeTime !== null) setBedtimeTime(storedBedtimeTime);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings to localStorage
  const saveSetting = (key, value) => {
    try {
      localStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleBack = () => {
    navigate('/maya');
  };

  const handleMusicToggle = () => {
    const newValue = !musicEnabled;
    setMusicEnabled(newValue);
    saveSetting('mayaMusicEnabled', newValue);
  };

  const handleVolumeChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setMusicVolume(newValue);
    saveSetting('mayaMusicVolume', newValue);
  };

  const handleVoiceToggle = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    saveSetting('mayaVoiceEnabled', newValue);
  };

  const handleVoiceSpeedChange = (speed) => {
    setVoiceSpeed(speed);
    saveSetting('mayaVoiceSpeed', speed);
  };

  const handleAnimationsToggle = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    saveSetting('mayaAnimationsEnabled', newValue);
  };

  const handleNightModeToggle = () => {
    const newValue = !nightMode;
    setNightMode(newValue);
    saveSetting('mayaNightMode', newValue);
  };

  const handleBedtimeReminderToggle = () => {
    const newValue = !bedtimeReminder;
    setBedtimeReminder(newValue);
    saveSetting('mayaBedtimeReminder', newValue);
  };

  const handleBedtimeTimeChange = (e) => {
    const newValue = e.target.value;
    setBedtimeTime(newValue);
    saveSetting('mayaBedtimeTime', newValue);
  };

  const handleClearChatHistory = () => {
    try {
      // Clear chat-related localStorage
      localStorage.removeItem('mayaChatHistory');
      localStorage.removeItem('mayaTalkHistory');
      setShowClearChatModal(false);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleResetSettings = () => {
    try {
      // Reset all settings to defaults
      setMusicEnabled(true);
      setMusicVolume(70);
      setVoiceEnabled(true);
      setVoiceSpeed('normal');
      setAnimationsEnabled(true);
      setNightMode(false);
      setBedtimeReminder(false);
      setBedtimeTime('21:00');

      // Save defaults
      saveSetting('mayaMusicEnabled', true);
      saveSetting('mayaMusicVolume', 70);
      saveSetting('mayaVoiceEnabled', true);
      saveSetting('mayaVoiceSpeed', 'normal');
      saveSetting('mayaAnimationsEnabled', true);
      saveSetting('mayaNightMode', false);
      saveSetting('mayaBedtimeReminder', false);
      saveSetting('mayaBedtimeTime', '21:00');

      setShowResetSettingsModal(false);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  const handleResetProgress = () => {
    try {
      // Reset progress-related localStorage
      localStorage.removeItem('mayaLevel');
      localStorage.removeItem('mayaXP');
      localStorage.removeItem('mayaStoriesListened');
      localStorage.removeItem('mayaGamesPlayed');
      localStorage.removeItem('mayaSleepHistory');
      setShowResetProgressModal(false);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const getVoiceSpeedLabel = () => {
    switch (voiceSpeed) {
      case 'slow': return '🐢 Slow';
      case 'normal': return '🙂 Normal';
      case 'fast': return '⚡ Fast';
      default: return '🙂 Normal';
    }
  };

  const getVoiceSpeedValue = () => {
    switch (voiceSpeed) {
      case 'slow': return 0.8;
      case 'normal': return 1.0;
      case 'fast': return 1.15;
      default: return 1.0;
    }
  };

  // Mock progress data
  const mayaLevel = 5;
  const mayaXP = 250;
  const mayaXPMax = 500;
  const storiesListened = 12;
  const gamesPlayed = 8;

  return (
    <div className={`maya-settings-page ${nightMode ? 'night-mode' : ''} ${!animationsEnabled ? 'no-animations' : ''}`}>
      {/* Back Button */}
      <button className="settings-back" onClick={handleBack}>
        ← Back to Maya
      </button>

      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">⚙️ Maya Settings</h1>
        <p className="settings-subtitle">Make Maya's world feel just right for you. 💗</p>
      </div>

      {/* Maya Message */}
      <div className="maya-message-card">
        {!imageError && (
          <img 
            src={mayaImage} 
            alt="Maya" 
            className="maya-message-image"
            onError={() => setImageError(true)}
          />
        )}
        <p>"Hi! 💗 You can change my settings anytime."</p>
      </div>

      {/* Settings Grid */}
      <div className="settings-grid">
        {/* Music Section */}
        <div className="settings-card">
          <h2 className="card-title">🎵 Music</h2>
          <p className="card-description">Control Maya's background music.</p>
          
          <div className="setting-row">
            <label>Music</label>
            <button 
              className={`toggle-btn ${musicEnabled ? 'active' : ''}`}
              onClick={handleMusicToggle}
            >
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="setting-row">
            <label>🔊 Music Volume</label>
            <div className="volume-slider-container">
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="100"
                value={musicVolume}
                onChange={handleVolumeChange}
              />
              <span className="volume-value">{musicVolume}%</span>
            </div>
          </div>
        </div>

        {/* Voice Section */}
        <div className="settings-card">
          <h2 className="card-title">🎙️ Maya Voice</h2>
          <p className="card-description">Allow Maya to speak responses and stories.</p>
          
          <div className="setting-row">
            <label>Voice</label>
            <button 
              className={`toggle-btn ${voiceEnabled ? 'active' : ''}`}
              onClick={handleVoiceToggle}
            >
              {voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="setting-row">
            <label>🗣️ Voice Speed</label>
            <div className="speed-selector">
              <button 
                className={`speed-btn ${voiceSpeed === 'slow' ? 'active' : ''}`}
                onClick={() => handleVoiceSpeedChange('slow')}
              >
                🐢 Slow
              </button>
              <button 
                className={`speed-btn ${voiceSpeed === 'normal' ? 'active' : ''}`}
                onClick={() => handleVoiceSpeedChange('normal')}
              >
                🙂 Normal
              </button>
              <button 
                className={`speed-btn ${voiceSpeed === 'fast' ? 'active' : ''}`}
                onClick={() => handleVoiceSpeedChange('fast')}
              >
                ⚡ Fast
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="settings-card">
          <h2 className="card-title">✨ Appearance</h2>
          <p className="card-description">Enable Maya's magical visual effects.</p>
          
          <div className="setting-row">
            <label>Animations</label>
            <button 
              className={`toggle-btn ${animationsEnabled ? 'active' : ''}`}
              onClick={handleAnimationsToggle}
            >
              {animationsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="setting-row">
            <label>🌙 Night Mode</label>
            <button 
              className={`toggle-btn ${nightMode ? 'active' : ''}`}
              onClick={handleNightModeToggle}
            >
              {nightMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Bedtime Section */}
        <div className="settings-card">
          <h2 className="card-title">🔔 Bedtime Reminder</h2>
          <p className="card-description">Set your bedtime preference.</p>
          
          <div className="setting-row">
            <label>Reminder</label>
            <button 
              className={`toggle-btn ${bedtimeReminder ? 'active' : ''}`}
              onClick={handleBedtimeReminderToggle}
            >
              {bedtimeReminder ? 'ON' : 'OFF'}
            </button>
          </div>

          {bedtimeReminder && (
            <div className="setting-row">
              <label>Bedtime</label>
              <input
                type="time"
                className="time-input"
                value={bedtimeTime}
                onChange={handleBedtimeTimeChange}
              />
            </div>
          )}

          {bedtimeReminder && (
            <p className="bedtime-saved">Your bedtime preference is saved. 🌙</p>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="settings-card progress-card">
        <h2 className="card-title">💾 My Progress</h2>
        
        <div className="progress-grid">
          <div className="progress-item">
            <span className="progress-label">Maya Level</span>
            <span className="progress-value">Level {mayaLevel}</span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Current XP</span>
            <span className="progress-value">{mayaXP} / {mayaXPMax}</span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Stories Listened</span>
            <span className="progress-value">{storiesListened}</span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Games Played</span>
            <span className="progress-value">{gamesPlayed}</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${(mayaXP / mayaXPMax) * 100}%` }}></div>
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-card data-card">
        <h2 className="card-title">🧹 Clear Chat History</h2>
        <p className="card-description">Remove your saved Maya chat messages.</p>
        <button 
          className="action-btn clear-btn"
          onClick={() => setShowClearChatModal(true)}
        >
          Clear Chat History
        </button>
      </div>

      <div className="settings-card data-card">
        <h2 className="card-title">🔄 Reset Settings</h2>
        <p className="card-description">Restore Maya's settings to their defaults.</p>
        <button 
          className="action-btn reset-btn"
          onClick={() => setShowResetSettingsModal(true)}
        >
          Reset Settings
        </button>
      </div>

      {/* Danger Zone */}
      <div className="settings-card danger-card">
        <h2 className="card-title">⚠️ Reset Maya Progress</h2>
        <p className="card-description">This will reset Maya's saved progress and unlock-related progress.</p>
        <button 
          className="action-btn danger-btn"
          onClick={() => setShowResetProgressModal(true)}
        >
          Reset Progress
        </button>
      </div>

      {/* Modals */}
      {showClearChatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure?</h3>
            <p>This will clear all your saved Maya chat messages.</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel-btn" onClick={() => setShowClearChatModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm-btn" onClick={handleClearChatHistory}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Settings?</h3>
            <p>This will restore all Maya settings to their default values.</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel-btn" onClick={() => setShowResetSettingsModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm-btn" onClick={handleResetSettings}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetProgressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Reset Progress?</h3>
            <p>Are you sure? This will reset your Maya progress.</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel-btn" onClick={() => setShowResetProgressModal(false)}>
                Cancel
              </button>
              <button className="modal-btn danger-btn" onClick={handleResetProgress}>
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Stars */}
      <div className="settings-stars">
        <div className="star star1">✨</div>
        <div className="star star2">✨</div>
        <div className="star star3">✨</div>
      </div>
    </div>
  );
};

export default MayaSettings;