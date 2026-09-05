import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MayaExplore.css";

const STORAGE_KEY = "mayaExploreProgress";

const LEVELS = [
  {
    level: 1,
    icon: "🌸",
    title: "Style Starter",
    gameIcon: "👗",
    game: "Dress the Look",
    pass: "Create 1 complete outfit",
    description:
      "Help Maya create her first beautiful outfit by choosing the right fashion pieces.",
  },
  {
    level: 2,
    icon: "🎨",
    title: "Color Creator",
    gameIcon: "🌈",
    game: "Color Match Studio",
    pass: "Match 5 color combinations",
    description:
      "Learn how colors work together and help Maya create beautiful fashion combinations.",
  },
  {
    level: 3,
    icon: "✂️",
    title: "Fashion Maker",
    gameIcon: "🧵",
    game: "Design the Outfit",
    pass: "Choose 5 correct design pieces",
    description:
      "Build stylish outfits by selecting the perfect clothing and accessories for each theme.",
  },
  {
    level: 4,
    icon: "💎",
    title: "Trend Designer",
    gameIcon: "👠",
    game: "Style Challenge",
    pass: "Complete 4 fashion challenges",
    description:
      "Take on Maya's styling challenges and prove that you can create looks for every occasion.",
  },
  {
    level: 5,
    icon: "👑",
    title: "Fashion Master",
    gameIcon: "✨",
    game: "Maya's Fashion Show",
    pass: "Complete 5 runway looks",
    description:
      "Create five amazing runway looks and become Maya's ultimate Fashion Master.",
  },
];

function getProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        passedLevels: [],
      };
    }

    const parsed = JSON.parse(saved);

    return {
      passedLevels: Array.isArray(parsed.passedLevels)
        ? parsed.passedLevels
        : [],
    };
  } catch {
    return {
      passedLevels: [],
    };
  }
}

export default function MayaExplore() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(getProgress);

  useEffect(() => {
    const refreshProgress = () => {
      setProgress(getProgress());
    };

    window.addEventListener("mayaProgressUpdated", refreshProgress);
    window.addEventListener("storage", refreshProgress);

    return () => {
      window.removeEventListener("mayaProgressUpdated", refreshProgress);
      window.removeEventListener("storage", refreshProgress);
    };
  }, []);

  const passedLevels = progress.passedLevels || [];

  /*
    Level 1 is always unlocked.
    After passing Level 1 -> Level 2 unlocks.
    After passing Level 2 -> Level 3 unlocks, etc.
  */
  const isUnlocked = (level) => {
    if (level === 1) return true;

    return passedLevels.includes(level - 1);
  };

  const isPassed = (level) => {
    return passedLevels.includes(level);
  };

  const getStatus = (level) => {
    if (isPassed(level)) {
      return "PASSED";
    }

    if (isUnlocked(level)) {
      return "READY";
    }

    return "LOCKED";
  };

  const handlePlay = (level) => {
    if (!isUnlocked(level)) return;

    navigate(`/maya/play?level=${level}`);
  };

  const handleBack = () => {
    navigate("/maya");
  };

  return (
    <div className="maya-explore-page">
      {/* Background decoration */}
      <div className="maya-explore-stars" aria-hidden="true">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
        <span>·</span>
        <span>✧</span>
        <span>✦</span>
        <span>·</span>
        <span>✧</span>
        <span>✦</span>
      </div>

      {/* Top navigation */}
      <header className="maya-explore-header">
        <button
          type="button"
          className="maya-explore-back"
          onClick={handleBack}
        >
          ← Back to Maya
        </button>

        <div className="maya-explore-heading">
          <div className="maya-heading-icon">🎨</div>

          <h1>Maya's Design Journey</h1>

          <p>
            Explore fashion, create beautiful looks, and become a Fashion
            Master.
          </p>
        </div>
      </header>

      {/* Progress summary */}
      <section className="maya-progress-summary">
        <div className="maya-progress-text">
          <span className="maya-progress-label">YOUR DESIGN JOURNEY</span>
          <strong>
            {passedLevels.length} / {LEVELS.length} Levels Passed
          </strong>
        </div>

        <div
          className="maya-progress-bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax={LEVELS.length}
          aria-valuenow={passedLevels.length}
        >
          <div
            className="maya-progress-fill"
            style={{
              width: `${(passedLevels.length / LEVELS.length) * 100}%`,
            }}
          />
        </div>
      </section>

      {/* Roadmap */}
      <main className="maya-roadmap">
        {LEVELS.map((item, index) => {
          const unlocked = isUnlocked(item.level);
          const passed = isPassed(item.level);
          const status = getStatus(item.level);

          return (
            <React.Fragment key={item.level}>
              <article
                className={[
                  "maya-level-card",
                  unlocked ? "is-unlocked" : "is-locked",
                  passed ? "is-passed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Level number */}
                <div className="maya-level-number">
                  LEVEL {item.level}
                </div>

                {/* Main icon */}
                <div className="maya-level-icon" aria-hidden="true">
                  {item.icon}
                </div>

                {/* Status */}
                <div
                  className={`maya-level-status maya-status-${status.toLowerCase()}`}
                >
                  {status === "PASSED" && "✓ PASSED"}
                  {status === "READY" && "🔓 READY"}
                  {status === "LOCKED" && "🔒 LOCKED"}
                </div>

                {/* Content */}
                <div className="maya-level-content">
                  <h2>{item.title}</h2>

                  <div className="maya-game-name">
                    <span>{item.gameIcon}</span>
                    <span>{item.game}</span>
                  </div>

                  <p className="maya-level-description">
                    {item.description}
                  </p>

                  <div className="maya-pass-box">
                    <span className="maya-pass-label">PASS POINTS</span>
                    <span className="maya-pass-value">{item.pass}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="maya-level-action">
                  {unlocked ? (
                    <button
                      type="button"
                      className="maya-play-level"
                      onClick={() => handlePlay(item.level)}
                    >
                      {passed
                        ? `PLAY LEVEL ${item.level} AGAIN`
                        : `PLAY LEVEL ${item.level}`}
                      <span>→</span>
                    </button>
                  ) : (
                    <div className="maya-locked-message">
                      🔒 Pass Level {item.level - 1} to unlock
                    </div>
                  )}
                </div>
              </article>

              {/* Connector */}
              {index < LEVELS.length - 1 && (
                <div
                  className={`maya-level-connector ${
                    isUnlocked(item.level + 1) ? "connector-active" : ""
                  }`}
                  aria-hidden="true"
                >
                  <span>↓</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </main>

      {/* Bottom message */}
      <footer className="maya-explore-footer">
        <span>✦</span>
        <p>Create. Style. Design. Shine.</p>
        <span>✦</span>
      </footer>
    </div>
  );
}