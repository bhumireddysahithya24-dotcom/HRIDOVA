const app = document.getElementById("app");

const selectedCharacter =
    localStorage.getItem("hridovaCharacter") ||
    new URLSearchParams(window.location.search).get("character") ||
    "Kairo";

let currentMood = "";
let currentGameId = "";

const moods = [
    {
        id: "happy",
        icon: "😊",
        name: "Happy",
        description: "Feeling joyful and bright!",
    },
    {
        id: "angry",
        icon: "😡",
        name: "Angry",
        description: "Need to let it out safely?",
    },
    {
        id: "sad",
        icon: "😢",
        name: "Sad",
        description: "Let’s find something gentle.",
    },
    {
        id: "confused",
        icon: "😕",
        name: "Confused",
        description: "Let’s make things clearer.",
    },
    {
        id: "alone",
        icon: "🥺",
        name: "Alone",
        description: "You are never truly alone.",
    },
];

const gamesByMood = {
    happy: [
        {
            id: "pet-puppy",
            icon: "🐶",
            name: "Pet Puppy",
            description: "Give the puppy some love!",
        },
        {
            id: "balloon-pop",
            icon: "🎈",
            name: "Balloon Pop",
            description: "Pop 10 happy balloons!",
        },
        {
            id: "sun-shine",
            icon: "☀️",
            name: "Sun Shine",
            description: "Collect 6 rays of sunshine!",
        },
    ],

    angry: [
        {
            id: "pillow-fight",
            icon: "🛋️",
            name: "Pillow Fight",
            description: "Tap soft pillows to release frustration!",
        },
        {
            id: "fire-water",
            icon: "🔥",
            name: "Fire & Water",
            description: "Cool every flame with water!",
        },
        {
            id: "angry-doodle",
            icon: "🎨",
            name: "Angry Doodle",
            description: "Turn angry scribbles into sparkles.",
        },
    ],

    sad: [
        {
            id: "blow-clouds",
            icon: "☁️",
            name: "Blow Clouds",
            description: "Let the heavy clouds drift away.",
        },
        {
            id: "memory-garden",
            icon: "🌸",
            name: "Memory Garden",
            description: "Find the gentle garden pairs.",
        },
        {
            id: "sunshine-hearts",
            icon: "💛",
            name: "Sunshine Hearts",
            description: "Collect warm little hearts.",
        },
    ],

    confused: [
        {
            id: "choose-path",
            icon: "✨",
            name: "Choose Path",
            description: "Choose the correct glowing path.",
        },
        {
            id: "color-match",
            icon: "🎨",
            name: "Color Match",
            description: "Find the matching color.",
        },
        {
            id: "treasure-hunt",
            icon: "🏆",
            name: "Treasure Hunt",
            description: "Clear the messy room and find treasure!",
        },
    ],

    alone: [
        {
            id: "catch-stars",
            icon: "⭐",
            name: "Catch Stars",
            description: "Catch friendly stars.",
        },
        {
            id: "friendship-puzzle",
            icon: "🧩",
            name: "Friendship Puzzle",
            description: "Put the friendship pieces together!",
        },
        {
            id: "campfire-cozy",
            icon: "🔥",
            name: "Campfire Cozy",
            description: "Build a warm, cozy campfire.",
        },
    ],
};

