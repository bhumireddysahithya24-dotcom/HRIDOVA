import { useEffect, useRef, useState } from "react";
import "./Music.css";

/* =====================================================
   MOODS
===================================================== */

const MOODS = [
  {
    id: "happy",
    emoji: "😊",
    name: "Happy",
    description: "Bright and cheerful sounds for your happy mood.",
  },
  {
    id: "sad",
    emoji: "😢",
    name: "Sad",
    description: "Gentle sounds to keep you company.",
  },
  {
    id: "angry",
    emoji: "😡",
    name: "Angry",
    description: "Strong nature sounds to let the energy flow away.",
  },
  {
    id: "anxious",
    emoji: "😰",
    name: "Anxious",
    description: "Peaceful sounds to help you slow down.",
  },
  {
    id: "bored",
    emoji: "😐",
    name: "Bored",
    description: "Fun nature sounds for a little adventure.",
  },
  {
    id: "tired",
    emoji: "😴",
    name: "Tired",
    description: "Soft sounds for a calm and cozy rest.",
  },
];


/* =====================================================
   YOUR 9 REAL WAV SOUNDS

   These filenames MUST exactly match the files
   inside:

   public/sounds/
===================================================== */

const SOUNDS = {

  /* ---------------- HAPPY ---------------- */

  happy: [
    {
      title: "Morning Birds",
      emoji: "🐦",
      description: "Cheerful birds singing in the morning.",
      file: "/sounds/mixkit-morning-birds-2472.wav",
    },

    {
      title: "Birds Near River",
      emoji: "🌿",
      description: "Happy birds singing beside a peaceful river.",
      file: "/sounds/mixkit-birds-chirping-near-the-river-2473.wav",
    },

    {
      title: "Flowing Water",
      emoji: "💧",
      description: "Fresh flowing water for a bright mood.",
      file: "/sounds/mixkit-water-flowing-ambience-loop-3126.wav",
    },
  ],


  /* ---------------- SAD ---------------- */

  sad: [
    {
      title: "Light Rain",
      emoji: "🌧️",
      description: "Soft rain for a quiet moment.",
      file: "/sounds/mixkit-light-rain-loop-2393.wav",
    },

    {
      title: "Heavy Rain",
      emoji: "☔",
      description: "Steady rain to sit with your feelings.",
      file: "/sounds/mixkit-heavy-rain-drops-2399.wav",
    },

    {
      title: "Flowing Water",
      emoji: "💧",
      description: "Gentle flowing water to help you feel peaceful.",
      file: "/sounds/mixkit-water-flowing-ambience-loop-3126.wav",
    },
  ],


  /* ---------------- ANGRY ---------------- */

  angry: [
    {
      title: "Rain & Thunder",
      emoji: "⛈️",
      description: "Rain and thunder for releasing big energy.",
      file: "/sounds/mixkit-rain-and-thunder-storm-2390.wav",
    },

    {
      title: "Thunder Rumble",
      emoji: "🌩️",
      description: "Deep thunder sounds as your energy settles.",
      file: "/sounds/mixkit-thunder-rumble-during-a-storm-2395.wav",
    },

    {
      title: "Forest Thunderstorm",
      emoji: "🌲",
      description: "A powerful storm moving through the forest.",
      file: "/sounds/mixkit-thunderstorm-in-the-forest-2396.wav",
    },
  ],


  /* ---------------- ANXIOUS ---------------- */

  anxious: [
    {
      title: "Gentle Rain",
      emoji: "🌧️",
      description: "Soft steady rain for a calmer moment.",
      file: "/sounds/mixkit-light-rain-loop-2393.wav",
    },

    {
      title: "Flowing Water",
      emoji: "💧",
      description: "Peaceful water flowing at a steady rhythm.",
      file: "/sounds/mixkit-water-flowing-ambience-loop-3126.wav",
    },

    {
      title: "River Birds",
      emoji: "🐦",
      description: "Birds and nature beside a peaceful river.",
      file: "/sounds/mixkit-birds-chirping-near-the-river-2473.wav",
    },
  ],


  /* ---------------- BORED ---------------- */

  bored: [
    {
      title: "Jungle Birds & Rain",
      emoji: "🌴",
      description: "A lively jungle adventure with birds and rain.",
      file: "/sounds/mixkit-rain-in-the-jungle-and-birds-2431.wav",
    },

    {
      title: "Morning Birds",
      emoji: "🐦",
      description: "Bright morning birds to wake up your mood.",
      file: "/sounds/mixkit-morning-birds-2472.wav",
    },

    {
      title: "River Adventure",
      emoji: "🏞️",
      description: "Flowing water surrounded by nature.",
      file: "/sounds/mixkit-water-flowing-ambience-loop-3126.wav",
    },
  ],


  /* ---------------- TIRED ---------------- */

  tired: [
    {
      title: "Soft Rain",
      emoji: "🌧️",
      description: "Gentle rain for a cozy rest.",
      file: "/sounds/mixkit-light-rain-loop-2393.wav",
    },

    {
      title: "Calm Water",
      emoji: "💧",
      description: "Slow flowing water for peaceful relaxation.",
      file: "/sounds/mixkit-water-flowing-ambience-loop-3126.wav",
    },

    {
      title: "Forest Thunderstorm",
      emoji: "🌲",
      description: "Distant forest storm sounds for a quiet atmosphere.",
      file: "/sounds/mixkit-thunderstorm-in-the-forest-2396.wav",
    },
  ],
};


