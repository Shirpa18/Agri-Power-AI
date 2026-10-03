import React, { useMemo, useState } from "react";

import { useFarm } from "../context/FarmContext";
import { askFarmAI } from "../services/aiService";

function AIAssistant() {
  const {
    data,
    intelligence,
    loading,
    error,
    backendOnline,
  } = useFarm();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");

  const farm = data?.farm;
  const soil = data?.soil;
  const water = data?.water;
  const weather = data?.weather;
  const energy = data?.energy;
  const pump = data?.pump;

  const farmName =
    farm?.name || "Green Valley Farm";

  const soilMoisture = Number(
    soil?.moisture ?? 0
  );

  const targetMoisture = Number(
    soil?.target_moisture ?? 0
  );

  const waterAvailable = Number(
    water?.available ?? 0
  );

  const waterRequired = Number(
    intelligence?.water?.required ??
      water?.required ??
      0
  );

  const solarPower = Number(
    energy?.solar_generation ?? 0
  );

  const batteryLevel = Number(
    energy?.battery_level ?? 0
  );

  const pumpRunning = Boolean(
    pump?.running
  );

  const currentFarmContext = useMemo(
    () => ({
      farm,
      soil,
      water,
      weather,
      energy,
      pump,
      intelligence,
    }),
    [
      farm,
      soil,
      water,
      weather,
      energy,
      pump,
      intelligence,
    ]
  );

  const suggestedQuestions = [
    "Should I irrigate the field now?",
    "How much water do I need?",
    "What energy source should I use?",
    "What is my soil moisture?",
    "Why is the pump not running?",
    "How can you help me?",
  ];

  const sendMessage = async (question) => {
    const trimmed = question.trim();

    if (!trimmed || sending) {
      return;
    }

    setChatError("");
    setSending(true);

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: trimmed,
      },
    ]);

    setMessage("");

    try {
      const result = await askFarmAI(
        trimmed,
        currentFarmContext
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "assistant",
          text: result.answer,
        },
      ]);
    } catch (requestError) {
      console.error(
        "AI assistant error:",
        requestError
      );

      const errorMessage =
        requestError?.message ||
        "The AI assistant could not respond.";

      setChatError(errorMessage);

      setMessages((previous) => [
        ...previous,
        {
          type: "assistant",
          text:
            "I could not connect to the AI service right now. Please check that the FastAPI backend is running and that the AI API configuration is available.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(message);
  };

  const handleSuggestedQuestion = (
    question
  ) => {
    sendMessage(question);
  };

  if (loading && !farm) {
    return (
      <div className="assistant-page">
        <div className="dashboard-loading">
          Loading AI farm assistant...
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="assistant-page">
        <div className="dashboard-error">
          <div>
            <h3>AI assistant unavailable</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assistant-page">
      <section className="assistant-header">
        <div>
          <div className="assistant-overline">
            FARM INTELLIGENCE
          </div>

          <h1>AI farm assistant</h1>

          <p>
            Ask questions about irrigation,
            water, energy and current farm
            conditions.
          </p>
        </div>

        <div className="assistant-status">
          <span
            className={`assistant-status-dot ${
              backendOnline
                ? ""
                : "offline"
            }`}
          />

          <div>
            <span>Assistant context</span>
            <strong>{farmName}</strong>
          </div>
        </div>
      </section>

      <section className="assistant-layout">
        <div className="assistant-chat-panel">
          <div className="assistant-chat-header">
            <div>
              <div className="assistant-avatar">
                AI
              </div>

              <div>
                <h2>
                  AgriPower Assistant
                </h2>

                <p>
                  Farm-aware AI decision
                  support
                </p>
              </div>
            </div>

            <span className="assistant-live-label">
              {sending
                ? "Thinking..."
                : backendOnline
                ? "AI connected"
                : "AI offline"}
            </span>
          </div>

          <div className="assistant-chat-body">
            {messages.length === 0 ? (
              <div className="assistant-welcome">
                <div className="assistant-welcome-icon">
                  AI
                </div>

                <h2>
                  How can I help with
                  your farm?
                </h2>

                <p>
                  Ask me about irrigation,
                  water, energy, solar,
                  battery status, pump
                  operation or current
                  farm conditions.
                </p>
              </div>
            ) : (
              <div className="assistant-messages">
                {messages.map(
                  (item, index) => (
                    <div
                      key={`${item.type}-${index}`}
                      className={`assistant-message ${
                        item.type ===
                        "user"
                          ? "user"
                          : "assistant"
                      }`}
                    >
                      <div className="assistant-message-label">
                        {item.type ===
                        "user"
                          ? "YOU"
                          : "AGRIPOWER AI"}
                      </div>

                      <div className="assistant-message-text">
                        {item.text}
                      </div>
                    </div>
                  )
                )}

                {sending && (
                  <div className="assistant-message assistant">
                    <div className="assistant-message-label">
                      AGRIPOWER AI
                    </div>

                    <div className="assistant-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="assistant-suggestions">
            <div className="assistant-suggestions-label">
              Suggested questions
            </div>

            <div className="assistant-suggestion-list">
              {suggestedQuestions.map(
                (question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={sending}
                    onClick={() =>
                      handleSuggestedQuestion(
                        question
                      )
                    }
                  >
                    {question}
                  </button>
                )
              )}
            </div>
          </div>

          {chatError && (
            <div className="assistant-chat-error">
              {chatError}
            </div>
          )}

          <form
            className="assistant-input-area"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              placeholder="Ask something about your farm..."
              disabled={sending}
            />

            <button
              type="submit"
              className="primary-button"
              disabled={
                sending ||
                !message.trim()
              }
            >
              {sending
                ? "Thinking..."
                : "Ask AI"}
            </button>
          </form>
        </div>

        <aside className="assistant-context-panel">
          <div className="assistant-context-header">
            <div>
              <h2>Farm context</h2>

              <p>
                Live data currently
                available to the
                assistant.
              </p>
            </div>
          </div>

          <div className="assistant-context-list">
            <div className="assistant-context-item">
              <span>
                Soil moisture
              </span>

              <strong>
                {soilMoisture.toFixed(0)}%
              </strong>
            </div>

            <div className="assistant-context-item">
              <span>
                Target moisture
              </span>

              <strong>
                {targetMoisture.toFixed(0)}%
              </strong>
            </div>

            <div className="assistant-context-item">
              <span>
                Water available
              </span>

              <strong>
                {waterAvailable.toFixed(
                  0
                )}{" "}
                L
              </strong>
            </div>

            <div className="assistant-context-item">
              <span>
                Optimized water need
              </span>

              <strong>
                {waterRequired.toFixed(
                  1
                )}{" "}
                L
              </strong>
            </div>

            <div className="assistant-context-item">
              <span>
                Solar generation
              </span>

              <strong>
                {solarPower.toFixed(1)}{" "}
                kW
              </strong>
            </div>

            <div className="assistant-context-item">
              <span>
                Battery level
              </span>

              <strong>
                {batteryLevel.toFixed(
                  0
                )}%
              </strong>
            </div>

            <div className="assistant-context-item">
              <span>
                Pump status
              </span>

              <strong>
                {pumpRunning
                  ? "Running"
                  : "Not running"}
              </strong>
            </div>
          </div>

          <div className="assistant-current-decision">
            <div className="assistant-current-label">
              CURRENT FARM DECISION
            </div>

            <p>
              {intelligence?.recommendation
                ?.action ||
                "Monitoring current farm conditions."}
            </p>

            <div className="assistant-decision-details">
              <span>
                Irrigation:{" "}
                {intelligence
                  ?.recommendation
                  ?.irrigation ||
                  "Unavailable"}
              </span>

              <span>
                Energy:{" "}
                {intelligence
                  ?.recommendation
                  ?.energySource ||
                  "Unavailable"}
              </span>

              <span>
                Priority:{" "}
                {intelligence
                  ?.recommendation
                  ?.priority ||
                  "Unavailable"}
              </span>
            </div>
          </div>

          <div className="assistant-context-note">
            The AI explains live farm data
            and deterministic decision-engine
            results. Critical irrigation and
            energy decisions remain controlled
            by the farm decision engine.
          </div>
        </aside>
      </section>
    </div>
  );
}

export default AIAssistant;