const gameMessages = {
    "pet-puppy": "You gave the puppy so much love! 🐶💕",
    "balloon-pop": "You popped every happy balloon! 🎈✨",
    "sun-shine": "You brought the sunshine back! ☀️💛",
    "pillow-fight": "You let those big feelings out safely! 💜",
    "fire-water": "You cooled every flame with care! 💧",
    "angry-doodle": "You turned angry scribbles into sparkles! ✨",
    "blow-clouds": "The heavy clouds gently drifted away. ☁️💙",
    "memory-garden": "You found every gentle garden pair! 🌸",
    "sunshine-hearts": "You collected warm little hearts! 💛",
    "choose-path": "You found the glowing path every time! ✨",
    "color-match": "You matched all the beautiful colors! 🎨",
    "treasure-hunt": "You searched through the mess and found treasure! 🏆",
    "catch-stars": "You caught every friendly star! ⭐",
    "friendship-puzzle": "You put friendship together piece by piece! 🧩💞",
    "campfire-cozy": "You built a warm, cozy campfire! 🔥🌙",
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sparkles() {
    let dots = "";

    for (let index = 0; index < 34; index += 1) {
        dots += `
      <span
        class="sparkle"
        style="
          left:${random(1, 98)}%;
          top:${random(1, 98)}%;
          animation-delay:${Math.random() * 3}s;
        "
      ></span>
    `;
    }

    return `<div class="sparkles">${dots}</div>`;
}

function characterBadge() {
    return `<div class="character-badge">✨ Games with ${selectedCharacter}</div>`;
}

function gameInfo(gameId) {
    return Object.values(gamesByMood)
        .flat()
        .find((game) => game.id === gameId);
}

function showMoodScreen() {
    currentMood = "";
    currentGameId = "";

    app.innerHTML = `
    <section class="screen active">
      ${sparkles()}

      <button
  class="world-return-button"
  id="return-to-world"
  type="button"
>
  ← Back to World
</button>
      ${characterBadge()}

      <div class="hero">
        <p class="eyebrow">Welcome to HRIDOVA Games</p>
        <h1>How are you feeling today?</h1>
        <p>Pick a mood and let's find the perfect game for you!</p>
      </div>

      <div class="mood-grid">
        ${moods
            .map(
                (mood) => `
              <button
                class="mood-card"
                type="button"
                data-mood="${mood.id}"
                aria-label="Choose ${mood.name} mood"
              >
                <span class="mood-icon">${mood.icon}</span>
                <span class="mood-name">${mood.name}</span>
                <span class="mood-description">${mood.description}</span>
              </button>
            `
            )
            .join("")}
      </div>
    </section>
  `;

    document.querySelectorAll("[data-mood]").forEach((button) => {
        button.addEventListener("click", () => {
            showGamesScreen(button.dataset.mood);
        });
    });
    const returnToWorldButton = document.getElementById(
        "return-to-world"
    );

    if (returnToWorldButton) {
        returnToWorldButton.addEventListener("click", () => {
            window.parent.postMessage(
                {
                    type: "HRIDOVA_RETURN_TO_WORLD",
                },
                window.location.origin
            );
        });
    }
}

function showGamesScreen(moodId) {
    currentMood = moodId;

    const mood = moods.find((item) => item.id === moodId);
    const games = gamesByMood[moodId];

    app.innerHTML = `
    <section class="screen active">
      ${sparkles()}

      <button class="back-button" id="mood-back-button" type="button">
        ← Moods
      </button>

      <div class="games-heading">
        ${characterBadge()}
        <h1 class="screen-title">${mood.name} Games</h1>
        <p class="screen-subtitle">Choose one gentle game to play with ${selectedCharacter}.</p>
      </div>

      <div class="game-grid">
        ${games
            .map(
                (game) => `
              <article class="game-card">
                <div class="game-emoji">${game.icon}</div>
                <h3>${game.name}</h3>
                <p>${game.description}</p>

                <button
                  class="play-button"
                  type="button"
                  data-game-id="${game.id}"
                  aria-label="Play ${game.name}"
                >
                  PLAY →
                </button>
              </article>
            `
            )
            .join("")}
      </div>
    </section>
  `;

    document
        .getElementById("mood-back-button")
        .addEventListener("click", showMoodScreen);

    document.querySelectorAll("[data-game-id]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            startGame(button.dataset.gameId);
        });
    });
}

function renderGameLayout(title, instruction, total, extraClass = "") {
    app.innerHTML = `
    <section class="screen active game-screen">
      ${sparkles()}

      <button class="back-button" id="games-back-button" type="button">
        ← Games
      </button>

      <div class="game-topbar">
        <div class="game-title-wrap">
          <h2>${title}</h2>
          <p>${instruction}</p>
        </div>

        <div class="progress-pill" id="progress-pill">0 / ${total}</div>
      </div>

      <div class="game-board ${extraClass}" id="game-board">
        <div class="feedback" id="feedback"></div>
      </div>
    </section>
  `;

    document
        .getElementById("games-back-button")
        .addEventListener("click", () => showGamesScreen(currentMood));
}

