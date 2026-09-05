// MayaPlay.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./MayaPlay.css";

// -----------------------------
// Game Data: 5 moods, 3 games each
// -----------------------------

const MOODS = {
  joy: {
    id: "joy",
    label: "Joy",
    emoji: "😊",
    theme: "joy",
    description: "Uplifting, rewarding games that boost positive mood.",
    games: [
      {
        id: "star-catcher",
        title: "Star Catcher",
        short: "Catch stars before time runs out!",
      },
      {
        id: "memory-flip",
        title: "Memory Flip",
        short: "Find all matching pairs of cards.",
      },
      {
        id: "balloon-pop",
        title: "Balloon Pop Party",
        short: "Pop balloons as they float up!",
      },
    ],
  },
  sadness: {
    id: "sadness",
    label: "Sadness",
    emoji: "😢",
    theme: "sadness",
    description: "Gentle, reflective games that honor and process sadness.",
    games: [
      {
        id: "raindrop-catch",
        title: "Raindrop Catch",
        short: "Catch sunny drops, avoid storm drops.",
      },
      {
        id: "build-rainbow",
        title: "Build the Rainbow",
        short: "Arrange colors in rainbow order.",
      },
      {
        id: "light-stars",
        title: "Light the Stars",
        short: "Click stars in the right sequence.",
      },
    ],
  },
  anger: {
    id: "anger",
    label: "Anger",
    emoji: "😡",
    theme: "anger",
    description: "Cathartic, high-energy games to channel frustration.",
    games: [
      {
        id: "anger-bubbles",
        title: "Pop the Anger Bubbles",
        short: "Pop red bubbles as fast as you can.",
      },
      {
        id: "cool-volcano",
        title: "Cool the Volcano",
        short: "Click water drops to cool the volcano.",
      },
      {
        id: "smash-targets",
        title: "Smash the Targets",
        short: "Tap targets quickly, avoid negatives.",
      },
    ],
  },
  fear: {
    id: "fear",
    label: "Fear",
    emoji: "😨",
    theme: "fear",
    description: "Calming or brave games for anxiety and fear.",
    games: [
      {
        id: "brave-path",
        title: "Brave Path",
        short: "Find the safe path using clues.",
      },
      {
        id: "monster-maze",
        title: "Monster Maze",
        short: "Reach the exit, avoid obstacles.",
      },
      {
        id: "courage-shield",
        title: "Courage Shield",
        short: "Block incoming objects with your shield.",
      },
    ],
  },
  confused: {
    id: "confused",
    label: "Confused",
    emoji: "😵",
    theme: "confused",
    description: "Clarity-building puzzle games to sharpen thinking.",
    games: [
      {
        id: "quick-sort",
        title: "Quick Sort",
        short: "Sort objects into the right categories.",
      },
      {
        id: "pattern-detective",
        title: "Pattern Detective",
        short: "Guess what comes next in the pattern.",
      },
      {
        id: "puzzle-room",
        title: "Escape the Puzzle Room",
        short: "Solve puzzles in order to escape.",
      },
    ],
  },
};

// Flatten for easy lookup
const GAME_REGISTRY = {};
Object.values(MOODS).forEach((mood) => {
  mood.games.forEach((g) => {
    GAME_REGISTRY[g.id] = { ...g, moodId: mood.id };
  });
});

// -----------------------------
// Utility hooks
// -----------------------------

function useInterval(callback, delay, active = true) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active || delay == null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay, active]);
}

// -----------------------------
// Individual Game Components
// -----------------------------

