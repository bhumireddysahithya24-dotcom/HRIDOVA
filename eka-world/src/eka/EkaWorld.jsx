import React, { useEffect, useMemo, useRef, useState } from "react";
import "./EkaWorld.css";

import ekaCharacter from "../assets/eka/eka-character.png";
import ekaProfile from "../assets/eka/eka-profile.png";

const sleepStories = [
  {
    title: "The Quiet Moon",
    text: "The moon rises slowly above a quiet lake. The water becomes still, and every little ripple begins to disappear. You breathe in softly. You breathe out slowly. There is nowhere you need to go. For now, you can simply rest.",
  },
  {
    title: "The Garden of Light",
    text: "Imagine a small garden glowing beneath the stars. Each flower opens gently as you breathe. One breath for the purple flowers. One breath for the golden flowers. The garden asks nothing from you. It simply waits quietly with you.",
  },
  {
    title: "The Floating Cloud",
    text: "A soft cloud carries you across a peaceful evening sky. There is no hurry. The wind is gentle. The sky is wide. You watch the world becoming quieter below, while your body becomes softer and heavier.",
  },
  {
    title: "The Golden River",
    text: "A golden river moves quietly through a sleeping forest. You sit beside it and listen. The water carries every unnecessary thought away. You do not need to hold onto anything tonight. Let the river carry it for you.",
  },
  {
    title: "The Sleeping Lotus",
    text: "A lotus rests upon calm water beneath a silver moon. Its petals slowly close as the night deepens. Your shoulders relax. Your breathing becomes gentle. Just like the lotus, you can close your eyes and allow yourself to rest.",
  },
  {
    title: "The Temple of Silence",
    text: "Far beyond the busy world stands a quiet temple surrounded by stars. Inside, there is only warmth, stillness, and peaceful light. You enter slowly. You sit down. Nothing is expected from you. You are safe to simply be.",
  },
  {
    title: "The Little Star",
    text: "A tiny star shines above you. It is not bright enough to wake you. It is just bright enough to remind you that you are not alone. Its gentle light stays with you while your thoughts become slower and quieter.",
  },
  {
    title: "The Ocean Breath",
    text: "The ocean moves in and out like a giant breath. Waves come closer and return again. You breathe with them. In and out. Slowly and softly. Every wave leaves the shore a little more peaceful.",
  },
  {
    title: "The Inner Light",
    text: "Deep inside you is a tiny peaceful light. You do not need to create it. It has always been there. Tonight, simply notice it. Let it become warm. Let it become soft. Let it gently guide you toward sleep.",
  },
  {
    title: "EKA's Night Garden",
    text: "EKA walks quietly through a garden filled with silver leaves and tiny stars. The path becomes softer with every step. The sounds of the night become distant. Soon there is only your breathing, the gentle light, and the comfort of being still.",
  },
];

const moods = [
  ["sad", "😔", "Sad"],
  ["angry", "😠", "Angry"],
  ["anxious", "😰", "Anxious"],
  ["tired", "😴", "Tired"],
  ["happy", "😊", "Happy"],
  ["bored", "😐", "Bored"],
];

const games = {
  sad: [
    [
      "Light Within",
      "Breathing",
      "Follow the glowing circle and slow your breathing.",
    ],
    [
      "Hope Quiz",
      "Quiz",
      "Answer gentle questions about hope and positive thoughts.",
    ],
    [
      "Memory of Warmth",
      "Memory",
      "Remember and match peaceful glowing symbols.",
    ],
  ],

  angry: [
    [
      "Calm the Storm",
      "Reaction",
      "Tap the calm lights and let the storm disappear.",
    ],
    [
      "Release the Sparks",
      "Tap",
      "Clear the floating energy sparks from the sky.",
    ],
    [
      "Balance",
      "Puzzle",
      "Restore balance by arranging the glowing symbols.",
    ],
  ],

  anxious: [
    [
      "Breathing Light",
      "Breathing",
      "Match your breathing with EKA's gentle light.",
    ],
    [
      "Stillness",
      "Focus",
      "Find the single peaceful symbol among the moving ones.",
    ],
    [
      "Pattern of Peace",
      "Pattern",
      "Remember and repeat a calming light pattern.",
    ],
  ],

  tired: [
    ["Moon Memory", "Memory", "Match pairs of soft moon symbols."],
    [
      "Star Count",
      "Relax",
      "Count slowly glowing stars before they disappear.",
    ],
    [
      "Dream Puzzle",
      "Puzzle",
      "Put together a peaceful dream scene.",
    ],
  ],

  happy: [
    ["Light Garden", "Garden", "Grow a tiny magical garden."],
    [
      "Joy Quiz",
      "Quiz",
      "Explore little moments that bring happiness.",
    ],
    [
      "Gratitude Match",
      "Memory",
      "Match symbols connected to gratitude.",
    ],
  ],

  bored: [
    [
      "Mystery Light",
      "Mystery",
      "Discover which hidden light opens the mystery.",
    ],
    [
      "Hidden Symbols",
      "Search",
      "Find glowing symbols hidden in the scene.",
    ],
    [
      "Wisdom Quiz",
      "Quiz",
      "Test yourself with EKA's calm wisdom questions.",
    ],
  ],
};

