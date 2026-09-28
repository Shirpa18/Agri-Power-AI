import { useMemo, useState } from "react";
import { useFarm } from "../context/FarmContext";
import { calculateFarmDecision } from "../utils/decisionEngine";

function AIAssistant() {
  const { data } = useFarm();

  const {
    farm,
    soil,
    water,
    weather,
    energy,
    pump,
  } = data;

  const decision = calculateFarmDecision(data);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text:
        `Hello. I am monitoring ${farm.name}. ` +
        `I can explain irrigation, water and energy decisions ` +
        `using the current farm data.`,
    },
  ]);

  const [input, setInput] = useState("");

  const recommendation = useMemo(() => {
    if (
      decision.irrigationDecision === "IRRIGATE"
    ) {
      return (
        `Irrigation is currently recommended. ` +
        `${decision.reason} ` +
        `The selected energy source is ${decision.energyDecision}. ` +
        `${decision.energyReason}`
      );
    }

    if (
      decision.irrigationDecision === "WAIT"
    ) {
      return (
        `Irrigation should currently wait. ` +
        `${decision.reason} ` +
        `${decision.energyReason}`
      );
    }

    return decision.reason;
  }, [decision]);

  const generateResponse = (question) => {
    const text = question.toLowerCase();

    if (
      text.includes("irrigation") ||
      text.includes("irrigate") ||
      text.includes("water the crop")
    ) {
      return (
        `Current irrigation decision: ` +
        `${decision.irrigationDecision}. ` +
        `${decision.reason}`
      );
    }

    if (
      text.includes("soil") ||
      text.includes("moisture")
    ) {
      return (
        `Soil moisture is currently ${soil.moisture}%. ` +
        `The target is ${soil.targetMoisture}%. ` +
        `The current moisture gap is ${decision.moistureGap}%.`
      );
    }

    if (
      text.includes("water") ||
      text.includes("reservoir")
    ) {
      return (
        `The farm currently has ${water.available} L of available water. ` +
        `The calculated requirement is ${water.required} L. ` +
        `Water availability is currently ` +
        `${decision.waterAvailable ? "sufficient" : "insufficient"}.`
      );
    }

    if (
      text.includes("solar") ||
      text.includes("sun")
    ) {
      return (
        `Solar generation is currently ${energy.solarGeneration} kW ` +
        `from a ${energy.solarCapacity} kW system. ` +
        `${decision.solarAvailable
          ? "Solar can currently support the pump."
          : "Solar generation is currently insufficient for the pump."}`
      );
    }

    if (
      text.includes("battery") ||
      text.includes("charge")
    ) {
      return (
        `The battery is currently at ${energy.batteryLevel}%. ` +
        `${decision.batteryAvailable
          ? "It is available as a backup energy source."
          : "Its current level is below the backup threshold."}`
      );
    }

    if (
      text.includes("energy") ||
      text.includes("power")
    ) {
      return (
        `The current energy decision is ${decision.energyDecision}. ` +
        `${decision.energyReason}`
      );
    }

    if (
      text.includes("pump")
    ) {
      return (
        `The pump is currently ` +
        `${pump.running ? "running" : "on standby"} ` +
        `and requires ${energy.pumpPower} kW. ` +
        `The selected energy source is ${decision.energyDecision}.`
      );
    }

    if (
      text.includes("weather") ||
      text.includes("rain")
    ) {
      return (
        `The current temperature is ${weather.temperature}°C ` +
        `and rain probability is ${weather.rainProbability}%.`
      );
    }

    if (
      text.includes("recommend") ||
      text.includes("recommendation") ||
      text.includes("what should")
    ) {
      return recommendation;
    }

    if (
      text.includes("status") ||
      text.includes("condition")
    ) {
      return (
        `Farm status: soil moisture ${soil.moisture}%, ` +
        `water ${water.available} L, solar ${energy.solarGeneration} kW, ` +
        `battery ${energy.batteryLevel}%, ` +
        `rain probability ${weather.rainProbability}%. ` +
        `Current irrigation decision: ` +
        `${decision.irrigationDecision}.`
      );
    }

    return (
      `Based on the current farm data, the irrigation decision is ` +
      `${decision.irrigationDecision} and the selected energy source is ` +
      `${decision.energyDecision}. ` +
      `You can ask me about soil moisture, irrigation, water, solar, ` +
      `battery, energy, pump or weather.`
    );
  };

  const sendMessage = (question) => {
    const trimmed = question.trim();

    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    const aiMessage = {
      id: Date.now() + 1,
      sender: "ai",
      text: generateResponse(trimmed),
    };

    setMessages((current) => [
      ...current,
      userMessage,
      aiMessage,
    ]);

    setInput("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const quickQuestions = [
    "Should I irrigate now?",
    "What is the soil moisture?",
    "Which energy source should I use?",
    "How much water is available?",
    "What is the battery level?",
    "What is the current farm status?",
  ];

  return (
    <div className="ai-assistant-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Farm Intelligence
          </p>

          <h2>AI Farm Assistant</h2>

          <p>
            Ask questions about your farm's water,
            energy, soil and irrigation conditions.
          </p>
        </div>

        <span className="status-badge success">
          AI Online
        </span>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                Current Recommendation
              </p>

              <h3>
                Farm Decision
              </h3>
            </div>

            <span
              className={`status-badge ${
                decision.priority === "HIGH"
                  ? "warning"
                  : "success"
              }`}
            >
              {decision.priority}
            </span>
          </div>

          <div className="ai-decision">
            <div className="decision-status">
              <div>
                <span className="metric-label">
                  Irrigation
                </span>

                <strong>
                  {decision.irrigationDecision}
                </strong>
              </div>

              <div>
                <span className="metric-label">
                  Energy
                </span>

                <strong>
                  {decision.energyDecision}
                </strong>
              </div>
            </div>

            <p>
              {recommendation}
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                Live Farm Context
              </p>

              <h3>
                {farm.name}
              </h3>
            </div>
          </div>

          <div className="detail-grid">
            <div>
              <span className="metric-label">
                Soil Moisture
              </span>

              <strong>
                {soil.moisture}%
              </strong>
            </div>

            <div>
              <span className="metric-label">
                Target
              </span>

              <strong>
                {soil.targetMoisture}%
              </strong>
            </div>

            <div>
              <span className="metric-label">
                Water
              </span>

              <strong>
                {water.available} L
              </strong>
            </div>

            <div>
              <span className="metric-label">
                Rain Probability
              </span>

              <strong>
                {weather.rainProbability}%
              </strong>
            </div>

            <div>
              <span className="metric-label">
                Solar
              </span>

              <strong>
                {energy.solarGeneration} kW
              </strong>
            </div>

            <div>
              <span className="metric-label">
                Battery
              </span>

              <strong>
                {energy.batteryLevel}%
              </strong>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              Conversation
            </p>

            <h3>
              Ask the Farm Assistant
            </h3>
          </div>
        </div>

        <div className="ai-chat">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.sender === "user"
                  ? "chat-message user"
                  : "chat-message ai"
              }
            >
              <div className="chat-message-content">
                <span className="metric-label">
                  {message.sender === "user"
                    ? "You"
                    : "AgriPower AI"}
                </span>

                <p>
                  {message.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form
          className="ai-input-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask about irrigation, water, energy or weather..."
          />

          <button
            type="submit"
            className="button primary"
          >
            Ask AI
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              Quick Questions
            </p>

            <h3>
              Farm Questions
            </h3>
          </div>
        </div>

        <div className="quick-question-grid">
          {quickQuestions.map((question) => (
            <button
              type="button"
              className="quick-question"
              key={question}
              onClick={() =>
                sendMessage(question)
              }
            >
              {question}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              Decision Safety
            </p>

            <h3>
              AI Decision Architecture
            </h3>
          </div>
        </div>

        <div className="condition-grid">
          <div className="condition-item">
            <span>
              Farm data
            </span>

            <strong>
              Connected
            </strong>
          </div>

          <div className="condition-item">
            <span>
              Decision engine
            </span>

            <strong>
              Active
            </strong>
          </div>

          <div className="condition-item">
            <span>
              Irrigation decision
            </span>

            <strong>
              {decision.irrigationDecision}
            </strong>
          </div>

          <div className="condition-item">
            <span>
              Energy decision
            </span>

            <strong>
              {decision.energyDecision}
            </strong>
          </div>
        </div>

        <div className="insight-content">
          <div>
            <span className="metric-label">
              Architecture principle
            </span>

            <p>
              Critical irrigation and energy decisions
              are calculated from farm conditions by the
              decision engine. The AI assistant explains
              those decisions to the farmer rather than
              directly controlling critical operations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AIAssistant;