function updateProgress(value, total) {
    document.getElementById("progress-pill").textContent = `${value} / ${total}`;
}

function feedback(text) {
    const box = document.getElementById("feedback");

    if (!box) return;

    box.textContent = text;
    box.classList.add("show");

    window.setTimeout(() => {
        box.classList.remove("show");
    }, 900);
}

function showResult() {
    const game = gameInfo(currentGameId);

    app.innerHTML = `
    <section class="screen active">
      ${sparkles()}

      <div class="result-card">
        <div class="result-emoji">🎉</div>
        <h1>Great Job!</h1>
        <h2>${game.name}</h2>
        <p>${gameMessages[currentGameId]}</p>
        <div class="stars-earned">⭐ +20 Stars</div>

        <div class="result-actions">
          <button class="result-button" id="play-again-button" type="button">
            PLAY AGAIN
          </button>

          <button class="result-button secondary" id="games-button" type="button">
            ← Games
          </button>
        </div>
      </div>
    </section>
  `;

    document
        .getElementById("play-again-button")
        .addEventListener("click", () => startGame(currentGameId));

    document
        .getElementById("games-button")
        .addEventListener("click", () => showGamesScreen(currentMood));
}

function popEffect(board, emoji, x, y, className = "spark-pop") {
    const effect = document.createElement("span");

    effect.className = className;
    effect.textContent = emoji;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.fontSize = "2.6rem";

    board.appendChild(effect);

    window.setTimeout(() => effect.remove(), 850);
}

function startGame(gameId) {
    currentGameId = gameId;

    const games = {
        "pet-puppy": startPetPuppy,
        "balloon-pop": startBalloonPop,
        "sun-shine": startSunShine,
        "pillow-fight": startPillowFight,
        "fire-water": startFireWater,
        "angry-doodle": startAngryDoodle,
        "blow-clouds": startBlowClouds,
        "memory-garden": startMemoryGarden,
        "sunshine-hearts": startSunshineHearts,
        "choose-path": startChoosePath,
        "color-match": startColorMatch,
        "treasure-hunt": startTreasureHunt,
        "catch-stars": startCatchStars,
        "friendship-puzzle": startFriendshipPuzzle,
        "campfire-cozy": startCampfireCozy,
    };

    games[gameId]();
}

/* HAPPY GAMES */

function startPetPuppy() {
    const target = 10;
    let progress = 0;

    renderGameLayout(
        "Pet Puppy",
        "Give the puppy some love. Tap the puppy 10 times!",
        target
    );

    const board = document.getElementById("game-board");

    board.innerHTML += `
    <button class="puppy" id="puppy-button" type="button" aria-label="Pet the puppy">
      🐶
    </button>
  `;

    const puppy = document.getElementById("puppy-button");

    puppy.addEventListener("click", () => {
        progress += 1;
        updateProgress(progress, target);

        popEffect(
            board,
            ["💗", "💖", "💕"][random(0, 2)],
            puppy.offsetLeft + random(60, 140),
            puppy.offsetTop + random(20, 80),
            "heart-pop"
        );

        if (progress >= target) {
            puppy.disabled = true;
            window.setTimeout(showResult, 550);
        }
    });
}

