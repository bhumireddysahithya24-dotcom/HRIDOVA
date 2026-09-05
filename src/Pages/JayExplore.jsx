import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JayExplore.css";

const STORAGE_KEY = "jayExploreUnlockedLevel";

const LEVELS = [
  {
    level: 1,
    icon: "⭐",
    name: "New Gamer",
    game: "Star Catcher",
    description:
      "Move Jay through the game world and catch falling stars.",
    pass: "Collect 10 stars",
  },
  {
    level: 2,
    icon: "🌈",
    name: "Game Explorer",
    game: "Rainbow Builder",
    description:
      "Build a colorful rainbow by placing each color in the correct position.",
    pass: "Place 5 colors correctly",
  },
  {
    level: 3,
    icon: "🫧",
    name: "Challenge Seeker",
    game: "Pop the Anger Bubbles",
    description:
      "Pop the floating bubbles and clear the challenge from Jay's world.",
    pass: "Pop 20 bubbles",
  },
  {
    level: 4,
    icon: "🧩",
    name: "Pro Gamer",
    game: "Pattern Detective",
    description:
      "Study each pattern carefully and choose the correct missing piece.",
    pass: "Solve 4 patterns correctly",
  },
  {
    level: 5,
    icon: "🤝",
    name: "Gaming Master",
    game: "Find a Friend",
    description:
      "Explore the game world and find the correct friends.",
    pass: "Find 5 correct friends",
  },
];

export default function JayExplore() {
  const navigate = useNavigate();

  const [unlockedLevel, setUnlockedLevel] = useState(1);

  useEffect(() => {
    const savedLevel = Number(
      localStorage.getItem(STORAGE_KEY)
    );

    if (
      Number.isInteger(savedLevel) &&
      savedLevel >= 1 &&
      savedLevel <= 5
    ) {
      setUnlockedLevel(savedLevel);
    } else {
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  /*
   * Allows JayPlay to unlock the next level
   * after the current game has actually been passed.
   */
  useEffect(() => {
    window.unlockJayLevel = (completedLevel) => {
      const currentLevel = Number(
        localStorage.getItem(STORAGE_KEY) || "1"
      );

      const nextLevel = Math.min(
        5,
        Math.max(
          currentLevel,
          completedLevel + 1
        )
      );

      localStorage.setItem(
        STORAGE_KEY,
        String(nextLevel)
      );

      setUnlockedLevel(nextLevel);
    };

    return () => {
      delete window.unlockJayLevel;
    };
  }, []);

  const handlePlay = (level) => {
    /*
     * Locked levels cannot be opened.
     */
    if (level > unlockedLevel) {
      return;
    }

    /*
     * Open the ACTUAL playable game.
     */
    navigate(`/jay/play?level=${level}`);
  };

  const handleBack = () => {
    navigate("/jay");
  };

  const resetProgress = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setUnlockedLevel(1);
  };

  return (
    <div className="jay-explore-page">
      <div className="jay-explore-stars" />

      <button
        type="button"
        className="jay-explore-back"
        onClick={handleBack}
      >
        ← Back to Jay
      </button>

      <main className="jay-explore-content">

        {/* HEADER */}

        <header className="jay-explore-header">
          <div className="jay-explore-icon">
            🎮
          </div>

          <h1>Explore & Unlock</h1>

          <p>
            Level up your gaming skills with Jay,
            one challenge at a time.
          </p>

          <div className="jay-progress-summary">
            <span>Gaming Journey</span>

            <strong>
              Level {unlockedLevel} of 5
            </strong>
          </div>
        </header>

        {/* LEVEL ROADMAP */}

        <section className="jay-roadmap">

          {LEVELS.map((item, index) => {
            const isUnlocked =
              item.level <= unlockedLevel;

            const isCurrent =
              item.level === unlockedLevel;

            const isCompleted =
              item.level < unlockedLevel;

            return (
              <React.Fragment key={item.level}>

                <article
                  className={[
                    "jay-level-card",

                    isUnlocked
                      ? "unlocked"
                      : "locked",

                    isCurrent
                      ? "current"
                      : "",

                    isCompleted
                      ? "completed"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >

                  {/* TOP */}

                  <div className="jay-level-top">

                    <div className="jay-level-number">
                      LEVEL {item.level}
                    </div>

                    <div className="jay-level-status">

                      {isCompleted
                        ? "✓ COMPLETED"
                        : isUnlocked
                        ? "🔓 READY"
                        : "🔒 LOCKED"}

                    </div>

                  </div>

                  {/* ICON */}

                  <div className="jay-level-icon">
                    {item.icon}
                  </div>

                  {/* LEVEL NAME */}

                  <h2>{item.name}</h2>

                  {/* GAME */}

                  <div className="jay-game-name">
                    {item.game}
                  </div>

                  {/* DESCRIPTION */}

                  <p className="jay-level-description">
                    {item.description}
                  </p>

                  {/* PASS POINTS */}

                  <div className="jay-pass-box">

                    <span>
                      PASS POINTS
                    </span>

                    <strong>
                      {item.pass}
                    </strong>

                  </div>

                  {/* PLAY / LOCK */}

                  {isUnlocked ? (

                    <button
                      type="button"
                      className="jay-play-level"
                      onClick={() =>
                        handlePlay(item.level)
                      }
                    >
                      {isCompleted
                        ? `▶ PLAY LEVEL ${item.level}`
                        : `🎮 PLAY LEVEL ${item.level}`}
                    </button>

                  ) : (

                    <div className="jay-locked-message">
                      🔒 Complete Level{" "}
                      {item.level - 1} to unlock
                    </div>

                  )}

                </article>

                {/* CONNECTOR */}

                {index < LEVELS.length - 1 && (
                  <div
                    className={[
                      "jay-roadmap-connector",

                      item.level <
                      unlockedLevel
                        ? "active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span>↓</span>
                  </div>
                )}

              </React.Fragment>
            );
          })}

        </section>

        {/* FOOTER */}

        <footer className="jay-explore-footer">

          <p>
            🎮 Complete each game to unlock
            your next gaming challenge.
          </p>

          <button
            type="button"
            className="jay-reset-progress"
            onClick={resetProgress}
          >
            Reset Progress
          </button>

        </footer>

      </main>
    </div>
  );
}