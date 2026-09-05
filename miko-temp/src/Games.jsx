import { useEffect, useMemo, useState } from "react";
import "./Games.css";

const MOODS = [
  {
    id: "happy",
    emoji: "😊",
    name: "Happy",
    description: "Let's keep that happy energy going!",
  },
  {
    id: "sad",
    emoji: "😢",
    name: "Sad",
    description: "Let's gently bring a little sunshine back.",
  },
  {
    id: "angry",
    emoji: "😡",
    name: "Angry",
    description: "Let's release that big energy safely.",
  },
  {
    id: "anxious",
    emoji: "😰",
    name: "Anxious",
    description: "Let's slow things down together.",
  },
  {
    id: "bored",
    emoji: "😐",
    name: "Bored",
    description: "Let's find something fun to do!",
  },
  {
    id: "tired",
    emoji: "😴",
    name: "Tired",
    description: "Let's choose something gentle and cozy.",
  },
];

const GAMES = {
  happy: [
    {
      id: "balloon",
      title: "Balloon Pop",
      emoji: "🎈",
      description: "Pop as many happy balloons as you can!",
      type: "tap",
      target: "🎈",
    },
    {
      id: "stars",
      title: "Star Catch",
      emoji: "⭐",
      description: "Catch the stars before they disappear!",
      type: "tap",
      target: "⭐",
    },
    {
      id: "smile",
      title: "Smile Match",
      emoji: "😄",
      description: "Tap the smiling faces!",
      type: "tap",
      target: "😄",
    },
  ],

  sad: [
    {
      id: "heart-garden",
      title: "Heart Garden",
      emoji: "🌷",
      description: "Grow a little garden by collecting hearts.",
      type: "tap",
      target: "💗",
    },
    {
      id: "kindness",
      title: "Kindness Cards",
      emoji: "💌",
      description: "Choose a kind thought for yourself.",
      type: "cards",
    },
    {
      id: "memories",
      title: "Happy Memories",
      emoji: "🌈",
      description: "Pick something that can make you smile.",
      type: "cards",
    },
  ],

  angry: [
    {
      id: "anger-bubbles",
      title: "Anger Bubbles",
      emoji: "🫧",
      description: "Pop the bubbles and let the anger float away.",
      type: "tap",
      target: "🔴",
    },
    {
      id: "volcano",
      title: "Cool the Volcano",
      emoji: "🌋",
      description: "Tap the volcano to cool it down!",
      type: "cool",
    },
    {
      id: "calm-tap",
      title: "Calm Tap",
      emoji: "🖐️",
      description: "Tap slowly and bring your energy down.",
      type: "slow",
    },
  ],

  anxious: [
    {
      id: "breathing",
      title: "Breathing Bubbles",
      emoji: "🫧",
      description: "Follow the bubble: breathe in, then breathe out.",
      type: "breathing",
    },
    {
      id: "countdown",
      title: "Calm Countdown",
      emoji: "🌿",
      description: "Take a peaceful 10-second reset.",
      type: "countdown",
    },
    {
      id: "find-calm",
      title: "Find the Calm",
      emoji: "🍃",
      description: "Find the peaceful leaf among the leaves.",
      type: "find",
      target: "🍃",
    },
  ],

  bored: [
    {
      id: "memory",
      title: "Memory Match",
      emoji: "🧠",
      description: "Find the matching pairs.",
      type: "memory",
    },
    {
      id: "scramble",
      title: "Word Scramble",
      emoji: "🔤",
      description: "Unscramble the word!",
      type: "scramble",
    },
    {
      id: "quiz",
      title: "Quick Quiz",
      emoji: "❓",
      description: "Answer a few fun questions.",
      type: "quiz",
    },
  ],

  tired: [
    {
      id: "clouds",
      title: "Cloud Match",
      emoji: "☁️",
      description: "Match the soft sleepy clouds.",
      type: "memory",
    },
    {
      id: "cozy-stars",
      title: "Cozy Stars",
      emoji: "🌟",
      description: "Collect five gentle stars.",
      type: "tap",
      target: "🌟",
    },
    {
      id: "sleepy-breathing",
      title: "Sleepy Breathing",
      emoji: "🌙",
      description: "Slow down with Miko.",
      type: "breathing",
    },
  ],
};

