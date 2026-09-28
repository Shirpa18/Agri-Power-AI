import { useFarm } from "../context/FarmContext";
import { calculateFarmDecision } from "../utils/decisionEngine";

function Irrigation() {
  const {
    data,
    setPumpRunning,
  } = useFarm();

  const {
    farm,
    soil,
    water,
    weather,
    energy,
    pump,
  } = data;

  const decision = calculateFarmDecision(data);

  const moistureProgress =
    soil.targetMoisture > 0
      ? Math.min(
          (soil.moisture /
            soil.targetMoisture) *
            100,
          100
        )
      : 0;

  const canStart =
    decision.irrigationDecision === "IRRIGATE" &&
    decision.energyDecision !== "UNAVAILABLE";

  const handlePumpToggle = () => {
    if (!pump.running && !canStart) {
      return;
    }

    setPumpRunning(!pump.running);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Water Operations
          </p>

          <h2>
            Irrigation Control
          </h2>

          <p>
            Intelligent irrigation timing based on
            soil, rain, water and energy conditions.
          </p>
        </div>

        <span
          className={`status-badge ${
            decision.irrigationDecision ===
            "IRRIGATE"
              ? "warning"
              : "success"
          }`}
        >
          {decision.irrigationDecision}
        </span>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                IRRIGATION DECISION
              </p>

              <h3>
                Current Recommendation
              </h3>
            </div>
          </div>

          <div className="ai-decision">
            <div className="decision-status">
              <div>
                <span className="metric-label">
                  Decision
                </span>

                <strong>
                  {decision.irrigationDecision}
                </strong>
              </div>

              <div>
                <span className="metric-label">
                  Priority
                </span>

                <strong>
                  {decision.priority}
                </strong>
              </div>
            </div>

            <p>
              {decision.reason}
            </p>

            <div className="decision-grid">
              <div>
                <span className="metric-label">
                  Moisture Gap
                </span>

                <strong>
                  {decision.moistureGap}%
                </strong>
              </div>

              <div>
                <span className="metric-label">
                  Rain Risk
                </span>

                <strong>
                  {weather.rainProbability}%
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                LIVE CONTROL
              </p>

              <h3>
                Pump Controller
              </h3>
            </div>

            <span
              className={`status-badge ${
                pump.running
                  ? "warning"
                  : "success"
              }`}
            >
              {pump.running
                ? "Running"
                : "Standby"}
            </span>
          </div>

          <div className="metric-large">
            {energy.pumpPower} kW
          </div>

          <p>
            {pump.running
              ? "The irrigation pump is currently running."
              : "The irrigation pump is currently stopped."}
          </p>

          <div className="form-actions">
            <button
              type="button"
              className={
                pump.running
                  ? "button danger"
                  : "button primary"
              }
              onClick={handlePumpToggle}
              disabled={
                !pump.running && !canStart
              }
            >
              {pump.running
                ? "Stop Pump"
                : "Start Irrigation"}
            </button>
          </div>

          {!pump.running && !canStart && (
            <div className="setup-message">
              <strong>
                Pump start blocked
              </strong>

              <p>
                The decision engine currently does
                not recommend starting irrigation or
                a suitable energy source is unavailable.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              SOIL MOISTURE
            </p>

            <h3>
              Moisture Target
            </h3>
          </div>

          <span className="status-badge info">
            {soil.moisture}%
          </span>
        </div>

        <div className="metric-large">
          {soil.moisture}%
        </div>

        <p>
          Target moisture: {soil.targetMoisture}%.
          Current progress toward target is{" "}
          {Math.round(moistureProgress)}%.
        </p>

        <div className="progress-bar">
          <div
            className="progress-value"
            style={{
              width: `${moistureProgress}%`,
            }}
          />
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                WATER AVAILABILITY
              </p>

              <h3>
                Irrigation Resource
              </h3>
            </div>
          </div>

          <div className="detail-grid">
            <div>
              <span>
                Available
              </span>

              <strong>
                {water.available} L
              </strong>
            </div>

            <div>
              <span>
                Required
              </span>

              <strong>
                {water.required} L
              </strong>
            </div>

            <div>
              <span>
                Source
              </span>

              <strong>
                {water.waterSource}
              </strong>
            </div>

            <div>
              <span>
                Capacity
              </span>

              <strong>
                {water.reservoirCapacity} L
              </strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                ENERGY SELECTION
              </p>

              <h3>
                Pump Energy Source
              </h3>
            </div>
          </div>

          <div className="insight-content">
            <strong>
              {decision.energyDecision}
            </strong>

            <p>
              {decision.energyReason}
            </p>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              DECISION FACTORS
            </p>

            <h3>
              Why the system made this decision
            </h3>
          </div>
        </div>

        <div className="condition-grid">
          <div className="condition-item">
            <span>
              Soil
            </span>

            <strong>
              {soil.moisture}%
            </strong>
          </div>

          <div className="condition-item">
            <span>
              Rain
            </span>

            <strong>
              {weather.rainProbability}%
            </strong>
          </div>

          <div className="condition-item">
            <span>
              Water
            </span>

            <strong>
              {decision.waterAvailable
                ? "Available"
                : "Insufficient"}
            </strong>
          </div>

          <div className="condition-item">
            <span>
              Energy
            </span>

            <strong>
              {decision.energyDecision}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Irrigation;