const musicTracks = [
  {
    title: "Inner Stillness",
    mood: "Calm",
    file: "/eka/music/inner-stillness.mp3",
  },
  {
    title: "Moonlit Water",
    mood: "Sleep",
    file: "/eka/music/moonlit-water.mp3",
  },
  {
    title: "Forest Breath",
    mood: "Nature",
    file: "/eka/music/forest-breath.mp3",
  },
  {
    title: "Golden Light",
    mood: "Meditation",
    file: "/eka/music/golden-light.mp3",
  },
  {
    title: "Quiet Sky",
    mood: "Focus",
    file: "/eka/music/quiet-sky.mp3",
  },
  {
    title: "Healing Rain",
    mood: "Emotional Relief",
    file: "/eka/music/healing-rain.mp3",
  },
  {
    title: "Ocean Breath",
    mood: "Calm",
    file: "/eka/music/ocean-breath.mp3",
  },
  {
    title: "Gentle Morning",
    mood: "Nature",
    file: "/eka/music/gentle-morning.mp3",
  },
  {
    title: "Starlight Dreams",
    mood: "Sleep",
    file: "/eka/music/starlight-dreams.mp3",
  },
  {
    title: "Peaceful Garden",
    mood: "Meditation",
    file: "/eka/music/peaceful-garden.mp3",
  },
];

function EkaWorld() {
  const [activePanel, setActivePanel] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
const [gameScore, setGameScore] = useState(0);
const [gameRound, setGameRound] = useState(0);
const [gameFinished, setGameFinished] = useState(false);
const [gameFeedback, setGameFeedback] = useState("");
const [gameTarget, setGameTarget] = useState(null);
const [gameCards, setGameCards] = useState([]);
const [gameMatched, setGameMatched] = useState([]);
const [gameFlipped, setGameFlipped] = useState([]);
const [gameSequence, setGameSequence] = useState([]);
const [gameUserSequence, setGameUserSequence] = useState([]);
const [gameOptions, setGameOptions] = useState([]);
const [gameAnswer, setGameAnswer] = useState(null);
  const [selectedStory, setSelectedStory] = useState(0);
  const [storyPlaying, setStoryPlaying] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(15);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
const [language, setLanguage] = useState("English"); 

  const [chatInput, setChatInput] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      role: "eka",
      text: "Hello. I'm EKA. ✨ Take a breath and tell me what's on your mind.",
    },
  ]);

  const [talkMessages, setTalkMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [musicMood, setMusicMood] = useState("All");
  const [musicTrack, setMusicTrack] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const [exploreMessage, setExploreMessage] = useState("");

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const chatBoxRef = useRef(null);

  const filteredTracks = useMemo(() => {
    if (musicMood === "All") return musicTracks;

    return musicTracks.filter(
      (track) => track.mood === musicMood
    );
  }, [musicMood]);

  useEffect(() => {
    document.body.classList.toggle(
      "eka-night-mode",
      nightMode
    );

    return () => {
      document.body.classList.remove("eka-night-mode");
    };
  }, [nightMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = soundEnabled ? 0.65 : 0;
    }
  }, [soundEnabled]);
  useEffect(() => {
  if (chatBoxRef.current) {
    chatBoxRef.current.scrollTop =
      chatBoxRef.current.scrollHeight;
  }
}, [chatMessages]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop?.();
      setIsSpeaking(false);
      audioRef.current?.pause?.();
      window.clearTimeout(sleepTimerRef.current);
    };
  }, []);

  const openPanel = (panel) => {
    setActivePanel(panel);

    if (panel !== "sleep") {
      window.speechSynthesis?.cancel();
      setStoryPlaying(false);
    }
  };

  const closePanel = () => {
    setActivePanel(null);

    window.speechSynthesis?.cancel();

    recognitionRef.current?.stop?.();

    setIsListening(false);
    setIsSpeaking(false);
    setStoryPlaying(false);
    setMusicPlaying(false);

    audioRef.current?.pause?.();
  };

  const handleBack = () => {
    if (activePanel) {
      closePanel();
      return;
    }

    window.history.back();
  };
  const resetEkaSettings = () => {
  setSoundEnabled(true);
  setVoiceEnabled(true);
  setAnimationsEnabled(true);
  setNightMode(false);
  setNotificationsEnabled(true);
  setLanguage("English");

  window.speechSynthesis?.cancel();
  audioRef.current?.pause?.();

  setMusicPlaying(false);
  setStoryPlaying(false);

  alert("EKA settings have been reset.");
};

  const sendChat = () => {
  const text = chatInput.trim();

  if (!text) return;

  const message = text.toLowerCase();

  let reply;

  if (
    message.includes("sad") ||
    message.includes("unhappy") ||
    message.includes("upset") ||
    message.includes("cry") ||
    message.includes("crying")
  ) {
    reply =
      "I'm sorry you're feeling this way. It's okay to have difficult moments. Take a gentle breath and be kind to yourself. I'm here with you. ✨";
  } else if (
    message.includes("angry") ||
    message.includes("mad") ||
    message.includes("frustrated") ||
    message.includes("irritated")
  ) {
    reply =
      "It's okay to feel angry. Take a slow breath and give yourself a little space. You don't have to react to everything immediately. 🌿";
  } else if (
    message.includes("anxious") ||
    message.includes("anxiety") ||
    message.includes("worried") ||
    message.includes("stress") ||
    message.includes("stressed") ||
    message.includes("panic")
  ) {
    reply =
      "Let's slow down together. Breathe in gently, and breathe out slowly. You only need to focus on this moment right now. ✨";
  } else if (
    message.includes("happy") ||
    message.includes("good") ||
    message.includes("great") ||
    message.includes("excited")
  ) {
    reply =
      "That makes me happy to hear! 💙 Hold on to this beautiful feeling and enjoy this little moment of joy.";
  } else if (
    message.includes("tired") ||
    message.includes("sleepy") ||
    message.includes("exhausted")
  ) {
    reply =
      "You sound like you need some rest. Give yourself permission to slow down. Your mind deserves a peaceful moment. 🌙";
  } else if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    reply =
      "Hello! ✨ I'm EKA. I'm happy you're here. Tell me what's on your mind.";
  } else {
    reply =
      "I hear you. ✨ Take a gentle breath and tell me a little more. I'm here to listen.";
  }

  setChatMessages((prev) => [
    ...prev,
    {
      role: "user",
      text: text,
    },
    {
      role: "eka",
      text: reply,
    },
  ]);

  setChatInput("");
};
const speakEka = (text) => {
  if (!voiceEnabled || !soundEnabled) return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 0.8;

  window.speechSynthesis.speak(utterance);
};

