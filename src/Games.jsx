import React, { useEffect } from "react";

function Games({ character, onBack }) {
    const gameUrl =
        `/games/alakananda-kairo-games/index.html?character=${character}`;

    useEffect(() => {
        function handleGameMessage(event) {
            if (event.origin !== window.location.origin) {
                return;
            }

            if (event.data?.type === "HRIDOVA_RETURN_TO_WORLD") {
                onBack();
            }
        }

        window.addEventListener("message", handleGameMessage);

        return () => {
            window.removeEventListener("message", handleGameMessage);
        };
    }, [onBack]);

    return (
        <div className="games-page">
            <iframe
                title="HRIDOVA Games"
                className="games-frame"
                src={gameUrl}
            />
        </div>
    );
}

export default Games;