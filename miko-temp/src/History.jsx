import { useEffect, useState } from "react";
import "./History.css";

export default function History({ onBack }) {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    const saved =
      localStorage.getItem("miko_chat_history");

    if (!saved) {
      setHistory([]);
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setHistory(parsed);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("History error:", error);
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();

    const handleUpdate = () => {
      loadHistory();
    };

    window.addEventListener(
      "miko-clear-history",
      handleUpdate
    );

    window.addEventListener(
      "miko-reset-history",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "miko-clear-history",
        handleUpdate
      );

      window.removeEventListener(
        "miko-reset-history",
        handleUpdate
      );
    };
  }, []);

  return (
    <div className="history-page">

      <header className="history-header">

        <button
          type="button"
          className="history-back"
          onClick={onBack}
        >
          ←
        </button>

        <img
          src="/miko.png"
          alt="Miko"
        />

        <div>
          <h1>Chat History 💬</h1>
          <p>Your conversations with Miko</p>
        </div>

      </header>

      <main className="history-content">

        {history.length === 0 ? (

          <div className="empty-history">

            <div className="empty-icon">
              💬
            </div>

            <h2>No conversations yet</h2>

            <p>
              Your conversations with Miko will
              appear here.
            </p>

          </div>

        ) : (

          <div className="history-list">

            {history.map((item, index) => {

              const userText =
                item.user ||
                item.message ||
                item.text ||
                "";

              const mikoText =
                item.miko ||
                item.reply ||
                item.response ||
                "";

              return (
                <div
                  className="history-card"
                  key={item.id || index}
                >

                  <div className="history-user">

                    <span className="history-avatar">
                      👤
                    </span>

                    <div>
                      <strong>You</strong>

                      <p>
                        {userText}
                      </p>
                    </div>

                  </div>

                  {mikoText && (
                    <div className="history-miko">

                      <span className="history-avatar">
                        💗
                      </span>

                      <div>
                        <strong>Miko</strong>

                        <p>
                          {mikoText}
                        </p>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
}