const createMemoryCards = () => {
  const symbols = ["🌙", "⭐", "🌸", "💎", "🦋", "✨"];
  const cards = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
    }));

  setGameCards(cards);
  setGameMatched([]);
  setGameFlipped([]);
};

const createSequence = () => {
  const colors = ["🌸", "🌊", "✨", "🌙"];
  const sequence = Array.from(
    { length: 3 },
    () => colors[Math.floor(Math.random() * colors.length)]
  );

  setGameSequence(sequence);
  setGameUserSequence([]);
};

const startGame = (name, type, description) => {
  const game = {
    name,
    type,
    description,
  };

  setSelectedGame(game);
  setGameScore(0);
  setGameRound(0);
  setGameFinished(false);
  setGameFeedback("");
  setGameAnswer(null);
  setGameMatched([]);
  setGameFlipped([]);
  setGameUserSequence([]);

  if (
    name.includes("Memory") ||
    name.includes("Match")
  ) {
    createMemoryCards();
  }

  if (
    name === "Pattern of Peace"
  ) {
    createSequence();
  }

  if (
    type === "Breathing" ||
    name === "Calm the Storm" ||
    name === "Release the Sparks" ||
    name === "Stillness" ||
    name === "Star Count" ||
    name === "Light Garden" ||
    name === "Mystery Light" ||
    name === "Hidden Symbols"
  ) {
    setGameTarget(
      Math.floor(Math.random() * 9)
    );
  }

  if (
    type === "Quiz"
  ) {
    const quizQuestions = {
      "Hope Quiz": {
        question: "What can help when a difficult moment feels heavy?",
        options: [
          "Taking one small step",
          "Giving up completely",
          "Ignoring every feeling",
        ],
        answer: 0,
      },

      "Joy Quiz": {
        question: "Which can create a small moment of joy?",
        options: [
          "A kind thought",
          "Being unkind to yourself",
          "Never resting",
        ],
        answer: 0,
      },

      "Wisdom Quiz": {
        question: "What is a gentle way to regain focus?",
        options: [
          "Pause and breathe",
          "Rush faster",
          "Avoid everything",
        ],
        answer: 0,
      },
    };

    const quiz = quizQuestions[name];

    if (quiz) {
      setGameOptions(quiz.options);
      setGameAnswer(quiz.answer);
    }
  }
};

const finishGame = (finalScore) => {
  setGameFinished(true);
  setGameScore(finalScore);
};

const handleQuizAnswer = (index) => {
  if (gameFinished) return;

  if (index === gameAnswer) {
    const newScore = gameScore + 1;
    setGameScore(newScore);
    setGameFeedback("✨ Wonderful! That's right.");

    if (gameRound >= 2) {
      finishGame(newScore);
    } else {
      setGameRound((round) => round + 1);
    }
  } else {
    setGameFeedback("🌱 That's okay. Try another one.");
  }
};

const handleTargetClick = (index) => {
  if (gameFinished) return;

  if (index === gameTarget) {
    const newScore = gameScore + 1;
    setGameScore(newScore);
    setGameFeedback("✨ You found it!");

    if (gameRound >= 4) {
      finishGame(newScore);
    } else {
      setGameRound((round) => round + 1);
      setGameTarget(Math.floor(Math.random() * 9));
    }
  } else {
    setGameFeedback("🌿 Almost. Keep looking.");
  }
};

const handleMemoryClick = (id) => {
  if (
    gameFlipped.includes(id) ||
    gameMatched.includes(id) ||
    gameFlipped.length >= 2 ||
    gameFinished
  ) {
    return;
  }

  const nextFlipped = [...gameFlipped, id];
  setGameFlipped(nextFlipped);

  if (nextFlipped.length === 2) {
    const first = gameCards.find(
      (card) => card.id === nextFlipped[0]
    );

    const second = gameCards.find(
      (card) => card.id === nextFlipped[1]
    );

    if (first?.symbol === second?.symbol) {
      const newMatched = [
        ...gameMatched,
        first.id,
        second.id,
      ];

      setGameMatched(newMatched);
      setGameFlipped([]);

      const newScore = gameScore + 1;
      setGameScore(newScore);

      if (newMatched.length === gameCards.length) {
        finishGame(newScore);
      }
    } else {
      setTimeout(() => {
        setGameFlipped([]);
      }, 700);
    }
  }
};

const handlePatternClick = (symbol) => {
  if (gameFinished) return;

  const next = [...gameUserSequence, symbol];
  setGameUserSequence(next);

  const currentIndex = next.length - 1;

  if (next[currentIndex] !== gameSequence[currentIndex]) {
    setGameFeedback("🌿 Gentle reset. Watch the pattern again.");
    setGameUserSequence([]);

    setTimeout(() => {
      createSequence();
    }, 700);

    return;
  }

  if (next.length === gameSequence.length) {
    const newScore = gameScore + 1;
    setGameScore(newScore);

    if (gameRound >= 2) {
      finishGame(newScore);
    } else {
      setGameRound((round) => round + 1);
      setGameFeedback("✨ Beautiful! Next pattern.");

      setTimeout(() => {
        createSequence();
      }, 500);
    }
  }
};

