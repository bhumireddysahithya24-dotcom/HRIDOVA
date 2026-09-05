import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MayaSleep.css";

const MAYA_STORIES = [
  {
    id: 1,
    title: "Maya and the Moonlit Garden",
    icon: "🌙",
    category: "NATURE",
    subtitle: "A peaceful garden adventure",
    text: `
Once upon a quiet evening, Maya looked through her bedroom window and noticed that the moon was shining brighter than usual.

She wrapped herself in a soft blanket and stepped into the little garden behind her home. The garden looked completely different beneath the silver moonlight. Tiny flowers opened their petals, glowing gently like little stars.

Maya walked slowly along the peaceful garden path. She could hear the soft sound of leaves moving in the evening breeze. Somewhere nearby, a small stream made a gentle, sleepy sound.

At the center of the garden stood an old wooden bench beneath a beautiful tree. Maya sat down and looked up at the sky.

One by one, the stars appeared.

Maya took a slow breath and imagined that every star was carrying a tiny peaceful thought. One star carried happiness. Another carried courage. Another carried kindness. And one especially bright star seemed to carry a message just for her.

You are safe. You can rest now.

Maya smiled.

A small butterfly floated past her shoulder and landed softly on a flower. Maya watched it for a moment before closing her eyes.

The garden seemed to become quieter.

The flowers moved gently in the breeze. The stream continued its soft song. The moonlight rested peacefully across the grass.

Maya imagined herself lying on a soft cloud surrounded by warm little stars. With every breath, her body became more relaxed.

She breathed in slowly.

And breathed out even more slowly.

The peaceful garden seemed to whisper goodnight.

Maya opened her eyes one final time and looked at the moon.

Thank you for watching over me, she whispered.

Then she returned home, climbed into her warm bed, pulled the blanket around herself, and closed her eyes.

Outside her window, the moon continued to shine.

The stars twinkled softly.

And Maya drifted into the sweetest, calmest dreams.

Goodnight, Maya.

Goodnight, little dreamer.

Sleep peacefully beneath the moonlit sky.
    `,
  },

  {
    id: 2,
    title: "Maya's Butterfly Dream",
    icon: "🦋",
    category: "FANTASY",
    subtitle: "Dancing with butterflies",
    text: `
Maya was lying comfortably in bed when she noticed a tiny golden butterfly floating near her window.

Its wings shimmered softly in the moonlight.

Maya reached out her hand, and the butterfly landed gently on her finger.

Suddenly, her room filled with warm golden light.

Maya found herself standing in a beautiful meadow filled with hundreds of colorful butterflies. Pink butterflies floated beside blue ones. Golden butterflies danced above tiny flowers, while purple butterflies moved slowly through the evening air.

Maya smiled and followed them along a soft grassy path.

The butterflies seemed to know exactly where they were going.

They led Maya toward a quiet hill where she could see the whole magical meadow below.

The sky was filled with stars.

Maya sat on the grass and listened to the gentle sound of the wind.

A large blue butterfly landed beside her.

Maya asked, Where are you taking me?

The butterfly slowly opened its wings.

A trail of glowing lights appeared across the meadow.

Maya followed the lights until she reached a small pond surrounded by flowers.

The water was perfectly still.

When Maya looked into it, she saw reflections of beautiful memories: laughing with friends, warm evenings at home, peaceful mornings, and all the little moments that made her heart happy.

Maya realized that peaceful memories could be like tiny butterflies.

They might disappear quickly, but they always leave something beautiful behind.

She sat beside the pond and took a deep breath.

The butterflies gathered around her.

Their wings moved slowly and quietly.

Maya closed her eyes.

She listened to the breeze.

She listened to the water.

She listened to her own calm breathing.

Soon, the golden butterfly returned and rested gently on her shoulder.

It was time to go home.

Maya thanked the butterflies and followed the glowing path back through the meadow.

The magical light slowly faded.

She found herself back in her warm bedroom.

The little golden butterfly was gone.

But a tiny golden glow remained beside her pillow.

Maya smiled and closed her eyes.

She imagined butterflies floating peacefully around her dreams.

Slowly, she drifted deeper into sleep.

The meadow became quieter.

The stars became softer.

And Maya dreamed of endless peaceful gardens filled with butterflies.

Goodnight, little butterfly.

Goodnight, Maya.

May your dreams always be colorful and gentle.
    `,
  },

  {
    id: 3,
    title: "Maya and the Whispering River",
    icon: "🌊",
    category: "NATURE",
    subtitle: "A gentle journey beside the water",
    text: `
One peaceful evening, Maya discovered a small river flowing quietly through the forest.

The water shimmered beneath the moonlight.

Maya followed the riverbank slowly, listening to the gentle sound of water moving over smooth stones.

The river seemed to be whispering.

Maya stopped and listened carefully.

The river whispered about peaceful mornings, sleepy birds, soft rain, and warm sunlight.

Maya smiled and continued walking.

Tall trees stood on both sides of the river. Their leaves moved gently in the breeze.

Every few steps, Maya found a tiny glowing flower beside the water.

She decided to follow the glowing flowers.

They led her to a small wooden bridge.

Maya crossed the bridge and sat beside the river.

She placed her hands on the soft grass and took a slow breath.

The air smelled fresh and peaceful.

A little bird landed on a nearby branch.

It sang one quiet note and then became still.

Maya listened to the river again.

Splash.

Pause.

Splash.

Pause.

The gentle rhythm made her feel sleepy.

Maya imagined that every sound was helping her let go of the worries of the day.

She breathed in.

She breathed out.

Her shoulders relaxed.

Her hands became warm and comfortable.

The moon slowly moved across the sky.

Maya lay down on the soft grass and looked upward.

The stars seemed to be floating above her like tiny lanterns.

She imagined that the river was carrying away every little worry.

Anything that had made her feel nervous could simply float away with the water.

Maya watched the moon reflected in the river.

It looked like a silver path leading into a peaceful dream.

She closed her eyes.

The river continued its gentle song.

The leaves rustled softly.

The little bird rested quietly in its tree.

Everything around Maya felt safe.

After a while, Maya imagined herself floating gently on a small cloud above the river.

The cloud carried her slowly toward home.

The river became quieter and quieter.

Maya smiled in her dream.

She knew that whenever she needed a peaceful moment, she could remember the whispering river.

With one final slow breath, Maya drifted into a deep and peaceful sleep.

Goodnight, little river.

Goodnight, Maya.

Let the gentle sounds of the night carry you safely into your dreams.
    `,
  },

  {
    id: 4,
    title: "Maya's Cloud Castle",
    icon: "☁️",
    category: "FANTASY",
    subtitle: "A soft journey through the clouds",
    text: `
Maya looked outside her bedroom window and saw a tiny white cloud floating unusually close to her house.

The cloud was soft and round like a pillow.

Maya reached toward it.

To her surprise, the cloud floated gently through the window.

It stopped beside her bed.

Maya stepped onto it.

The cloud lifted her slowly into the night sky.

Up she went, past the rooftops, past the trees, and past the quiet birds resting in their nests.

Soon Maya reached a beautiful castle made entirely from clouds.

Its towers were soft and white.

Its windows glowed with warm golden light.

Maya walked through the cloud castle.

Every room was peaceful.

One room was filled with pillows.

Another had glowing stars floating near the ceiling.

A third room contained a small fountain that made the quietest sound Maya had ever heard.

Maya found a comfortable chair beside a large window.

From there, she could see the whole night sky.

The moon looked enormous and beautiful.

Maya took a slow breath.

The cloud castle seemed to breathe with her.

When she breathed in, the curtains moved gently.

When she breathed out, tiny stars shimmered outside the window.

Maya closed her eyes.

She imagined a warm blanket around her shoulders.

She imagined soft pillows beneath her head.

She imagined every worry becoming lighter and lighter until it floated away like a cloud.

A tiny cloud bird flew into the room.

It carried a little silver star.

The bird placed the star beside Maya.

The star gave off a warm and peaceful glow.

Maya thanked the little bird.

Then she rested her head against the soft chair.

The castle became quieter.

The fountain became softer.

The wind outside became a gentle whisper.

Maya imagined that the entire castle was protecting her while she slept.

She felt safe.

She felt calm.

She felt ready to dream.

The little cloud bird curled up beside her.

Maya closed her eyes.

The moonlight gently filled the room.

The stars continued to sparkle.

And the cloud castle slowly floated through the peaceful night.

Maya drifted into a beautiful dream filled with soft clouds, glowing stars, and endless peaceful skies.

Goodnight, Maya.

May your dreams be soft as clouds.

And may your heart feel peaceful all night long.
    `,
  },

  {
    id: 5,
    title: "The Starlight Meadow",
    icon: "⭐",
    category: "FANTASY",
    subtitle: "A quiet night beneath the stars",
    text: `
Maya discovered a secret meadow hidden beyond a small forest path.

She entered the meadow just as the sun disappeared.

The sky slowly changed from blue to purple.

Then the first star appeared.

Maya sat in the middle of the meadow and watched the sky.

Soon another star appeared.

Then another.

Before long, the entire sky was filled with sparkling lights.

The grass beneath Maya began to glow softly.

Tiny flowers opened around her.

Each flower looked like a little star resting on the ground.

Maya walked slowly through the meadow.

She did not need to hurry.

There was nowhere else she needed to be.

She could simply enjoy the peaceful night.

A warm breeze moved through the grass.

Maya breathed in the cool evening air.

Then she breathed out slowly.

She noticed how calm everything felt.

There were no loud sounds.

No busy roads.

No rushing.

Only the gentle breeze and the soft sparkle of the stars.

Maya found a small hill in the center of the meadow.

She lay down on the grass and looked toward the sky.

One bright star seemed to shine directly above her.

Maya imagined that the star was her own little night-light.

It would stay awake while she rested.

Maya closed her eyes.

She imagined that every breath made the meadow brighter.

Breathing in brought calm.

Breathing out released worry.

Breathing in brought comfort.

Breathing out brought peace.

A gentle feeling of sleep began to spread through her body.

Her arms felt relaxed.

Her legs felt comfortable.

Her eyes felt heavy.

The stars above her seemed to move slowly like tiny glowing fireflies.

Maya imagined floating among them.

She floated past a silver moon.

She floated past soft clouds.

She floated through a sky filled with peaceful colors.

Nothing needed to happen.

She could simply rest.

The starlight meadow remained quiet beneath her.

The little flowers closed their petals.

The breeze became softer.

The moon climbed higher.

Maya smiled as she drifted deeper into her dream.

She knew that the peaceful meadow would always be waiting for her whenever she needed a quiet place.

With one final slow breath, Maya fell into a deep, comfortable sleep.

Goodnight, little star.

Goodnight, peaceful meadow.

And goodnight, Maya.

Sweet dreams.
    `,
  },
];

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
}

