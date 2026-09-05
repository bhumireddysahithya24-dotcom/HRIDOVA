import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './JayPlay.css';

const moods = [
  { id: 'joy', label: 'Joy', emoji: '😊' },
  { id: 'sadness', label: 'Sadness', emoji: '😢' },
  { id: 'anger', label: 'Anger', emoji: '😠' },
  { id: 'fear', label: 'Fear', emoji: '😨' },
  { id: 'confused', label: 'Confused', emoji: '😵' },
];

const moodDescriptions = {
  joy: 'Feeling happy? Let\'s celebrate with some fun games!',
  sadness: 'Having a tough day? These calming games might help.',
  anger: 'Need to release some energy? Try these active games!',
  fear: 'Feeling anxious? Let\'s build confidence with these challenges!',
  confused: 'Mind feeling foggy? These brain games can help clear it up!',
};

const gamesByMood = {
  joy: [
    {
      id: 'star-catcher',
      name: 'Star Catcher',
      emoji: '⭐',
      description: 'Catch falling stars!',
      controls: '← → or A/D to move',
    },
    {
      id: 'coin-rush',
      name: 'Coin Rush',
      emoji: '🪙',
      description: 'Collect coins quickly!',
      controls: 'Arrow keys or WASD',
    },
    {
      id: 'balloon-blast',
      name: 'Balloon Blast',
      emoji: '🎈',
      description: 'Pop balloons fast!',
      controls: 'Click/Tap balloons',
    },
  ],

  sadness: [
    {
      id: 'build-rainbow',
      name: 'Build a Rainbow',
      emoji: '🌈',
      description: 'Place colors correctly!',
      controls: 'Click colors in order',
    },
    {
      id: 'light-stars',
      name: 'Light the Stars',
      emoji: '✨',
      description: 'Light up the stars!',
      controls: 'Click/Tap stars',
    },
    {
      id: 'collect-sunshine',
      name: 'Collect Sunshine',
      emoji: '☀️',
      description: 'Gather sunshine rays!',
      controls: 'Arrow keys to move',
    },
  ],

  anger: [
    {
      id: 'pop-bubbles',
      name: 'Pop Bubbles',
      emoji: '🫧',
      description: 'Pop anger bubbles!',
      controls: 'Click/Tap bubbles',
    },
    {
      id: 'smash-targets',
      name: 'Smash Targets',
      emoji: '🎯',
      description: 'Smash the targets!',
      controls: 'Click/Tap targets',
    },
    {
      id: 'cool-volcano',
      name: 'Cool Volcano',
      emoji: '🌋',
      description: 'Cool the volcano!',
      controls: 'Click water drops',
    },
  ],

  fear: [
    {
      id: 'brave-path',
      name: 'Brave Path',
      emoji: '🛤️',
      description: 'Navigate the path!',
      controls: 'Arrow keys/WASD',
    },
    {
      id: 'monster-escape',
      name: 'Monster Escape',
      emoji: '👾',
      description: 'Escape the monsters!',
      controls: 'Arrow keys + Space',
    },
    {
      id: 'courage-shield',
      name: 'Courage Shield',
      emoji: '🛡️',
      description: 'Block incoming objects!',
      controls: 'Move + Space',
    },
  ],

  confused: [
    {
      id: 'pattern-detective',
      name: 'Pattern Detective',
      emoji: '🔍',
      description: 'Find the pattern!',
      controls: 'Click correct answer',
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      emoji: '📦',
      description: 'Sort items fast!',
      controls: 'Click to sort',
    },
    {
      id: 'puzzle-escape',
      name: 'Puzzle Escape',
      emoji: '🧩',
      description: 'Escape the maze!',
      controls: 'Arrow keys/WASD',
    },
  ],
};

