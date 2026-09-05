import { useEffect, useState } from "react";
import "./Sleep.css";

const STORIES = [
  {
    title: "Miko and the Little Moon",
    emoji: "🌙",
    story:
      "One quiet evening, Miko looked out of the window and saw a tiny moonbeam resting on the floor. Hello, little moonbeam, Miko whispered. The moonbeam danced across the room. Miko followed it until it reached a sleepy little flower. Even flowers need rest, Miko smiled. Miko tucked the flower beneath a soft leaf and whispered good night. The room became quiet. Miko closed his eyes, took a slow breath, and soon everything felt peaceful. Good night, little dreamer.",
  },
  {
    title: "The Cloud That Couldn't Sleep",
    emoji: "☁️",
    story:
      "High above the world lived a little cloud named Puffy. Every night, Puffy watched the stars sparkle. But one night Puffy could not sleep. I have too many thoughts, Puffy whispered. A friendly star floated closer. Try watching your thoughts like little boats, said the star. Puffy imagined each thought floating away. One boat, then another, then another. Soon Puffy felt lighter and drifted peacefully into a wonderful dream.",
  },
  {
    title: "Miko's Secret Garden",
    emoji: "🌷",
    story:
      "Behind Miko's house was a tiny garden that only opened at night. One evening, Miko discovered a glowing little path. He followed it carefully. At the end was a garden filled with flowers that sparkled like stars. Welcome, whispered the flowers. Miko sat beneath a big tree and listened to the gentle breeze. The garden seemed to whisper, You are safe. You can rest. Miko closed his eyes and the garden became part of his sweetest dream.",
  },
  {
    title: "The Star Who Lost Its Sparkle",
    emoji: "⭐",
    story:
      "One night, Miko noticed a little star that was not shining. Are you okay, Miko asked. I think I need a rest, said the star. So Miko sat beside it. They did not need to talk. They simply watched the quiet sky. After a while, the little star began to glow again. Sometimes staying beside someone is enough. Miko smiled. Together they closed their eyes and dreamed beneath the peaceful stars.",
  },
  {
    title: "The Sleepy Forest",
    emoji: "🌲",
    story:
      "Deep inside a peaceful forest, all the animals were getting ready for bed. The rabbits curled up in their homes. The birds tucked their heads beneath their wings. Miko walked quietly along the forest path. He could hear the gentle wind moving through the trees. Miko found a soft patch of grass beneath a giant tree. He looked at the stars, took a slow breath, and soon the whole forest was dreaming together.",
  },
  {
    title: "The Floating Lantern",
    emoji: "🏮",
    story:
      "Miko found a tiny lantern beside his window. It was not an ordinary lantern. It could float. Miko held it gently and the lantern rose into the air. Outside, hundreds of tiny lights floated across the night sky. Each light carried a little wish. Miko closed his eyes and made one too. I wish everyone has a peaceful night. The lantern glowed brightly and returned to Miko's room. Miko climbed into bed and drifted into a peaceful dream.",
  },
  {
    title: "The Tiny Dream Boat",
    emoji: "⛵",
    story:
      "Miko discovered a tiny boat floating in a silver lake. He stepped inside. The boat moved without a sail. Slowly and quietly, it carried Miko across the water. The stars reflected in the lake. The water made a soft sound against the boat. Splash, splash, splash. Miko took a deep breath. There was nowhere he needed to hurry to. Tonight was simply for resting. Soon Miko drifted into a peaceful dream.",
  },
  {
    title: "Miko and the Friendly Firefly",
    emoji: "✨",
    story:
      "One evening, Miko met a tiny firefly named Flicker. Flicker was afraid of the dark. Miko smiled and said, The dark is not empty. Look. They sat together and watched the night. There were stars above them and flowers beside them. Flicker slowly began to glow. Miko's eyes became sleepy. Sometimes resting is brave too, Miko whispered. Flicker glowed softly and the two friends dreamed beneath the quiet stars.",
  },
  {
    title: "The Rainbow After the Rain",
    emoji: "🌈",
    story:
      "Miko woke up after a gentle rain. Everything outside looked fresh and peaceful. Then Miko saw something beautiful. A rainbow appeared across the sky. Even rainy days can end beautifully, the rainbow seemed to say. Miko thought about his day. Some moments were happy and some were difficult. But all of them were okay. Tonight he did not need to think about tomorrow. He just needed to rest. The rain began softly and Miko fell asleep listening to it.",
  },
  {
    title: "Goodnight, Little Explorer",
    emoji: "🧸",
    story:
      "Miko had spent the whole day exploring. He had climbed hills, watched birds, found flowers, and discovered new places. But now the sky was dark. Tomorrow can hold another adventure, he said. Tonight was different. Tonight was for resting. Miko placed his adventure bag beside the bed and pulled the blanket up. He remembered all the wonderful things he had seen. His eyes became heavy. Goodnight, world, he whispered. See you tomorrow. And the little explorer drifted into a warm peaceful dream.",
  },
];

export default function Sleep({ onBack }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const story = STORIES[storyIndex];

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [storyIndex]);

  const listenToStory = () => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support voice narration.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(story.story);

    speech.rate = 0.78;
    speech.pitch = 1.08;
    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const voice =
      voices.find((v) =>
        /female|zira|samantha|aria|google us english/i.test(
          v.name
        )
      ) ||
      voices.find((v) =>
        v.lang.toLowerCase().startsWith("en")
      );

    if (voice) {
      speech.voice = voice;
    }

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  const nextStory = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    setStoryIndex(
      (current) => (current + 1) % STORIES.length
    );
  };

  const previousStory = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    setStoryIndex(
      (current) =>
        (current - 1 + STORIES.length) % STORIES.length
    );
  };

  const chooseStory = (index) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setStoryIndex(index);
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    onBack();
  };

  return (
    <div className="sleep-page">

      <div className="sleep-stars">
        ✦　　✧　　　✦　　✧
      </div>

      <header className="sleep-header">

        <button
          type="button"
          className="sleep-back"
          onClick={handleBack}
        >
          ←
        </button>

        <img src="/miko.png" alt="Miko" />

        <div>
          <h1>Bedtime with Miko 🌙</h1>
          <p>A little story before sleep</p>
        </div>

      </header>

      <main className="sleep-content">

        <div className="sleep-miko">
          <img src="/miko.png" alt="Miko" />
        </div>

        <div className="story-card">

          <div className="story-top">

            <span className="story-emoji">
              {story.emoji}
            </span>

            <span className="story-number">
              Story {storyIndex + 1} of {STORIES.length}
            </span>

          </div>

          <h2>{story.title}</h2>

          <div className="story-text">
            {story.story}
          </div>

          <button
            type="button"
            className={`listen-story ${
              isSpeaking ? "speaking" : ""
            }`}
            onClick={listenToStory}
          >
            {isSpeaking
              ? "⏹ Stop Story"
              : "🔊 Listen to Story"}
          </button>

          <div className="story-controls">

            <button
              type="button"
              onClick={previousStory}
            >
              ← Previous
            </button>

            <button
              type="button"
              className="next-story"
              onClick={nextStory}
            >
              Next Story →
            </button>

          </div>

          <div className="sleep-dots">

            {STORIES.map((_, index) => (
              <button
                type="button"
                key={index}
                className={
                  index === storyIndex ? "active" : ""
                }
                onClick={() => chooseStory(index)}
                aria-label={`Story ${index + 1}`}
              />
            ))}

          </div>

        </div>

        <p className="goodnight">
          🌙 Sleep well, little dreamer. Miko is here. 💗
        </p>

      </main>
    </div>
  );
}