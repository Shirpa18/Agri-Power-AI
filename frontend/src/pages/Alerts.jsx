import { useMemo, useState } from "react";
import { useFarm } from "../context/FarmContext";
import { calculateFarmDecision } from "../utils/decisionEngine";

function Alerts() {
  const { data } = useFarm();

  const {
    soil,
    water,
    weather,
    energy,
    sensors,
    pump,
    farm,
  } = data;

  const decision = calculateFarmDecision(data);

  const [filter, setFilter] = useState("All");
  const [resolvedAlerts, setResolvedAlerts] = useState([]);

  const alerts = useMemo(() => {
    const generatedAlerts = [];

    if (soil.moisture < soil.targetMoisture) {
      const moistureGap =
        soil.targetMoisture - soil.moisture;

      generatedAlerts.push({
        id: "soil-moisture",
        type: moistureGap >= 20 ? "High" : "Medium",
        title: "Soil moisture below target",
        message:
          `Soil moisture is ${soil.moisture}% while the target is ` +
          `${soil.targetMoisture}%.`,
        action:
          decision.irrigationDecision === "IRRIGATE"
            ? "Irrigation is recommended."
            : "Monitor conditions before irrigation.",
      });
    }

    if (water.available < water.required) {
      generatedAlerts.push({
        id: "water-level",
        type: "High",
        title: "Water availability is low",
        message:
          `Available water is ${water.available} L while ` +
          `${water.required} L is required.`,
        action:
          "Reduce irrigation demand or replenish the water source.",
      });
    }

    if (weather.rainProbability >= 60) {
      generatedAlerts.push({
        id: "rain-risk",
        type: "Medium",
        title: "Rain probability is high",
        message:
          `Rain probability is currently ${weather.rainProbability}%.`,
        action:
          "Irrigation should be delayed when appropriate.",
      });
    }

    if (energy.batteryLevel < 30) {
      generatedAlerts.push({
        id: "battery-low",
        type: "High",
        title: "Battery level is low",
        message:
          `Battery charge is ${energy.batteryLevel}%.`,
        action:
          "Prefer available solar generation and preserve battery reserve.",
      });
    } else if (energy.batteryLevel < 50) {
      generatedAlerts.push({
        id: "battery-medium",
        type: "Medium",
        title: "Battery level is getting low",
        message:
          `Battery charge is ${energy.batteryLevel}%.`,
        action:
          "Monitor battery usage and renewable generation.",
      });
    }

    if (!energy.gridAvailability) {
      generatedAlerts.push({
        id: "grid-offline",
        type: "High",
        title: "Grid power unavailable",
        message:
          "The farm grid connection is currently unavailable.",
        action:
          decision.energyDecision === "SOLAR"
            ? "Solar energy can currently support the pump."
            : decision.energyDecision === "BATTERY"
            ? "Battery energy is available as backup."
            : "No suitable backup energy source is currently available.",
      });
    }

    if (!sensors.soil) {
      generatedAlerts.push({
        id: "soil-sensor",
        type: "High",
        title: "Soil sensor disconnected",
        message:
          "The soil moisture sensor is not reporting.",
        action:
          "Check the sensor connection before relying on live moisture readings.",
      });
    }

    if (!sensors.water) {
      generatedAlerts.push({
        id: "water-sensor",
        type: "Medium",
        title: "Water sensor disconnected",
        message:
          "The water monitoring sensor is not reporting.",
        action:
          "Check the water sensor connection.",
      });
    }

    if (!sensors.solar) {
      generatedAlerts.push({
        id: "solar-sensor",
        type: "Medium",
        title: "Solar sensor disconnected",
        message:
          "The solar monitoring sensor is not reporting.",
        action:
          "Check the solar monitoring connection.",
      });
    }

    if (!sensors.pump) {
      generatedAlerts.push({
        id: "pump-sensor",
        type: "Medium",
        title: "Pump sensor disconnected",
        message:
          "The pump monitoring sensor is not reporting.",
        action:
          "Check the pump monitoring connection.",
      });
    }

    if (
      pump.running &&
      decision.energyDecision === "GRID"
    ) {
      generatedAlerts.push({
        id: "pump-grid",
        type: "Medium",
        title: "Pump running on grid power",
        message:
          "The pump is currently operating while grid power is the selected energy source.",
        action:
          "Check whether solar or battery power can be used instead.",
      });
    }

    if (
      decision.energyDecision === "UNAVAILABLE"
    ) {
      generatedAlerts.push({
        id: "energy-unavailable",
        type: "High",
        title: "No suitable energy source",
        message:
          "Solar, battery and grid conditions cannot currently support irrigation.",
        action:
          "Wait for a suitable energy source before starting irrigation.",
      });
    }

    return generatedAlerts;
  }, [
    soil,
    water,
    weather,
    energy,
    sensors,
    pump,
    decision,
  ]);

  const activeAlerts = alerts.filter(
    (alert) => !resolvedAlerts.includes(alert.id)
  );

  const filteredAlerts =
    filter === "All"
      ? activeAlerts
      : activeAlerts.filter(
          (alert) => alert.type === filter
        );

  const highCount = activeAlerts.filter(
    (alert) => alert.type === "High"
  ).length;

  const mediumCount = activeAlerts.filter(
    (alert) => alert.type === "Medium"
  ).length;

  const resolveAlert = (id) => {
    setResolvedAlerts((current) => [
      ...current,
      id,
    ]);
  };

  const clearResolved = () => {
    setResolvedAlerts([]);
  };

  return (
    <div className="alerts-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Farm Monitoring
          </p>

          <h2>Alerts</h2>

          <p>
            Real-time warnings based on soil,
            water, weather and energy conditions.
          </p>
        </div>

        <span
          className={`status-badge ${
            highCount > 0
              ? "warning"
              : "success"
          }`}
        >
          {activeAlerts.length === 0
            ? "System Healthy"
            : `${activeAlerts.length} Active`}
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            Active Alerts
          </div>

          <div className="stat-value">
            {activeAlerts.length}
          </div>

          <div className="stat-meta">
            Current farm conditions
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            High Priority
          </div>

          <div className="stat-value">
            {highCount}
          </div>

          <div className="stat-meta">
            Requires attention
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Medium Priority
          </div>

          <div className="stat-value">
            {mediumCount}
          </div>

          <div className="stat-meta">
            Monitor conditions
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Decision Status
          </div>

          <div className="stat-value">
            {decision.irrigationDecision}
          </div>

          <div className="stat-meta">
            Energy: {decision.energyDecision}
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              Alert Center
            </p>

            <h3>Current Farm Alerts</h3>
          </div>

          <button
            type="button"
            className="button secondary"
            onClick={clearResolved}
          >
            Reset Resolved
          </button>
        </div>

        <div className="alert-filters">
          <button
            type="button"
            className={
              filter === "All"
                ? "button primary"
                : "button secondary"
            }
            onClick={() => setFilter("All")}
          >
            All
          </button>

          <button
            type="button"
            className={
              filter === "High"
                ? "button primary"
                : "button secondary"
            }
            onClick={() => setFilter("High")}
          >
            High
          </button>

          <button
            type="button"
            className={
              filter === "Medium"
                ? "button primary"
                : "button secondary"
            }
            onClick={() => setFilter("Medium")}
          >
            Medium
          </button>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="setup-message">
            <strong>
              No active alerts
            </strong>

            <p>
              Current farm conditions are within
              the monitored operating range.
            </p>
          </div>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map((alert) => (
              <div
                className={`alert-card ${alert.type.toLowerCase()}`}
                key={alert.id}
              >
                <div className="alert-content">
                  <div className="alert-header">
                    <div>
                      <span
                        className={`status-badge ${
                          alert.type === "High"
                            ? "warning"
                            : "success"
                        }`}
                      >
                        {alert.type}
                      </span>

                      <h4>
                        {alert.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="button secondary"
                      onClick={() =>
                        resolveAlert(alert.id)
                      }
                    >
                      Resolve
                    </button>
                  </div>

                  <p>
                    {alert.message}
                  </p>

                  <span className="metric-label">
                    Recommended action
                  </span>

                  <p>
                    {alert.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                System Health
              </p>

              <h3>Connected Systems</h3>
            </div>
          </div>

          <div className="system-list">
            <div className="system-row">
              <div>
                <strong>Soil Monitoring</strong>

                <span>
                  Moisture: {soil.moisture}%
                </span>
              </div>

              <span
                className={
                  sensors.soil
                    ? "online"
                    : "offline"
                }
              >
                {sensors.soil
                  ? "Online"
                  : "Offline"}
              </span>
            </div>

            <div className="system-row">
              <div>
                <strong>Water Monitoring</strong>

                <span>
                  Available: {water.available} L
                </span>
              </div>

              <span
                className={
                  sensors.water
                    ? "online"
                    : "offline"
                }
              >
                {sensors.water
                  ? "Online"
                  : "Offline"}
              </span>
            </div>

            <div className="system-row">
              <div>
                <strong>Solar Monitoring</strong>

                <span>
                  Generation:{" "}
                  {energy.solarGeneration} kW
                </span>
              </div>

              <span
                className={
                  sensors.solar
                    ? "online"
                    : "offline"
                }
              >
                {sensors.solar
                  ? "Online"
                  : "Offline"}
              </span>
            </div>

            <div className="system-row">
              <div>
                <strong>Pump Monitoring</strong>

                <span>
                  Status:{" "}
                  {pump.running
                    ? "Running"
                    : "Standby"}
                </span>
              </div>

              <span
                className={
                  sensors.pump
                    ? "online"
                    : "offline"
                }
              >
                {sensors.pump
                  ? "Online"
                  : "Offline"}
              </span>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                AI Decision Context
              </p>

              <h3>
                {farm.name}
              </h3>
            </div>
          </div>

          <div className="insight-content">
            <div>
              <span className="metric-label">
                Irrigation decision
              </span>

              <strong>
                {decision.irrigationDecision}
              </strong>

              <p>
                {decision.reason}
              </p>
            </div>

            <div>
              <span className="metric-label">
                Energy decision
              </span>

              <strong>
                {decision.energyDecision}
              </strong>

              <p>
                {decision.energyReason}
              </p>
            </div>

            <div>
              <span className="metric-label">
                Decision priority
              </span>

              <strong>
                {decision.priority}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Alerts;