function JayPlay() {
  // React Router navigation
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState('joy');
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const [player, setPlayer] = useState({ x: 50, y: 80 });
  const [objects, setObjects] = useState([]);
  const [targets, setTargets] = useState([]);
  const [monsters, setMonsters] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [rainbowPieces, setRainbowPieces] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);

  const [puzzleState, setPuzzleState] = useState({
    pattern: [],
    answer: '',
    options: [],
  });

  const [volcanoLevel, setVolcanoLevel] = useState(50);
  const [shieldActive, setShieldActive] = useState(false);
  const [direction, setDirection] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const [feedback, setFeedback] = useState('');

  const gameAreaRef = useRef(null);
  const keysPressed = useRef({});
  const gameLoopRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  const cleanupGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }

    keysPressed.current = {};
  }, []);

  const resetGame = useCallback(() => {
    cleanupGame();

    setScore(0);
    setTimeLeft(30);
    setPlayer({ x: 50, y: 80 });
    setObjects([]);
    setTargets([]);
    setMonsters([]);
    setObstacles([]);
    setRainbowPieces([]);
    setSortedItems([]);

    setPuzzleState({
      pattern: [],
      answer: '',
      options: [],
    });

    setVolcanoLevel(50);
    setShieldActive(false);

    setDirection({
      left: false,
      right: false,
      up: false,
      down: false,
    });

    setFeedback('');
  }, [cleanupGame]);

  const startGame = () => {
    resetGame();
    setGameState('playing');

    const gameId = selectedGame?.id;

    if (gameId === 'star-catcher') {
      setObjects([
        { id: 1, x: 30, y: 20, type: 'star' },
        { id: 2, x: 70, y: 30, type: 'star' },
      ]);
    }

    else if (gameId === 'coin-rush') {
      setObjects([
        { id: 1, x: 30, y: 40, type: 'coin' },
        { id: 2, x: 70, y: 60, type: 'coin' },
      ]);
    }

    else if (
      ['balloon-blast', 'pop-bubbles', 'smash-targets'].includes(gameId)
    ) {
      const initialTargets = [];

      for (let i = 0; i < 5; i++) {
        initialTargets.push({
          id: Date.now() + i,
          x: Math.random() * 70 + 15,
          y: Math.random() * 70 + 15,
        });
      }

      setTargets(initialTargets);
    }

    else if (gameId === 'build-rainbow') {
      setRainbowPieces([
        { id: 1, color: 'red', placed: false },
        { id: 2, color: 'orange', placed: false },
        { id: 3, color: 'yellow', placed: false },
        { id: 4, color: 'green', placed: false },
        { id: 5, color: 'blue', placed: false },
      ]);
    }

    else if (gameId === 'light-stars') {
      const stars = [];

      for (let i = 0; i < 8; i++) {
        stars.push({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          lit: false,
        });
      }

      setObjects(stars);
    }

    else if (gameId === 'collect-sunshine') {
      setObjects([
        { id: 1, x: 40, y: 40, type: 'sun' },
        { id: 2, x: 70, y: 50, type: 'sun' },
      ]);
    }

    else if (gameId === 'cool-volcano') {
      setTargets([
        { id: 1, x: 50, y: 50, type: 'water' },
      ]);
    }

    else if (gameId === 'brave-path') {
      setObstacles([
        { id: 1, x: 40, y: 60, width: 20 },
        { id: 2, x: 60, y: 40, width: 20 },
      ]);

      setPlayer({ x: 20, y: 80 });
    }

    else if (gameId === 'monster-escape') {
      setMonsters([
        { id: 1, x: 40, y: 50 },
        { id: 2, x: 60, y: 40 },
      ]);

      setPlayer({ x: 20, y: 80 });
    }

    else if (gameId === 'courage-shield') {
      setTargets([
        { id: 1, x: 30, y: 20, active: true },
        { id: 2, x: 70, y: 30, active: true },
      ]);
    }

    else if (gameId === 'pattern-detective') {
      const patterns = [
        {
          pattern: ['⭐', '🌙', '⭐', '🌙'],
          answer: '⭐',
        },
        {
          pattern: ['🔵', '🔴', '🔵', '🔴'],
          answer: '🔵',
        },
        {
          pattern: ['🟦', '🔺', '🟦', '🔺'],
          answer: '🟦',
        },
        {
          pattern: ['⭐', '⭐', '🌙', '⭐', '⭐'],
          answer: '🌙',
        },
      ];

      const selected =
        patterns[Math.floor(Math.random() * patterns.length)];

      const options = [
        '⭐',
        '🌙',
        '🔵',
        '🔴',
        '🟦',
        '🔺',
      ]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      if (!options.includes(selected.answer)) {
        options[0] = selected.answer;
      }

      setPuzzleState({
        pattern: selected.pattern,
        answer: selected.answer,
        options,
      });
    }

    else if (gameId === 'quick-sort') {
      setSortedItems([
        { id: 1, type: 'circle', sorted: false },
        { id: 2, type: 'square', sorted: false },
        { id: 3, type: 'circle', sorted: false },
        { id: 4, type: 'square', sorted: false },
        { id: 5, type: 'circle', sorted: false },
      ]);
    }

    else if (gameId === 'puzzle-escape') {
      setObstacles([
        { id: 1, x: 30, y: 50, width: 15 },
        { id: 2, x: 60, y: 40, width: 15 },
      ]);

      setPlayer({ x: 15, y: 80 });
    }
  };

  const endGame = (won) => {
    cleanupGame();
    setGameState('gameover');
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && gameState === 'playing') {
      endGame(false);
    }
  }, [gameState, timeLeft]);

  // Keyboard input
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      if (
        e.code === 'Space' &&
        selectedGame?.id === 'courage-shield'
      ) {
        setShieldActive(true);
      }

      if (
        e.code === 'Space' &&
        selectedGame?.id === 'monster-escape'
      ) {
        setPlayer((p) => ({
          ...p,
          y: Math.max(5, p.y - 15),
        }));
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;

      if (
        e.code === 'Space' &&
        selectedGame?.id === 'courage-shield'
      ) {
        setShieldActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, selectedGame]);

  // Mobile controls
  const handleMobileControl = (dir, active) => {
    if (gameState !== 'playing') return;

    if (dir === 'shield') {
      if (selectedGame?.id === 'courage-shield') {
        setShieldActive(active);
      }
    }

    else if (dir === 'jump') {
      if (
        active &&
        selectedGame?.id === 'monster-escape'
      ) {
        setPlayer((p) => ({
          ...p,
          y: Math.max(5, p.y - 15),
        }));
      }
    }

    else {
      setDirection((prev) => ({
        ...prev,
        [dir]: active,
      }));
    }
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameId = selectedGame?.id;

    gameLoopRef.current = setInterval(() => {
      // Movement games
      if (
        [
          'coin-rush',
          'collect-sunshine',
          'brave-path',
          'monster-escape',
          'puzzle-escape',
        ].includes(gameId)
      ) {
        setPlayer((p) => {
          let newX = p.x;
          let newY = p.y;
          const speed = 3;

          if (
            keysPressed.current['arrowleft'] ||
            keysPressed.current['a']
          ) {
            newX -= speed;
          }

          if (
            keysPressed.current['arrowright'] ||
            keysPressed.current['d']
          ) {
            newX += speed;
          }

          if (
            keysPressed.current['arrowup'] ||
            keysPressed.current['w']
          ) {
            newY -= speed;
          }

          if (
            keysPressed.current['arrowdown'] ||
            keysPressed.current['s']
          ) {
            newY += speed;
          }

          if (direction.left) newX -= speed;
          if (direction.right) newX += speed;
          if (direction.up) newY -= speed;
          if (direction.down) newY += speed;

          return {
            ...p,
            x: Math.max(5, Math.min(95, newX)),
            y: Math.max(5, Math.min(90, newY)),
          };
        });
      }

      // Star catcher
      if (gameId === 'star-catcher') {
        setPlayer((p) => {
          let newX = p.x;
          const speed = 4;

          if (
            keysPressed.current['arrowleft'] ||
            keysPressed.current['a'] ||
            direction.left
          ) {
            newX -= speed;
          }

          if (
            keysPressed.current['arrowright'] ||
            keysPressed.current['d'] ||
            direction.right
          ) {
            newX += speed;
          }

          return {
            ...p,
            x: Math.max(5, Math.min(95, newX)),
          };
        });
      }

      // Spawn objects
      if (
        [
          'star-catcher',
          'coin-rush',
          'collect-sunshine',
        ].includes(gameId)
      ) {
        if (Math.random() < 0.05) {
          setObjects((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: Math.random() * 80 + 10,
              y: 5,
              type:
                gameId === 'star-catcher'
                  ? 'star'
                  : gameId === 'coin-rush'
                    ? 'coin'
                    : 'sun',
            },
          ]);
        }
      }

      // Move falling objects
      if (
        [
          'star-catcher',
          'coin-rush',
          'collect-sunshine',
        ].includes(gameId)
      ) {
        setObjects((prev) =>
          prev
            .map((obj) => ({
              ...obj,
              y:
                obj.y +
                (gameId === 'star-catcher' ? 2 : 1.5),
            }))
            .filter((obj) => obj.y < 95)
        );
      }

      // Move monsters
      if (gameId === 'monster-escape') {
        setMonsters((prev) =>
          prev.map((m) => {
            const dx = player.x - m.x;
            const dy = player.y - m.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            return {
              ...m,
              x: m.x + (dx / dist) * 0.8,
              y: m.y + (dy / dist) * 0.8,
            };
          })
        );
      }

      // Shield game
      if (gameId === 'courage-shield') {
        setTargets((prev) =>
          prev
            .map((t) => ({
              ...t,
              y: t.y + 1.5,
            }))
            .filter((t) => t.y < 95 && t.active)
        );

        if (Math.random() < 0.04) {
          setTargets((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: Math.random() * 80 + 10,
              y: 5,
              active: true,
            },
          ]);
        }
      }

      // Balloons / bubbles
      if (
        ['balloon-blast', 'pop-bubbles'].includes(gameId)
      ) {
        setTargets((prev) =>
          prev.map((t) => ({
            ...t,
            x: Math.max(
              10,
              Math.min(
                90,
                t.x + (Math.random() - 0.5) * 3
              )
            ),
            y: Math.max(
              10,
              Math.min(
                90,
                t.y + (Math.random() - 0.5) * 3
              )
            ),
          }))
        );

        if (targets.length < 3 && Math.random() < 0.03) {
          setTargets((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: Math.random() * 70 + 15,
              y: Math.random() * 70 + 15,
            },
          ]);
        }
      }

      // Volcano
      if (gameId === 'cool-volcano') {
        setVolcanoLevel((prev) =>
          Math.min(100, prev + 0.3)
        );

        if (Math.random() < 0.02) {
          setTargets((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10,
              type: 'water',
            },
          ]);
        }
      }
    }, 50);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [
    gameState,
    selectedGame,
    player.x,
    player.y,
    direction,
    targets.length,
  ]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameId = selectedGame?.id;

    if (
      [
        'star-catcher',
        'coin-rush',
        'collect-sunshine',
      ].includes(gameId)
    ) {
      objects.forEach((obj) => {
        if (
          Math.abs(obj.x - player.x) < 10 &&
          Math.abs(obj.y - player.y) < 10 &&
          obj.y > 75
        ) {
          setScore((s) => s + 10);

          setObjects((prev) =>
            prev.filter((o) => o.id !== obj.id)
          );
        }
      });
    }

    if (gameId === 'monster-escape') {
      monsters.forEach((m) => {
        if (
          Math.abs(m.x - player.x) < 8 &&
          Math.abs(m.y - player.y) < 8
        ) {
          setScore((s) => Math.max(0, s - 5));
        }
      });

      if (player.y < 10) {
        setScore((s) => s + 50);
        endGame(true);
      }
    }

    if (gameId === 'brave-path') {
      obstacles.forEach((obs) => {
        if (
          Math.abs(obs.x - player.x) < obs.width &&
          Math.abs(obs.y - player.y) < 10
        ) {
          setPlayer((p) => ({
            ...p,
            y: p.y + 5,
          }));
        }
      });

      if (player.y < 10) {
        setScore((s) => s + 50);
        endGame(true);
      }
    }

    if (gameId === 'courage-shield') {
      targets.forEach((t) => {
        if (
          t.active &&
          t.y > 85 &&
          Math.abs(t.x - player.x) < 10
        ) {
          if (shieldActive) {
            setScore((s) => s + 10);

            setTargets((prev) =>
              prev.filter((obj) => obj.id !== t.id)
            );
          }

          else {
            setScore((s) =>
              Math.max(0, s - 5)
            );
          }
        }
      });
    }

    if (
      gameId === 'cool-volcano' &&
      volcanoLevel >= 100
    ) {
      setScore(50);
      endGame(true);
    }

    if (
      gameId === 'light-stars' &&
      objects.length > 0 &&
      objects.every((o) => o.lit)
    ) {
      setScore(50);
      endGame(true);
    }

    if (
      gameId === 'build-rainbow' &&
      rainbowPieces.length > 0 &&
      rainbowPieces.every((p) => p.placed)
    ) {
      setScore(50);
      endGame(true);
    }

    if (
      gameId === 'puzzle-escape' &&
      player.y < 10
    ) {
      setScore((s) => s + 50);
      endGame(true);
    }

    if (
      gameId === 'quick-sort' &&
      sortedItems.length > 0 &&
      sortedItems.every((i) => i.sorted)
    ) {
      setScore(50);
      endGame(true);
    }
  }, [
    gameState,
    selectedGame,
    player,
    objects,
    monsters,
    obstacles,
    targets,
    volcanoLevel,
    rainbowPieces,
    shieldActive,
    sortedItems,
  ]);

  // Pattern Detective
  const handlePatternAnswer = (selectedOption) => {
    if (
      gameState !== 'playing' ||
      selectedGame?.id !== 'pattern-detective'
    ) {
      return;
    }

    if (selectedOption === puzzleState.answer) {
      setScore((s) => s + 25);
      setFeedback('✓ Correct!');

      feedbackTimeoutRef.current = setTimeout(() => {
        const patterns = [
          {
            pattern: ['⭐', '🌙', '⭐', '🌙'],
            answer: '⭐',
          },
          {
            pattern: ['🔵', '🔴', '🔵', '🔴'],
            answer: '🔵',
          },
          {
            pattern: ['🟦', '🔺', '🟦', '🔺'],
            answer: '🟦',
          },
          {
            pattern: ['⭐', '⭐', '🌙', '⭐', '⭐'],
            answer: '🌙',
          },
        ];

        const selected =
          patterns[Math.floor(Math.random() * patterns.length)];

        const options = [
          '⭐',
          '🌙',
          '🔵',
          '🔴',
          '🟦',
          '🔺',
        ]
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        if (!options.includes(selected.answer)) {
          options[0] = selected.answer;
        }

        setPuzzleState({
          pattern: selected.pattern,
          answer: selected.answer,
          options,
        });

        setFeedback('');
      }, 800);
    }

    else {
      setFeedback('✗ Try again!');

      feedbackTimeoutRef.current = setTimeout(
        () => setFeedback(''),
        800
      );
    }
  };

  // Quick Sort
  const handleSortClick = (itemId) => {
    if (
      gameState !== 'playing' ||
      selectedGame?.id !== 'quick-sort'
    ) {
      return;
    }

    setSortedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, sorted: true }
          : item
      )
    );

    setScore((s) => s + 10);
  };

  // Game area click
  const handleGameClick = (e) => {
    if (
      gameState !== 'playing' ||
      !gameAreaRef.current
    ) {
      return;
    }

    e.stopPropagation();

    const rect =
      gameAreaRef.current.getBoundingClientRect();

    const clickX =
      ((e.clientX - rect.left) / rect.width) * 100;

    const clickY =
      ((e.clientY - rect.top) / rect.height) * 100;

    const gameId = selectedGame?.id;

    if (
      [
        'balloon-blast',
        'pop-bubbles',
        'smash-targets',
      ].includes(gameId)
    ) {
      const hit = targets.find(
        (t) =>
          Math.abs(t.x - clickX) < 12 &&
          Math.abs(t.y - clickY) < 12
      );

      if (hit) {
        setScore((s) => s + 10);

        setTargets((prev) =>
          prev.filter((t) => t.id !== hit.id)
        );
      }
    }

    if (gameId === 'cool-volcano') {
      const hit = targets.find(
        (t) =>
          Math.abs(t.x - clickX) < 12 &&
          Math.abs(t.y - clickY) < 12
      );

      if (hit) {
        setVolcanoLevel((v) =>
          Math.max(0, v - 15)
        );

        setTargets((prev) =>
          prev.filter((t) => t.id !== hit.id)
        );
      }
    }

    if (gameId === 'light-stars') {
      const hit = objects.find(
        (o) =>
          !o.lit &&
          Math.abs(o.x - clickX) < 12 &&
          Math.abs(o.y - clickY) < 12
      );

      if (hit) {
        setScore((s) => s + 10);

        setObjects((prev) =>
          prev.map((o) =>
            o.id === hit.id
              ? { ...o, lit: true }
              : o
          )
        );
      }
    }

    if (gameId === 'build-rainbow') {
      const colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ];

      const colorIndex = Math.floor(
        (clickX / 100) * colors.length
      );

      const clickedColor = colors[colorIndex];

      const nextPiece =
        rainbowPieces.find((p) => !p.placed);

      if (
        nextPiece &&
        nextPiece.color === clickedColor
      ) {
        setScore((s) => s + 10);

        setRainbowPieces((prev) =>
          prev.map((p) =>
            p.id === nextPiece.id
              ? { ...p, placed: true }
              : p
          )
        );
      }
    }
  };

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setSelectedGame(null);
    setGameState('menu');
    resetGame();
  };

  // IMPORTANT:
  // This now returns to the actual Jay World route.
  const handleBack = () => {
    cleanupGame();
    resetGame();
    navigate('/jay');
  };

  const handleBackToHome = () => {
    handleBack();
  };

  const currentGames = gamesByMood[selectedMood];

  return (
    <div className={`jay-play-page theme-${selectedMood}`}>

      <div className="jay-top-bar">
        <button
          className="btn-back-jay"
          onClick={handleBackToHome}
        >
          ← Back
        </button>

        <span className="jay-title-small">
          JayPlay
        </span>
      </div>

      <div className="jay-play-header">
        <h1>🎮 Jay's Gaming World</h1>
        <p className="jay-subtitle">
          Pick your mood, choose your game!
        </p>
      </div>

      {!selectedGame && (
        <>
          <div className="jay-mood-nav">
            {moods.map((mood) => (
              <button
                key={mood.id}
                className={`jay-mood-btn theme-${mood.id} ${
                  selectedMood === mood.id
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleMoodSelect(mood.id)
                }
              >
                <span className="mood-emoji">
                  {mood.emoji}
                </span>

                <span className="mood-label">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>

          <div className="jay-mood-info">
            <h2>
              {
                moods.find(
                  (m) => m.id === selectedMood
                )?.emoji
              }{' '}
              {
                moods.find(
                  (m) => m.id === selectedMood
                )?.label
              }
            </h2>

            <p>
              {moodDescriptions[selectedMood]}
            </p>
          </div>

          <ul className="jay-games-grid">
            {currentGames.map((game) => (
              <li
                key={game.id}
                className="jay-game-card"
              >
                <h3>
                  {game.emoji} {game.name}
                </h3>

                <p>{game.description}</p>

                <button
                  className="play-badge"
                  onClick={() =>
                    setSelectedGame(game)
                  }
                >
                  Play Now
                </button>
              </li>
            ))}
          </ul>

          <div className="jay-play-footer">
            Select a mood that matches how you feel,
            then pick a game to play!
          </div>
        </>
      )}

      {selectedGame && (
        <div className="game-container">

          <div className="game-header">
            <h2>
              {selectedGame.emoji}{' '}
              {selectedGame.name}
            </h2>

            <p>
              {selectedGame.description}
            </p>
          </div>

          <div className="game-stats">
            <span>
              Score: {score}
            </span>

            <span>
              Time: {timeLeft}s
            </span>
          </div>

          <div
            className="game-area"
            ref={gameAreaRef}
            onClick={handleGameClick}
            style={{
              pointerEvents: 'auto',
            }}
          >

            {gameState === 'menu' && (
              <div className="game-start-screen">

                <h3>How to Play</h3>

                <p
                  style={{
                    color: '#c7d2fe',
                    marginBottom: '1rem',
                  }}
                >
                  {selectedGame.controls}
                </p>

                <div className="game-actions">

                  <button
                    className="btn-primary"
                    onClick={startGame}
                  >
                    Start Game
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={handleBack}
                  >
                    Back
                  </button>

                </div>
              </div>
            )}

            {gameState === 'playing' && (
              <>
                {/* Movement Games */}
                {[
                  'star-catcher',
                  'coin-rush',
                  'collect-sunshine',
                  'brave-path',
                  'monster-escape',
                  'puzzle-escape',
                  'courage-shield',
                ].includes(selectedGame.id) && (
                  <div
                    className="player-jay"
                    style={{
                      left: `${player.x}%`,
                      top: `${player.y}%`,
                      fontSize: '32px',
                      pointerEvents: 'none',
                    }}
                  >
                    {selectedGame.id ===
                    'star-catcher'
                      ? '🤲'
                      : selectedGame.id ===
                        'coin-rush'
                        ? '😊'
                        : selectedGame.id ===
                          'collect-sunshine'
                          ? '☀️'
                          : selectedGame.id ===
                            'brave-path'
                            ? '🚶'
                            : selectedGame.id ===
                              'monster-escape'
                              ? '🏃'
                              : selectedGame.id ===
                                'puzzle-escape'
                                ? '🧭'
                                : '🛡️'}
                  </div>
                )}

                {/* Shield */}
                {selectedGame.id ===
                  'courage-shield' &&
                  shieldActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${player.x}%`,
                        top: `${player.y}%`,
                        fontSize: '40px',
                        transform:
                          'translate(-50%, -50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      🔵
                    </div>
                  )}

                {/* Falling Objects */}
                {[
                  'star-catcher',
                  'coin-rush',
                  'collect-sunshine',
                ].includes(selectedGame.id) &&
                  objects.map((obj) => (
                    <div
                      key={obj.id}
                      className="fall-item"
                      style={{
                        left: `${obj.x}%`,
                        top: `${obj.y}%`,
                        fontSize: '24px',
                        pointerEvents: 'none',
                      }}
                    >
                      {obj.type === 'star'
                        ? '⭐'
                        : obj.type === 'coin'
                          ? '🪙'
                          : '☀️'}
                    </div>
                  ))}

                {/* Click Targets */}
                {[
                  'balloon-blast',
                  'pop-bubbles',
                  'smash-targets',
                  'cool-volcano',
                ].includes(selectedGame.id) &&
                  targets.map((t) => (
                    <button
                      key={t.id}
                      className="rush-target good-target"
                      style={{
                        left: `${t.x}%`,
                        top: `${t.y}%`,
                        fontSize: '28px',
                        position: 'absolute',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        background: 'transparent',
                        border: 'none',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGameClick(e);
                      }}
                    >
                      {selectedGame.id ===
                      'balloon-blast'
                        ? '🎈'
                        : selectedGame.id ===
                          'pop-bubbles'
                          ? '🫧'
                          : selectedGame.id ===
                            'smash-targets'
                            ? '🎯'
                            : '💧'}
                    </button>
                  ))}

                {/* Monsters */}
                {selectedGame.id ===
                  'monster-escape' &&
                  monsters.map((m) => (
                    <div
                      key={m.id}
                      className="fall-item"
                      style={{
                        left: `${m.x}%`,
                        top: `${m.y}%`,
                        fontSize: '28px',
                        pointerEvents: 'none',
                      }}
                    >
                      👾
                    </div>
                  ))}

                {/* Light Stars */}
                {selectedGame.id ===
                  'light-stars' &&
                  objects.map((o) => (
                    <button
                      key={o.id}
                      className="fall-item"
                      style={{
                        left: `${o.x}%`,
                        top: `${o.y}%`,
                        fontSize: '24px',
                        opacity: o.lit ? 1 : 0.3,
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        background: 'transparent',
                        border: 'none',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!o.lit) {
                          setScore((s) => s + 10);

                          setObjects((prev) =>
                            prev.map((star) =>
                              star.id === o.id
                                ? {
                                    ...star,
                                    lit: true,
                                  }
                                : star
                            )
                          );
                        }
                      }}
                    >
                      ✨
                    </button>
                  ))}

                {/* Build Rainbow */}
                {selectedGame.id ===
                  'build-rainbow' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <p
                      style={{
                        color: '#c7d2fe',
                        marginBottom: '20px',
                      }}
                    >
                      Click colors in order:
                      Red → Orange → Yellow →
                      Green → Blue
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                      }}
                    >
                      {[
                        'red',
                        'orange',
                        'yellow',
                        'green',
                        'blue',
                      ].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            const nextPiece =
                              rainbowPieces.find(
                                (p) => !p.placed
                              );

                            if (
                              nextPiece &&
                              nextPiece.color ===
                                color
                            ) {
                              setScore(
                                (s) => s + 10
                              );

                              setRainbowPieces(
                                (prev) =>
                                  prev.map((p) =>
                                    p.id ===
                                    nextPiece.id
                                      ? {
                                          ...p,
                                          placed:
                                            true,
                                        }
                                      : p
                                  )
                              );
                            }
                          }}
                          style={{
                            width: '50px',
                            height: '50px',
                            background:
                              rainbowPieces.find(
                                (p) =>
                                  p.color === color
                              )?.placed
                                ? color
                                : '#334155',
                            borderRadius: '8px',
                            border:
                              '2px solid white',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Sort */}
                {selectedGame.id ===
                  'quick-sort' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <p
                      style={{
                        color: '#c7d2fe',
                        marginBottom: '20px',
                      }}
                    >
                      Click items to sort them!
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {sortedItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            if (!item.sorted) {
                              handleSortClick(
                                item.id
                              );
                            }
                          }}
                          style={{
                            width: '50px',
                            height: '50px',
                            background:
                              item.sorted
                                ? '#22d3ee'
                                : '#334155',
                            borderRadius:
                              item.sorted
                                ? '50%'
                                : '8px',
                            border:
                              '2px solid white',
                            display: 'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                            fontSize: '20px',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                          }}
                        >
                          {item.type === 'circle'
                            ? '🔵'
                            : '🟦'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pattern Detective */}
                {selectedGame.id ===
                  'pattern-detective' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 10,
                    }}
                  >
                    <p
                      style={{
                        color: '#c7d2fe',
                        marginBottom: '20px',
                        fontSize: '1.1rem',
                      }}
                    >
                      What comes next?{' '}
                      {puzzleState.pattern.join(
                        ' '
                      )}{' '}
                      ?
                    </p>

                    {feedback && (
                      <div
                        style={{
                          color:
                            feedback.includes('✓')
                              ? '#22d3ee'
                              : '#f472b6',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          marginBottom: '15px',
                          minHeight: '30px',
                        }}
                      >
                        {feedback}
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                      }}
                    >
                      {puzzleState.options.map(
                        (option, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePatternAnswer(
                                option
                              );
                            }}
                            style={{
                              width: '70px',
                              height: '70px',
                              background: '#1e293b',
                              borderRadius: '12px',
                              border:
                                '2px solid #6366f1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '36px',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                              position: 'relative',
                              zIndex: 20,
                              transition:
                                'transform 0.1s, background 0.2s',
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.transform =
                                'scale(1.05)')
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.transform =
                                'scale(1)')
                            }
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Volcano */}
                {selectedGame.id ===
                  'cool-volcano' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '64px',
                        marginBottom: '20px',
                      }}
                    >
                      🌋
                    </div>

                    <div
                      style={{
                        width: '200px',
                        height: '30px',
                        background: '#334155',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        border:
                          '2px solid #6366f1',
                      }}
                    >
                      <div
                        style={{
                          width: `${volcanoLevel}%`,
                          height: '100%',
                          background:
                            'linear-gradient(90deg, #22d3ee, #f472b6)',
                          transition:
                            'width 0.3s',
                        }}
                      />
                    </div>

                    <p
                      style={{
                        color: '#c7d2fe',
                        marginTop: '10px',
                      }}
                    >
                      Click water drops to cool!
                    </p>
                  </div>
                )}

                {/* Finish Flag */}
                {[
                  'brave-path',
                  'monster-escape',
                  'puzzle-escape',
                ].includes(selectedGame.id) && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '5%',
                      fontSize: '36px',
                      transform:
                        'translateX(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    🏁
                  </div>
                )}

                {/* Obstacles */}
                {obstacles.map((obs) => (
                  <div
                    key={obs.id}
                    style={{
                      position: 'absolute',
                      left: `${obs.x}%`,
                      top: `${obs.y}%`,
                      width: `${obs.width}%`,
                      height: '20px',
                      background: '#f472b6',
                      borderRadius: '8px',
                      border: '2px solid white',
                      pointerEvents: 'none',
                    }}
                  />
                ))}

                {/* Mobile Controls */}
                {[
                  'star-catcher',
                  'coin-rush',
                  'collect-sunshine',
                  'brave-path',
                  'monster-escape',
                  'puzzle-escape',
                  'courage-shield',
                ].includes(selectedGame.id) && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform:
                        'translateX(-50%)',
                      display: 'flex',
                      gap: '10px',
                      pointerEvents: 'auto',
                      zIndex: 30,
                    }}
                  >
                    <button
                      className="btn-secondary"
                      style={{
                        padding: '10px 20px',
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={() =>
                        handleMobileControl(
                          'left',
                          true
                        )
                      }
                      onMouseUp={() =>
                        handleMobileControl(
                          'left',
                          false
                        )
                      }
                      onTouchStart={() =>
                        handleMobileControl(
                          'left',
                          true
                        )
                      }
                      onTouchEnd={() =>
                        handleMobileControl(
                          'left',
                          false
                        )
                      }
                    >
                      ←
                    </button>

                    <button
                      className="btn-secondary"
                      style={{
                        padding: '10px 20px',
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={() =>
                        handleMobileControl(
                          'up',
                          true
                        )
                      }
                      onMouseUp={() =>
                        handleMobileControl(
                          'up',
                          false
                        )
                      }
                      onTouchStart={() =>
                        handleMobileControl(
                          'up',
                          true
                        )
                      }
                      onTouchEnd={() =>
                        handleMobileControl(
                          'up',
                          false
                        )
                      }
                    >
                      ↑
                    </button>

                    <button
                      className="btn-secondary"
                      style={{
                        padding: '10px 20px',
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={() =>
                        handleMobileControl(
                          'down',
                          true
                        )
                      }
                      onMouseUp={() =>
                        handleMobileControl(
                          'down',
                          false
                        )
                      }
                      onTouchStart={() =>
                        handleMobileControl(
                          'down',
                          true
                        )
                      }
                      onTouchEnd={() =>
                        handleMobileControl(
                          'down',
                          false
                        )
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="btn-secondary"
                      style={{
                        padding: '10px 20px',
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={() =>
                        handleMobileControl(
                          'right',
                          true
                        )
                      }
                      onMouseUp={() =>
                        handleMobileControl(
                          'right',
                          false
                        )
                      }
                      onTouchStart={() =>
                        handleMobileControl(
                          'right',
                          true
                        )
                      }
                      onTouchEnd={() =>
                        handleMobileControl(
                          'right',
                          false
                        )
                      }
                    >
                      →
                    </button>

                    {selectedGame.id ===
                      'courage-shield' && (
                      <button
                        className="btn-primary"
                        style={{
                          padding: '10px 20px',
                          pointerEvents: 'auto',
                        }}
                        onMouseDown={() =>
                          handleMobileControl(
                            'shield',
                            true
                          )
                        }
                        onMouseUp={() =>
                          handleMobileControl(
                            'shield',
                            false
                          )
                        }
                        onTouchStart={() =>
                          handleMobileControl(
                            'shield',
                            true
                          )
                        }
                        onTouchEnd={() =>
                          handleMobileControl(
                            'shield',
                            false
                          )
                        }
                      >
                        🛡️
                      </button>
                    )}

                    {selectedGame.id ===
                      'monster-escape' && (
                      <button
                        className="btn-primary"
                        style={{
                          padding: '10px 20px',
                          pointerEvents: 'auto',
                        }}
                        onMouseDown={() =>
                          handleMobileControl(
                            'jump',
                            true
                          )
                        }
                        onMouseUp={() =>
                          handleMobileControl(
                            'jump',
                            false
                          )
                        }
                        onTouchStart={() =>
                          handleMobileControl(
                            'jump',
                            true
                          )
                        }
                        onTouchEnd={() =>
                          handleMobileControl(
                            'jump',
                            false
                          )
                        }
                      >
                        Jump
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Game Over */}
            {gameState === 'gameover' && (
              <div className="game-over-screen">

                <h3>
                  {score >= 30
                    ? '🎉 You Won!'
                    : 'Game Over!'}
                </h3>

                <p>
                  Final Score: {score}
                </p>

                <div className="game-actions">

                  <button
                    className="btn-primary"
                    onClick={startGame}
                  >
                    Play Again
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={handleBack}
                  >
                    Back
                  </button>

                </div>
              </div>
            )}

          </div>

          {gameState === 'playing' && (
            <div
              style={{
                textAlign: 'center',
                color: '#c7d2fe',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
              }}
            >
              {selectedGame.controls}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default JayPlay;