/* =====================================================
   MOOD SELECTION PAGE
===================================================== */

function MoodSelection({ onBack, onSelect }) {
  return (
    <div className="music-page">

      <header className="music-header">

        <button
          type="button"
          className="music-back"
          onClick={onBack}
        >
          ←
        </button>

        <img
          src="/miko.png"
          alt="Miko"
        />

        <div>
          <h1>Music with Miko 🎵</h1>
          <p>How are you feeling?</p>
        </div>

      </header>


      <main className="music-content">

        <div className="music-miko">
          <img
            src="/miko.png"
            alt="Miko"
          />
        </div>

        <h2>Choose your mood</h2>

        <p className="music-subtitle">
          Miko will find nature sounds that match your mood.
        </p>


        <div className="music-mood-grid">

          {MOODS.map((mood) => (

            <button
              type="button"
              key={mood.id}
              className={`music-mood-card mood-${mood.id}`}
              onClick={() => onSelect(mood.id)}
            >

              <span>
                {mood.emoji}
              </span>

              <strong>
                {mood.name}
              </strong>

              <small>
                {mood.description}
              </small>

            </button>

          ))}

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   SOUND SELECTION PAGE
===================================================== */

function SoundSelection({
  mood,
  onBack,
  onSelect,
}) {

  const moodInfo = MOODS.find(
    (item) => item.id === mood
  );

  const sounds = SOUNDS[mood] || [];


  return (
    <div className="music-page">

      <header className="music-header">

        <button
          type="button"
          className="music-back"
          onClick={onBack}
        >
          ←
        </button>

        <img
          src="/miko.png"
          alt="Miko"
        />

        <div>

          <h1>
            {moodInfo?.emoji}{" "}
            {moodInfo?.name} Sounds
          </h1>

          <p>
            Choose a sound for your mood.
          </p>

        </div>

      </header>


      <main className="sound-content">

        <div className="selected-mood">

          <span>
            {moodInfo?.emoji}
          </span>

          <div>

            <strong>
              Nature sounds for when you're{" "}
              {moodInfo?.name?.toLowerCase()}
            </strong>

            <p>
              {moodInfo?.description}
            </p>

          </div>

        </div>


        <div className="sound-grid">

          {sounds.map((sound) => (

            <button
              type="button"
              className="sound-card"
              key={sound.title}
              onClick={() => onSelect(sound)}
            >

              <span className="sound-emoji">
                {sound.emoji}
              </span>

              <h3>
                {sound.title}
              </h3>

              <p>
                {sound.description}
              </p>

              <span className="sound-play">
                ▶ Play
              </span>

            </button>

          ))}

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   SOUND PLAYER
===================================================== */

function SoundPlayer({
  sound,
  onBack,
}) {

  const audioRef = useRef(null);

  const [playing, setPlaying] =
    useState(false);

  const [volume, setVolume] =
    useState(0.65);

  const [audioError, setAudioError] =
    useState(false);


  /* =================================================
     SET VOLUME
  ================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;

  }, [volume]);


  /* =================================================
     LOAD NEW SOUND
  ================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setPlaying(false);
    setAudioError(false);

    audio.pause();
    audio.currentTime = 0;
    audio.load();

  }, [sound]);


  /* =================================================
     AUDIO EVENTS
  ================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) {
      return;
    }


    const handleEnded = () => {
      setPlaying(false);
    };


    const handleError = () => {

      console.error(
        "Could not load audio:",
        sound.file
      );

      setPlaying(false);
      setAudioError(true);

    };


    audio.addEventListener(
      "ended",
      handleEnded
    );

    audio.addEventListener(
      "error",
      handleError
    );


    return () => {

      audio.pause();

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audio.removeEventListener(
        "error",
        handleError
      );

    };

  }, [sound]);


  /* =================================================
     PLAY / PAUSE
  ================================================= */

  const togglePlay = async () => {

    const audio = audioRef.current;

    if (!audio) {
      return;
    }


    if (playing) {

      audio.pause();

      setPlaying(false);

      return;
    }


    try {

      setAudioError(false);

      audio.volume = volume;

      await audio.play();

      setPlaying(true);

    } catch (error) {

      console.error(
        "Audio could not start:",
        error
      );

      setPlaying(false);
      setAudioError(true);

    }
  };


  /* =================================================
     BACK
  ================================================= */

  const handleBack = () => {

    const audio = audioRef.current;

    if (audio) {

      audio.pause();

      audio.currentTime = 0;

    }

    setPlaying(false);

    onBack();
  };


  /* =================================================
     RENDER PLAYER
  ================================================= */

  return (
    <div className="music-page">

      {/* HEADER */}

      <header className="music-header">

        <button
          type="button"
          className="music-back"
          onClick={handleBack}
        >
          ←
        </button>

        <img
          src="/miko.png"
          alt="Miko"
        />

        <div>

          <h1>
            Music with Miko 🎵
          </h1>

          <p>
            Nature sounds for your mood
          </p>

        </div>

      </header>


      {/* PLAYER */}

      <main className="player-content">

        <div
          className={`sound-animation ${
            playing ? "playing" : ""
          }`}
        >

          <span>
            {sound.emoji}
          </span>

        </div>


        <div className="now-playing">

          <span>
            NOW PLAYING
          </span>

          <h2>
            {sound.title}
          </h2>

          <p>
            {sound.description}
          </p>

        </div>


        {/* ACTUAL AUDIO */}

        <audio
          ref={audioRef}
          src={sound.file}
          loop
          preload="auto"
        />


        {/* PLAY BUTTON */}

        <button
          type="button"
          className={`main-play-button ${
            playing ? "playing" : ""
          }`}
          onClick={togglePlay}
          aria-label={
            playing
              ? "Pause sound"
              : "Play sound"
          }
        >
          {playing ? "⏸" : "▶"}
        </button>


        {/* STATUS */}

        <div className="player-status">

          {audioError ? (
            <span>
              ⚠️ This sound could not be loaded.
            </span>
          ) : playing ? (
            "Miko is playing your nature sound... 🎵"
          ) : (
            "Press play to listen"
          )}

        </div>


        {/* VOLUME */}

        <div className="volume-control">

          <span>
            🔈
          </span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) =>
              setVolume(
                Number(event.target.value)
              )
            }
            aria-label="Volume"
          />

          <span>
            🔊
          </span>

        </div>


        {/* ERROR HELP */}

        {audioError && (
          <div
            style={{
              marginTop: "12px",
              maxWidth: "500px",
              padding: "12px 16px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.65)",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            Check that this file exists:

            <br />

            <strong>
              {sound.file}
            </strong>
          </div>
        )}


        {/* CHOOSE ANOTHER */}

        <button
          type="button"
          className="choose-another"
          onClick={handleBack}
        >
          🎵 Choose Another Sound
        </button>

      </main>

    </div>
  );
}


/* =====================================================
   MAIN MUSIC COMPONENT
===================================================== */

export default function Music({
  onBack,
}) {

  const [stage, setStage] =
    useState("mood");

  const [mood, setMood] =
    useState(null);

  const [sound, setSound] =
    useState(null);


  /* =================================================
     SELECT MOOD
  ================================================= */

  const selectMood = (selectedMood) => {

    setMood(selectedMood);

    setStage("sounds");

  };


  /* =================================================
     SELECT SOUND
  ================================================= */

  const selectSound = (selectedSound) => {

    setSound(selectedSound);

    setStage("player");

  };


  /* =================================================
     BACK NAVIGATION
  ================================================= */

  const goBack = () => {

    if (stage === "player") {

      setSound(null);

      setStage("sounds");

      return;
    }


    if (stage === "sounds") {

      setMood(null);

      setStage("mood");

      return;
    }


    onBack();

  };


  /* =================================================
     PLAYER PAGE
  ================================================= */

  if (stage === "player") {

    return (
      <SoundPlayer
        sound={sound}
        onBack={goBack}
      />
    );

  }


  /* =================================================
     SOUND SELECTION PAGE
  ================================================= */

  if (stage === "sounds") {

    return (
      <SoundSelection
        mood={mood}
        onBack={goBack}
        onSelect={selectSound}
      />
    );

  }


  /* =================================================
     MOOD PAGE
  ================================================= */

  return (
    <MoodSelection
      onBack={onBack}
      onSelect={selectMood}
    />
  );
}