const KINDNESS_MESSAGES = [
  "You are doing better than you think. 💗",
  "You deserve kindness too. 🌷",
  "It's okay to have a difficult day. 🌈",
  "You don't have to solve everything today. 🌿",
];

const MEMORY_ITEMS = ["🌈", "🌈", "⭐", "⭐", "🌸", "🌸", "🦋", "🦋"];

const QUIZ = [
  {
    question: "Which one can help you calm down?",
    answers: ["Slow breathing", "Shouting", "Skipping sleep"],
    correct: 0,
  },
  {
    question: "What should you do when you feel angry?",
    answers: ["Take a safe break", "Break things", "Push someone"],
    correct: 0,
  },
  {
    question: "Which is a kind thing to tell yourself?",
    answers: [
      "I can try again.",
      "I am terrible.",
      "I should never make mistakes.",
    ],
    correct: 0,
  },
];

const SCRAMBLES = [
  {
    letters: "L A C M",
    answer: "CALM",
  },
  {
    letters: "Y A P L",
    answer: "PLAY",
  },
  {
    letters: "E P H O",
    answer: "HOPE",
  },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function TapGame({ game, onFinish }) {
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState({
    left: 50,
    top: 50,
  });

  const moveTarget = () => {
    setTargetPosition({
      left: 15 + Math.random() * 70,
      top: 15 + Math.random() * 65,
    });

    setScore((current) => current + 1);
  };

  const finished = score >= 10;

  return (
    <div className="game-play">
      <div className="game-score">
        Score: <strong>{score}/10</strong>
      </div>

      {!finished ? (
        <div className="tap-arena">
          <button
            type="button"
            className="floating-target"
            style={{
              left: `${targetPosition.left}%`,
              top: `${targetPosition.top}%`,
            }}
            onClick={moveTarget}
            aria-label={`Catch ${game.title} target`}
          >
            {game.target}
          </button>
        </div>
      ) : (
        <div className="game-complete">
          <div className="complete-emoji">🎉</div>
          <h3>Great job!</h3>
          <p>You collected 10 targets with Miko!</p>

          <button
            type="button"
            className="primary-game-button"
            onClick={onFinish}
          >
            Back to Games
          </button>
        </div>
      )}
    </div>
  );
}

function CardsGame({ game, onFinish }) {
  const [selected, setSelected] = useState("");

  const options =
    game.id === "kindness"
      ? KINDNESS_MESSAGES
      : [
          "A funny moment with someone you like. 😊",
          "A place where you felt safe. 🌿",
          "Something you are proud of. ⭐",
          "Something that made you laugh. 😂",
        ];

  return (
    <div className="game-play">
      <div className="choice-grid">
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            className={`choice-card ${
              selected === option ? "selected" : ""
            }`}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <div className="selected-message">
          <span>💗</span>
          <p>{selected}</p>

          <button
            type="button"
            className="primary-game-button"
            onClick={onFinish}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}

function CoolGame({ onFinish }) {
  const [heat, setHeat] = useState(100);

  const coolDown = () => {
    setHeat((current) => Math.max(0, current - 10));
  };

  return (
    <div className="game-play">
      <div className="volcano">🌋</div>

      <div className="heat-bar">
        <div
          className="heat-progress"
          style={{ width: `${heat}%` }}
        />
      </div>

      <p className="game-hint">
        Tap slowly and cool the volcano.
      </p>

      {heat > 0 ? (
        <button
          type="button"
          className="primary-game-button"
          onClick={coolDown}
        >
          🧊 Cool It Down
        </button>
      ) : (
        <div className="game-complete">
          <div className="complete-emoji">❄️</div>
          <h3>So calm!</h3>
          <p>You cooled the volcano.</p>

          <button
            type="button"
            className="primary-game-button"
            onClick={onFinish}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}

function SlowGame({ onFinish }) {
  const [count, setCount] = useState(0);

  const tap = () => {
    setCount((current) => current + 1);
  };

  return (
    <div className="game-play centered-game">
      <div className="slow-circle">
        {count < 5 ? count : "💗"}
      </div>

      {count < 5 ? (
        <>
          <p className="game-hint">
            Take one slow tap at a time.
          </p>

          <button
            type="button"
            className="primary-game-button"
            onClick={tap}
          >
            Tap Slowly
          </button>
        </>
      ) : (
        <>
          <h3>Nice and calm! 🌿</h3>

          <button
            type="button"
            className="primary-game-button"
            onClick={onFinish}
          >
            Finish
          </button>
        </>
      )}
    </div>
  );
}

function BreathingGame({ onFinish }) {
  const [step, setStep] = useState("Breathe In");
  const [round, setRound] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) =>
        current === "Breathe In" ? "Breathe Out" : "Breathe In"
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextRound = () => {
    if (round >= 3) {
      onFinish();
      return;
    }

    setRound((current) => current + 1);
  };

  return (
    <div className="game-play centered-game">
      <div className={`breathing-circle ${step === "Breathe In" ? "in" : "out"}`}>
        <span>{step}</span>
      </div>

      <p className="game-hint">
        Round {Math.min(round + 1, 4)} of 4
      </p>

      <button
        type="button"
        className="primary-game-button"
        onClick={nextRound}
      >
        {round >= 3 ? "Finish" : "I'm Ready"}
      </button>
    </div>
  );
}

function CountdownGame({ onFinish }) {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="game-play centered-game">
      <div className="countdown-number">
        {seconds}
      </div>

      {seconds > 0 ? (
        <p className="game-hint">
          Slowly breathe and watch the number.
        </p>
      ) : (
        <>
          <h3>You're here. You're safe. 🌿</h3>

          <button
            type="button"
            className="primary-game-button"
            onClick={onFinish}
          >
            Finish
          </button>
        </>
      )}
    </div>
  );
}

function FindGame({ onFinish }) {
  const [items, setItems] = useState(() =>
    shuffle(["🍃", "🍂", "🌿", "🍃", "🌱", "🍂"])
  );
  const [found, setFound] = useState(false);

  const choose = (item, index) => {
    if (item === "🍃") {
      setFound(true);
      return;
    }

    setItems((current) => {
      const next = [...current];
      next[index] = "🌱";
      return next;
    });
  };

  return (
    <div className="game-play">
      <div className="find-grid">
        {items.map((item, index) => (
          <button
            type="button"
            key={`${item}-${index}`}
            className="find-item"
            onClick={() => choose(item, index)}
          >
            {item}
          </button>
        ))}
      </div>

      {found && (
        <div className="game-complete">
          <div className="complete-emoji">🍃</div>
          <h3>You found the calm!</h3>

          <button
            type="button"
            className="primary-game-button"
            onClick={onFinish}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}

function MemoryGame({ onFinish, game }) {
  const items = useMemo(() => {
    if (game.id === "clouds") {
      return ["☁️", "☁️", "🌙", "🌙", "⭐", "⭐", "💤", "💤"];
    }

    return MEMORY_ITEMS;
  }, [game.id]);

  const [cards] = useState(() => shuffle(items));
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);

  const chooseCard = (index) => {
    if (
      open.includes(index) ||
      matched.includes(index) ||
      open.length >= 2
    ) {
      return;
    }

    const nextOpen = [...open, index];
    setOpen(nextOpen);

    if (nextOpen.length === 2) {
      const [first, second] = nextOpen;

      if (cards[first] === cards[second]) {
        setMatched((current) => [
          ...current,
          first,
          second,
        ]);

        setOpen([]);
      } else {
        setTimeout(() => {
          setOpen([]);
        }, 650);
      }
    }
  };

  const complete = matched.length === cards.length;

  return (
    <div className="game-play">
      <div className="memory-grid">
        {cards.map((card, index) => {
          const visible =
            open.includes(index) ||
            matched.includes(index);

          return (
            <button
              type="button"
              key={index}
              className={`memory-card ${
                visible ? "visible" : ""
              }`}
              onClick={() => chooseCard(index)}
            >
              {visible ? card : "?"}
            </button>
          );
        })}
      </div>

      {complete && (
        <div className="game-complete">
          <div className="complete-emoji">🧠</div>
          <h3>Perfect match!</h3>

          <button
            type="button"
            className="primary-game-button"
            onClick={onFinish}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}

function ScrambleGame({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(false);

  const current = SCRAMBLES[index];

  const checkAnswer = () => {
    if (answer.trim().toUpperCase() === current.answer) {
      setCorrect(true);
    }
  };

  const next = () => {
    if (index >= SCRAMBLES.length - 1) {
      onFinish();
      return;
    }

    setIndex((currentIndex) => currentIndex + 1);
    setAnswer("");
    setCorrect(false);
  };

  return (
    <div className="game-play centered-game">
      <div className="scramble-word">
        {current.letters}
      </div>

      <input
        className="game-input"
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Type the word..."
        autoComplete="off"
      />

      {!correct ? (
        <button
          type="button"
          className="primary-game-button"
          onClick={checkAnswer}
        >
          Check
        </button>
      ) : (
        <>
          <div className="correct-message">
            Correct! 🎉
          </div>

          <button
            type="button"
            className="primary-game-button"
            onClick={next}
          >
            {index === SCRAMBLES.length - 1
              ? "Finish"
              : "Next"}
          </button>
        </>
      )}
    </div>
  );
}

function QuizGame({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const current = QUIZ[index];

  const choose = (answerIndex) => {
    if (selected !== null) return;

    setSelected(answerIndex);

    if (answerIndex === current.correct) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const next = () => {
    if (index >= QUIZ.length - 1) {
      onFinish();
      return;
    }

    setIndex((currentIndex) => currentIndex + 1);
    setSelected(null);
  };

  return (
    <div className="game-play">
      <div className="quiz-progress">
        Question {index + 1}/{QUIZ.length}
      </div>

      <h3 className="quiz-question">
        {current.question}
      </h3>

      <div className="quiz-options">
        {current.answers.map((answer, answerIndex) => (
          <button
            type="button"
            key={answer}
            className={`quiz-option ${
              selected === answerIndex ? "selected" : ""
            }`}
            onClick={() => choose(answerIndex)}
          >
            {answer}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="quiz-bottom">
          <p>
            {selected === current.correct
              ? "Awesome! 🎉"
              : "Nice try! Keep learning. 🌱"}
          </p>

          <button
            type="button"
            className="primary-game-button"
            onClick={next}
          >
            {index === QUIZ.length - 1
              ? `Finish (${score}/${QUIZ.length})`
              : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}

function GamePlayer({ game, onBack }) {
  const finish = () => {
    onBack();
  };

  let content;

  if (game.type === "tap") {
    content = (
      <TapGame
        game={game}
        onFinish={finish}
      />
    );
  }

  if (game.type === "cards") {
    content = (
      <CardsGame
        game={game}
        onFinish={finish}
      />
    );
  }

  if (game.type === "cool") {
    content = <CoolGame onFinish={finish} />;
  }

  if (game.type === "slow") {
    content = <SlowGame onFinish={finish} />;
  }

  if (game.type === "breathing") {
    content = <BreathingGame onFinish={finish} />;
  }

  if (game.type === "countdown") {
    content = <CountdownGame onFinish={finish} />;
  }

  if (game.type === "find") {
    content = <FindGame onFinish={finish} />;
  }

  if (game.type === "memory") {
    content = (
      <MemoryGame
        game={game}
        onFinish={finish}
      />
    );
  }

  if (game.type === "scramble") {
    content = <ScrambleGame onFinish={finish} />;
  }

  if (game.type === "quiz") {
    content = <QuizGame onFinish={finish} />;
  }

  return (
    <div className="games-page">
      <div className="games-header">
        <button
          type="button"
          className="games-back"
          onClick={onBack}
        >
          ←
        </button>

        <img src="/miko.png" alt="Miko" />

        <div>
          <h1>Miko's Game</h1>
          <p>Let's play together 💗</p>
        </div>
      </div>

      <div className="game-player">
        <div className="game-title">
          <span>{game.emoji}</span>
          <div>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
          </div>
        </div>

        {content}
      </div>
    </div>
  );
}

function MoodSelection({ onBack, onSelectMood }) {
  return (
    <div className="games-page">
      <div className="games-header">
        <button
          type="button"
          className="games-back"
          onClick={onBack}
        >
          ←
        </button>

        <img src="/miko.png" alt="Miko" />

        <div>
          <h1>Play with Miko</h1>
          <p>How are you feeling today? 💗</p>
        </div>
      </div>

      <div className="mood-content">
        <h2>Choose your mood</h2>

        <p className="mood-subtitle">
          Miko will choose three games that fit your mood.
        </p>

        <div className="mood-grid">
          {MOODS.map((mood) => (
            <button
              type="button"
              key={mood.id}
              className={`mood-card mood-${mood.id}`}
              onClick={() => onSelectMood(mood.id)}
            >
              <span className="mood-emoji">
                {mood.emoji}
              </span>

              <strong>{mood.name}</strong>

              <small>{mood.description}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameChoices({
  mood,
  onBack,
  onSelectGame,
}) {
  const moodInfo = MOODS.find(
    (item) => item.id === mood
  );

  return (
    <div className="games-page">
      <div className="games-header">
        <button
          type="button"
          className="games-back"
          onClick={onBack}
        >
          ←
        </button>

        <img src="/miko.png" alt="Miko" />

        <div>
          <h1>
            {moodInfo?.emoji} {moodInfo?.name} Games
          </h1>

          <p>Pick one and let's play!</p>
        </div>
      </div>

      <div className="game-choice-content">
        <div className="chosen-mood">
          <span>{moodInfo?.emoji}</span>

          <div>
            <strong>
              Games for when you're {moodInfo?.name.toLowerCase()}
            </strong>

            <p>{moodInfo?.description}</p>
          </div>
        </div>

        <div className="game-grid">
          {GAMES[mood].map((game, index) => (
            <button
              type="button"
              key={game.id}
              className="game-card"
              onClick={() => onSelectGame(game)}
            >
              <div className="game-number">
                Game {index + 1}
              </div>

              <div className="game-card-emoji">
                {game.emoji}
              </div>

              <h3>{game.title}</h3>

              <p>{game.description}</p>

              <span className="play-now">
                Play →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Games({ onBack }) {
  const [stage, setStage] = useState("mood");
  const [mood, setMood] = useState(null);
  const [game, setGame] = useState(null);

  const selectMood = (selectedMood) => {
    setMood(selectedMood);
    setStage("games");
  };

  const selectGame = (selectedGame) => {
    setGame(selectedGame);
    setStage("play");
  };

  const goBack = () => {
    if (stage === "play") {
      setGame(null);
      setStage("games");
      return;
    }

    if (stage === "games") {
      setMood(null);
      setStage("mood");
      return;
    }

    onBack();
  };

  if (stage === "play") {
    return (
      <GamePlayer
        game={game}
        onBack={goBack}
      />
    );
  }

  if (stage === "games") {
    return (
      <GameChoices
        mood={mood}
        onBack={goBack}
        onSelectGame={selectGame}
      />
    );
  }

  return (
    <MoodSelection
      onBack={goBack}
      onSelectMood={selectMood}
    />
  );
}