const restartGame = () => {
  if (!selectedGame) return;

  startGame(
    selectedGame.name,
    selectedGame.type,
    selectedGame.description
  );
};

const exitGame = () => {
  setSelectedGame(null);
  setGameFinished(false);
  setGameScore(0);
  setGameRound(0);
  setGameFeedback("");
};

  const speakAsEka = (text) => {
    if (
      !voiceEnabled ||
      !soundEnabled ||
      !("speechSynthesis" in window)
    ) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices?.() || [];

    const preferredVoice =
      voices.find((voice) => /en-IN/i.test(voice.lang)) ||
      voices.find((voice) => /en-GB/i.test(voice.lang)) ||
      voices.find((voice) => /en-US/i.test(voice.lang)) ||
      voices.find((voice) => /^en/i.test(voice.lang));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = preferredVoice?.lang || "en-IN";
    utterance.rate = 0.86;
    utterance.pitch = 1.02;
    utterance.volume = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };
  const getEkaVoiceReply = (text) => {
  const message = text.toLowerCase();

  if (
    message.includes("sad") ||
    message.includes("unhappy") ||
    message.includes("cry") ||
    message.includes("crying") ||
    message.includes("upset")
  ) {
    return "I'm sorry you're feeling this way. You don't have to hide your feelings from me. Take a slow breath. I'm here with you. ✨";
  }

  if (
    message.includes("angry") ||
    message.includes("mad") ||
    message.includes("frustrated") ||
    message.includes("irritated")
  ) {
    return "It's okay to feel angry. Let's slow things down together. Take one deep breath, and give yourself a little space. 🌿";
  }

  if (
    message.includes("anxious") ||
    message.includes("anxiety") ||
    message.includes("worried") ||
    message.includes("stress") ||
    message.includes("stressed") ||
    message.includes("panic")
  ) {
    return "You are safe in this moment. Breathe in slowly, and breathe out gently. You don't have to figure everything out right now. ✨";
  }

  if (
    message.includes("happy") ||
    message.includes("good") ||
    message.includes("excited") ||
    message.includes("great")
  ) {
    return "I'm happy to hear that! Hold on to this little moment of joy. You deserve to feel good. 💙";
  }

  if (
    message.includes("tired") ||
    message.includes("sleepy") ||
    message.includes("exhausted")
  ) {
    return "You sound like you could use some rest. Be gentle with yourself and give your mind a peaceful moment. 🌙";
  }

  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return "Hello! I'm EKA. ✨ I'm happy you're here. Tell me what's on your mind.";
  }

  return "I hear you. ✨ Take a gentle breath and give yourself a moment. You don't have to handle everything all at once.";
};

  const clearChat = () => {
  setChatMessages([
    {
      role: "eka",
      text: "Hello. I'm EKA. ✨ Take a breath and tell me what's on your mind.",
    },
  ]);

  setChatInput("");
};

  const startTalking = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not available in this browser. Please use Google Chrome."
      );
      return;
    }

    if (isSpeaking) {
      stopEkaSpeaking();
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim();

      if (!transcript) return;

      const reply =
        "I hear you. ✨ Take a gentle breath. You don't have to solve everything right now. I'm here with you.";

      setTalkMessages((prev) => [
        ...prev,
        { role: "user", text: transcript },
        { role: "eka", text: reply },
      ]);

      // EKA speaks the response aloud.
      speakAsEka(reply);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone permission was blocked. Please allow microphone access for this website and try again."
        );
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const chooseStory = (index) => {
    window.speechSynthesis?.cancel();

    setSelectedStory(index);
    setStoryPlaying(false);
  };

  const playStory = () => {
    const story = sleepStories[selectedStory];

    if (!story || !("speechSynthesis" in window)) {
      return;
    }

    if (storyPlaying) {
      window.speechSynthesis.pause();
      setStoryPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStoryPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(story.text);

    utterance.lang = "en-IN";
    utterance.rate = 0.7;
    utterance.pitch = 0.92;
    utterance.volume = soundEnabled ? 0.75 : 0;

    utterance.onstart = () => {
      setStoryPlaying(true);
    };

    utterance.onend = () => {
      setStoryPlaying(false);
    };

    utterance.onerror = () => {
      setStoryPlaying(false);
    };

    window.speechSynthesis.speak(utterance);

    window.clearTimeout(sleepTimerRef.current);

    sleepTimerRef.current = window.setTimeout(() => {
      window.speechSynthesis.cancel();
      setStoryPlaying(false);
    }, sleepTimer * 60 * 1000);
  };

  const changeStory = (direction) => {
    setSelectedStory(
      (current) =>
        (current + direction + sleepStories.length) %
        sleepStories.length
    );

    window.speechSynthesis?.cancel();

    setStoryPlaying(false);
  };

  const selectMusic = (track) => {
    setMusicTrack(track);

    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.src = track.file;

    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => setMusicPlaying(true))
      .catch(() => setMusicPlaying(false));
  };

  const toggleMusic = () => {
    if (!musicTrack) {
      if (filteredTracks[0]) {
        selectMusic(filteredTracks[0]);
      }

      return;
    }

    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
    }
  };

  return (
    <main
      className={`eka-world ${
        animationsEnabled ? "" : "no-animations"
      }`}
    >
      <div className="eka-stars" />

      <div className="eka-glow eka-glow-one" />
      <div className="eka-glow eka-glow-two" />

      {/* SETTINGS */}
      <button
        className="eka-settings-button"
        onClick={() => openPanel("settings")}
        title="Settings"
      >
        ⚙
        <span>Settings</span>
      </button>

      {/* WORLD TITLE */}
      <div className="eka-world-title">
        <div className="eka-title-main">
          EKA ✦
        </div>

        <div className="eka-title-sub">
          INNER LIGHT
        </div>

        <div className="eka-title-tagline">
          Pause • Breathe • Begin Again
        </div>
      </div>

      {/* NORMAL WORLD */}
      {!activePanel && (
        <>
          {/* PROFILE CARD */}
          <section className="eka-profile-card">
            <div className="eka-profile-image">
              <img
                src={ekaProfile}
                alt="EKA"
              />
            </div>

            <div className="eka-profile-info">
              <h2>EKA</h2>

              <p>
                Your Inner-Light Companion
              </p>

              <div className="eka-xp-row">
                <span className="eka-level">
                  Lv. 1
                </span>

                <div className="eka-xp-bar">
                  <div />
                </div>

                <span className="eka-xp-text">
                  210 / 500 XP
                </span>
              </div>
            </div>
          </section>

          {/* QUOTE */}
          <div className="eka-quote-card">
            <div className="eka-quote-icon">
              ✦
            </div>

            <p>
              It's okay to slow down. Your inner
              light doesn't need to hurry.
            </p>

            <span>— EKA</span>
          </div>

          {/* CHARACTER */}
          <div className="eka-character-container">
            <div className="eka-orbit orbit-one" />
            <div className="eka-orbit orbit-two" />
            <div className="eka-orbit orbit-three" />

            <div className="eka-character-glow" />

            <img
              src={ekaCharacter}
              alt="EKA"
              className="eka-character"
            />
          </div>

          {/* BOTTOM NAV */}
          <nav className="eka-bottom-nav">
            <button onClick={handleBack}>
              <span>←</span>
              <strong>Back</strong>
            </button>

            <button
              onClick={() => openPanel("talk")}
            >
              <span>🎙️</span>
              <strong>Talk</strong>
            </button>

            <button
              onClick={() => openPanel("chat")}
            >
              <span>💬</span>
              <strong>Chat</strong>
            </button>

            <button
              onClick={() => openPanel("play")}
            >
              <span>🎮</span>
              <strong>Play</strong>
            </button>

            <button
              onClick={() => openPanel("explore")}
            >
              <span>🔓</span>
              <strong>Explore & Unlock</strong>
            </button>

            <button
              onClick={() => openPanel("sleep")}
            >
              <span>🌙</span>
              <strong>Sleep</strong>
            </button>

            <button
              onClick={() => openPanel("music")}
            >
              <span>🎵</span>
              <strong>Music</strong>
            </button>
          </nav>
        </>
      )}

      {/* PANELS */}
      {activePanel && (
        <div className="eka-panel-backdrop">
          <section className="eka-panel">

            <button
              className="eka-panel-close"
              onClick={closePanel}
            >
              ×
            </button>

            {/* =========================
                TALK
            ========================= */}
            {activePanel === "talk" && (
  <div className="eka-talk-window">

    {/* TALK HEADER */}
    <div className="eka-talk-header">

      <div className="eka-talk-identity">
        <div className="eka-talk-avatar">
          <img
            src={ekaProfile}
            alt="EKA"
          />
        </div>

        <div className="eka-talk-title">
          <span>EKA</span>
          <h2>Talk with EKA</h2>
          <small>Your calm voice companion</small>
        </div>
      </div>

    </div>

    {/* STATUS */}
    <div
      className={`eka-status ${
        isListening ? "listening" : ""
      }`}
    >
      <span className="eka-status-dot">●</span>

      {isListening
        ? "EKA is listening..."
        : isSpeaking
        ? "EKA is speaking..."
        : "EKA is ready"}
    </div>

    {/* CONVERSATION AREA */}
    <div className="eka-talk-conversation">

      {talkMessages.length === 0 ? (

        <div className="eka-talk-welcome">

          <div className="eka-talk-welcome-icon">
            🎙️
          </div>

          <h3>
            Speak naturally
          </h3>

          <p>
            Talk to EKA about what's on your mind.
          </p>

          <span>
            I'm here to listen.
          </span>

        </div>

      ) : (

        <div className="eka-talk-messages">

          {talkMessages.map(
            (message, index) => (

              <div
                className={`eka-talk-message ${
                  message.role === "user"
                    ? "user"
                    : "eka"
                }`}
                key={`${message.role}-${index}`}
              >

                {message.role === "eka" && (
                  <div className="eka-message-avatar">
                    <img
                      src={ekaProfile}
                      alt="EKA"
                    />
                  </div>
                )}

                <div className="eka-message-content">

                  <small>
                    {message.role === "user"
                      ? "You"
                      : "EKA"}
                  </small>

                  <p>
                    {message.text}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

    {/* TALK ACTION */}
    <div className="eka-talk-action">

      <button
        className={`eka-talk-button ${
          isListening
            ? "listening"
            : ""
        }`}
        onClick={isSpeaking ? stopEkaSpeaking : startTalking}
      >

        <span className="eka-talk-button-icon">
          {isListening ? "🎙️" : isSpeaking ? "🔊" : "🎙️"}
        </span>

        <span>
          {isListening
            ? "Listening..."
            : isSpeaking
            ? "Stop EKA"
            : "Start Talking"}
        </span>

      </button>

      <small>
        Tap the microphone, speak naturally, and EKA will answer aloud
      </small>

    </div>

  </div>
)}

            {/* =========================
                CHAT
            ========================= */}
            {activePanel === "chat" && (
              <div className="eka-panel-content">

                <div className="eka-panel-profile">
                  <img
                    src={ekaProfile}
                    alt="EKA"
                  />

                  <div>
  <span>EKA</span>

  <h2>
    Chat with EKA
  </h2>

  <small>
    Write anything you feel
  </small>
</div>

<button
  className="eka-refresh-chat-button"
  onClick={clearChat}
  title="Refresh Chat"
>
  🔄
</button>
                </div>

                <div className="eka-chat-box"
                ref={chatBoxRef}
                >

                  {chatMessages.map(
                    (message, index) => (
                      <div
                        className={`eka-chat-row ${
                          message.role === "user"
                            ? "user"
                            : ""
                        }`}
                        key={`${message.role}-${index}`}
                      >

                        {message.role === "eka" && (
                          <img
                            src={ekaProfile}
                            alt="EKA"
                          />
                        )}

                        <div className="eka-chat-bubble">

                          <small>
                            {message.role === "user"
                              ? "You"
                              : "EKA"}
                          </small>

                          <p>
                            {message.text}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

                <div className="eka-chat-input-row">

                  <input
                    value={chatInput}
                    onChange={(event) =>
                      setChatInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                        sendChat();
                      }
                    }}
                    placeholder="Talk to EKA..."
                  />

                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim()}
                  >
                    ➤
                  </button>

                </div>

              </div>
            )}

            {/* =========================
                PLAY
            ========================= */}
            {/* =========================
    PLAY
========================= */}
{activePanel === "play" && (
  <div className="eka-panel-content">

    {!selectedGame ? (
      <>
        <h2 className="eka-panel-heading">
          Play with EKA ✨
        </h2>

        <p className="eka-panel-subtitle">
          Choose how you feel and EKA will find a game for you.
        </p>

        <div className="eka-mood-grid">

          {moods.map(([key, emoji, label]) => (
            <button
              key={key}
              className={`eka-mood-card ${
                selectedMood === key ? "selected" : ""
              }`}
              onClick={() => setSelectedMood(key)}
            >
              <span>{emoji}</span>
              <strong>{label}</strong>
            </button>
          ))}

        </div>

        {selectedMood && (
          <div className="eka-games-area">

            <h3>
              Games for {moods.find(
                ([key]) => key === selectedMood
              )?.[2]}
            </h3>

            <div className="eka-game-grid">

              {games[selectedMood].map(
                ([name, type, description]) => (

                  <button
                    className="eka-game-card"
                    key={name}
                    onClick={() =>
                      startGame(
                        name,
                        type,
                        description
                      )
                    }
                  >
                    <strong>{name}</strong>

                    <small>
                      {type}
                    </small>

                    <p>
                      {description}
                    </p>

                    <span className="eka-game-play">
                      ▶ Play
                    </span>
                  </button>

                )
              )}

            </div>

          </div>
        )}

      </>
    ) : (

      <div className="eka-active-game">

        <div className="eka-game-header">

          <button
            className="eka-game-back"
            onClick={exitGame}
          >
            ← Games
          </button>

          <div>
            <h2>
              {selectedGame.name}
            </h2>

            <small>
              Score: {gameScore}
            </small>
          </div>

        </div>

        {!gameFinished ? (
          <>

            <p className="eka-game-description">
              {selectedGame.description}
            </p>

            {/* QUIZ GAMES */}
            {selectedGame.type === "Quiz" && (
              <div className="eka-game-board quiz-board">

                <div className="eka-game-question">
                  {selectedGame.name === "Hope Quiz" &&
                    "What can help when a difficult moment feels heavy?"}

                  {selectedGame.name === "Joy Quiz" &&
                    "Which can create a small moment of joy?"}

                  {selectedGame.name === "Wisdom Quiz" &&
                    "What is a gentle way to regain focus?"}
                </div>

                <div className="eka-quiz-options">

                  {gameOptions.map((option, index) => (
                    <button
                      key={option}
                      onClick={() =>
                        handleQuizAnswer(index)
                      }
                    >
                      {option}
                    </button>
                  ))}

                </div>

              </div>
            )}

            {/* MEMORY GAMES */}
            {(selectedGame.name === "Memory of Warmth" ||
              selectedGame.name === "Moon Memory" ||
              selectedGame.name === "Gratitude Match") && (

              <div className="eka-game-board">

                <div className="eka-memory-grid">

                  {gameCards.map((card) => {

                    const visible =
                      gameFlipped.includes(card.id) ||
                      gameMatched.includes(card.id);

                    return (
                      <button
                        key={card.id}
                        className={`eka-memory-card ${
                          visible ? "visible" : ""
                        }`}
                        onClick={() =>
                          handleMemoryClick(card.id)
                        }
                      >
                        {visible ? card.symbol : "?"}
                      </button>
                    );

                  })}

                </div>

              </div>
            )}

            {/* PATTERN GAME */}
            {selectedGame.name === "Pattern of Peace" && (

              <div className="eka-game-board">

                <h3>
                  Remember the pattern
                </h3>

                <div className="eka-pattern-display">
                  {gameSequence.map(
                    (symbol, index) => (
                      <span key={index}>
                        {symbol}
                      </span>
                    )
                  )}
                </div>

                <div className="eka-pattern-buttons">

                  {["🌸", "🌊", "✨", "🌙"].map(
                    (symbol) => (
                      <button
                        key={symbol}
                        onClick={() =>
                          handlePatternClick(symbol)
                        }
                      >
                        {symbol}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* BREATHING / TARGET / SEARCH / RELAX / GARDEN */}
            {selectedGame.type !== "Quiz" &&
              selectedGame.name !== "Memory of Warmth" &&
              selectedGame.name !== "Moon Memory" &&
              selectedGame.name !== "Gratitude Match" &&
              selectedGame.name !== "Pattern of Peace" && (

              <div className="eka-game-board">

                <h3>
                  {selectedGame.name === "Light Within" &&
                    "Follow the light and breathe slowly."}

                  {selectedGame.name === "Breathing Light" &&
                    "Find the glowing light and breathe with EKA."}

                  {selectedGame.name === "Calm the Storm" &&
                    "Tap the calm light to clear the storm."}

                  {selectedGame.name === "Release the Sparks" &&
                    "Tap the energy sparks."}

                  {selectedGame.name === "Balance" &&
                    "Find the glowing symbol to restore balance."}

                  {selectedGame.name === "Stillness" &&
                    "Find the peaceful symbol."}

                  {selectedGame.name === "Star Count" &&
                    "Catch the glowing stars slowly."}

                  {selectedGame.name === "Dream Puzzle" &&
                    "Choose the peaceful dream symbol."}

                  {selectedGame.name === "Light Garden" &&
                    "Tap the light to grow your garden."}

                  {selectedGame.name === "Mystery Light" &&
                    "Find the hidden mystery light."}

                  {selectedGame.name === "Hidden Symbols" &&
                    "Find the hidden glowing symbol."}
                </h3>

                <div className="eka-target-grid">

                  {Array.from(
                    { length: 9 },
                    (_, index) => (

                      <button
                        key={index}
                        className={`eka-target ${
                          gameTarget === index
                            ? "target-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleTargetClick(index)
                        }
                      >
                        {gameTarget === index
                          ? "✨"
                          : "·"}
                      </button>

                    )
                  )}

                </div>

              </div>
            )}

            {gameFeedback && (
              <div className="eka-game-feedback">
                {gameFeedback}
              </div>
            )}

            <div className="eka-game-progress">
              Round {Math.min(gameRound + 1, 5)}
            </div>

          </>
        ) : (

          <div className="eka-game-finished">

            <div className="eka-finished-icon">
              🎉
            </div>

            <h2>
              Wonderful! ✨
            </h2>

            <p>
              You completed {selectedGame.name}.
            </p>

            <strong>
              Score: {gameScore}
            </strong>

            <div className="eka-game-finished-buttons">

              <button onClick={restartGame}>
                🔄 Play Again
              </button>

              <button onClick={exitGame}>
                🎮 Choose Another Game
              </button>

            </div>

          </div>

        )}

      </div>

    )}

  </div>
)}
            {/* =========================
                SLEEP
            ========================= */}
            {activePanel === "sleep" && (
              <div className="eka-panel-content">

                <h2 className="eka-panel-heading">
                  Sleep with EKA 🌙
                </h2>

                <p className="eka-panel-subtitle">
                  Choose a story and let your mind
                  slowly become quiet.
                </p>

                <div className="eka-story-grid">

                  {sleepStories.map(
                    (story, index) => (
                      <button
                        key={story.title}
                        className={`eka-story-card ${
                          selectedStory === index
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          chooseStory(index)
                        }
                      >
                        <span>
                          {index + 1}
                        </span>

                        <strong>
                          {story.title}
                        </strong>
                      </button>
                    )
                  )}

                </div>

                <div className="eka-story-player">

                  <small>
                    STORY {selectedStory + 1} OF{" "}
                    {sleepStories.length}
                  </small>

                  <h3>
                    {sleepStories[selectedStory].title}
                  </h3>

                  <p>
                    {sleepStories[selectedStory].text}
                  </p>

                  <div className="eka-player-controls">

                    <button
                      onClick={() =>
                        changeStory(-1)
                      }
                    >
                      ⏮
                    </button>

                    <button
                      className="eka-play-circle"
                      onClick={playStory}
                    >
                      {storyPlaying
                        ? "Ⅱ"
                        : "▶"}
                    </button>

                    <button
                      onClick={() =>
                        changeStory(1)
                      }
                    >
                      ⏭
                    </button>

                  </div>

                  <div className="eka-timer-row">

                    <span>
                      Sleep timer
                    </span>

                    <select
                      value={sleepTimer}
                      onChange={(event) =>
                        setSleepTimer(
                          Number(event.target.value)
                        )
                      }
                    >
                      <option value={15}>
                        15 min
                      </option>

                      <option value={30}>
                        30 min
                      </option>

                      <option value={45}>
                        45 min
                      </option>

                      <option value={60}>
                        60 min
                      </option>
                    </select>

                  </div>

                </div>

              </div>
            )}

            {/* =========================
                MUSIC
            ========================= */}
            {activePanel === "music" && (
              <div className="eka-panel-content">

                <h2 className="eka-panel-heading">
                  Music for your mood 🎵
                </h2>

                <p className="eka-panel-subtitle">
                  Choose a peaceful soundscape.
                </p>

                <div className="eka-music-filters">

                  {[
                    "All",
                    "Calm",
                    "Nature",
                    "Meditation",
                    "Sleep",
                    "Focus",
                    "Emotional Relief",
                  ].map((mood) => (
                    <button
                      key={mood}
                      className={
                        musicMood === mood
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setMusicMood(mood)
                      }
                    >
                      {mood}
                    </button>
                  ))}

                </div>

                <div className="eka-music-list">

                  {filteredTracks.map(
                    (track) => (
                      <button
                        key={track.title}
                        className={`eka-music-row ${
                          musicTrack?.title ===
                          track.title
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          selectMusic(track)
                        }
                      >

                        <span>🎵</span>

                        <div>
                          <strong>
                            {track.title}
                          </strong>

                          <small>
                            {track.mood}
                          </small>
                        </div>

                        <span>
                          {musicTrack?.title ===
                            track.title &&
                          musicPlaying
                            ? "Ⅱ"
                            : "▶"}
                        </span>

                      </button>
                    )
                  )}

                </div>

                <audio
                  ref={audioRef}
                  onEnded={() =>
                    setMusicPlaying(false)
                  }
                />

                <button
                  className="eka-primary-button"
                  onClick={toggleMusic}
                  disabled={!musicTrack}
                >
                  {musicPlaying
                    ? "Ⅱ Pause Music"
                    : "▶ Play Music"}
                </button>

              </div>
            )}

            {/* =========================
                EXPLORE
            ========================= */}
            {activePanel === "explore" && (
              <div className="eka-panel-content">

                <h2 className="eka-panel-heading">
                  Explore & Unlock ✨
                </h2>

                <p className="eka-panel-subtitle">
                  Discover quiet places inside EKA's
                  Inner Light world.
                </p>

                <div className="eka-explore-grid">

                  {[
                    [
                      "🌌",
                      "Star Garden",
                      "A peaceful visual space",
                    ],
                    [
                      "🪷",
                      "Lotus Space",
                      "Return to your breath",
                    ],
                    [
                      "🔮",
                      "Inner Wisdom",
                      "Unlock EKA reflections",
                    ],
                    [
                      "✨",
                      "Daily Light",
                      "Receive a new reflection",
                    ],
                  ].map(
                    ([emoji, title, description]) => (
                      <button
                        key={title}
                        onClick={() =>
                          setExploreMessage(
                            `${title}: ${description}`
                          )
                        }
                      >
                        <span>{emoji}</span>

                        <strong>
                          {title}
                        </strong>

                        <small>
                          {description}
                        </small>
                      </button>
                    )
                  )}

                </div>

                {exploreMessage && (
                  <div className="eka-game-message">
                    ✨ {exploreMessage}
                  </div>
                )}

              </div>
            )}

            {/* =========================
                SETTINGS
            ========================= */}
            {/* =========================
    SETTINGS
========================= */}
{activePanel === "settings" && (
  <div className="eka-panel-content eka-settings-panel">

    <h2 className="eka-panel-heading">
      Settings ⚙️
    </h2>

    <p className="eka-panel-subtitle">
      Personalize your EKA experience.
    </p>

    {/* SOUND & VOICE */}
    <div className="eka-settings-section">
      <h3>🔊 Sound & Voice</h3>

      <button
        className="eka-setting-item"
        onClick={() =>
          setSoundEnabled((v) => !v)
        }
      >
        <span>
          🔊 <strong>Sound</strong>
          <small>Music and world sounds</small>
        </span>

        <b className={soundEnabled ? "on" : ""}>
          {soundEnabled ? "ON" : "OFF"}
        </b>
      </button>

      <button
        className="eka-setting-item"
        onClick={() =>
          setVoiceEnabled((v) => !v)
        }
      >
        <span>
          🎙️ <strong>Voice Replies</strong>
          <small>EKA's spoken responses</small>
        </span>

        <b className={voiceEnabled ? "on" : ""}>
          {voiceEnabled ? "ON" : "OFF"}
        </b>
      </button>
    </div>

    {/* APPEARANCE */}
    <div className="eka-settings-section">
      <h3>✨ Appearance</h3>

      <button
        className="eka-setting-item"
        onClick={() =>
          setAnimationsEnabled((v) => !v)
        }
      >
        <span>
          ✨ <strong>Animations</strong>
          <small>World and character effects</small>
        </span>

        <b className={animationsEnabled ? "on" : ""}>
          {animationsEnabled ? "ON" : "OFF"}
        </b>
      </button>

      <button
        className="eka-setting-item"
        onClick={() =>
          setNightMode((v) => !v)
        }
      >
        <span>
          🌙 <strong>Night Mode</strong>
          <small>Use a darker peaceful appearance</small>
        </span>

        <b className={nightMode ? "on" : ""}>
          {nightMode ? "ON" : "OFF"}
        </b>
      </button>
    </div>

    {/* EXPERIENCE */}
    <div className="eka-settings-section">
      <h3>🌿 Experience</h3>

      <button
        className="eka-setting-item"
        onClick={() =>
          setNotificationsEnabled((v) => !v)
        }
      >
        <span>
          🔔 <strong>Notifications</strong>
          <small>Gentle reminders from EKA</small>
        </span>

        <b
          className={
            notificationsEnabled ? "on" : ""
          }
        >
          {notificationsEnabled ? "ON" : "OFF"}
        </b>
      </button>

      <div className="eka-setting-item eka-language-item">
        <span>
          🌐 <strong>Language</strong>
          <small>Choose your preferred language</small>
        </span>

        <select
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value)
          }
        >
          <option value="English">English</option>
          <option value="Telugu">తెలుగు</option>
          <option value="Hindi">हिन्दी</option>
        </select>
      </div>
    </div>

    {/* CHAT */}
    <div className="eka-settings-section">
      <h3>💬 Chat</h3>

      <button
        className="eka-setting-action"
        onClick={() => {
          setChatMessages([
            {
              role: "eka",
              text:
                "Hello. I'm EKA. ✨ Take a breath and tell me what's on your mind.",
            },
          ]);

          setChatInput("");
        }}
      >
        🧹 Clear Chat
      </button>
    </div>

    {/* RESET */}
    <div className="eka-settings-section">
      <h3>♻️ Reset</h3>

      <button
        className="eka-reset-button"
        onClick={resetEkaSettings}
      >
        Reset EKA Settings
      </button>
    </div>

    <p className="eka-settings-footer">
      EKA • Inner Light Companion ✦
    </p>

  </div>
)}

          </section>
        </div>
      )}
    </main>
  );
}

export default EkaWorld;