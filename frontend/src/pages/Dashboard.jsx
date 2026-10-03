import React from "react";
import { useFarm } from "../context/FarmContext";

function Dashboard() {
  const {
    farm,
    intelligence,
    loading,
    error,
    backendOnline,
  } = useFarm();

  if (loading && !farm) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading farm intelligence...
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div>
            <h3>Dashboard unavailable</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const farmName = farm?.name || "Green Valley Farm";
  const location =
    farm?.location || "Karnataka, India";

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

  const solarPower = Number(
    farm?.solar_power ??
      farm?.solarPower ??
      0
  );

  const batteryLevel = Number(
    farm?.battery_level ??
      farm?.batteryLevel ??
      0
  );

  const pumpStatus =
    farm?.pump_status ??
    farm?.pumpStatus ??
    farm?.pump_on ??
    farm?.pumpOn ??
    false;

  const recommendation = intelligence?.recommendation;

  const recommendationText =
    typeof recommendation === "string"
      ? recommendation
      : recommendation?.action ||
        intelligence?.message ||
        "Farm systems are operating normally.";

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

  const recommendationPriority =
    typeof recommendation === "object" &&
    recommendation !== null
      ? recommendation.priority
      : null;

  const getMoistureStatus = () => {
    if (soilMoisture < 35) return "Low";
    if (soilMoisture < 55) return "Optimal";
    return "High";
  };

  const getWaterStatus = () => {
    if (waterLevel < 30) return "Low";
    if (waterLevel < 60) return "Moderate";
    return "Healthy";
  };

  const getBatteryStatus = () => {
    if (batteryLevel < 25) return "Low";
    if (batteryLevel < 60) return "Moderate";
    return "Healthy";
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <div className="dashboard-overline">
            FARM OPERATIONS
          </div>

          <div className="dashboard-header-content">
            <h1>{farmName}</h1>
            <p>{location} · Live farm intelligence</p>
          </div>
        </div>

        <div className="dashboard-status-card">
          <span
            className={`dashboard-status-dot ${
              backendOnline ? "online" : "offline"
            }`}
          />

          <div>
            <div className="dashboard-status-label">
              System status
            </div>

            <div className="dashboard-status-value">
              {backendOnline
                ? "All systems operational"
                : "Backend disconnected"}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            SOIL
          </div>

          <div className="dashboard-stat-content">
            <div className="dashboard-stat-label">
              Soil moisture
            </div>

            <div className="dashboard-stat-value">
              {soilMoisture.toFixed(0)}%
            </div>

            <div className="dashboard-stat-meta">
              {getMoistureStatus()} condition
            </div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            WATER
          </div>

          <div className="dashboard-stat-content">
            <div className="dashboard-stat-label">
              Water availability
            </div>

            <div className="dashboard-stat-value">
              {waterLevel.toFixed(0)}%
            </div>

            <div className="dashboard-stat-meta">
              {getWaterStatus()} reserve
            </div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            SOLAR
          </div>

          <div className="dashboard-stat-content">
            <div className="dashboard-stat-label">
              Solar generation
            </div>

            <div className="dashboard-stat-value">
              {solarPower.toFixed(1)} kW
            </div>

            <div className="dashboard-stat-meta">
              Renewable power available
            </div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            BAT
          </div>

          <div className="dashboard-stat-content">
            <div className="dashboard-stat-label">
              Battery level
            </div>

            <div className="dashboard-stat-value">
              {batteryLevel.toFixed(0)}%
            </div>

            <div className="dashboard-stat-meta">
              {getBatteryStatus()} storage
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">
                Today's farm status
              </h2>

              <p className="dashboard-panel-subtitle">
                Current conditions across water and energy systems
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
                ? "PUMP ACTIVE"
                : "PUMP IDLE"}
            </span>
          </div>

          <div className="dashboard-decision-grid">
            <div className="dashboard-decision-item">
              <span className="dashboard-decision-label">
                Soil moisture
              </span>

              <strong>
                {soilMoisture.toFixed(0)}%
              </strong>
            </div>

            <div className="dashboard-decision-item">
              <span className="dashboard-decision-label">
                Water reserve
              </span>

              <strong>
                {waterLevel.toFixed(0)}%
              </strong>
            </div>

            <div className="dashboard-decision-item">
              <span className="dashboard-decision-label">
                Solar output
              </span>

              <strong>
                {solarPower.toFixed(1)} kW
              </strong>
            </div>

            <div className="dashboard-decision-item">
              <span className="dashboard-decision-label">
                Battery
              </span>

              <strong>
                {batteryLevel.toFixed(0)}%
              </strong>
            </div>
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress-header">
              <span>Soil moisture</span>
              <strong>
                {soilMoisture.toFixed(0)}%
              </strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, soilMoisture)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress-header">
              <span>Water availability</span>
              <strong>
                {waterLevel.toFixed(0)}%
              </strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, waterLevel)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress-header">
              <span>Battery charge</span>
              <strong>
                {batteryLevel.toFixed(0)}%
              </strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, batteryLevel)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">
                AI farm decision
              </h2>

              <p className="dashboard-panel-subtitle">
                Recommended action based on current conditions
              </p>
            </div>
          </div>

          <div className="dashboard-ai-card">
            <div className="dashboard-ai-label">
              RECOMMENDED ACTION
            </div>

            <p>{recommendationText}</p>

            {irrigationRecommendation && (
              <div className="dashboard-recommendation-detail">
                <span>Irrigation</span>

                <strong>
                  {String(irrigationRecommendation)}
                </strong>
              </div>
            )}

            {energyRecommendation && (
              <div className="dashboard-recommendation-detail">
                <span>Energy source</span>

                <strong>
                  {String(energyRecommendation)}
                </strong>
              </div>
            )}

            {recommendationPriority && (
              <div className="dashboard-recommendation-detail">
                <span>Decision priority</span>

                <strong>
                  {String(recommendationPriority)}
                </strong>
              </div>
            )}
          </div>

          <div className="dashboard-metric-list">
            <div className="dashboard-metric-row">
              <span className="dashboard-metric-name">
                Irrigation system
              </span>

              <span className="dashboard-metric-value">
                {pumpStatus
                  ? "Running"
                  : "Standby"}
              </span>
            </div>

            <div className="dashboard-metric-row">
              <span className="dashboard-metric-name">
                Renewable generation
              </span>

              <span className="dashboard-metric-value">
                {solarPower.toFixed(1)} kW
              </span>
            </div>

            <div className="dashboard-metric-row">
              <span className="dashboard-metric-name">
                Battery reserve
              </span>

              <span className="dashboard-metric-value">
                {batteryLevel.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-panel dashboard-pump-card">
        <div className="dashboard-panel-header">
          <div>
            <h2 className="dashboard-panel-title">
              Irrigation control
            </h2>

            <p className="dashboard-panel-subtitle">
              Current irrigation system state
            </p>
          </div>

          <span
            className={`status-badge ${
              pumpStatus
                ? "status-success"
                : "status-neutral"
            }`}
          >
            {pumpStatus ? "ACTIVE" : "STANDBY"}
          </span>
        </div>

        <div className="dashboard-pump-status">
          <span>
            {pumpStatus
              ? "The irrigation pump is currently running based on the farm control state."
              : "The irrigation pump is currently idle. The system is monitoring soil and water conditions."}
          </span>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;