function startBalloonPop() {
    const target = 10;
    let progress = 0;
    const colors = ["#ff6cae", "#746de7", "#51c6e9", "#ffc64d", "#63d29b", "#ff8a56"];

    renderGameLayout(
        "Balloon Pop",
        "Pop 10 happy balloons!",
        target
    );

    const board = document.getElementById("game-board");

    function spawnBalloon() {
        if (progress >= target) return;

        const balloon = document.createElement("button");
        balloon.className = "tap-object";
        balloon.type = "button";
        balloon.textContent = "🎈";
        balloon.style.fontSize = `${random(4, 6)}rem`;
        balloon.style.left = `${random(5, 86)}%`;
        balloon.style.top = `${random(14, 76)}%`;
        balloon.style.filter = `hue-rotate(${random(0, 340)}deg) drop-shadow(0 7px 8px ${colors[random(0, colors.length - 1)]})`;

        balloon.addEventListener("click", () => {
            if (balloon.classList.contains("collected")) return;

            balloon.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "✨", balloon.offsetLeft, balloon.offsetTop);

            window.setTimeout(() => balloon.remove(), 250);

            if (progress >= target) {
                window.setTimeout(showResult, 600);
            } else {
                window.setTimeout(spawnBalloon, 220);
            }
        });

        board.appendChild(balloon);
    }

    for (let index = 0; index < 5; index += 1) {
        window.setTimeout(spawnBalloon, index * 120);
    }
}

function startSunShine() {
    const target = 6;
    let progress = 0;

    renderGameLayout(
        "Sun Shine",
        "Collect all 6 glowing rays of sunshine!",
        target
    );

    const board = document.getElementById("game-board");

    board.innerHTML += `<div class="sun-core">☀️</div>`;

    for (let index = 0; index < target; index += 1) {
        const angle = (index / target) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 32;
        const y = 50 + Math.sin(angle) * 34;

        const ray = document.createElement("button");
        ray.className = "tap-object";
        ray.type = "button";
        ray.textContent = "✨";
        ray.style.left = `${x}%`;
        ray.style.top = `${y}%`;
        ray.style.fontSize = "3.5rem";

        ray.addEventListener("click", () => {
            if (ray.classList.contains("collected")) return;

            ray.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "🌟", ray.offsetLeft, ray.offsetTop);

            if (progress >= target) {
                window.setTimeout(showResult, 650);
            }
        });

        board.appendChild(ray);
    }
}

/* ANGRY GAMES */

function startPillowFight() {
    const target = 15;
    let progress = 0;
    const colors = ["#ffc3d8", "#c4d9ff", "#d7f6d2", "#ffe2ad", "#e4cdfc", "#b9f0ed"];

    renderGameLayout(
        "Pillow Fight",
        "Tap 15 soft pillows to release your big feelings!",
        target
    );

    const board = document.getElementById("game-board");

    function spawnPillow() {
        if (progress >= target) return;

        const pillow = document.createElement("button");
        pillow.className = "tap-object pillow";
        pillow.type = "button";
        pillow.textContent = "☁️";
        pillow.style.background = colors[random(0, colors.length - 1)];
        pillow.style.left = `${random(4, 84)}%`;
        pillow.style.top = `${random(16, 76)}%`;
        pillow.style.transform = `rotate(${random(-20, 20)}deg)`;

        pillow.addEventListener("click", () => {
            if (pillow.classList.contains("collected")) return;

            pillow.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "💨", pillow.offsetLeft, pillow.offsetTop);

            window.setTimeout(() => pillow.remove(), 260);

            if (progress >= target) {
                window.setTimeout(showResult, 550);
            } else {
                window.setTimeout(spawnPillow, 140);
            }
        });

        board.appendChild(pillow);
    }

    for (let index = 0; index < 7; index += 1) {
        window.setTimeout(spawnPillow, index * 95);
    }
}

function startFireWater() {
    const target = 7;
    let progress = 0;

    renderGameLayout(
        "Fire & Water",
        "Tap every flame to cool it with a splash!",
        target
    );

    const board = document.getElementById("game-board");

    function spawnFlame() {
        if (progress >= target) return;

        const flame = document.createElement("button");
        flame.className = "tap-object";
        flame.type = "button";
        flame.textContent = "🔥";
        flame.style.fontSize = `${random(4, 6)}rem`;
        flame.style.left = `${random(5, 86)}%`;
        flame.style.top = `${random(18, 76)}%`;

        flame.addEventListener("click", () => {
            if (flame.classList.contains("collected")) return;

            flame.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "💦", flame.offsetLeft, flame.offsetTop, "water-pop");

            window.setTimeout(() => flame.remove(), 260);

            if (progress >= target) {
                window.setTimeout(showResult, 600);
            } else {
                window.setTimeout(spawnFlame, 240);
            }
        });

        board.appendChild(flame);
    }

    for (let index = 0; index < 4; index += 1) {
        window.setTimeout(spawnFlame, index * 150);
    }
}

