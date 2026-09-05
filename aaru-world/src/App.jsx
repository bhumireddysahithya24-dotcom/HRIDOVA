import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import {
  FaArrowLeft,
  FaMicrophone,
  FaComments,
  FaGamepad,
  FaLock,
  FaMoon,
  FaMusic,
  FaCog,
  FaLeaf,
  FaHeart,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import aaruBackground from "./assets/aaru-background.png";
import aaru from "./assets/aaru.png";
const musicFiles = import.meta.glob(
  "./assets/music/*.mp3",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function App() {
  // =====================================================
  // PANEL
  // =====================================================

  const [activePanel, setActivePanel] = useState(null);
  const [gameActive, setGameActive] =
  useState(false);

const [gameScore, setGameScore] =
  useState(0);

const [gameTime, setGameTime] =
  useState(30);

const [gameBubbles, setGameBubbles] =
  useState([]);

const [gameFinished, setGameFinished] =
  useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [gameItems, setGameItems] = useState([]);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [sleepMode, setSleepMode] = useState(false);
const [selectedStory, setSelectedStory] = useState(null);
const [isStoryPlaying, setIsStoryPlaying] = useState(false);
const [storyIndex, setStoryIndex] = useState(0);
const [sleepTimer, setSleepTimer] = useState(15);
const [currentMusic, setCurrentMusic] = useState(null);
const [isMusicPlaying, setIsMusicPlaying] = useState(false);
const [musicVolume, setMusicVolume] = useState(0.6);
const [selectedMusicMood, setSelectedMusicMood] = useState(null);
const [calmMode, setCalmMode] = useState(true);
const [soundEnabled, setSoundEnabled] = useState(true);
const [notificationsEnabled, setNotificationsEnabled] = useState(true);
const [nightMode, setNightMode] = useState(false);
const [animationsEnabled, setAnimationsEnabled] = useState(true);
const [voiceRepliesEnabled, setVoiceRepliesEnabled] = useState(true);
const [autoReadStories, setAutoReadStories] = useState(false);

const [language, setLanguage] = useState("English");
const toggleSound = () => {
  setSoundEnabled((previous) => !previous);

  if (soundEnabled) {
    window.speechSynthesis?.cancel();
    stopMusic?.();
  }
};

const toggleNightMode = () => {
  setNightMode((previous) => !previous);
};

const resetSettings = () => {
  setCalmMode(true);
  setSoundEnabled(true);
  setNotificationsEnabled(true);
  setNightMode(false);
  setAnimationsEnabled(true);
  setVoiceRepliesEnabled(true);
  setMusicVolume(0.6);
  setAutoReadStories(false);
  setLanguage("English");
};



  const openPanel = (panel) => {
    setActivePanel(panel);
  };

  const closePanel = () => {
    setActivePanel(null);
    setSelectedMood(null);
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    if (activePanel) {
      closePanel();
    } else {
      window.history.back();
    }
  };

  // =====================================================
  // CONVERSATION
  // =====================================================
const [conversationId, setConversationId] = useState(
  () => `aaru-${Date.now()}-${Math.random()}`
);
  // =====================================================
  // TALK
  // =====================================================

  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [talkReply, setTalkReply] = useState("");
  const [isAaruThinking, setIsAaruThinking] = useState(false);
  const [talkHistory, setTalkHistory] = useState([]);

  // =====================================================
  // SEND TALK TO BACKEND
  // =====================================================

  const sendTalkToAaru = async (text) => {
  if (!text || !text.trim()) return;

  const cleanText = text.trim();

  console.log("📤 Sending to Aaru:", cleanText);

  // Show the user's message immediately
  setSpokenText(cleanText);

  // Add user message to history
  setTalkHistory((previous) => [
    ...previous,
    {
      role: "user",
      text: cleanText,
    },
  ]);

  setIsAaruThinking(true);
  setTalkReply("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanText,
          conversationId,
        }),
      }
    );

    const data = await response.json();

    console.log("📥 Backend:", data);

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Aaru could not respond."
      );
    }

    const reply =
      data.reply ||
      "I'm here with you. 🌿";

    setTalkReply(reply);

    // Add Aaru response to history
    setTalkHistory((previous) => [
      ...previous,
      {
        role: "model",
        text: reply,
      },
    ]);

    setIsAaruThinking(false);

    // Speak Aaru's reply
    if (
      voiceRepliesEnabled &&
      soundEnabled &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();

      const speech =
        new SpeechSynthesisUtterance(reply);

      speech.lang = "en-IN";
      speech.rate = 0.88;
      speech.pitch = 1.02;
      speech.volume = 0.8;

      speech.onstart = () => {
        console.log("🔊 Aaru started speaking");
      };

      speech.onend = () => {
        console.log("🔊 Aaru finished speaking");

        setIsAaruThinking(false);
      };

      speech.onerror = (event) => {
        console.error(
          "🔊 Speech error:",
          event.error
        );

        setIsAaruThinking(false);
      };

      window.speechSynthesis.speak(speech);
    }

  } catch (error) {

    console.error(
      "❌ Talk error:",
      error
    );

    const fallback =
      "I'm having trouble connecting right now. 🌿 Please try again in a moment.";

    setTalkReply(fallback);

    // Show the connection message as Aaru
    setTalkHistory((previous) => [
      ...previous,
      {
        role: "model",
        text: fallback,
        error: true,
      },
    ]);

    setIsAaruThinking(false);
  }
};
  // =====================================================
  // START LISTENING
  // =====================================================

  const startListening = () => {
  console.log("🎤 TALK BUTTON CLICKED");

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech recognition is not supported. Please use Google Chrome."
    );
    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎙️ Aaru is listening...");

    setIsListening(true);
    setSpokenText("");
    setTalkReply("");
    setIsAaruThinking(false);
  };

  recognition.onresult = (event) => {
    console.log(
      "✅ SPEECH RESULT RECEIVED"
    );

    const transcript =
      event.results[0][0].transcript.trim();

    console.log(
      "🗣️ YOU SAID:",
      transcript
    );

    if (!transcript) return;

    setSpokenText(transcript);

    // Send to backend
    sendTalkToAaru(transcript);
  };

  recognition.onerror = (event) => {
    console.error(
      "❌ SPEECH ERROR:",
      event.error
    );

    setIsListening(false);
    setIsAaruThinking(false);

    if (event.error === "not-allowed") {
      alert(
        "Microphone permission was denied."
      );
    }

    if (event.error === "no-speech") {
      alert(
        "I couldn't hear you. Please speak clearly and try again."
      );
    }
  };

  recognition.onend = () => {
    console.log(
      "🎙️ Speech recognition ended"
    );

    setIsListening(false);
  };

  try {
    recognition.start();
  } catch (error) {
    console.error(
      "❌ Could not start recognition:",
      error
    );

    setIsListening(false);
  }
};
  // =====================================================
  // CHAT
  // =====================================================

  const [chatMessages, setChatMessages] =
    useState([
      {
        role: "model",
        text:
          "Hi, I'm Aaru. 🌿\nHow are you feeling today?",
      },
    ]);

  const [chatInput, setChatInput] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  // =====================================================
  // CHAT AUTO SCROLL
  // =====================================================

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages, isTyping]);

  // =====================================================
  // SEND CHAT
  // =====================================================

  const sendMessage = async () => {
    const message = chatInput.trim();

    if (!message || isTyping) return;

    setChatMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: message,
      },
    ]);

    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message,
            conversationId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Aaru could not respond."
        );
      }

      setChatMessages((previous) => [
        ...previous,
        {
          role: "model",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("❌ Chat error:", error);

      setChatMessages((previous) => [
        ...previous,
        {
          role: "model",
          text:
            "I'm having a little trouble connecting right now. 🌿 Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // =====================================================
  // CHAT ENTER
  // =====================================================

  const handleChatKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const clearChat = () => {
  window.speechSynthesis?.cancel();

  setChatMessages([
    {
      role: "model",
      text: "Hi, I'm Aaru. 🌿\nHow are you feeling today?",
    },
  ]);

  setChatInput("");
  setIsTyping(false);
  setTalkReply("");
  setSpokenText("");
  setIsAaruThinking(false);
};
const refreshChat = () => {
  // Stop Aaru speaking
  window.speechSynthesis?.cancel();

  // Create a completely new conversation
  setConversationId(
    `aaru-${Date.now()}-${Math.random()}`
  );

  // Reset chatbot to the beginning
  setChatMessages([
    {
      role: "model",
      text: "Hi, I'm Aaru. 🌿\nHow are you feeling today?",
    },
  ]);

  // Clear current input and temporary states
  setChatInput("");
  setIsTyping(false);
  setTalkReply("");
  setSpokenText("");
  setIsAaruThinking(false);
};

  // =====================================================
  // MOOD SELECTION
  // =====================================================

  const [selectedMood, setSelectedMood] =
    useState(null);


  // =====================================================
// ALL AARU GAMES
// =====================================================

const games = {
  // SAD
  rainbowPuzzle: {
    title: "Rainbow Puzzle", type: "puzzle", emoji: "🌈",
    message: "Put the rainbow pieces in the right order.",
  },
  sadMemory: {
    title: "Gentle Memory", type: "memory", emoji: "🧠",
    message: "Find the matching nature cards.",
  },
  feelingsQuiz: {
    title: "Feelings Quiz", type: "quiz", emoji: "❓",
    message: "Answer Aaru's little feelings questions.",
  },

  // ANGRY
  popAnger: {
    title: "Pop the Anger", type: "reaction", emoji: "🫧",
    message: "Pop the angry bubbles and release the energy.",
  },
  beatStorm: {
    title: "Beat the Storm", type: "rhythm", emoji: "🥁",
    message: "Repeat Aaru's rhythm.",
  },
  cooldownPuzzle: {
    title: "Cool-Down Puzzle", type: "sequence", emoji: "🧩",
    message: "Put the calming steps in the right order.",
  },

  // ANXIOUS
  bubbleBreathing: {
    title: "Bubble Breathing", type: "breathing", emoji: "🫧",
    message: "Breathe slowly with Aaru.",
  },
  patternMemory: {
    title: "Pattern Memory", type: "pattern", emoji: "🧠",
    message: "Remember the pattern and repeat it.",
  },
  findCalm: {
    title: "Find the Calm", type: "hidden", emoji: "🔎",
    message: "Find the peaceful objects.",
  },

  // TIRED
  moonlightMemory: {
    title: "Moonlight Memory", type: "memory", emoji: "🌙",
    message: "Match the peaceful night cards.",
  },
  dreamyCounting: {
    title: "Dreamy Counting", type: "counting", emoji: "🐑",
    message: "Count the sleepy sheep.",
  },
  sleepyPuzzle: {
    title: "Sleepy Puzzle", type: "puzzle", emoji: "🧩",
    message: "Complete a gentle puzzle.",
  },

  // HAPPY
  joyBalloon: {
    title: "Joy Balloon Pop", type: "reaction", emoji: "🎈",
    message: "Pop the happy balloons!",
  },
  flowerFestival: {
    title: "Flower Festival", type: "creative", emoji: "🌸",
    message: "Create a beautiful flower pattern.",
  },
  happyMemory: {
    title: "Happy Memory", type: "memory", emoji: "🧠",
    message: "Match all the happy cards.",
  },

  // BORED
  mysteryPuzzle: {
    title: "Mystery Puzzle", type: "puzzle", emoji: "🧩",
    message: "Solve Aaru's mystery puzzle.",
  },
  hiddenLeaf: {
    title: "Hidden Leaf Hunt", type: "hidden", emoji: "🔎",
    message: "Find all the hidden leaves.",
  },
  adventureQuiz: {
    title: "Aaru's Adventure Quiz", type: "quiz", emoji: "❓",
    message: "Answer the adventure questions.",
  },
};

const moodGames = {
  sad: {
    title: "😔 Gentle Games",
    message: "Let's bring a little light back. 🌿",
    games: ["rainbowPuzzle", "sadMemory", "feelingsQuiz"],
  },
  angry: {
    title: "😡 Let It Out",
    message: "Let's release that energy safely.",
    games: ["popAnger", "beatStorm", "cooldownPuzzle"],
  },
  anxious: {
    title: "😰 Calm Your Mind",
    message: "Slow down. Breathe. 🌿",
    games: ["bubbleBreathing", "patternMemory", "findCalm"],
  },
  tired: {
    title: "😴 Slow Down",
    message: "Choose something peaceful. 🌙",
    games: ["moonlightMemory", "dreamyCounting", "sleepyPuzzle"],
  },
  happy: {
    title: "😊 Have Some Fun",
    message: "Keep that happy energy going! 🌸",
    games: ["joyBalloon", "flowerFestival", "happyMemory"],
  },
  bored: {
    title: "😐 Let's Have Fun",
    message: "Aaru has a few adventures for you.",
    games: ["mysteryPuzzle", "hiddenLeaf", "adventureQuiz"],
  },
};

//=================================================
// GAME ENGINE
// =====================================================

const createGameItems = (game) => {
  if (game.type === "hidden") {
    return Array.from({ length: 6 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      x: Math.random() * 82 + 5,
      y: Math.random() * 70 + 5,
      emoji: "🍃",
      found: false,
    }));
  }

  if (game.type === "reaction") {
    return Array.from({ length: 7 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      x: Math.random() * 82 + 5,
      y: Math.random() * 70 + 5,
      emoji: gameIdUsesBalloon(game) ? "🎈" : "💢",
    }));
  }

  return [];
};

const gameIdUsesBalloon = (game) =>
  game?.title === "Joy Balloon Pop";

const createMemoryGame = () => {
  const symbols = ["🌸", "🌿", "🌈", "⭐", "🦋", "🌙"];

  setMemoryCards(
    [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
      }))
  );
  setFlippedCards([]);
  setMatchedCards([]);
};

const createPuzzleGame = () => {
  setPuzzlePieces(
    ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"]
      .sort(() => Math.random() - 0.5)
  );
};

const createCountingGame = () => {
  const count = Math.floor(Math.random() * 5) + 5;
  setGameItems(
    Array.from({ length: count }, (_, index) => ({
      id: index,
      emoji: "🐑",
    }))
  );
};

const startMoodGame = (gameId) => {
  const game = games[gameId];
  if (!game) return;

  setActiveGame(gameId);
  setGameActive(true);
  setGameFinished(false);
  setGameScore(0);
  setGameTime(60);
  setGameBubbles([]);
  setGameItems([]);

  if (game.type === "memory") createMemoryGame();
  if (game.type === "puzzle") createPuzzleGame();
  if (game.type === "counting") createCountingGame();
  if (game.type === "hidden" || game.type === "reaction") {
    setGameItems(createGameItems(game));
  }
};

const finishGame = () => {
  setGameActive(false);
  setGameFinished(true);
};

const flipMemoryCard = (id) => {
  if (
    flippedCards.length >= 2 ||
    flippedCards.includes(id) ||
    matchedCards.includes(id)
  ) return;

  const next = [...flippedCards, id];
  setFlippedCards(next);

  if (next.length === 2) {
    const first = memoryCards.find(card => card.id === next[0]);
    const second = memoryCards.find(card => card.id === next[1]);

    if (first?.symbol === second?.symbol) {
      setMatchedCards(prev => [...prev, first.id, second.id]);
      setGameScore(prev => prev + 2);
      setFlippedCards([]);

      if (matchedCards.length + 2 === memoryCards.length) {
        setTimeout(finishGame, 400);
      }
    } else {
      setTimeout(() => setFlippedCards([]), 700);
    }
  }
};

const clickReactionItem = (id) => {
  setGameScore(prev => prev + 1);
  setGameItems(prev =>
    prev.map(item =>
      item.id === id
        ? {
            ...item,
            x: Math.random() * 82 + 5,
            y: Math.random() * 70 + 5,
          }
        : item
    )
  );
};

const findHiddenItem = (id) => {
  setGameItems(prev =>
    prev.map(item =>
      item.id === id ? { ...item, found: true } : item
    )
  );
  setGameScore(prev => prev + 1);

  const remaining = gameItems.filter(item => item.id !== id && !item.found);
  if (remaining.length === 0) {
    setTimeout(finishGame, 300);
  }
};

const chooseCountingAnswer = (number) => {
  if (number === gameItems.length) {
    setGameScore(5);
    finishGame();
  } else {
    setGameScore(prev => Math.max(0, prev - 1));
  }
};

const removePuzzlePiece = (index) => {
  setPuzzlePieces(prev => {
    const next = prev.filter((_, i) => i !== index);
    if (next.length === 0) setTimeout(finishGame, 300);
    return next;
  });
  setGameScore(prev => prev + 1);
};

// Generic completion timer
useEffect(() => {
  if (!gameActive || gameFinished) return;

  if (gameTime <= 0) {
    finishGame();
    return;
  }

  const timer = setTimeout(
    () => setGameTime(previous => previous - 1),
    1000
  );

  return () => clearTimeout(timer);
}, [gameActive, gameTime, gameFinished]);

const exitGame = () => {
  setGameActive(false);
  setGameFinished(false);
  setActiveGame(null);
  setGameScore(0);
  setGameTime(60);
  setGameItems([]);
  setMemoryCards([]);
  setFlippedCards([]);
  setMatchedCards([]);
  setPuzzlePieces([]);
};

// =====================================================
  // RETURN
  // =====================================================
  const sleepStories = [
  {
    id: 1,
    emoji: "🌙",
    title: "The Little Moon Boat",
    duration: "8 min",
    description: "A tiny boat drifts across a peaceful silver lake.",
    text: `
Close your eyes.

Imagine a little wooden boat floating gently
on a quiet silver lake.

The moon is above you.

The water moves slowly.

In...

and out...

The boat rocks gently.

There is nowhere you need to go.

Nothing you need to finish.

The little boat simply floats.

A soft breeze passes by.

The moonlight dances across the water.

You feel safe.

You feel warm.

You feel peaceful.

The boat continues drifting...

slowly...

quietly...

until the whole lake becomes still.

And as the lake becomes still...

your thoughts become still too.

Rest now.

You are safe.

You can let the day go.

Good night.
    `,
  },

  {
    id: 2,
    emoji: "☁️",
    title: "The Cloud That Forgot to Hurry",
    duration: "7 min",
    description: "A soft little cloud learns that it can simply drift.",
    text: `
High above the sleeping world
lived a tiny white cloud.

Every day the cloud tried to hurry.

But tonight was different.

The sky was quiet.

The stars were bright.

So the cloud decided to stop.

It floated...

slowly...

softly...

without going anywhere.

The wind carried it gently.

The cloud did not need to hurry.

Neither do you.

You can relax your shoulders.

Relax your hands.

Relax your face.

Let yourself become as soft as a cloud.

Nothing is waiting for you tonight.

You can simply drift.

Slowly...

softly...

peacefully...

Good night.
    `,
  },

  {
    id: 3,
    emoji: "🌲",
    title: "The Whispering Forest",
    duration: "9 min",
    description: "A quiet forest settles into the peaceful sounds of night.",
    text: `
Imagine walking into a quiet forest at night.

The trees are tall.

The leaves move gently in the breeze.

You hear a soft rustling sound.

Nothing scary.

Just the forest breathing.

The branches sway slowly.

The leaves whisper...

rest...

rest...

rest...

You find a soft place beneath an old tree.

The ground feels warm.

The night air is cool.

You take a slow breath.

And let it go.

The forest continues breathing with you.

Everything is slowing down.

The birds are sleeping.

The flowers are sleeping.

The trees are resting.

And now...

you can rest too.

Close your eyes.

Breathe slowly.

Let the forest hold the quiet for you.

Good night.
    `,
  },

  {
    id: 4,
    emoji: "🌧️",
    title: "The House of Gentle Rain",
    duration: "8 min",
    description: "A cozy little house listens to the soft sound of rain.",
    text: `
There is a small warm house at the edge of a quiet village.

Inside the house is a soft bed.

Outside...

rain is falling.

Tap...

tap...

tap...

The rain is gentle.

It touches the roof.

It touches the windows.

And then it disappears into the night.

Inside, everything is warm.

A blanket rests softly around you.

The room is quiet.

You hear the rain.

Tap...

tap...

tap...

Your breathing becomes slower.

Your body becomes heavier.

The rain keeps falling.

There is nothing to do.

Nothing to worry about.

Just listen.

Tap...

tap...

tap...

Sleep can come softly now.

Good night.
    `,
  },

  {
    id: 5,
    emoji: "✨",
    title: "The Star Keeper",
    duration: "8 min",
    description: "A tiny star keeper helps the stars settle into the night.",
    text: `
Every night, a tiny star keeper walks across the sky.

She checks every little star.

One by one...

she makes sure they are comfortable.

This star is resting.

That star is glowing softly.

Another star is becoming sleepy.

The sky grows quieter.

The stars twinkle slowly.

One...

two...

three...

four...

You can imagine each star becoming softer.

Your eyes can become softer too.

Your breathing can become slower.

The night is peaceful.

The stars are resting.

And now...

you can rest with them.

There is nothing left to do tonight.

The star keeper smiles.

The sky becomes quiet.

Good night.
    `,
  },

  {
    id: 6,
    emoji: "🌸",
    title: "The Sleeping Flower Garden",
    duration: "8 min",
    description: "A peaceful garden slowly closes its flowers for the night.",
    text: `
At the edge of a peaceful village
there is a hidden flower garden.

During the day,
the flowers open toward the sun.

But now the sun has gone to sleep.

One flower closes its petals.

Then another.

Then another.

The whole garden becomes quiet.

The leaves move gently.

The flowers rest.

The grass rests.

The trees rest.

You can rest too.

Feel your body becoming comfortable.

Let your breathing slow down.

Imagine yourself lying softly among the flowers.

The garden is safe.

The night is gentle.

Everything is quiet.

The flowers are sleeping.

And you can sleep too.

Good night.
    `,
  },

  {
    id: 7,
    emoji: "🦋",
    title: "The Butterfly's Dream",
    duration: "7 min",
    description: "A little butterfly finds the perfect flower for a peaceful dream.",
    text: `
A little butterfly flies beneath the evening sky.

Its wings move slowly.

There is no hurry.

The butterfly sees a beautiful flower.

The flower is warm.

The petals are soft.

The butterfly settles gently.

Its wings become still.

The night breeze passes by.

The butterfly feels safe.

Everything is quiet.

You can imagine resting like the butterfly.

Your body can become still.

Your thoughts can become quiet.

The flower holds the butterfly gently.

The night holds you gently.

Nothing is needed now.

Just rest.

Just breathe.

Just sleep.

Good night.
    `,
  },

  {
    id: 8,
    emoji: "🌊",
    title: "The Ocean That Breathed",
    duration: "9 min",
    description: "Slow waves move in and out beneath a peaceful moon.",
    text: `
You are standing beside a quiet ocean.

The moon shines across the water.

A wave comes in...

and slowly goes out.

Another wave comes in...

and slowly goes out.

Breathe in...

and breathe out.

The ocean does not hurry.

It simply moves.

In...

and out...

In...

and out...

You can breathe with the ocean.

Your body begins to relax.

The waves become softer.

The night becomes quieter.

The moon stays above you.

The ocean keeps breathing.

And you keep resting.

In...

and out...

Good night.
    `,
  },

  {
    id: 9,
    emoji: "🕯️",
    title: "The Little Lantern",
    duration: "8 min",
    description: "A warm lantern glows quietly as a village falls asleep.",
    text: `
In a tiny peaceful village
there was one little lantern.

Every evening,
the lantern was lit.

Its warm light filled the streets.

One by one,
the windows became dark.

The houses became quiet.

The village became still.

The little lantern continued glowing.

Not brightly.

Just softly.

Its light said...

you are safe...

you can rest...

you can sleep...

Imagine that soft light around you.

Warm.

Gentle.

Quiet.

Your breathing slows.

Your body relaxes.

The lantern stays beside you.

And the night becomes peaceful.

Good night.
    `,
  },

  {
    id: 10,
    emoji: "🌿",
    title: "Aaru's Secret Garden",
    duration: "10 min",
    description: "Aaru leads you into a quiet garden hidden beneath the stars.",
    text: `
Tonight, Aaru has a secret to share.

There is a little garden
hidden behind the trees.

Aaru opens the gate.

Inside...

everything is peaceful.

Tiny flowers glow softly.

Leaves move in the breeze.

A small stream makes a gentle sound.

You walk slowly with Aaru.

There is nowhere to hurry.

You sit beneath a tree.

Aaru sits beside you.

Together, you watch the stars.

Take a slow breath.

And let it go.

The garden is quiet.

The trees are quiet.

The flowers are quiet.

Your thoughts can become quiet too.

Aaru whispers...

You have done enough for today.

You can rest now.

You are safe.

You are cared for.

Close your eyes.

Let the garden become a dream.

Good night.
    `,
  },
];

  // =====================================================
  // SLEEP STORY CONTROLS
  // =====================================================

  const startStory = (story) => {
    if (!story) return;

    window.speechSynthesis?.cancel();

    setSelectedStory(story);

    const index = sleepStories.findIndex(
      (item) => item.id === story.id
    );

    setStoryIndex(index >= 0 ? index : 0);
    setSleepMode(true);
    setIsStoryPlaying(false);
  };

  const stopStory = () => {
    window.speechSynthesis?.cancel();
    setIsStoryPlaying(false);
  };

  const playStory = () => {
    if (!selectedStory || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      selectedStory.text
    );

    speech.lang = "en-IN";
    speech.rate = 0.76;
    speech.pitch = 0.90;
    speech.volume = 0.72;

    speech.onend = () => {
      setIsStoryPlaying(false);
    };

    speech.onerror = () => {
      setIsStoryPlaying(false);
    };

    window.speechSynthesis.speak(speech);
    setIsStoryPlaying(true);
  };

  const goToStory = (nextIndex) => {
    const safeIndex =
      (nextIndex + sleepStories.length) %
      sleepStories.length;

    const story = sleepStories[safeIndex];

    window.speechSynthesis?.cancel();

    setStoryIndex(safeIndex);
    setSelectedStory(story);
    setIsStoryPlaying(false);
  };

  const nextStory = () => {
    goToStory(storyIndex + 1);
  };

  const previousStory = () => {
    goToStory(storyIndex - 1);
  };

  const closeSleepMode = () => {
    window.speechSynthesis?.cancel();
    setIsStoryPlaying(false);
    setSleepMode(false);
    setSelectedStory(null);
  };

  // Stop speech when the component unmounts.
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // =====================================================
  // MUSIC LIBRARY
  // =====================================================
  const getMusicFile = (fileName) => {
  const key = `./assets/music/${fileName}`;

  return musicFiles[key];
};

const musicTracks = [
  {
    id: 1,
    title: "Beautiful Piano",
    category: "Piano • Relaxation",
    icon: "🎹",
    file: "beautiful-piano.mp3",
    moods: ["sad", "bored"],
  },

  {
    id: 2,
    title: "Calm Acoustic",
    category: "Acoustic • Peaceful",
    icon: "🎸",
    file: "calm-acoustic.mp3",
    moods: ["sad", "happy"],
  },

  {
    id: 3,
    title: "Calm Music",
    category: "Ambient • Relaxation",
    icon: "🌿",
    file: "calm-music.mp3",
    moods: ["angry", "anxious"],
  },

  {
    id: 4,
    title: "Chill Cloudy Day",
    category: "Cloudy • Calm",
    icon: "☁️",
    file: "chill-cloudy-day.mp3",
    moods: ["tired"],
  },

  {
    id: 5,
    title: "Immediate Music",
    category: "Ambient • Focus",
    icon: "✨",
    file: "immediate-music.mp3",
    moods: ["bored"],
  },

  {
    id: 6,
    title: "Nature Forest",
    category: "Forest • Nature",
    icon: "🌲",
    file: "nature-forest.mp3",
    moods: ["angry"],
  },

  {
    id: 7,
    title: "Nature Music",
    category: "Nature • Relaxation",
    icon: "🍃",
    file: "nature-music.mp3",
    moods: ["happy", "bored"],
  },

  {
    id: 8,
    title: "Nature",
    category: "Nature • Ambient",
    icon: "🌳",
    file: "nature.mp3",
    moods: ["anxious"],
  },

  {
    id: 9,
    title: "Rainy Cafe",
    category: "Rain • Cozy",
    icon: "🌧️",
    file: "rainy-cafe.mp3",
    moods: ["anxious"],
  },

  {
    id: 10,
    title: "Sleep Music",
    category: "Sleep • Night",
    icon: "🌙",
    file: "sleep-music.mp3",
    moods: ["tired"],
  },
].map((track) => ({
  ...track,
  src: getMusicFile(track.file),
}));
const playMusic = (track) => {
  const audio = document.getElementById("aaru-music-player");

  if (!audio || !track) return;

  if (currentMusic?.id !== track.id) {
    audio.src = track.src;
    audio.volume = musicVolume;
    setCurrentMusic(track);
  }

  audio.play()
    .then(() => {
      setIsMusicPlaying(true);
    })
    .catch((error) => {
      console.error("Music playback error:", error);
    });
};

const pauseMusic = () => {
  const audio = document.getElementById("aaru-music-player");

  if (!audio) return;

  audio.pause();
  setIsMusicPlaying(false);
};

const stopMusic = () => {
  const audio = document.getElementById("aaru-music-player");

  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
  setIsMusicPlaying(false);
};

const nextMusic = () => {
  if (!currentMusic) {
    playMusic(musicTracks[0]);
    return;
  }

  const index = musicTracks.findIndex(
    (track) => track.id === currentMusic.id
  );

  const nextIndex =
    (index + 1) % musicTracks.length;

  playMusic(musicTracks[nextIndex]);
};

const previousMusic = () => {
  if (!currentMusic) {
    playMusic(musicTracks[0]);
    return;
  }

  const index = musicTracks.findIndex(
    (track) => track.id === currentMusic.id
  );

  const previousIndex =
    (index - 1 + musicTracks.length) %
    musicTracks.length;

  playMusic(musicTracks[previousIndex]);
};

const changeMusicVolume = (event) => {
  const volume = Number(event.target.value);

  setMusicVolume(volume);

  const audio = document.getElementById(
    "aaru-music-player"
  );

  if (audio) {
    audio.volume = volume;
  }
};

  return (
    <div
      className="aaru-world"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15)
          ),
          url(${aaruBackground})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      {/* =================================================
          ACTIVE GAME
      ================================================== */}

      {gameActive && activeGame && (
        <div className="pop-anger-game">

          <div className="game-header">
            <div className="game-title">
              {games[activeGame].emoji} {games[activeGame].title}
            </div>
            <div className="game-stats">
              <span>⭐ {gameScore}</span>
              <span>⏱️ {gameTime}s</span>
            </div>
          </div>

          <div className="game-message">
            <div className="aaru-game-icon">🌿</div>
            <div>
              <strong>Aaru</strong>
              <p>{games[activeGame].message}</p>
            </div>
          </div>

          {/* MEMORY */}
          {games[activeGame].type === "memory" && (
            <div className="memory-board">
              {memoryCards.map(card => {
                const visible =
                  flippedCards.includes(card.id) ||
                  matchedCards.includes(card.id);

                return (
                  <button
                    key={card.id}
                    className="memory-card"
                    onClick={() => flipMemoryCard(card.id)}
                  >
                    {visible ? card.symbol : "❔"}
                  </button>
                );
              })}
            </div>
          )}

          {/* REACTION */}
          {games[activeGame].type === "reaction" && (
            <div className="reaction-area">
              {gameItems.map(item => (
                <button
                  key={item.id}
                  className="reaction-item"
                  onClick={() => clickReactionItem(item.id)}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          )}

          {/* HIDDEN OBJECT */}
          {games[activeGame].type === "hidden" && (
            <div className="hidden-area">
              <h2>🔎 Find all the leaves!</h2>
              {gameItems.map(item =>
                !item.found && (
                  <button
                    key={item.id}
                    className="hidden-item"
                    onClick={() => findHiddenItem(item.id)}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                    }}
                  >
                    {item.emoji}
                  </button>
                )
              )}
            </div>
          )}

          {/* COUNTING */}
          {games[activeGame].type === "counting" && (
            <div className="counting-game">
              <h2>🐑 How many sheep?</h2>

              <div className="counting-items">
                {gameItems.map(item => (
                  <span key={item.id}>{item.emoji}</span>
                ))}
              </div>

              <div className="answer-buttons">
                {[5, 6, 7, 8, 9, 10].map(number => (
                  <button
                    key={number}
                    onClick={() => chooseCountingAnswer(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PUZZLE */}
          {games[activeGame].type === "puzzle" && (
            <div className="puzzle-game">
              <h2>🧩 Put the pieces together!</h2>

              <div className="puzzle-board">
                {puzzlePieces.map((piece, index) => (
                  <button
                    key={`${piece}-${index}`}
                    className="puzzle-piece"
                    onClick={() => removePuzzlePiece(index)}
                  >
                    {piece}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUIZ */}
          {games[activeGame].type === "quiz" && (
            <div className="special-game">
              <h2>❓ Aaru's Quiz</h2>
              <p>Which activity can help you feel calmer?</p>

              <div className="quiz-options">
                <button onClick={() => {
                  setGameScore(prev => prev + 3);
                  finishGame();
                }}>
                  🌿 Take slow breaths
                </button>

                <button onClick={() => setGameScore(prev => Math.max(0, prev - 1))}>
                  😤 Shout louder
                </button>

                <button onClick={() => setGameScore(prev => Math.max(0, prev - 1))}>
                  🏃 Run away
                </button>
              </div>
            </div>
          )}

          {/* BREATHING */}
          {games[activeGame].type === "breathing" && (
            <div className="breathing-game">
              <div className="breathing-circle">🌿</div>
              <h2>Breathe in... and out...</h2>

              <button
                className="panel-main-button"
                onClick={() => {
                  setGameScore(prev => prev + 1);
                  if (gameScore >= 4) finishGame();
                }}
              >
                I breathed 🌿
              </button>
            </div>
          )}

          {/* PATTERN */}
          {games[activeGame].type === "pattern" && (
            <div className="special-game">
              <h2>🧠 Pattern Memory</h2>
              <p>Remember: 🌸 → ⭐ → 🌿</p>

              <div className="quiz-options">
                <button onClick={() => {
                  setGameScore(prev => prev + 3);
                  finishGame();
                }}>
                  🌸 → ⭐ → 🌿
                </button>

                <button onClick={() => setGameScore(prev => Math.max(0, prev - 1))}>
                  ⭐ → 🌿 → 🌸
                </button>
              </div>
            </div>
          )}

          {/* RHYTHM */}
          {games[activeGame].type === "rhythm" && (
            <div className="special-game">
              <h2>🥁 Beat Aaru's Rhythm</h2>
              <p>Tap the drums in order!</p>

              <div className="quiz-options">
                {["🥁", "🥁", "🥁"].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setGameScore(prev => prev + 1);
                      if (gameScore >= 2) finishGame();
                    }}
                  >
                    {emoji} Tap
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SEQUENCE */}
          {games[activeGame].type === "sequence" && (
            <div className="special-game">
              <h2>🧩 Cool-Down Steps</h2>
              <p>Choose the calming first step.</p>

              <div className="quiz-options">
                <button onClick={() => {
                  setGameScore(prev => prev + 3);
                  finishGame();
                }}>
                  🌬️ Take a slow breath
                </button>

                <button onClick={() => setGameScore(prev => Math.max(0, prev - 1))}>
                  🔥 Get more upset
                </button>
              </div>
            </div>
          )}

          {/* CREATIVE */}
          {games[activeGame].type === "creative" && (
            <div className="special-game">
              <h2>🌸 Flower Festival</h2>
              <p>Choose flowers for your garden.</p>

              <div className="quiz-options">
                {["🌸", "🌺", "🌻", "🌷"].map(flower => (
                  <button
                    key={flower}
                    onClick={() => {
                      setGameScore(prev => prev + 1);
                      if (gameScore >= 4) finishGame();
                    }}
                  >
                    {flower}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="exit-game-button"
            onClick={exitGame}
          >
            ✕ Exit Game
          </button>

        </div>
      )}

      {/* =================================================
          GAME FINISHED
      ================================================== */}

      {gameFinished && (
        <div className="game-finished-overlay">
          <div className="game-finished-card">

            <div className="aaru-game-icon game-finished-icon">
              🌿
            </div>

            <h2>Wonderful! 🌿</h2>

            <p>
              You completed{" "}
              {games[activeGame]?.title || "the game"}!
            </p>

            <div className="final-score">
              ⭐ Score: {gameScore}
            </div>

            <button
              className="panel-main-button"
              onClick={() => {
                if (activeGame) startMoodGame(activeGame);
              }}
            >
              🔄 Play Again
            </button>

            <button
              className="exit-game-button"
              onClick={() => {
                setGameFinished(false);
                setActiveGame(null);
                setActivePanel("play");
              }}
            >
              Back to Games
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          NORMAL WORLD
      ================================================== */}

      {!gameActive && !gameFinished && (
        <>

          {/* OVERLAY */}

          <div className="world-overlay"></div>


          {/* PROFILE CARD */}

          <div className="profile-card">

            <div className="profile-image-wrapper">

              <img
                src={aaru}
                alt="Aaru"
                className="profile-image"
              />

            </div>

            <div className="profile-info">

              <h2>
                AARU
              </h2>

              <p>
                Your Calm Companion
              </p>

              <div className="xp-row">

                <span className="level">
                  Lv. 5
                </span>

                <div className="xp-bar">
                  <div className="xp-fill"></div>
                </div>

                <span className="xp-text">
                  250 / 500 XP
                </span>

              </div>

            </div>

          </div>


          {/* SETTINGS */}

          <button
            className="settings-button"
            onClick={() =>
              openPanel("settings")
            }
          >

            <FaCog />

            <span>
              Settings
            </span>

          </button>


          {/* TITLE */}

          <div className="world-title">

            <div className="title-main">

              AARU

              <FaLeaf
                className="title-leaf"
              />

            </div>

            <div className="title-sub">
              SERENE WORLD
            </div>

            <div className="title-tagline">
              Pause • Breathe • Begin Again
            </div>

            <FaHeart
              className="title-heart"
            />

          </div>


          {/* AARU CHARACTER */}

          <div className="aaru-character-container">

            <img
              src={aaru}
              alt="Aaru"
              className="aaru-character"
            />

          </div>


          {/* QUOTE */}

          <div className="quote-card">

            <FaLeaf
              className="quote-leaf"
            />

            <p>
              It's okay
              <br />
              to take a break.
              <br />
              You matter too.
            </p>

            <FaHeart
              className="quote-heart"
            />

          </div>


          {/* BOTTOM NAV */}

          <div className="bottom-nav">

            <button
              className="nav-btn back-btn"
              onClick={handleBack}
            >
              <FaArrowLeft />

              <span>
                Back
              </span>
            </button>


            <button
              className="nav-btn talk-btn"
              onClick={() =>
                openPanel("talk")
              }
            >
              <FaMicrophone />

              <span>
                Talk
              </span>
            </button>


            <button
              className="nav-btn chat-btn"
              onClick={() =>
                openPanel("chat")
              }
            >
              <FaComments />

              <span>
                Chat
              </span>
            </button>


            <button
              className="nav-btn play-btn"
              onClick={() =>
                openPanel("play")
              }
            >
              <FaGamepad />

              <span>
                Play
              </span>
            </button>


            <button
              className="nav-btn explore-btn"
              onClick={() =>
                openPanel("explore")
              }
            >
              <FaLock />

              <span>
                Explore &
                <br />
                Unlock
              </span>

            </button>


            <button
              className="nav-btn sleep-btn"
              onClick={() =>
                openPanel("sleep")
              }
            >
              <FaMoon />

              <span>
                Sleep
              </span>

            </button>


            <button
              className="nav-btn music-btn"
              onClick={() =>
                openPanel("music")
              }
            >
              <FaMusic />

              <span>
                Music
              </span>

            </button>

          </div>


          {/* =================================================
              PANEL
          ================================================== */}

          {activePanel && (

            <div
              className="panel-backdrop"
              onClick={closePanel}
            >

              <div
                className={
                  activePanel === "chat"
                    ? "action-panel chat-action-panel"
                    : "action-panel"
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                {/* CLOSE */}

                <button
                  className="close-panel"
                  onClick={closePanel}
                >
                  <FaTimes />
                </button>


                {/* =================================================
                    SETTINGS
                ================================================== */}

                {activePanel === "settings" && (
  <div className="settings-panel">

    <div className="settings-heading">

      <div className="settings-main-icon">
        ⚙️
      </div>

      <div>
        <h2>
          Settings
        </h2>

        <p>
          Make your Aaru world feel right for you.
        </p>
      </div>

    </div>


    {/* =========================
        EXPERIENCE
    ========================= */}

    <div className="settings-section-title">
      🌿 Experience
    </div>


    <div className="settings-option">

      <div className="settings-option-left">

        <div className="settings-option-icon">
          🌿
        </div>

        <div>
          <strong>
            Calm Mode
          </strong>

          <small>
            Keep the world soft and peaceful
          </small>
        </div>

      </div>

      <button
        className={
          calmMode
            ? "settings-toggle on"
            : "settings-toggle"
        }
        onClick={() =>
          setCalmMode((previous) => !previous)
        }
        aria-label="Toggle Calm Mode"
      >
        <span></span>
      </button>

    </div>


    <div className="settings-option">

      <div className="settings-option-left">

        <div className="settings-option-icon">
          ✨
        </div>

        <div>
          <strong>
            Animations
          </strong>

          <small>
            Enable gentle visual movement
          </small>
        </div>

      </div>

      <button
        className={
          animationsEnabled
            ? "settings-toggle on"
            : "settings-toggle"
        }
        onClick={() =>
          setAnimationsEnabled(
            (previous) => !previous
          )
        }
        aria-label="Toggle animations"
      >
        <span></span>
      </button>

    </div>


    <div className="settings-option">

      <div className="settings-option-left">

        <div className="settings-option-icon">
          🌙
        </div>

        <div>
          <strong>
            Night Mode
          </strong>

          <small>
            Use a darker relaxing atmosphere
          </small>
        </div>

      </div>

      <button
        className={
          nightMode
            ? "settings-toggle on"
            : "settings-toggle"
        }
        onClick={toggleNightMode}
        aria-label="Toggle night mode"
      >
        <span></span>
      </button>

    </div>


    {/* =========================
        SOUND
    ========================= */}

    <div className="settings-section-title">
      🔊 Sound
    </div>


    <div className="settings-option">

      <div className="settings-option-left">

        <div className="settings-option-icon">
          🔊
        </div>

        <div>
          <strong>
            Sound
          </strong>

          <small>
            Allow music and audio
          </small>
        </div>

      </div>

      <button
        className={
          soundEnabled
            ? "settings-toggle on"
            : "settings-toggle"
        }
        onClick={toggleSound}
        aria-label="Toggle sound"
      >
        <span></span>
      </button>

    </div>


    <div className="settings-volume">

      <div className="settings-volume-header">

        <span>
          🎵 Music Volume
        </span>

        <span>
          {Math.round(
            musicVolume * 100
          )}%
        </span>

      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={musicVolume}
        onChange={(event) => {

          const value =
            Number(event.target.value);

          setMusicVolume(value);

          const audio =
            document.getElementById(
              "aaru-music-player"
            );

          if (audio) {
            audio.volume = value;
          }

        }}
      />

    </div>


    {/* =========================
        AARU VOICE
    ========================= */}

    <div className="settings-section-title">
      🌿 Aaru
    </div>


    <div className="settings-option">

      <div className="settings-option-left">

        <div className="settings-option-icon">
          🎙️
        </div>

        <div>
          <strong>
            Voice Replies
          </strong>

          <small>
            Let Aaru speak her replies
          </small>
        </div>

      </div>

      <button
        className={
          voiceRepliesEnabled
            ? "settings-toggle on"
            : "settings-toggle"
        }
        onClick={() =>
          setVoiceRepliesEnabled(
            (previous) => !previous
          )
        }
        aria-label="Toggle voice replies"
      >
        <span></span>
      </button>

    </div>


    <div className="settings-option">

      <div className="settings-option-left">

        <div className="settings-option-icon">
          📖
        </div>

        <div>
          <strong>
            Auto Read Stories
          </strong>

          <small>
            Start sleep-story narration automatically
          </small>
        </div>

      </div>

      <button
        className={
          autoReadStories
            ? "settings-toggle on"
            : "settings-toggle"
        }
        onClick={() =>
          setAutoReadStories(
            (previous) => !previous
          )
        }
        aria-label="Toggle automatic story narration"
      >
        <span></span>
      </button>

    </div>


    {/* =========================
        NOTIFICATIONS
    ========================= */}

    <div className="settings-section-title">
      🔔 Notifications
    </div>


    <div className="settings-option">

      <div className="settings-option-left">

        <div className="settings-option-icon">
          🔔
        </div>

        <div>
          <strong>
            Notifications
          </strong>

          <small>
            Gentle reminders from Aaru
          </small>
        </div>

      </div>

      <button
        className={
          notificationsEnabled
            ? "settings-toggle on"
            : "settings-toggle"
        }
        onClick={() =>
          setNotificationsEnabled(
            (previous) => !previous
          )
        }
        aria-label="Toggle notifications"
      >
        <span></span>
      </button>

    </div>


    {/* =========================
        LANGUAGE
    ========================= */}

    <div className="settings-section-title">
      🌐 Language
    </div>


    <div className="settings-language">

      <label>
        Aaru's language
      </label>

      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value)
        }
      >

        <option value="English">
          English
        </option>

        <option value="Telugu">
          తెలుగు
        </option>

        <option value="Hindi">
          हिन्दी
        </option>

      </select>

    </div>


    {/* =========================
        RESET
    ========================= */}

    <button
      className="settings-reset"
      onClick={resetSettings}
    >
      ♻️ Reset Preferences
    </button>

  </div>
)}


                {/* =================================================
                    TALK
                ================================================== */}

{activePanel === "talk" && (
  <div className="talk-screen">

    {/* HEADER */}

    <div className="talk-header">

      <div className="profile-image-wrapper talk-profile-avatar">
  <img
    src={aaru}
    alt="Aaru"
    className="profile-image"
  />

</div>

      <div className="talk-header-text">

        <h2>
          Talk with Aaru
        </h2>

        <p>
          Your calm voice companion 🌿
        </p>

      </div>

    </div>


    {/* STATUS */}

    <div
      className={
        isListening
          ? "talk-status listening"
          : isAaruThinking
          ? "talk-status thinking"
          : "talk-status"
      }
    >

      <span className="status-dot"></span>

      {isListening
        ? "Aaru is listening..."
        : isAaruThinking
        ? "Aaru is thinking..."
        : "Aaru is ready"}

    </div>


    {/* CONVERSATION */}

    <div className="talk-conversation">

      {talkHistory.length === 0 && (
        <div className="talk-welcome">

          <div className="talk-welcome-avatar">
            🌿
          </div>

          <h3>
            Hi, I'm Aaru 🌿
          </h3>

          <p>
            Press the microphone and
            tell me what's on your mind.
          </p>

        </div>
      )}


      {talkHistory.map(
        (message, index) => (

          <div
            key={index}
            className={
              message.role === "user"
                ? "talk-message user-talk-message"
                : "talk-message aaru-talk-message"
            }
          >

            {message.role === "model" && (
              <div className="talk-message-avatar">

                <img
                  src={aaru}
                  alt="Aaru"
                />

              </div>
            )}


            <div
              className={
                message.error
                  ? "talk-message-bubble error-bubble"
                  : "talk-message-bubble"
              }
            >

              <small>
                {message.role === "user"
                  ? "You"
                  : "Aaru"}
              </small>

              <p>
                {message.text}
              </p>

            </div>

          </div>

        )
      )}


      {isAaruThinking && (
        <div className="talk-message aaru-talk-message">

          <div className="talk-message-avatar">

            <img
              src={aaru}
              alt="Aaru"
            />

          </div>

          <div className="talk-message-bubble">

            <small>
              Aaru
            </small>

            <div className="talk-typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        </div>
      )}

    </div>


    {/* SPEAKING STATUS */}

    {talkReply &&
      !isAaruThinking &&
      !isListening && (

        <div className="talk-speaking-status">

          <span>
            🔊
          </span>

          Aaru has replied

          {voiceRepliesEnabled &&
            soundEnabled &&
            "speechSynthesis" in window
            ? " • Voice response enabled"
            : " • Voice response off"}

        </div>
      )}


    {/* MICROPHONE BUTTON */}

    <button
      className={
        isListening
          ? "talk-mic-button listening"
          : "talk-mic-button"
      }
      onClick={startListening}
      disabled={isListening || isAaruThinking}
    >

      <FaMicrophone />

      <span>
        {isListening
          ? "Listening..."
          : isAaruThinking
          ? "Aaru is thinking..."
          : "Start Talking"}
      </span>

    </button>


    {/* HELPER TEXT */}

    <p className="talk-helper-text">

      {isListening
        ? "Speak naturally. Aaru is listening."
        : "Tap the microphone whenever you're ready."}

    </p>


    {/* NEW CONVERSATION */}

    {talkHistory.length > 0 && (

      <button
        className="talk-new-button"
        onClick={() => {

          window.speechSynthesis?.cancel();

          setTalkHistory([]);
          setSpokenText("");
          setTalkReply("");
          setIsListening(false);
          setIsAaruThinking(false);

          setConversationId(
            `aaru-${Date.now()}-${Math.random()}`
          );

        }}
      >
        ↻ Start Fresh
      </button>

    )}

  </div>
)}

  {/* =================================================
  CHAT
  ================================================== */}

  {activePanel ===
                  "chat" && (

                  <div className="real-chat">

                    <div className="real-chat-header">

  <div className="real-chat-avatar emoji-aaru-avatar">
    🌿
  </div>

  <div className="real-chat-title">

    <h2>
      Aaru
    </h2>

    <span>
      Your Calm Companion 🌿
    </span>

  </div>

  <div className="chat-header-actions">

    <button
      className="refresh-chat-button"
      onClick={refreshChat}
      title="Start a new chat"
      aria-label="Start a new chat"
    >
      ↻
    </button>

    <button
      className="clear-chat-button"
      onClick={clearChat}
      title="Clear chat"
      aria-label="Clear chat"
    >
      <FaTrash />
    </button>

  </div>

</div>


                    <div className="real-chat-messages">

                      {chatMessages.map(
                        (
                          message,
                          index
                        ) => (

                          <div
                            key={index}
                            className={`chat-message ${
                              message.role ===
                              "user"
                                ? "user-message"
                                : "aaru-message"
                            }`}
                          >

                            {message.role ===
                              "model" && (

                              <div className="message-avatar aaru-avatar">
                                  <img
                                    src={aaru}
                                    alt="Aaru"
                                  />
                                </div>

                            )}

                            <div className="message-bubble">

                              {message.text
                                .split("\n")
                                .map(
                                  (
                                    line,
                                    lineIndex
                                  ) => (

                                    <React.Fragment
                                      key={
                                        lineIndex
                                      }
                                    >

                                      {line}

                                      {lineIndex <
                                        message.text.split(
                                          "\n"
                                        ).length -
                                          1 && (
                                        <br />
                                      )}

                                    </React.Fragment>

                                  )
                                )}

                            </div>

                          </div>

                        )
                      )}


                      {isTyping && (

                        <div className="chat-message aaru-message">

                          <div className="message-avatar aaru-avatar">
                            <img
                              src={aaru}
                              alt="Aaru"
                            />
                          </div>
                          <div className="typing-bubble">

                            <span></span>
                            <span></span>
                            <span></span>

                          </div>

                        </div>

                      )}

                      <div
                        ref={chatEndRef}
                      />

                    </div>


                    <div className="real-chat-input">

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(event) =>
                          setChatInput(
                            event.target.value
                          )
                        }
                        onKeyDown={
                          handleChatKeyDown
                        }
                        placeholder="Talk to Aaru..."
                        disabled={
                          isTyping
                        }
                      />

                      <button
                        className="chat-send-button"
                        onClick={
                          sendMessage
                        }
                        disabled={
                          !chatInput.trim() ||
                          isTyping
                        }
                      >
                        <FaComments />
                      </button>

                    </div>

                    <div className="chat-hint">
                      Press Enter to send
                    </div>

                  </div>

                )}


                {/* =================================================
                    PLAY
                ================================================== */}

                {activePanel === "play" && (
                  <div className="play-section">

                    {!selectedMood ? (
                      <>
                        <FaGamepad className="panel-icon play-icon" />

                        <h2>Play with Aaru 🌿</h2>

                        <p>
                          How are you feeling right now?
                          <br />
                          Choose your mood and I'll find
                          something nice for you to play.
                        </p>

                        <div className="mood-grid">

                          <button className="mood-card" onClick={() => setSelectedMood("sad")}>
                            <span className="mood-emoji">😔</span>
                            <span>Sad</span>
                          </button>

                          <button className="mood-card" onClick={() => setSelectedMood("angry")}>
                            <span className="mood-emoji">😡</span>
                            <span>Angry</span>
                          </button>

                          <button className="mood-card" onClick={() => setSelectedMood("anxious")}>
                            <span className="mood-emoji">😰</span>
                            <span>Anxious</span>
                          </button>

                          <button className="mood-card" onClick={() => setSelectedMood("tired")}>
                            <span className="mood-emoji">😴</span>
                            <span>Tired</span>
                          </button>

                          <button className="mood-card" onClick={() => setSelectedMood("happy")}>
                            <span className="mood-emoji">😊</span>
                            <span>Happy</span>
                          </button>

                          <button className="mood-card" onClick={() => setSelectedMood("bored")}>
                            <span className="mood-emoji">😐</span>
                            <span>Bored</span>
                          </button>

                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          className="mood-back-button"
                          onClick={() => setSelectedMood(null)}
                        >
                          ← Back to moods
                        </button>

                        <h2>{moodGames[selectedMood]?.title}</h2>

                        <p>{moodGames[selectedMood]?.message}</p>

                        <div className="game-options">
                          {moodGames[selectedMood]?.games.map((gameId) => {
                            const game = games[gameId];

                            return (
                              <button
                                key={gameId}
                                onClick={() => startMoodGame(gameId)}
                              >
                                {game.emoji} {game.title}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                  </div>
                )}

                {/* =================================================
                    EXPLORE
                ================================================== */}

                {activePanel ===
                  "explore" && (
                  <>

                    <FaLock
                      className="panel-icon explore-icon"
                    />

                    <h2>
                      Explore & Unlock
                    </h2>

                    <p>
                      Discover new experiences,
                      activities and special areas
                      inside Aaru's world.
                    </p>

                    <div className="unlock-card">

                      <strong>
                        Level 6
                      </strong>

                      <span>
                        New world activity
                        coming soon
                      </span>

                    </div>

                  </>
                )}


                {/* =================================================
                    SLEEP
                ================================================== */}

                {activePanel === "sleep" && (
                  <div className="sleep-library">

                    {!sleepMode ? (
                      <>
                        <FaMoon className="panel-icon sleep-icon" />

                        <h2>
                          Sleep with Aaru 🌙
                        </h2>

                        <p>
                          Choose a peaceful bedtime story
                          and let Aaru gently guide you
                          into the night.
                        </p>

                        <div className="sleep-story-list">
                          {sleepStories.map((story) => (
                            <button
                              key={story.id}
                              className="sleep-story-card"
                              onClick={() => startStory(story)}
                            >
                              <div className="story-icon">
                                {story.emoji}
                              </div>

                              <div className="story-info">
                                <strong>{story.title}</strong>

                                <span>
                                  {story.description}
                                </span>

                                <small>
                                  🌙 {story.duration}
                                </small>
                              </div>

                              <div className="story-arrow">
                                ›
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="sleep-player">

                        <div className="sleep-player-top">
                          <button
                            className="sleep-player-back"
                            onClick={closeSleepMode}
                          >
                            ← Stories
                          </button>

                          <span>🌙 Sleep Mode</span>
                        </div>

                        <div className="sleep-story-visual">
                          <div className="sleep-story-moon">
                            {selectedStory?.emoji || "🌙"}
                          </div>

                          <div className="sleep-story-stars">
                            ✦ &nbsp; ✧ &nbsp; ✦
                            <br />
                            &nbsp; ✧ &nbsp; ✦
                          </div>
                        </div>

                        <h2>
                          {selectedStory?.title || "Bedtime Story"}
                        </h2>

                        <p className="sleep-player-description">
                          {selectedStory?.description}
                        </p>

                        <div className="sleep-player-aaru">

                          <div className="aaru-game-icon">
                            🌿
                          </div>

                          <div>
                            <strong>Aaru</strong>

                            <p>
                              Close your eyes, breathe slowly,
                              and just listen.
                            </p>
                          </div>

                        </div>

                        <div className="sleep-controls">

                          <button
                            onClick={previousStory}
                            aria-label="Previous story"
                          >
                            ⏮
                          </button>

                          <button
                            className="sleep-play-button"
                            onClick={
                              isStoryPlaying
                                ? stopStory
                                : playStory
                            }
                            aria-label={
                              isStoryPlaying
                                ? "Pause story"
                                : "Play story"
                            }
                          >
                            {isStoryPlaying ? "⏸" : "▶"}
                          </button>

                          <button
                            onClick={nextStory}
                            aria-label="Next story"
                          >
                            ⏭
                          </button>

                        </div>

                        <div className="sleep-timer-selector">
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
                            <option value={5}>
                              5 minutes
                            </option>

                            <option value={15}>
                              15 minutes
                            </option>

                            <option value={30}>
                              30 minutes
                            </option>

                            <option value={45}>
                              45 minutes
                            </option>

                            <option value={60}>
                              60 minutes
                            </option>
                          </select>
                        </div>

                        <div className="sleep-volume-note">
                          🔊 Gentle narration • Slow pace • Low volume
                        </div>

                        <button
                          className="sleep-stop-button"
                          onClick={closeSleepMode}
                        >
                          ✕ End Sleep Session
                        </button>

                      </div>
                    )}

                  </div>
                )}

                {/* =================================================
                    MUSIC
                ================================================== */}

{activePanel === "music" && (
  <div className="aaru-music-library">

    {!selectedMusicMood ? (

      <>
        <div className="music-library-header">

          <div className="music-main-icon">
            🎵
          </div>

          <div>
            <h2>
              Aaru's Music
            </h2>

            <p>
              Choose music that matches how
              you feel right now.
            </p>
          </div>

        </div>


        <div className="music-mood-heading">
          How are you feeling? 🌿
        </div>


        <div className="music-mood-grid">

          <button
            onClick={() =>
              setSelectedMusicMood("sad")
            }
          >
            <span>😔</span>
            <strong>Sad</strong>
            <small>Gentle & comforting</small>
          </button>


          <button
            onClick={() =>
              setSelectedMusicMood("angry")
            }
          >
            <span>😡</span>
            <strong>Angry</strong>
            <small>Release & reset</small>
          </button>


          <button
            onClick={() =>
              setSelectedMusicMood("anxious")
            }
          >
            <span>😰</span>
            <strong>Anxious</strong>
            <small>Calm & breathe</small>
          </button>


          <button
            onClick={() =>
              setSelectedMusicMood("tired")
            }
          >
            <span>😴</span>
            <strong>Tired</strong>
            <small>Slow & sleepy</small>
          </button>


          <button
            onClick={() =>
              setSelectedMusicMood("happy")
            }
          >
            <span>😊</span>
            <strong>Happy</strong>
            <small>Light & peaceful</small>
          </button>


          <button
            onClick={() =>
              setSelectedMusicMood("bored")
            }
          >
            <span>😐</span>
            <strong>Bored</strong>
            <small>Explore & unwind</small>
          </button>

        </div>

      </>

    ) : (

      <>
        <button
          className="music-mood-back"
          onClick={() =>
            setSelectedMusicMood(null)
          }
        >
          ← Change Mood
        </button>


        <div className="music-selected-mood">

          <span>
            {selectedMusicMood === "sad" && "😔"}
            {selectedMusicMood === "angry" && "😡"}
            {selectedMusicMood === "anxious" && "😰"}
            {selectedMusicMood === "tired" && "😴"}
            {selectedMusicMood === "happy" && "😊"}
            {selectedMusicMood === "bored" && "😐"}
          </span>

          <div>
            <h2>
              {selectedMusicMood === "sad" &&
                "Music for a Gentle Heart"}

              {selectedMusicMood === "angry" &&
                "Music to Cool Down"}

              {selectedMusicMood === "anxious" &&
                "Music to Find Your Calm"}

              {selectedMusicMood === "tired" &&
                "Music to Slow Down"}

              {selectedMusicMood === "happy" &&
                "Music to Keep You Smiling"}

              {selectedMusicMood === "bored" &&
                "Music to Explore"}
            </h2>

            <p>
              Aaru picked these for you. 🌿
            </p>
          </div>

        </div>


        {currentMusic && (

          <div className="current-music-card">

            <div className="current-music-icon">
              {currentMusic.icon}
            </div>

            <div className="current-music-info">

              <strong>
                {currentMusic.title}
              </strong>

              <span>
                {currentMusic.category}
              </span>

            </div>

          </div>

        )}


        <audio
          id="aaru-music-player"
          onPlay={() =>
            setIsMusicPlaying(true)
          }
          onPause={() =>
            setIsMusicPlaying(false)
          }
          onEnded={nextMusic}
        />


        <div className="music-player-controls">

          <button onClick={previousMusic}>
            ⏮
          </button>

          <button
            className="main-music-button"
            onClick={() => {

              if (!currentMusic) {

                const firstTrack =
                  musicTracks.find(track =>
                    track.moods.includes(
                      selectedMusicMood
                    )
                  );

                if (firstTrack) {
                  playMusic(firstTrack);
                }

              } else if (isMusicPlaying) {

                pauseMusic();

              } else {

                playMusic(currentMusic);

              }

            }}
          >
            {isMusicPlaying ? "⏸" : "▶"}
          </button>

          <button onClick={nextMusic}>
            ⏭
          </button>

          <button onClick={stopMusic}>
            ⏹
          </button>

        </div>


        <div className="music-volume">

          <span>🔈</span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={changeMusicVolume}
          />

          <span>🔊</span>

        </div>


        <div className="music-track-list">

          {musicTracks
            .filter(track =>
              track.moods.includes(
                selectedMusicMood
              )
            )
            .map(track => (

              <button
                key={track.id}
                className={
                  currentMusic?.id === track.id
                    ? "music-track active"
                    : "music-track"
                }
                onClick={() =>
                  playMusic(track)
                }
              >

                <div className="music-track-icon">
                  {track.icon}
                </div>

                <div className="music-track-info">

                  <strong>
                    {track.title}
                  </strong>

                  <span>
                    {track.category}
                  </span>

                </div>

                <div className="music-track-play">

                  {currentMusic?.id === track.id &&
                  isMusicPlaying
                    ? "🔊"
                    : "▶"}

                </div>

              </button>

            ))}

        </div>

      </>

    )}

  </div>
)}

              </div>

            </div>

          )}

        </>
      )}

    </div>
  );
}

export default App;