import React from "react";
import { useFarm } from "../context/FarmContext";

function Irrigation() {
  const {
    farm,
    intelligence,
    loading,
    error,
    updateFarm,
    automaticPumpControl,
  } = useFarm();

  if (loading && !farm) {
    return (
      <div className="irrigation-page">
        <div className="dashboard-loading">
          Loading irrigation system...
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="irrigation-page">
        <div className="dashboard-error">
          <div>
            <h3>Irrigation unavailable</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const soilMoisture = Number(
    farm?.soil_moisture ??
      farm?.soilMoisture ??
      0
  );

  const waterLevel = Number(
    farm?.water_level ??
      farm?.waterLevel ??
      0
  );

  const pumpStatus =
    farm?.pump_status ??
    farm?.pumpStatus ??
    farm?.pump_on ??
    farm?.pumpOn ??
    false;

  const recommendation =
    intelligence?.recommendation;

  const irrigationRecommendation =
    typeof recommendation === "object" &&
    recommendation !== null
      ? recommendation.irrigation
      : null;

  const energyRecommendation =
    typeof recommendation === "object" &&
    recommendation !== null
      ? recommendation.energySource
      : null;

  const recommendationAction =
    typeof recommendation === "string"
      ? recommendation
      : recommendation?.action ||
        "No irrigation action is currently required.";

  const handlePumpToggle = async () => {
    try {
      await updateFarm({
        pump_status: !pumpStatus,
      });
    } catch (err) {
      console.error(
        "Failed to update pump status:",
        err
      );
    }
  };

  const handleAutomaticControl = async () => {
    try {
      await automaticPumpControl();
    } catch (err) {
      console.error(
        "Automatic pump control failed:",
        err
      );
    }
  };

  const soilStatus =
    soilMoisture < 30
      ? "Very dry"
      : soilMoisture < 45
      ? "Dry"
      : soilMoisture < 70
      ? "Healthy"
      : "Wet";

  const soilStatusClass =
    soilMoisture < 30
      ? "status-danger"
      : soilMoisture < 45
      ? "status-warning"
      : "status-success";

  const waterStatus =
    waterLevel < 25
      ? "Critical"
      : waterLevel < 50
      ? "Low"
      : waterLevel < 75
      ? "Moderate"
      : "Healthy";

  const waterStatusClass =
    waterLevel < 25
      ? "status-danger"
      : waterLevel < 50
      ? "status-warning"
      : "status-success";

  return (
    <div className="irrigation-page">
      <section className="irrigation-overview-grid">
        <div className="irrigation-control-card">
          <div className="irrigation-control-header">
            <div>
              <div className="irrigation-overline">
                IRRIGATION CONTROL
              </div>

              <h1>
                Smart water management
              </h1>

              <p>
                Use soil conditions and available
                water to operate irrigation efficiently.
              </p>
            </div>

            <span
              className={`status-badge ${
                pumpStatus
                  ? "status-success"
                  : "status-neutral"
              }`}
            >
              {pumpStatus
                ? "PUMP RUNNING"
                : "PUMP IDLE"}
            </span>
          </div>

          <div className="irrigation-pump-display">
            <div
              className={`irrigation-pump-circle ${
                pumpStatus ? "active" : ""
              }`}
            >
              <div className="irrigation-pump-state">
                {pumpStatus ? "ON" : "OFF"}
              </div>

              <div className="irrigation-pump-label">
                Irrigation pump
              </div>
            </div>

            <div className="irrigation-control-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handlePumpToggle}
              >
                {pumpStatus
                  ? "Stop pump"
                  : "Start pump"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleAutomaticControl}
              >
                Run automatic control
              </button>
            </div>
          </div>
        </div>

        <div className="irrigation-decision-card">
          <div className="irrigation-card-label">
            AI WATER DECISION
          </div>

          <div className="irrigation-decision-title">
            {recommendationAction}
          </div>

          <div className="irrigation-decision-list">
            <div>
              <span>Recommended irrigation</span>

              <strong>
                {irrigationRecommendation
                  ? String(
                      irrigationRecommendation
                    )
                  : "Monitoring"}
              </strong>
            </div>

            <div>
              <span>Preferred energy</span>

              <strong>
                {energyRecommendation
                  ? String(energyRecommendation)
                  : "Optimizing"}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="irrigation-metrics-grid">
        <div className="irrigation-metric-card">
          <div className="irrigation-metric-top">
            <span>Soil moisture</span>

            <span
              className={`status-badge ${soilStatusClass}`}
            >
              {soilStatus}
            </span>
          </div>

          <div className="irrigation-metric-value">
            {soilMoisture.toFixed(0)}
            <span>%</span>
          </div>

          <div className="irrigation-meter">
            <div
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, soilMoisture)
                )}%`,
              }}
            />
          </div>

          <p>
            Current estimated moisture level in
            the active field.
          </p>
        </div>

        <div className="irrigation-metric-card">
          <div className="irrigation-metric-top">
            <span>Water reserve</span>

            <span
              className={`status-badge ${waterStatusClass}`}
            >
              {waterStatus}
            </span>
          </div>

          <div className="irrigation-metric-value">
            {waterLevel.toFixed(0)}
            <span>%</span>
          </div>

          <div className="irrigation-meter">
            <div
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, waterLevel)
                )}%`,
              }}
            />
          </div>

          <p>
            Available water for irrigation
            operations.
          </p>
        </div>
      </section>

      <section className="irrigation-panel">
        <div className="irrigation-panel-header">
          <div>
            <h2>Water optimization logic</h2>

            <p>
              The decision engine combines field
              conditions with available resources.
            </p>
          </div>
        </div>

        <div className="irrigation-logic-grid">
          <div className="irrigation-logic-step">
            <div className="irrigation-step-number">
              01
            </div>

            <div>
              <h3>Sense</h3>

              <p>
                Monitor soil moisture and water
                availability.
              </p>
            </div>
          </div>

          <div className="irrigation-logic-line" />

          <div className="irrigation-logic-step">
            <div className="irrigation-step-number">
              02
            </div>

            <div>
              <h3>Decide</h3>

              <p>
                Determine whether irrigation is
                required.
              </p>
            </div>
          </div>

          <div className="irrigation-logic-line" />

          <div className="irrigation-logic-step">
            <div className="irrigation-step-number">
              03
            </div>

            <div>
              <h3>Optimize</h3>

              <p>
                Select the appropriate irrigation
                and energy strategy.
              </p>
            </div>
          </div>

          <div className="irrigation-logic-line" />

          <div className="irrigation-logic-step">
            <div className="irrigation-step-number">
              04
            </div>

            <div>
              <h3>Act</h3>

              <p>
                Control the pump and continuously
                monitor the result.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="irrigation-panel">
        <div className="irrigation-panel-header">
          <div>
            <h2>Current operating conditions</h2>

            <p>
              Live values used by the farm
              intelligence system.
            </p>
          </div>
        </div>

        <div className="irrigation-condition-grid">
          <div>
            <span>Soil moisture</span>
            <strong>
              {soilMoisture.toFixed(0)}%
            </strong>
          </div>

          <div>
            <span>Water availability</span>
            <strong>
              {waterLevel.toFixed(0)}%
            </strong>
          </div>

          <div>
            <span>Pump state</span>
            <strong>
              {pumpStatus ? "ON" : "OFF"}
            </strong>
          </div>

          <div>
            <span>Control mode</span>
            <strong>
              AI assisted
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Irrigation;