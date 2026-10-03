import React from "react";
import { useFarm } from "../context/FarmContext";

function Alerts() {
  const {
    farm,
    intelligence,
    loading,
    error,
  } = useFarm();

  if (loading && !farm) {
    return (
      <div className="alerts-page">
        <div className="dashboard-loading">
          Loading alerts...
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="alerts-page">
        <div className="dashboard-error">
          <h3>Alerts unavailable</h3>
          <p>{error}</p>
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

  const batteryLevel = Number(
    farm?.battery_level ??
      farm?.batteryLevel ??
      0
  );

  const solarPower = Number(
    farm?.solar_power ??
      farm?.solarPower ??
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

  const recommendationAction =
    typeof recommendation === "string"
      ? recommendation
      : recommendation?.action ||
        intelligence?.message ||
        "Farm systems are operating normally.";

  const alerts = [];

  if (soilMoisture < 30) {
    alerts.push({
      type: "critical",
      title: "Low soil moisture",
      message:
        "Soil moisture is below the preferred operating range. Review irrigation requirements.",
      value: `${soilMoisture.toFixed(0)}%`,
      source: "Soil sensor",
    });
  } else if (soilMoisture < 45) {
    alerts.push({
      type: "warning",
      title: "Soil moisture is falling",
      message:
        "The field is becoming dry. Monitor the next irrigation decision.",
      value: `${soilMoisture.toFixed(0)}%`,
      source: "Soil sensor",
    });
  }

  if (waterLevel < 25) {
    alerts.push({
      type: "critical",
      title: "Low water reserve",
      message:
        "Available irrigation water is critically low.",
      value: `${waterLevel.toFixed(0)}%`,
      source: "Water monitoring",
    });
  } else if (waterLevel < 50) {
    alerts.push({
      type: "warning",
      title: "Water reserve is limited",
      message:
        "Available water is below the preferred reserve level.",
      value: `${waterLevel.toFixed(0)}%`,
      source: "Water monitoring",
    });
  }

  if (batteryLevel < 20) {
    alerts.push({
      type: "critical",
      title: "Battery critically low",
      message:
        "Stored energy is approaching a low reserve level.",
      value: `${batteryLevel.toFixed(0)}%`,
      source: "Energy system",
    });
  } else if (batteryLevel < 40) {
    alerts.push({
      type: "warning",
      title: "Battery reserve is low",
      message:
        "Consider preserving stored energy for essential loads.",
      value: `${batteryLevel.toFixed(0)}%`,
      source: "Energy system",
    });
  }

  if (solarPower > 0) {
    alerts.push({
      type: "info",
      title: "Solar generation available",
      message:
        "Renewable energy is currently available for farm operations.",
      value: `${solarPower.toFixed(1)} kW`,
      source: "Solar system",
    });
  }

  if (pumpStatus) {
    alerts.push({
      type: "info",
      title: "Irrigation pump active",
      message:
        "The irrigation pump is currently operating.",
      value: "ON",
      source: "Pump controller",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      title: "No active alerts",
      message:
        "Current farm conditions are within the monitored operating ranges.",
      value: "OK",
      source: "Farm intelligence",
    });
  }

  const criticalCount = alerts.filter(
    (alert) => alert.type === "critical"
  ).length;

  const warningCount = alerts.filter(
    (alert) => alert.type === "warning"
  ).length;

  const infoCount = alerts.filter(
    (alert) => alert.type === "info"
  ).length;

  return (
    <div className="alerts-page">
      <section className="alerts-header">
        <div>
          <div className="alerts-overline">
            SYSTEM MONITORING
          </div>

          <h1>Alerts & events</h1>

          <p>
            Monitor conditions that may require
            attention across water, energy and
            irrigation systems.
          </p>
        </div>

        <div className="alerts-status">
          <span className="alerts-status-dot" />

          <div>
            <span>Monitoring status</span>
            <strong>Active</strong>
          </div>
        </div>
      </section>

      <section className="alerts-summary-grid">
        <div className="alerts-summary-card critical">
          <span>Critical</span>
          <strong>{criticalCount}</strong>
          <small>Requires attention</small>
        </div>

        <div className="alerts-summary-card warning">
          <span>Warnings</span>
          <strong>{warningCount}</strong>
          <small>Needs monitoring</small>
        </div>

        <div className="alerts-summary-card info">
          <span>Information</span>
          <strong>{infoCount}</strong>
          <small>System events</small>
        </div>

        <div className="alerts-summary-card">
          <span>Total events</span>
          <strong>{alerts.length}</strong>
          <small>Current conditions</small>
        </div>
      </section>

      <section className="alerts-main-grid">
        <div className="alerts-panel">
          <div className="alerts-panel-header">
            <div>
              <h2>Current alerts</h2>
              <p>
                Latest events detected by the farm
                monitoring layer.
              </p>
            </div>

            <span className="alerts-live-badge">
              LIVE
            </span>
          </div>

          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div
                className={`alert-item ${alert.type}`}
                key={`${alert.title}-${index}`}
              >
                <div className="alert-indicator">
                  {alert.type === "critical"
                    ? "!"
                    : alert.type === "warning"
                    ? "!"
                    : alert.type === "success"
                    ? "OK"
                    : "i"}
                </div>

                <div className="alert-content">
                  <div className="alert-title-row">
                    <h3>{alert.title}</h3>

                    <span className="alert-value">
                      {alert.value}
                    </span>
                  </div>

                  <p>{alert.message}</p>

                  <span className="alert-source">
                    Source: {alert.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="alerts-panel alerts-health-panel">
          <div className="alerts-panel-header">
            <div>
              <h2>System health</h2>
              <p>
                Current operational conditions.
              </p>
            </div>
          </div>

          <div className="alerts-health-list">
            <div className="alerts-health-row">
              <span>Soil moisture</span>

              <strong
                className={
                  soilMoisture < 30
                    ? "danger"
                    : soilMoisture < 45
                    ? "warning"
                    : "healthy"
                }
              >
                {soilMoisture.toFixed(0)}%
              </strong>
            </div>

            <div className="alerts-health-row">
              <span>Water reserve</span>

              <strong
                className={
                  waterLevel < 25
                    ? "danger"
                    : waterLevel < 50
                    ? "warning"
                    : "healthy"
                }
              >
                {waterLevel.toFixed(0)}%
              </strong>
            </div>

            <div className="alerts-health-row">
              <span>Battery</span>

              <strong
                className={
                  batteryLevel < 20
                    ? "danger"
                    : batteryLevel < 40
                    ? "warning"
                    : "healthy"
                }
              >
                {batteryLevel.toFixed(0)}%
              </strong>
            </div>

            <div className="alerts-health-row">
              <span>Solar output</span>

              <strong className="healthy">
                {solarPower.toFixed(1)} kW
              </strong>
            </div>

            <div className="alerts-health-row">
              <span>Irrigation pump</span>

              <strong
                className={
                  pumpStatus
                    ? "warning"
                    : "healthy"
                }
              >
                {pumpStatus ? "ON" : "OFF"}
              </strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="alerts-panel">
        <div className="alerts-panel-header">
          <div>
            <h2>AI decision context</h2>

            <p>
              Current recommendation generated from
              farm operating conditions.
            </p>
          </div>
        </div>

        <div className="alerts-ai-context">
          <div className="alerts-ai-mark">
            AI
          </div>

          <div>
            <span>Current recommendation</span>

            <strong>
              {recommendationAction}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Alerts;