import React, { useEffect, useMemo, useRef, useState } from "react";
import "./sleep.css";
import sleepStories from "./sleepStories";

function Sleep({ character = "kairo", onBack }) {
    /* =====================================================
       CHARACTER
    ===================================================== */

    const currentCharacter =
        character === "alakananda"
            ? "alakananda"
            : "kairo";

    const isKairo =
        currentCharacter === "kairo";

    const characterName = isKairo
        ? "Kairo"
        : "Alakananda";

    const characterEmoji = isKairo
        ? "🐺"
        : "🌊";

    const backgroundImage = isKairo
        ? "/backgrounds/kairo-sleep.png"
        : "/backgrounds/alakananda-sleep.png";

    /* =====================================================
       STORIES
    ===================================================== */

    const stories = useMemo(() => {
        return sleepStories[currentCharacter] || [];
    }, [currentCharacter]);

    const [selectedStory, setSelectedStory] =
        useState(0);

    const currentStory =
        stories[selectedStory] || null;

    /* =====================================================
       AUDIO / SPEECH
    ===================================================== */

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [isPaused, setIsPaused] =
        useState(false);

    const [isFinished, setIsFinished] =
        useState(false);

    const speechPartsRef = useRef([]);

    const speechIndexRef = useRef(0);

    const speechRunRef = useRef(0);

    const speechRef = useRef(null);

    /* =====================================================
       STOP EVERYTHING
    ===================================================== */

    const stopSpeech = () => {
        speechRunRef.current += 1;

        window.speechSynthesis.cancel();

        speechPartsRef.current = [];

        speechIndexRef.current = 0;

        speechRef.current = null;

        setIsSpeaking(false);
        setIsPaused(false);
    };

    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {
        stopSpeech();

        setSelectedStory(0);
        setIsFinished(false);

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [currentCharacter]);

    /* =====================================================
       SPEAK NEXT PART
    ===================================================== */

    const speakNextPart = (runId) => {
        if (runId !== speechRunRef.current) {
            return;
        }

        const parts =
            speechPartsRef.current;

        const index =
            speechIndexRef.current;

        /* ---------------------------------------------
           COMPLETE STORY FINISHED
        --------------------------------------------- */

        if (index >= parts.length) {
            setIsSpeaking(false);
            setIsPaused(false);
            setIsFinished(true);

            speechRef.current = null;

            return;
        }

        const part =
            parts[index]?.trim();

        if (!part) {
            speechIndexRef.current += 1;

            speakNextPart(runId);

            return;
        }

        const utterance =
            new SpeechSynthesisUtterance(part);

        utterance.rate =
            isKairo ? 0.82 : 0.78;

        utterance.pitch =
            isKairo ? 0.95 : 1.08;

        utterance.volume = 1;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
            setIsFinished(false);
        };

        utterance.onend = () => {
            if (
                runId !==
                speechRunRef.current
            ) {
                return;
            }

            speechIndexRef.current += 1;

            /*
              Small natural pause between
              paragraphs.
            */

            setTimeout(() => {
                speakNextPart(runId);
            }, 300);
        };

        utterance.onerror = () => {
            if (
                runId !==
                speechRunRef.current
            ) {
                return;
            }

            setIsSpeaking(false);
            setIsPaused(false);

            speechRef.current = null;
        };

        speechRef.current =
            utterance;

        window.speechSynthesis.speak(
            utterance
        );
    };

    /* =====================================================
       START COMPLETE STORY
    ===================================================== */

    const startStory = () => {
        if (
            !currentStory ||
            !currentStory.text
        ) {
            return;
        }

        /*
          Stop previous narration.
        */

        window.speechSynthesis.cancel();

        speechRunRef.current += 1;

        const runId =
            speechRunRef.current;

        /*
          Get COMPLETE story.
    
          We split by paragraphs so the browser
          can reliably narrate long stories.
        */

        const parts =
            currentStory.text
                .split(/\n\s*\n/)
                .map((part) =>
                    part.trim()
                )
                .filter(Boolean);

        /*
          If the story has no blank lines,
          still narrate the complete text.
        */

        if (parts.length === 0) {
            speechPartsRef.current = [
                currentStory.text.trim(),
            ];
        } else {
            speechPartsRef.current =
                parts;
        }

        speechIndexRef.current = 0;

        setIsSpeaking(true);
        setIsPaused(false);
        setIsFinished(false);

        speakNextPart(runId);
    };

    /* =====================================================
       PAUSE / RESUME
    ===================================================== */

    const pauseStory = () => {
        if (!isSpeaking) {
            return;
        }

        if (
            window.speechSynthesis.paused
        ) {
            window.speechSynthesis.resume();

            setIsPaused(false);
        } else {
            window.speechSynthesis.pause();

            setIsPaused(true);
        }
    };

    /* =====================================================
       SELECT STORY
    ===================================================== */

    const chooseStory = (index) => {
        stopSpeech();

        setSelectedStory(index);

        setIsFinished(false);
    };

    /* =====================================================
       NEXT STORY
    ===================================================== */

    const nextStory = () => {
        if (stories.length === 0) {
            return;
        }

        const next =
            (selectedStory + 1) %
            stories.length;

        chooseStory(next);
    };

    /* =====================================================
       PREVIOUS STORY
    ===================================================== */

    const previousStory = () => {
        if (stories.length === 0) {
            return;
        }

        const previous =
            selectedStory === 0
                ? stories.length - 1
                : selectedStory - 1;

        chooseStory(previous);
    };

    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {
        stopSpeech();

        if (onBack) {
            onBack();

            return;
        }

        /*
          Fallback for direct usage.
        */

        window.history.back();
    };

    /* =====================================================
       NO STORIES
    ===================================================== */

    if (stories.length === 0) {
        return (
            <div
                className={`sleep-page ${currentCharacter}`}
                style={{
                    backgroundImage:
                        `url("${backgroundImage}")`,
                }}
            >
                <div className="sleep-overlay" />

                <button
                    className="sleep-back-button"
                    onClick={handleBack}
                >
                    ←
                </button>

                <div className="sleep-content">

                    <div className="sleep-header">

                        <div className="sleep-character-icon">
                            {characterEmoji}
                        </div>

                        <h1>
                            {characterName}'s Sleep Stories
                        </h1>

                        <p>
                            Your peaceful stories
                            are coming soon. 🌙
                        </p>

                    </div>

                    <div className="sleep-story-card">

                        <div className="sleep-story-text">
                            No stories found for{" "}
                            {characterName}.
                        </div>

                    </div>

                </div>
            </div>
        );
    }

    /* =====================================================
       MAIN SCREEN
    ===================================================== */

    return (
        <div
            className={`sleep-page ${currentCharacter}`}
            style={{
                backgroundImage:
                    `url("${backgroundImage}")`,
            }}
        >

            {/* ================================================
          BACKGROUND OVERLAY
      ================================================ */}

            <div className="sleep-overlay" />

            {/* ================================================
          BACK BUTTON
      ================================================ */}

            <button
                className="sleep-back-button"
                onClick={handleBack}
                aria-label="Back"
            >
                ←
            </button>

            {/* ================================================
          MAIN CONTENT
      ================================================ */}

            <main className="sleep-content">

                {/* ==============================================
            HEADER
        ============================================== */}

                <header className="sleep-header">

                    <div className="sleep-character-icon">
                        {characterEmoji}
                    </div>

                    <h1>
                        HRIDOVA SLEEP TEST
                    </h1>

                    <p>
                        Close your eyes, take a deep
                        breath, and drift into peaceful
                        dreams. ✨
                    </p>

                </header>


                {/* =====================================================
    ALL 10 SLEEP STORIES
===================================================== */}

                <section className="sleep-story-list">

                    {stories.map((story, index) => (
                        <button
                            key={`${currentCharacter}-${index}`}
                            type="button"
                            className={`sleep-story-button ${selectedStory === index ? "selected" : ""
                                }`}
                            onClick={() => chooseStory(index)}
                        >

                            <span className="story-number">
                                {index + 1}
                            </span>

                            <span className="story-button-text">
                                {story.emoji || characterEmoji} {story.title}
                            </span>

                        </button>
                    ))}

                </section>


                {/* ==============================================
            CURRENT STORY
        ============================================== */}

                {currentStory && (
                    <section className="sleep-story-card">

                        {/* ------------------------------------------
                STORY HEADER
            ------------------------------------------ */}

                        <div className="story-card-top">

                            <span className="story-card-icon">
                                {currentStory.emoji ||
                                    characterEmoji}
                            </span>

                            <div>

                                <span className="story-label">
                                    TONIGHT'S STORY
                                </span>

                                <h2>
                                    {currentStory.title}
                                </h2>

                            </div>

                        </div>


                        {/* ------------------------------------------
                FULL STORY
            ------------------------------------------ */}

                        <div className="sleep-story-text">
                            {currentStory.text}
                        </div>


                        {/* ------------------------------------------
                STORY NAVIGATION
            ------------------------------------------ */}

                        <div className="sleep-story-navigation">

                            <button
                                type="button"
                                onClick={previousStory}
                                className="story-nav-button"
                                aria-label="Previous story"
                            >
                                ← Previous
                            </button>

                            <span className="story-counter">
                                {selectedStory + 1}
                                {" / "}
                                {stories.length}
                            </span>

                            <button
                                type="button"
                                onClick={nextStory}
                                className="story-nav-button"
                                aria-label="Next story"
                            >
                                Next →
                            </button>

                        </div>


                        {/* ------------------------------------------
                AUDIO CONTROLS
            ------------------------------------------ */}

                        <div className="sleep-controls">

                            <button
                                type="button"
                                className="sleep-control start"
                                onClick={startStory}
                            >
                                ▶ Start
                            </button>

                            <button
                                type="button"
                                className="sleep-control pause"
                                onClick={pauseStory}
                                disabled={!isSpeaking}
                            >
                                {isPaused
                                    ? "▶ Resume"
                                    : "⏸ Pause"}
                            </button>

                            <button
                                type="button"
                                className="sleep-control stop"
                                onClick={stopSpeech}
                                disabled={
                                    !isSpeaking &&
                                    !isPaused
                                }
                            >
                                ⏹ Stop
                            </button>

                        </div>


                        {/* ------------------------------------------
                STATUS
            ------------------------------------------ */}

                        <div className="sleep-status">

                            {isSpeaking &&
                                !isPaused && (
                                    <>
                                        🔊 {characterName} is
                                        telling the complete story...
                                    </>
                                )}

                            {isSpeaking &&
                                isPaused && (
                                    <>
                                        ⏸ Story paused —
                                        press Resume to continue.
                                    </>
                                )}

                            {!isSpeaking &&
                                !isFinished && (
                                    <>
                                        🌙 Press Start to listen
                                        to the complete story.
                                    </>
                                )}

                            {isFinished && (
                                <>
                                    ✨ Story finished.
                                    Sweet dreams!
                                </>
                            )}

                        </div>

                    </section>
                )}


                {/* ==============================================
            GOOD NIGHT
        ============================================== */}

                <div className="sleep-bottom-message">

                    <span>
                        {characterEmoji}
                    </span>

                    <span>
                        Good night, little explorer.
                        Sweet dreams! ✨
                    </span>

                </div>

            </main>

        </div>
    );
}

export default Sleep;