function startAngryDoodle() {
    const target = 8;
    let progress = 0;
    const doodles = ["🌀", "〰️", "💥", "🌪️", "🖍️", "💢"];

    renderGameLayout(
        "Angry Doodle",
        "Tap 8 doodles and turn them into sparkles!",
        target
    );

    const board = document.getElementById("game-board");

    function spawnDoodle() {
        if (progress >= target) return;

        const doodle = document.createElement("button");
        doodle.className = "tap-object doodle";
        doodle.type = "button";
        doodle.textContent = doodles[random(0, doodles.length - 1)];
        doodle.style.left = `${random(5, 84)}%`;
        doodle.style.top = `${random(17, 75)}%`;
        doodle.style.filter = `hue-rotate(${random(0, 340)}deg)`;

        doodle.addEventListener("click", () => {
            if (doodle.classList.contains("collected")) return;

            doodle.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);

            for (let count = 0; count < 4; count += 1) {
                popEffect(
                    board,
                    "✨",
                    doodle.offsetLeft + random(-20, 50),
                    doodle.offsetTop + random(-20, 50)
                );
            }

            window.setTimeout(() => doodle.remove(), 280);

            if (progress >= target) {
                window.setTimeout(showResult, 650);
            } else {
                window.setTimeout(spawnDoodle, 220);
            }
        });

        board.appendChild(doodle);
    }

    for (let index = 0; index < 5; index += 1) {
        window.setTimeout(spawnDoodle, index * 120);
    }
}

/* SAD GAMES */

function startBlowClouds() {
    const target = 6;
    let progress = 0;

    renderGameLayout(
        "Blow Clouds",
        "Tap 6 heavy clouds and let them drift away.",
        target
    );

    const board = document.getElementById("game-board");

    function spawnCloud() {
        if (progress >= target) return;

        const cloud = document.createElement("button");
        cloud.className = "tap-object";
        cloud.type = "button";
        cloud.textContent = "☁️";
        cloud.style.fontSize = `${random(4, 6)}rem`;
        cloud.style.left = `${random(5, 84)}%`;
        cloud.style.top = `${random(17, 71)}%`;
        cloud.style.filter = "grayscale(0.3) drop-shadow(0 7px 9px rgba(68,91,130,.2))";

        cloud.addEventListener("click", () => {
            if (cloud.classList.contains("collected")) return;

            cloud.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "🌬️", cloud.offsetLeft, cloud.offsetTop);

            window.setTimeout(() => cloud.remove(), 330);

            if (progress >= target) {
                window.setTimeout(showResult, 700);
            } else {
                window.setTimeout(spawnCloud, 350);
            }
        });

        board.appendChild(cloud);
    }

    for (let index = 0; index < 4; index += 1) {
        window.setTimeout(spawnCloud, index * 160);
    }
}