// 1. Star Catcher (Joy)
function StarCatcherGame({ onBack }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stars, setStars] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef(null);

  const spawnStar = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = Math.random() * (rect.width - 40);
    const y = Math.random() * (rect.height - 40);
    setStars((prev) => [...prev, { id, x, y }]);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    if (stars.length < 5) {
      const t = setTimeout(spawnStar, 400);
      return () => clearTimeout(t);
    }
  }, [started, gameOver, stars.length, spawnStar]);

  useInterval(
    () => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    },
    1000,
    started && !gameOver
  );

  const handleStarClick = (id) => {
    if (!started || gameOver) return;
    setScore((s) => s + 1);
    setStars((prev) => prev.filter((st) => st.id !== id));
  };

  const restart = () => {
    setStarted(false);
    setScore(0);
    setTimeLeft(30);
    setStars([]);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>⭐ Star Catcher</h2>
        <p>Catch as many stars as possible before time runs out!</p>
      </div>

      {!started && !gameOver && (
        <div className="game-start-screen">
          <div className="game-stats">
            <div>Score: 0</div>
            <div>Time: 30s</div>
          </div>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      )}

      {(started || gameOver) && (
        <>
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div ref={containerRef} className="game-area star-catcher-area">
            {started &&
              !gameOver &&
              stars.map((s) => (
                <button
                  key={s.id}
                  className="star-item"
                  style={{ left: s.x, top: s.y }}
                  onClick={() => handleStarClick(s.id)}
                  aria-label="Star"
                >
                  ⭐
                </button>
              ))}
          </div>

          {gameOver && (
            <div className="game-over-screen">
              <h3>🎉 Time’s Up!</h3>
              <p>Final Score: {score}</p>
              <div className="game-actions">
                <button className="btn-primary" onClick={restart}>
                  Play Again
                </button>
                <button className="btn-secondary" onClick={onBack}>
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 2. Memory Flip (Joy)
function MemoryFlipGame({ onBack }) {
  const baseCards = [
    { id: "a", symbol: "🍎" },
    { id: "b", symbol: "🍌" },
    { id: "c", symbol: "🍇" },
    { id: "d", symbol: "🍉" },
    { id: "e", symbol: "🍒" },
    { id: "f", symbol: "🍓" },
  ];
  const initialCards = [...baseCards, ...baseCards]
    .map((c, i) => ({ ...c, uid: i, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);

  const [cards, setCards] = useState(initialCards);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (cards.every((c) => c.matched) && cards.length > 0) {
      setWon(true);
    }
  }, [cards]);

  const handleCardClick = (uid) => {
    if (locked || won) return;
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map((c) =>
      c.uid === uid ? { ...c, flipped: true } : c
    );
    setCards(newCards);
    const newSelected = [...selected, card];

    if (newSelected.length === 1) {
      setSelected(newSelected);
      return;
    }

    setLocked(true);
    setMoves((m) => m + 1);
    const [first, second] = newSelected;

    if (first.id === second.id) {
      // match
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first.id && !c.matched ? { ...c, matched: true } : c
          )
        );
        setSelected([]);
        setLocked(false);
      }, 600);
    } else {
      // no match
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.uid === first.uid || c.uid === second.uid
              ? { ...c, flipped: false }
              : c
          )
        );
        setSelected([]);
        setLocked(false);
      }, 800);
    }
  };

  const restart = () => {
    const shuffled = [...baseCards, ...baseCards]
      .map((c, i) => ({ ...c, uid: i, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelected([]);
    setMoves(0);
    setWon(false);
    setLocked(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🃏 Memory Flip</h2>
        <p>Find all matching pairs of cards.</p>
      </div>

      {!won ? (
        <>
          <div className="game-stats">
            <div>Moves: {moves}</div>
            <div>Pairs left: {cards.filter((c) => !c.matched).length / 2}</div>
          </div>
          <div className="game-area memory-area">
            {cards.map((c) => (
              <button
                key={c.uid}
                className={`memory-card ${c.flipped || c.matched ? "flipped" : ""}`}
                onClick={() => handleCardClick(c.uid)}
                disabled={c.matched}
                aria-label="Memory card"
              >
                <span className="memory-inner">
                  <span className="memory-front">?</span>
                  <span className="memory-back">{c.symbol}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : (
        <div className="game-over-screen">
          <h3>🎉 You Won!</h3>
          <p>Moves: {moves}</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Balloon Pop Party (Joy)
function BalloonPopGame({ onBack }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [balloons, setBalloons] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef(null);

  const spawnBalloon = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = Math.random() * (rect.width - 50);
    const y = rect.height + 10;
    const speed = 1 + Math.random() * 1.5;
    const points = Math.random() > 0.8 ? 3 : 1; // some are bonus
    const color = points === 3 ? "#f59e0b" : "#38bdf8";
    setBalloons((prev) => [...prev, { id, x, y, speed, points, color }]);
  }, []);

  useInterval(
    () => {
      if (!started || gameOver) return;
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -60)
      );
      if (Math.random() < 0.4) spawnBalloon();
    },
    50,
    started && !gameOver
  );

  useInterval(
    () => {
      if (!started || gameOver) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    },
    1000,
    started && !gameOver
  );

  const popBalloon = (id, points) => {
    if (!started || gameOver) return;
    setScore((s) => s + points);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  const restart = () => {
    setStarted(false);
    setScore(0);
    setTimeLeft(30);
    setBalloons([]);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎈 Balloon Pop Party</h2>
        <p>Pop balloons as they float up! Gold balloons = 3 points.</p>
      </div>

      {!started && !gameOver && (
        <div className="game-start-screen">
          <div className="game-stats">
            <div>Score: 0</div>
            <div>Time: 30s</div>
          </div>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      )}

      {(started || gameOver) && (
        <>
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div ref={containerRef} className="game-area balloon-area">
            {started &&
              !gameOver &&
              balloons.map((b) => (
                <button
                  key={b.id}
                  className="balloon-item"
                  style={{
                    left: b.x,
                    bottom: b.y,
                    backgroundColor: b.color,
                  }}
                  onClick={() => popBalloon(b.id, b.points)}
                  aria-label="Balloon"
                />
              ))}
          </div>

          {gameOver && (
            <div className="game-over-screen">
              <h3>🎉 Time’s Up!</h3>
              <p>Final Score: {score}</p>
              <div className="game-actions">
                <button className="btn-primary" onClick={restart}>
                  Play Again
                </button>
                <button className="btn-secondary" onClick={onBack}>
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 4. Raindrop Catch (Sadness)
function RaindropCatchGame({ onBack }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(40);
  const [drops, setDrops] = useState([]);
  const [basketX, setBasketX] = useState(50); // percent
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef(null);

  const spawnDrop = useCallback(() => {
    if (!containerRef.current) return;
    const id = Date.now() + Math.random();
    const x = Math.random() * 90; // percent
    const type = Math.random() > 0.3 ? "sun" : "storm";
    setDrops((prev) => [...prev, { id, x, y: -10, type }]);
  }, []);

  useInterval(
    () => {
      if (!started || gameOver) return;
      setDrops((prev) =>
        prev
          .map((d) => ({ ...d, y: d.y + 1.2 }))
          .filter((d) => d.y < 110)
      );
      if (Math.random() < 0.35) spawnDrop();
    },
    40,
    started && !gameOver
  );

  useInterval(
    () => {
      if (!started || gameOver) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    },
    1000,
    started && !gameOver
  );

  // Check collisions
  useEffect(() => {
    if (!started || gameOver) return;
    const caught = [];
    drops.forEach((d) => {
      if (d.y >= 80 && d.y <= 95) {
        const dx = Math.abs(d.x - basketX);
        if (dx < 12) {
          caught.push(d);
          if (d.type === "sun") setScore((s) => s + 1);
          else {
            setLives((l) => {
              const newL = l - 1;
              if (newL <= 0) setGameOver(true);
              return newL;
            });
          }
        }
      }
    });
    if (caught.length) {
      setDrops((prev) => prev.filter((d) => !caught.some((c) => c.id === d.id)));
    }
  }, [drops, basketX, started, gameOver]);

  const handleMoveLeft = () => setBasketX((x) => Math.max(5, x - 8));
  const handleMoveRight = () => setBasketX((x) => Math.min(95, x + 8));

  const restart = () => {
    setStarted(false);
    setScore(0);
    setLives(3);
    setTimeLeft(40);
    setDrops([]);
    setBasketX(50);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🌧️ Raindrop Catch</h2>
        <p>Move the basket to catch sunny drops, avoid storm drops.</p>
      </div>

      {!started && !gameOver && (
        <div className="game-start-screen">
          <div className="game-stats">
            <div>Score: 0</div>
            <div>Lives: 3</div>
            <div>Time: 40s</div>
          </div>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      )}

      {(started || gameOver) && (
        <>
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Lives: {lives}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div ref={containerRef} className="game-area rain-area">
            {drops.map((d) => (
              <div
                key={d.id}
                className={`drop-item ${d.type === "sun" ? "sun-drop" : "storm-drop"}`}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
              >
                {d.type === "sun" ? "☀️" : "⛈️"}
              </div>
            ))}
            <div
              className="basket"
              style={{ left: `${basketX}%` }}
              aria-label="Basket"
            >
              🧺
            </div>

            <div className="touch-controls">
              <button className="btn-control" onClick={handleMoveLeft}>
                ◀
              </button>
              <button className="btn-control" onClick={handleMoveRight}>
                ▶
              </button>
            </div>
          </div>

          {gameOver && (
            <div className="game-over-screen">
              <h3>{lives <= 0 ? "💔 Game Over" : "🎉 Time’s Up!"}</h3>
              <p>Final Score: {score}</p>
              <div className="game-actions">
                <button className="btn-primary" onClick={restart}>
                  Play Again
                </button>
                <button className="btn-secondary" onClick={onBack}>
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 5. Build the Rainbow (Sadness)
function BuildRainbowGame({ onBack }) {
  const correctOrder = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  const colors = [
    { id: "red", label: "Red", color: "#ef4444" },
    { id: "orange", label: "Orange", color: "#f97316" },
    { id: "yellow", label: "Yellow", color: "#facc15" },
    { id: "green", label: "Green", color: "#22c55e" },
    { id: "blue", label: "Blue", color: "#3b82f6" },
    { id: "indigo", label: "Indigo", color: "#6366f1" },
    { id: "violet", label: "Violet", color: "#a855f7" },
  ];

  const [available, setAvailable] = useState(() =>
    [...colors].sort(() => Math.random() - 0.5)
  );
  const [placed, setPlaced] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [won, setWon] = useState(false);

  const handlePlace = (color) => {
    if (won) return;
    const nextIndex = placed.length;
    const expected = correctOrder[nextIndex];
    if (color.id === expected) {
      const newPlaced = [...placed, color];
      setPlaced(newPlaced);
      setAvailable((prev) => prev.filter((c) => c.id !== color.id));
      if (newPlaced.length === correctOrder.length) {
        setWon(true);
      }
    } else {
      setWrong((w) => w + 1);
    }
  };

  const restart = () => {
    setAvailable([...colors].sort(() => Math.random() - 0.5));
    setPlaced([]);
    setWrong(0);
    setWon(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🌈 Build the Rainbow</h2>
        <p>Place colors in correct rainbow order: Red → Violet.</p>
      </div>

      {!won ? (
        <>
          <div className="game-stats">
            <div>Wrong tries: {wrong}</div>
            <div>Placed: {placed.length} / 7</div>
          </div>

          <div className="game-area rainbow-area">
            <div className="rainbow-slots">
              {correctOrder.map((id, idx) => {
                const placedColor = placed[idx];
                return (
                  <div
                    key={id}
                    className={`rainbow-slot ${placedColor ? "filled" : ""}`}
                    style={
                      placedColor ? { backgroundColor: placedColor.color } : {}
                    }
                  >
                    {placedColor ? placedColor.label : `Slot ${idx + 1}`}
                  </div>
                );
              })}
            </div>

            <div className="color-pieces">
              {available.map((c) => (
                <button
                  key={c.id}
                  className="color-piece"
                  style={{ backgroundColor: c.color }}
                  onClick={() => handlePlace(c)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : (
        <div className="game-over-screen">
          <h3>🎉 Rainbow Complete!</h3>
          <p>Wrong tries: {wrong}</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. Light the Stars (Sadness)
function LightStarsGame({ onBack }) {
  // Sequence game: show pattern, user repeats
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [showing, setShowing] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [highlight, setHighlight] = useState(null);

  const stars = [0, 1, 2, 3, 4]; // 5 stars

  const generateSequence = (len) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 5));

  const startLevel = useCallback(
    (lvl) => {
      const seq = generateSequence(lvl + 2);
      setSequence(seq);
      setUserSeq([]);
      setShowing(true);
      setWon(false);
      setLost(false);

      // show sequence
      let i = 0;
      const interval = setInterval(() => {
        setHighlight(seq[i]);
        i++;
        if (i >= seq.length) {
          clearInterval(interval);
          setTimeout(() => {
            setHighlight(null);
            setShowing(false);
          }, 600);
        }
      }, 700);
    },
    []
  );

  useEffect(() => {
    startLevel(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleStarClick = (idx) => {
    if (showing || won || lost) return;
    const newUserSeq = [...userSeq, idx];
    setUserSeq(newUserSeq);

    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      setLost(true);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setWon(true);
    }
  };

  const nextLevel = () => {
    setLevel((l) => l + 1);
  };

  const restart = () => {
    setLevel(1);
    setWon(false);
    setLost(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>✨ Light the Stars</h2>
        <p>Watch the pattern, then repeat it by clicking the stars.</p>
      </div>

      {!won && !lost ? (
        <>
          <div className="game-stats">
            <div>Level: {level}</div>
            <div>{showing ? "Watch…" : "Your turn!"}</div>
          </div>

          <div className="game-area stars-area">
            {stars.map((i) => (
              <button
                key={i}
                className={`star-node ${highlight === i ? "lit" : ""}`}
                onClick={() => handleStarClick(i)}
                disabled={showing}
                aria-label={`Star ${i + 1}`}
              >
                ⭐
              </button>
            ))}
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : won ? (
        <div className="game-over-screen">
          <h3>🎉 Level Complete!</h3>
          <p>You reached Level {level}.</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={nextLevel}>
              Next Level
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h3>❌ Wrong Move</h3>
          <p>You reached Level {level}.</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 7. Pop the Anger Bubbles (Anger)
function AngerBubblesGame({ onBack }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [bubbles, setBubbles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef(null);

  const spawnBubble = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = Math.random() * (rect.width - 50);
    const y = Math.random() * (rect.height - 50);
    setBubbles((prev) => [...prev, { id, x, y }]);
  }, []);

  useInterval(
    () => {
      if (!started || gameOver) return;
      if (bubbles.length < 8) spawnBubble();
    },
    300,
    started && !gameOver
  );

  useInterval(
    () => {
      if (!started || gameOver) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    },
    1000,
    started && !gameOver
  );

  const popBubble = (id) => {
    if (!started || gameOver) return;
    setScore((s) => s + 1);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  const restart = () => {
    setStarted(false);
    setScore(0);
    setTimeLeft(25);
    setBubbles([]);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🫧 Pop the Anger Bubbles</h2>
        <p>Pop as many red bubbles as you can!</p>
      </div>

      {!started && !gameOver && (
        <div className="game-start-screen">
          <div className="game-stats">
            <div>Score: 0</div>
            <div>Time: 25s</div>
          </div>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      )}

      {(started || gameOver) && (
        <>
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div ref={containerRef} className="game-area bubbles-area">
            {started &&
              !gameOver &&
              bubbles.map((b) => (
                <button
                  key={b.id}
                  className="bubble-item"
                  style={{ left: b.x, top: b.y }}
                  onClick={() => popBubble(b.id)}
                  aria-label="Bubble"
                />
              ))}
          </div>

          {gameOver && (
            <div className="game-over-screen">
              <h3>🧘 Calm Restored</h3>
              <p>Final Score: {score}</p>
              <div className="game-actions">
                <button className="btn-primary" onClick={restart}>
                  Play Again
                </button>
                <button className="btn-secondary" onClick={onBack}>
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 8. Cool the Volcano (Anger)
function CoolVolcanoGame({ onBack }) {
  const [started, setStarted] = useState(false);
  const [heat, setHeat] = useState(100);
  const [timeLeft, setTimeLeft] = useState(30);
  const [drops, setDrops] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const containerRef = useRef(null);

  const spawnDrop = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = Math.random() * (rect.width - 40);
    const y = Math.random() * (rect.height - 40);
    setDrops((prev) => [...prev, { id, x, y }]);
  }, []);

  useInterval(
    () => {
      if (!started || won || gameOver) return;
      // heat rises slowly
      setHeat((h) => {
        const nh = h + 0.8;
        if (nh >= 100) {
          setGameOver(true);
          return 100;
        }
        return nh;
      });
      if (Math.random() < 0.4) spawnDrop();
    },
    100,
    started && !won && !gameOver
  );

  useInterval(
    () => {
      if (!started || won || gameOver) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    },
    1000,
    started && !won && !gameOver
  );

  const clickDrop = (id) => {
    if (!started || won || gameOver) return;
    setHeat((h) => Math.max(0, h - 6));
    setDrops((prev) => prev.filter((d) => d.id !== id));
  };

  useEffect(() => {
    if (heat <= 0 && started && !gameOver) {
      setWon(true);
    }
  }, [heat, started, gameOver]);

  const restart = () => {
    setStarted(false);
    setHeat(100);
    setTimeLeft(30);
    setDrops([]);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🌋 Cool the Volcano</h2>
        <p>Click water drops to reduce heat before it erupts!</p>
      </div>

      {!started && !gameOver && !won && (
        <div className="game-start-screen">
          <div className="game-stats">
            <div>Heat: 100%</div>
            <div>Time: 30s</div>
          </div>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      )}

      {(started || won || gameOver) && !won && !gameOver && (
        <>
          <div className="game-stats">
            <div>Heat: {Math.round(heat)}%</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div ref={containerRef} className="game-area volcano-area">
            <div className="volcano" />
            {drops.map((d) => (
              <button
                key={d.id}
                className="water-drop"
                style={{ left: d.x, top: d.y }}
                onClick={() => clickDrop(d.id)}
                aria-label="Water drop"
              >
                💧
              </button>
            ))}
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      )}

      {(won || gameOver) && (
        <div className="game-over-screen">
          <h3>{won ? "🌊 Volcano Cooled!" : "💥 Volcano Erupted!"}</h3>
          <p>Time left: {timeLeft}s</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 9. Smash the Targets (Anger)
function SmashTargetsGame({ onBack }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [targets, setTargets] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef(null);

  const spawnTarget = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = Math.random() * (rect.width - 60);
    const y = Math.random() * (rect.height - 60);
    const type = Math.random() > 0.25 ? "good" : "bad";
    setTargets((prev) => [...prev, { id, x, y, type }]);
  }, []);

  useInterval(
    () => {
      if (!started || gameOver) return;
      if (targets.length < 6) spawnTarget();
    },
    350,
    started && !gameOver
  );

  useInterval(
    () => {
      if (!started || gameOver) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    },
    1000,
    started && !gameOver
  );

  const hitTarget = (t) => {
    if (!started || gameOver) return;
    setScore((s) => (t.type === "good" ? s + 2 : s - 1));
    setTargets((prev) => prev.filter((x) => x.id !== t.id));
  };

  const restart = () => {
    setStarted(false);
    setScore(0);
    setTimeLeft(25);
    setTargets([]);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎯 Smash the Targets</h2>
        <p>Hit green targets (+2), avoid red ones (-1).</p>
      </div>

      {!started && !gameOver && (
        <div className="game-start-screen">
          <div className="game-stats">
            <div>Score: 0</div>
            <div>Time: 25s</div>
          </div>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      )}

      {(started || gameOver) && (
        <>
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div ref={containerRef} className="game-area targets-area">
            {started &&
              !gameOver &&
              targets.map((t) => (
                <button
                  key={t.id}
                  className={`target-item ${t.type === "good" ? "good-target" : "bad-target"}`}
                  style={{ left: t.x, top: t.y }}
                  onClick={() => hitTarget(t)}
                  aria-label="Target"
                />
              ))}
          </div>

          {gameOver && (
            <div className="game-over-screen">
              <h3>🎉 Time’s Up!</h3>
              <p>Final Score: {score}</p>
              <div className="game-actions">
                <button className="btn-primary" onClick={restart}>
                  Play Again
                </button>
                <button className="btn-secondary" onClick={onBack}>
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 10. Brave Path (Fear)
function BravePathGame({ onBack }) {
  // Simple 3-path choice per round, 3 rounds
  const totalRounds = 3;
  const [round, setRound] = useState(1);
  const [safePath, setSafePath] = useState(() => Math.floor(Math.random() * 3));
  const [chosen, setChosen] = useState(null);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [clue, setClue] = useState("");

  useEffect(() => {
    if (round > totalRounds) {
      setWon(true);
      return;
    }
    setSafePath(Math.floor(Math.random() * 3));
    setChosen(null);
    const clues = [
      "Not the leftmost path.",
      "Avoid the middle this time.",
      "The right path looks safest.",
      "Trust your gut, not the first path.",
      "The safest path is not the obvious one.",
    ];
    setClue(clues[Math.floor(Math.random() * clues.length)]);
  }, [round]);

  const choosePath = (idx) => {
    if (chosen || won || lost) return;
    setChosen(idx);
    if (idx === safePath) {
      setTimeout(() => {
        if (round + 1 > totalRounds) {
          setWon(true);
        } else {
          setRound((r) => r + 1);
        }
      }, 700);
    } else {
      setLost(true);
    }
  };

  const restart = () => {
    setRound(1);
    setWon(false);
    setLost(false);
    setChosen(null);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🛤️ Brave Path</h2>
        <p>Choose the safe path using the clue.</p>
      </div>

      {!won && !lost ? (
        <>
          <div className="game-stats">
            <div>Round: {round} / {totalRounds}</div>
            <div>Clue: {clue}</div>
          </div>

          <div className="game-area paths-area">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={`path-option ${chosen === i ? (i === safePath ? "safe" : "danger") : ""}`}
                onClick={() => choosePath(i)}
                disabled={chosen !== null}
              >
                Path {i + 1}
              </button>
            ))}
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : won ? (
        <div className="game-over-screen">
          <h3>🎉 You Found the Brave Path!</h3>
          <p>All rounds completed safely.</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h3>❌ Wrong Path</h3>
          <p>You made it to Round {round}.</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 11. Monster Maze (Fear)
function MonsterMazeGame({ onBack }) {
  // Simple grid maze: 10x10, player, exit, some moving obstacles
  const size = 10;
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [exitPos, setExitPos] = useState({ x: 9, y: 9 });
  const [obstacles, setObstacles] = useState([
    { x: 3, y: 3, dx: 1, dy: 0 },
    { x: 6, y: 2, dx: 0, dy: 1 },
    { x: 7, y: 7, dx: -1, dy: 0 },
  ]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const movePlayer = useCallback((dx, dy) => {
    if (won || lost) return;
    setPlayer((p) => {
      const nx = Math.max(0, Math.min(size - 1, p.x + dx));
      const ny = Math.max(0, Math.min(size - 1, p.y + dy));
      return { x: nx, y: ny };
    });
  }, [won, lost]);

  useEffect(() => {
    const handler = (e) => {
      if (won || lost) return;
      if (e.key === "ArrowUp" || e.key === "w") movePlayer(0, -1);
      if (e.key === "ArrowDown" || e.key === "s") movePlayer(0, 1);
      if (e.key === "ArrowLeft" || e.key === "a") movePlayer(-1, 0);
      if (e.key === "ArrowRight" || e.key === "d") movePlayer(1, 0);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [movePlayer, won, lost]);

  // Move obstacles
  useInterval(() => {
    if (won || lost) return;
    setObstacles((prev) =>
      prev.map((o) => {
        let nx = o.x + o.dx;
        let ny = o.y + o.dy;
        let ndx = o.dx;
        let ndy = o.dy;
        if (nx < 0 || nx >= size) {
          ndx = -ndx;
          nx = o.x + ndx;
        }
        if (ny < 0 || ny >= size) {
          ndy = -ndy;
          ny = o.y + ndy;
        }
        return { ...o, x: nx, y: ny, dx: ndx, dy: ndy };
      })
    );
  }, 600, !(won || lost));

  // Check collisions & win
  useEffect(() => {
    if (won || lost) return;
    if (player.x === exitPos.x && player.y === exitPos.y) {
      setWon(true);
    }
    if (obstacles.some((o) => o.x === player.x && o.y === player.y)) {
      setLost(true);
    }
  }, [player, obstacles, exitPos, won, lost]);

  const restart = () => {
    setPlayer({ x: 0, y: 0 });
    setExitPos({ x: 9, y: 9 });
    setObstacles([
      { x: 3, y: 3, dx: 1, dy: 0 },
      { x: 6, y: 2, dx: 0, dy: 1 },
      { x: 7, y: 7, dx: -1, dy: 0 },
    ]);
    setWon(false);
    setLost(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>👾 Monster Maze</h2>
        <p>Use Arrow Keys or WASD to reach the green exit. Avoid red monsters.</p>
      </div>

      {!won && !lost ? (
        <>
          <div className="game-area maze-area">
            <div className="maze-grid">
              {Array.from({ length: size * size }).map((_, i) => {
                const x = i % size;
                const y = Math.floor(i / size);
                const isPlayer = player.x === x && player.y === y;
                const isExit = exitPos.x === x && exitPos.y === y;
                const isObstacle = obstacles.some((o) => o.x === x && o.y === y);
                return (
                  <div
                    key={i}
                    className={`maze-cell ${isPlayer ? "player" : ""} ${isExit ? "exit" : ""} ${isObstacle ? "obstacle" : ""}`}
                  />
                );
              })}
            </div>

            <div className="touch-controls-maze">
              <div className="maze-row">
                <button className="btn-control" onClick={() => movePlayer(0, -1)}>
                  ↑
                </button>
              </div>
              <div className="maze-row">
                <button className="btn-control" onClick={() => movePlayer(-1, 0)}>
                  ←
                </button>
                <button className="btn-control" onClick={() => movePlayer(0, 1)}>
                  ↓
                </button>
                <button className="btn-control" onClick={() => movePlayer(1, 0)}>
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : won ? (
        <div className="game-over-screen">
          <h3>🎉 You Escaped the Maze!</h3>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h3>💀 Caught by a Monster!</h3>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 12. Courage Shield (Fear)
function CourageShieldGame({ onBack }) {
  const [started, setStarted] = useState(false);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [objects, setObjects] = useState([]);
  const [shieldUp, setShieldUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const containerRef = useRef(null);

  const spawnObject = useCallback(() => {
    if (!containerRef.current) return;
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10; // percent
    setObjects((prev) => [...prev, { id, x, y: -10 }]);
  }, []);

  useInterval(
    () => {
      if (!started || won || gameOver) return;
      setObjects((prev) =>
        prev
          .map((o) => ({ ...o, y: o.y + 1.3 }))
          .filter((o) => o.y < 110)
      );
      if (Math.random() < 0.35) spawnObject();
    },
    40,
    started && !won && !gameOver
  );

  useInterval(
    () => {
      if (!started || won || gameOver) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          setWon(true);
          return 0;
        }
        return t - 1;
      });
    },
    1000,
    started && !won && !gameOver
  );

  // Check hits
  useEffect(() => {
    if (!started || won || gameOver) return;
    const hit = objects.filter((o) => o.y >= 85 && o.y <= 95);
    if (hit.length) {
      if (!shieldUp) {
        setLives((l) => {
          const nl = l - hit.length;
          if (nl <= 0) setGameOver(true);
          return nl;
        });
      }
      setObjects((prev) => prev.filter((o) => !hit.some((h) => h.id === o.id)));
    }
  }, [objects, shieldUp, started, won, gameOver]);

  const restart = () => {
    setStarted(false);
    setLives(3);
    setTimeLeft(30);
    setObjects([]);
    setShieldUp(false);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🛡️ Courage Shield</h2>
        <p>Hold the shield to block falling objects. Survive 30 seconds!</p>
      </div>

      {!started && !gameOver && !won && (
        <div className="game-start-screen">
          <div className="game-stats">
            <div>Lives: 3</div>
            <div>Time: 30s</div>
          </div>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Games
          </button>
        </div>
      )}

      {(started || won || gameOver) && !won && !gameOver && (
        <>
          <div className="game-stats">
            <div>Lives: {lives}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div ref={containerRef} className="game-area shield-area">
            {objects.map((o) => (
              <div
                key={o.id}
                className="falling-object"
                style={{ left: `${o.x}%`, top: `${o.y}%` }}
              >
                🪨
              </div>
            ))}
            <div
              className={`shield ${shieldUp ? "up" : "down"}`}
              onMouseDown={() => setShieldUp(true)}
              onMouseUp={() => setShieldUp(false)}
              onMouseLeave={() => setShieldUp(false)}
              onTouchStart={() => setShieldUp(true)}
              onTouchEnd={() => setShieldUp(false)}
            >
              {shieldUp ? "🛡️" : "👐"}
            </div>
            <div className="shield-instructions">
              Hold mouse/touch to raise shield.
            </div>
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      )}

      {(won || gameOver) && (
        <div className="game-over-screen">
          <h3>{won ? "🎉 You Survived!" : "💔 Game Over"}</h3>
          <p>Time: {timeLeft}s | Lives left: {lives}</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 13. Quick Sort (Confused)
function QuickSortGame({ onBack }) {
  // Two categories: Fruits vs Animals
  const items = [
    { id: "apple", label: "🍎 Apple", cat: "fruit" },
    { id: "banana", label: "🍌 Banana", cat: "fruit" },
    { id: "grape", label: "🍇 Grape", cat: "fruit" },
    { id: "dog", label: "🐶 Dog", cat: "animal" },
    { id: "cat", label: "🐱 Cat", cat: "animal" },
    { id: "lion", label: "🦁 Lion", cat: "animal" },
  ];

  const [queue, setQueue] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const current = queue[0];

  const placeItem = (cat) => {
    if (!current || won || lost) return;
    if (current.cat === cat) {
      const newScore = score + 1;
      setScore(newScore);
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      if (newQueue.length === 0) {
        setWon(true);
      }
    } else {
      setWrong((w) => {
        const nw = w + 1;
        if (nw >= 3) setLost(true);
        return nw;
      });
      // remove item anyway to keep flow
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      if (newQueue.length === 0 && wrong + 1 < 3) setWon(true);
    }
  };

  const restart = () => {
    setQueue([...items].sort(() => Math.random() - 0.5));
    setScore(0);
    setWrong(0);
    setWon(false);
    setLost(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🗂️ Quick Sort</h2>
        <p>Sort items into Fruits or Animals. 3 mistakes = game over.</p>
      </div>

      {!won && !lost && current ? (
        <>
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Mistakes: {wrong} / 3</div>
          </div>

          <div className="game-area sort-area">
            <div className="current-item">{current.label}</div>
            <div className="sort-buttons">
              <button className="btn-sort" onClick={() => placeItem("fruit")}>
                🍎 Fruits
              </button>
              <button className="btn-sort" onClick={() => placeItem("animal")}>
                🐾 Animals
              </button>
            </div>
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : won ? (
        <div className="game-over-screen">
          <h3>🎉 All Sorted!</h3>
          <p>Score: {score} | Mistakes: {wrong}</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h3>❌ Too Many Mistakes</h3>
          <p>Score: {score} | Mistakes: {wrong}</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 14. Pattern Detective (Confused)
function PatternDetectiveGame({ onBack }) {
  // Simple patterns: A B A B ?, A A B A A B ?, etc.
  const patterns = [
    { seq: ["🔴", "🔵", "🔴", "🔵"], answer: "🔴", options: ["🔴", "🔵", "🟢"] },
    { seq: ["🟩", "🟩", "🟦", "🟩", "🟩"], answer: "🟦", options: ["🟦", "🟩", "🟥"] },
    { seq: ["⭐", "🌙", "⭐", "🌙", "⭐"], answer: "🌙", options: ["🌙", "⭐", "☀️"] },
    { seq: ["🍎", "🍌", "🍎", "🍌", "🍎"], answer: "🍌", options: ["🍌", "🍎", "🍇"] },
    { seq: ["🐶", "🐱", "🐶", "🐱", "🐶"], answer: "🐱", options: ["🐱", "🐶", "🦁"] },
  ];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const current = patterns[index];

  const choose = (opt) => {
    if (won || lost || !current) return;
    if (opt === current.answer) {
      const newScore = score + 1;
      setScore(newScore);
      if (index + 1 >= patterns.length) {
        setWon(true);
      } else {
        setIndex((i) => i + 1);
      }
    } else {
      const nw = wrong + 1;
      setWrong(nw);
      if (nw >= 2) setLost(true);
      else {
        if (index + 1 >= patterns.length) {
          setWon(true);
        } else {
          setIndex((i) => i + 1);
        }
      }
    }
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setWrong(0);
    setWon(false);
    setLost(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🕵️ Pattern Detective</h2>
        <p>Choose what comes next in the pattern.</p>
      </div>

      {!won && !lost && current ? (
        <>
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Mistakes: {wrong} / 2</div>
          </div>

          <div className="game-area pattern-area">
            <div className="pattern-seq">
              {current.seq.map((s, i) => (
                <span key={i} className="pattern-item">{s}</span>
              ))}
              <span className="pattern-item question">?</span>
            </div>
            <div className="pattern-options">
              {current.options.map((opt, i) => (
                <button key={i} className="btn-pattern" onClick={() => choose(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : won ? (
        <div className="game-over-screen">
          <h3>🎉 Pattern Master!</h3>
          <p>Score: {score} | Mistakes: {wrong}</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h3>❌ Pattern Broken</h3>
          <p>Score: {score} | Mistakes: {wrong}</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 15. Escape the Puzzle Room (Confused)
function PuzzleRoomGame({ onBack }) {
  // 3 simple puzzles in sequence
  const [step, setStep] = useState(1);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [error, setError] = useState("");
  const [won, setWon] = useState(false);

  const check1 = () => {
    // Puzzle 1: "I speak without a mouth… (echo)"
    if (input1.trim().toLowerCase() === "echo") {
      setStep(2);
      setError("");
    } else {
      setError("Not quite. Think: sound that repeats.");
    }
  };

  const check2 = () => {
    // Puzzle 2: simple math: 2 + 3 * 4 = ?
    if (input2.trim() === "14") {
      setStep(3);
      setError("");
    } else {
      setError("Remember order of operations: 3*4 first.");
    }
  };

  const check3 = () => {
    // Puzzle 3: pattern: 2,4,8,16,? => 32
    if (input3.trim() === "32") {
      setWon(true);
      setError("");
    } else {
      setError("Each number doubles the previous one.");
    }
  };

  const restart = () => {
    setStep(1);
    setInput1("");
    setInput2("");
    setInput3("");
    setError("");
    setWon(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🚪 Escape the Puzzle Room</h2>
        <p>Solve 3 puzzles in order to escape.</p>
      </div>

      {!won ? (
        <>
          <div className="game-stats">
            <div>Puzzle: {step} / 3</div>
          </div>

          <div className="game-area puzzle-area">
            {step === 1 && (
              <div className="puzzle-step">
                <p>“I speak without a mouth and hear without ears. What am I?”</p>
                <input
                  type="text"
                  className="puzzle-input"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  placeholder="Your answer"
                />
                <button className="btn-primary" onClick={check1}>
                  Submit
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="puzzle-step">
                <p>What is 2 + 3 × 4 ?</p>
                <input
                  type="text"
                  className="puzzle-input"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  placeholder="Number"
                />
                <button className="btn-primary" onClick={check2}>
                  Submit
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="puzzle-step">
                <p>What comes next: 2, 4, 8, 16, … ?</p>
                <input
                  type="text"
                  className="puzzle-input"
                  value={input3}
                  onChange={(e) => setInput3(e.target.value)}
                  placeholder="Number"
                />
                <button className="btn-primary" onClick={check3}>
                  Submit
                </button>
              </div>
            )}
            {error && <div className="puzzle-error">{error}</div>}
          </div>

          <div className="game-actions">
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </>
      ) : (
        <div className="game-over-screen">
          <h3>🎉 You Escaped!</h3>
          <p>All puzzles solved.</p>
          <div className="game-actions">
            <button className="btn-primary" onClick={restart}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Map game IDs to components
const GAME_COMPONENTS = {
  "star-catcher": StarCatcherGame,
  "memory-flip": MemoryFlipGame,
  "balloon-pop": BalloonPopGame,
  "raindrop-catch": RaindropCatchGame,
  "build-rainbow": BuildRainbowGame,
  "light-stars": LightStarsGame,
  "anger-bubbles": AngerBubblesGame,
  "cool-volcano": CoolVolcanoGame,
  "smash-targets": SmashTargetsGame,
  "brave-path": BravePathGame,
  "monster-maze": MonsterMazeGame,
  "courage-shield": CourageShieldGame,
  "quick-sort": QuickSortGame,
  "pattern-detective": PatternDetectiveGame,
  "puzzle-room": PuzzleRoomGame,
};

// -----------------------------
// Main MayaPlay Component
// -----------------------------

export default function MayaPlay() {
  const navigate = useNavigate();

  const [selectedMoodId, setSelectedMoodId] = useState("joy");
  const [selectedGameId, setSelectedGameId] = useState(null);

  const selectedMood = MOODS[selectedMoodId] || MOODS.joy;
  const selectedGame = selectedGameId ? GAME_REGISTRY[selectedGameId] : null;
  const GameComponent = selectedGameId ? GAME_COMPONENTS[selectedGameId] : null;

  const handleMoodClick = (moodId) => {
    setSelectedMoodId(moodId);
    setSelectedGameId(null);
  };

  const handleGameClick = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleBackToGames = () => {
    setSelectedGameId(null);
  };

  const handleBackToMaya = () => {
    navigate("/maya");
  };

  // If a game is selected, render that game only
  if (selectedGameId && GameComponent) {
    return (
      <div className={`maya-play-page theme-${selectedMood.theme}`}>
        <div className="maya-top-bar">
          <button className="btn-back-maya" onClick={handleBackToMaya}>
            ← Back to Maya
          </button>
          <div className="maya-title-small">MayaPlay</div>
        </div>
        <GameComponent onBack={handleBackToGames} />
      </div>
    );
  }

  // Otherwise, show mood selection and game cards
  return (
    <div className={`maya-play-page theme-${selectedMood.theme}`}>
      <header className="maya-play-header">
        <div className="maya-top-bar">
          <button className="btn-back-maya" onClick={handleBackToMaya}>
            ← Back to Maya
          </button>
          <div className="maya-title-small">MayaPlay</div>
        </div>
        <h1>MayaPlay – Mood-Based Games</h1>
        <p className="maya-subtitle">Pick a mood. Get 3 perfect games for it.</p>
      </header>

      <nav className="maya-mood-nav">
        {Object.values(MOODS).map((m) => (
          <button
            key={m.id}
            className={`maya-mood-btn theme-${m.theme} ${
              selectedMoodId === m.id ? "active" : ""
            }`}
            onClick={() => handleMoodClick(m.id)}
            aria-pressed={selectedMoodId === m.id}
          >
            <span className="mood-emoji">{m.emoji}</span>
            <span className="mood-label">{m.label}</span>
          </button>
        ))}
      </nav>

      <section className="maya-mood-info">
        <h2>
          <span className="mood-emoji">{selectedMood.emoji}</span> {selectedMood.label}
        </h2>
        <p>{selectedMood.description}</p>
      </section>

<ul className="maya-games-grid">
  {selectedMood.games.map((g) => {
    // Emoji mapping for game cards (purely visual)
    const emojiMap = {
      "star-catcher": "⭐",
      "memory-flip": "🧠",
      "balloon-pop": "🎈",
      "raindrop-catch": "🌧️",
      "build-rainbow": "🌈",
      "light-stars": "✨",
      "anger-bubbles": "🫧",
      "cool-volcano": "🌋",
      "smash-targets": "🎯",
      "brave-path": "🛤️",
      "monster-maze": "👾",
      "courage-shield": "🛡️",
      "quick-sort": "🗂️",
      "pattern-detective": "🕵️",
      "puzzle-room": "🚪",
    };
    const emoji = emojiMap[g.id] || "🎮";

    return (
      <li key={g.id}>
        <button className="maya-game-card" onClick={() => handleGameClick(g.id)}>
          <h3>{emoji} {g.title}</h3>
          <p>{g.short}</p>
          <span className="play-badge">Play</span>
        </button>
      </li>
    );
  })}
</ul>

      <footer className="maya-play-footer">
        <small>
          Tip: If a game feels too intense, switch to a calmer mood like Joy or Fear.
        </small>
      </footer>
    </div>
  );
}