function estimateDuration(text) {
  const words = text.trim().split(/\s+/).length;

  // Slow bedtime narration.
  // Minimum is always 2 minutes.
  const estimated = Math.ceil((words / 115) * 60);

  return Math.max(120, estimated);
}

export default function MayaSleep() {
  const navigate = useNavigate();

  const [selectedStory, setSelectedStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const utteranceRef = useRef(null);
  const timerRef = useRef(null);

  const duration = useMemo(() => {
    if (!selectedStory) return 120;
    return estimateDuration(selectedStory.text);
  }, [selectedStory]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    utteranceRef.current = null;
  };

  const startTimer = () => {
    stopTimer();

    timerRef.current = setInterval(() => {
      setElapsed((previous) => {
        if (previous >= duration) {
          stopTimer();
          return duration;
        }

        return previous + 1;
      });
    }, 1000);
  };

  const speakStory = (story) => {
    if (!("speechSynthesis" in window)) {
      alert(
        "Your browser does not support story narration. Please use Chrome or Edge."
      );
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(story.text);

    // Slow, calm bedtime narration.
    utterance.rate = 0.78;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      startTimer();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      stopTimer();

      setElapsed(duration);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      stopTimer();
    };

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);

    setIsPlaying(true);
    setIsPaused(false);
  };

  const startStory = (story) => {
    setSelectedStory(story);
    setElapsed(0);
    setIsPaused(false);

    // Start immediately from the button click.
    speakStory(story);
  };

  const pauseStory = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.pause();

    setIsPaused(true);
    setIsPlaying(false);

    stopTimer();
  };

  const resumeStory = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.resume();

    setIsPaused(false);
    setIsPlaying(true);

    startTimer();
  };

  const stopStory = () => {
    stopSpeech();
    stopTimer();

    setIsPlaying(false);
    setIsPaused(false);
    setElapsed(0);
  };

  const closePlayer = () => {
    stopSpeech();
    stopTimer();

    setSelectedStory(null);
    setIsPlaying(false);
    setIsPaused(false);
    setElapsed(0);
  };

  useEffect(() => {
    return () => {
      stopSpeech();
      stopTimer();
    };
  }, []);

  return (
    <div className="maya-sleep-page">
      {/* Background */}
      <div className="maya-sleep-background" aria-hidden="true">
        <div className="maya-moon">🌙</div>

        {Array.from({ length: 35 }).map((_, index) => (
          <span
            key={index}
            className={`maya-star maya-star-${index + 1}`}
          />
        ))}
      </div>

      {/* Back */}
      <button
        type="button"
        className="maya-sleep-back"
        onClick={() => {
          closePlayer();
          navigate("/maya");
        }}
      >
        ← Back to Maya
      </button>

      <main className="maya-sleep-content">
        {/* Header */}
        <header className="maya-sleep-header">
          <div className="maya-sleep-heading-icon">🌙</div>

          <h1>Sleep Stories</h1>

          <p>Peaceful bedtime stories by Maya</p>
        </header>

        {/* Story Cards */}
        <section className="maya-story-grid">
          {MAYA_STORIES.map((story) => (
            <article className="maya-story-card" key={story.id}>
              <div className="maya-story-icon">{story.icon}</div>

              <h2>{story.title}</h2>

              <p className="maya-story-subtitle">
                {story.subtitle}
              </p>

              <div className="maya-story-duration">
                ◷ {Math.ceil(estimateDuration(story.text) / 60)} min
              </div>

              <div className="maya-story-category">
                {story.category}
              </div>

              <button
                type="button"
                className="maya-start-story"
                onClick={() => startStory(story)}
              >
                ▶ Start Story
              </button>
            </article>
          ))}
        </section>

        <div className="maya-sleep-footer">
          <span>────────</span>
          <span>♥ Sweet dreams with Maya</span>
          <span>────────</span>
        </div>
      </main>

      {/* STORY PLAYER */}
      {selectedStory && (
        <div className="maya-player-overlay">
          <div className="maya-player-modal">
            <button
              type="button"
              className="maya-player-close"
              onClick={closePlayer}
              aria-label="Close story"
            >
              ×
            </button>

            <div className="maya-player-icon">
              {selectedStory.icon}
            </div>

            <h2 className="maya-player-title">
              {selectedStory.title}
            </h2>

            <p className="maya-player-subtitle">
              {selectedStory.subtitle}
            </p>

            {/* Progress */}
            <div className="maya-progress-area">
              <div className="maya-progress-bar">
                <div
                  className="maya-progress-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      (elapsed / duration) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="maya-time-row">
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Story text */}
            <div className="maya-player-story">
              {selectedStory.text
                .trim()
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>

            {/* Controls */}
            <div className="maya-player-controls">
              {!isPlaying && !isPaused && (
                <button
                  type="button"
                  className="maya-control-btn maya-play-control"
                  onClick={() => speakStory(selectedStory)}
                >
                  ▶ Play
                </button>
              )}

              {isPlaying && (
                <button
                  type="button"
                  className="maya-control-btn"
                  onClick={pauseStory}
                >
                  ⏸ Pause
                </button>
              )}

              {isPaused && (
                <button
                  type="button"
                  className="maya-control-btn maya-play-control"
                  onClick={resumeStory}
                >
                  ▶ Resume
                </button>
              )}

              <button
                type="button"
                className="maya-control-btn"
                onClick={stopStory}
              >
                ■ Stop
              </button>

              <button
                type="button"
                className="maya-control-btn maya-again-control"
                onClick={() => {
                  stopSpeech();
                  stopTimer();
                  setElapsed(0);
                  setIsPlaying(false);
                  setIsPaused(false);

                  setTimeout(() => {
                    speakStory(selectedStory);
                  }, 100);
                }}
              >
                ↻ Restart
              </button>
            </div>

            <p className="maya-player-status">
              {isPlaying
                ? "🌙 Maya is telling your story..."
                : isPaused
                ? "⏸ Story paused"
                : "✨ Ready for a peaceful story"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}