function startMemoryGarden() {
    const target = 3;
    let matches = 0;
    let openCards = [];
    let locked = false;
    const icons = ["🌸", "🌸", "🌻", "🌻", "🪻", "🪻"].sort(
        () => Math.random() - 0.5
    );

    renderGameLayout(
        "Memory Garden",
        "Find the 3 gentle garden pairs!",
        target
    );

    const board = document.getElementById("game-board");
    const grid = document.createElement("div");
    grid.className = "memory-grid";

    icons.forEach((icon, index) => {
        const card = document.createElement("button");

        card.className = "memory-card";
        card.type = "button";
        card.textContent = "🌿";
        card.dataset.icon = icon;
        card.dataset.index = String(index);

        card.addEventListener("click", () => {
            if (
                locked ||
                card.classList.contains("matched") ||
                card.classList.contains("revealed")
            ) {
                return;
            }

            card.classList.add("revealed");
            card.textContent = icon;
            openCards.push(card);

            if (openCards.length !== 2) return;

            locked = true;

            const [firstCard, secondCard] = openCards;
            const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

            window.setTimeout(() => {
                if (isMatch) {
                    firstCard.classList.remove("revealed");
                    secondCard.classList.remove("revealed");
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    matches += 1;
                    updateProgress(matches, target);
                    feedback("A gentle match! 🌸");

                    if (matches >= target) {
                        window.setTimeout(showResult, 750);
                    }
                } else {
                    firstCard.classList.remove("revealed");
                    secondCard.classList.remove("revealed");
                    firstCard.textContent = "🌿";
                    secondCard.textContent = "🌿";
                    feedback("Almost! Try another pair. 💜");
                }

                openCards = [];
                locked = false;
            }, 750);
        });

        grid.appendChild(card);
    });

    board.appendChild(grid);
}

function startSunshineHearts() {
    const target = 8;
    let progress = 0;

    renderGameLayout(
        "Sunshine Hearts",
        "Collect 8 warm little hearts!",
        target
    );

    const board = document.getElementById("game-board");

    function spawnHeart() {
        if (progress >= target) return;

        const heart = document.createElement("button");
        heart.className = "tap-object";
        heart.type = "button";
        heart.textContent = "💛";
        heart.style.fontSize = `${random(3, 5)}rem`;
        heart.style.left = `${random(5, 86)}%`;
        heart.style.top = `${random(16, 76)}%`;
        heart.style.filter = "drop-shadow(0 0 12px rgba(255, 190, 42, .8))";

        heart.addEventListener("click", () => {
            if (heart.classList.contains("collected")) return;

            heart.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);

            if (progress >= target) {
                window.setTimeout(showResult, 580);
            } else {
                window.setTimeout(spawnHeart, 230);
            }
        });

        board.appendChild(heart);
    }

    for (let index = 0; index < 5; index += 1) {
        window.setTimeout(spawnHeart, index * 130);
    }
}

/* CONFUSED GAMES */

function startChoosePath() {
    const target = 5;
    let progress = 0;

    renderGameLayout(
        "Choose Path",
        "Choose the correct glowing path!",
        target
    );

    const board = document.getElementById("game-board");

    function renderRound() {
        const oldPaths = board.querySelector(".paths");
        if (oldPaths) oldPaths.remove();

        const correctIndex = random(0, 2);
        const paths = document.createElement("div");
        paths.className = "paths";

        for (let index = 0; index < 3; index += 1) {
            const button = document.createElement("button");

            button.className = "path-button";
            button.type = "button";
            button.textContent = "✨";

            button.addEventListener("click", () => {
                if (index === correctIndex) {
                    button.classList.add("correct");
                    progress += 1;
                    updateProgress(progress, target);
                    feedback("You found the glowing path! ✨");

                    window.setTimeout(() => {
                        if (progress >= target) {
                            showResult();
                        } else {
                            renderRound();
                        }
                    }, 650);
                } else {
                    feedback("That path is not it—try again! 💜");
                    button.style.transform = "scale(.9)";
                    window.setTimeout(() => {
                        button.style.transform = "";
                    }, 260);
                }
            });

            paths.appendChild(button);
        }

        board.appendChild(paths);
    }

    renderRound();
}

function startColorMatch() {
    const target = 8;
    let progress = 0;

    const colors = [
        { name: "Pink", hex: "#f760a7" },
        { name: "Blue", hex: "#4d92e9" },
        { name: "Green", hex: "#55c987" },
        { name: "Gold", hex: "#ffca3a" },
        { name: "Purple", hex: "#9c63dc" },
        { name: "Orange", hex: "#ff8e49" },
        { name: "Cyan", hex: "#38cde1" },
        { name: "Red", hex: "#ef545e" },
    ];

    renderGameLayout(
        "Color Match",
        "Tap the color that matches the glowing circle!",
        target
    );

    const board = document.getElementById("game-board");

    function newRound() {
        const oldRound = board.querySelector(".color-round");
        if (oldRound) oldRound.remove();

        const targetColor = colors[random(0, colors.length - 1)];

        const round = document.createElement("div");
        round.className = "color-round";

        round.innerHTML = `
      <div
        class="target-color"
        style="background:${targetColor.hex}"
        title="${targetColor.name}"
      ></div>
      <div class="color-options"></div>
    `;

        const optionWrap = round.querySelector(".color-options");

        colors
            .slice()
            .sort(() => Math.random() - 0.5)
            .forEach((color) => {
                const option = document.createElement("button");

                option.className = "color-button";
                option.type = "button";
                option.style.background = color.hex;
                option.setAttribute("aria-label", color.name);

                option.addEventListener("click", () => {
                    if (color.name === targetColor.name) {
                        progress += 1;
                        updateProgress(progress, target);
                        feedback("Perfect match! 🌈");

                        if (progress >= target) {
                            window.setTimeout(showResult, 650);
                        } else {
                            window.setTimeout(newRound, 450);
                        }
                    } else {
                        feedback("Not that one—try again! 💜");
                        option.style.transform = "scale(.86)";
                        window.setTimeout(() => {
                            option.style.transform = "";
                        }, 240);
                    }
                });

                optionWrap.appendChild(option);
            });

        board.appendChild(round);
    }

    newRound();
}

function startTreasureHunt() {
    const target = 12;
    let progress = 0;

    const clutter = ["🧸", "📚", "👕", "🎒", "🧩", "⚽", "🎮", "🧦", "📦", "🖍️", "🪁", "🪀"];

    renderGameLayout(
        "Treasure Hunt",
        "Search through the messy room. Clear the clutter to find treasure!",
        target
    );

    const board = document.getElementById("game-board");

    board.innerHTML += `
    <div class="room-label">A very messy room! 🔎</div>
    <div class="treasure" id="treasure">🏆</div>
  `;

    clutter.forEach((item, index) => {
        const object = document.createElement("button");

        object.className = "tap-object";
        object.type = "button";
        object.textContent = item;
        object.style.fontSize = `${random(3, 5)}rem`;
        object.style.left = `${random(3, 85)}%`;
        object.style.top = `${random(15, 80)}%`;
        object.style.zIndex = String(random(2, 7));
        object.style.transform = `rotate(${random(-30, 30)}deg)`;

        object.addEventListener("click", () => {
            if (object.classList.contains("collected")) return;

            object.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "✨", object.offsetLeft, object.offsetTop);

            if (progress >= target) {
                window.setTimeout(() => {
                    document.getElementById("treasure").classList.add("show");
                    feedback("You found the treasure! 🏆");

                    window.setTimeout(showResult, 1450);
                }, 550);
            }
        });

        board.appendChild(object);
    });
}

/* ALONE GAMES */

function startCatchStars() {
    const target = 10;
    let progress = 0;

    renderGameLayout(
        "Catch Stars",
        "Catch 10 friendly stars!",
        target,
        "night-board"
    );

    const board = document.getElementById("game-board");

    function spawnStar() {
        if (progress >= target) return;

        const star = document.createElement("button");
        star.className = "tap-object";
        star.type = "button";
        star.textContent = "⭐";
        star.style.fontSize = `${random(3, 5)}rem`;
        star.style.left = `${random(4, 88)}%`;
        star.style.top = `${random(15, 75)}%`;
        star.style.filter = "drop-shadow(0 0 13px #ffd756)";

        star.addEventListener("click", () => {
            if (star.classList.contains("collected")) return;

            star.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "✨", star.offsetLeft, star.offsetTop);

            window.setTimeout(() => star.remove(), 230);

            if (progress >= target) {
                window.setTimeout(showResult, 600);
            } else {
                window.setTimeout(spawnStar, 210);
            }
        });

        board.appendChild(star);
    }

    for (let index = 0; index < 6; index += 1) {
        window.setTimeout(spawnStar, index * 100);
    }
}

function startFriendshipPuzzle() {
    const target = 5;
    let nextPiece = 0;
    const pieces = ["🧩", "💗", "🤝", "🌈", "⭐"];

    renderGameLayout(
        "Friendship Puzzle",
        "Tap the friendship pieces in order from left to right!",
        target
    );

    const board = document.getElementById("game-board");

    board.innerHTML += `
    <div class="puzzle-stage">
      <div class="puzzle-slots" id="puzzle-slots">
        ${pieces
            .map(
                (_, index) => `
              <div class="puzzle-slot" data-slot="${index}">?</div>
            `
            )
            .join("")}
      </div>

      <div class="puzzle-pieces" id="puzzle-pieces"></div>
    </div>
  `;

    const piecesWrap = document.getElementById("puzzle-pieces");

    pieces
        .map((piece, index) => ({ piece, index }))
        .sort(() => Math.random() - 0.5)
        .forEach((item) => {
            const button = document.createElement("button");

            button.className = "puzzle-piece";
            button.type = "button";
            button.textContent = item.piece;

            button.addEventListener("click", () => {
                if (item.index !== nextPiece) {
                    feedback("Start with the first empty space. You can do it! 💜");
                    button.style.transform = "scale(.86)";
                    window.setTimeout(() => {
                        button.style.transform = "";
                    }, 250);
                    return;
                }

                const slot = document.querySelector(`[data-slot="${nextPiece}"]`);
                slot.textContent = item.piece;
                button.classList.add("used");

                nextPiece += 1;
                updateProgress(nextPiece, target);
                feedback("A friendship piece fits! ✨");

                if (nextPiece >= target) {
                    window.setTimeout(showResult, 800);
                }
            });

            piecesWrap.appendChild(button);
        });
}

function startCampfireCozy() {
    const target = 8;
    let progress = 0;

    renderGameLayout(
        "Campfire Cozy",
        "Collect 8 pieces of firewood to build a cozy campfire.",
        target,
        "night-board"
    );

    const board = document.getElementById("game-board");

    board.innerHTML += `
    <div class="campfire" id="campfire">🔥</div>
  `;

    const campfire = document.getElementById("campfire");

    function spawnWood() {
        if (progress >= target) return;

        const wood = document.createElement("button");
        wood.className = "tap-object wood";
        wood.type = "button";
        wood.textContent = "🪵";
        wood.style.left = `${random(4, 87)}%`;
        wood.style.top = `${random(15, 68)}%`;
        wood.style.transform = `rotate(${random(-24, 24)}deg)`;

        wood.addEventListener("click", () => {
            if (wood.classList.contains("collected")) return;

            wood.classList.add("collected");
            progress += 1;
            updateProgress(progress, target);
            popEffect(board, "✨", wood.offsetLeft, wood.offsetTop);

            if (progress >= target) {
                window.setTimeout(() => {
                    campfire.classList.add("warm");

                    for (let index = 0; index < 12; index += 1) {
                        popEffect(
                            board,
                            ["✨", "⭐", "🟡"][random(0, 2)],
                            campfire.offsetLeft + random(-70, 120),
                            campfire.offsetTop + random(-30, 60)
                        );
                    }

                    feedback("Your campfire is warm and cozy! 🔥");

                    window.setTimeout(showResult, 1650);
                }, 480);
            } else {
                window.setTimeout(spawnWood, 240);
            }
        });

        board.appendChild(wood);
    }

    for (let index = 0; index < 5; index += 1) {
        window.setTimeout(spawnWood, index * 110);
    }
}

showMoodScreen();
document.addEventListener("DOMContentLoaded", () => {
    const returnToWorldButton = document.getElementById(
        "return-to-world"
    );

    if (returnToWorldButton) {
        returnToWorldButton.addEventListener("click", () => {
            window.parent.postMessage(
                {
                    type: "HRIDOVA_RETURN_TO_WORLD",
                },
                window.location.origin
            );
        });
    }
});