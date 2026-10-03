import React from "react";
import { useFarm } from "../context/FarmContext";

function Energy() {
  const {
    farm,
    intelligence,
    loading,
    error,
  } = useFarm();

  if (loading && !farm) {
    return (
      <div className="energy-page">
        <div className="dashboard-loading">
          Loading energy management...
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="energy-page">
        <div className="dashboard-error">
          <div>
            <h3>Energy management unavailable</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

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

  const recommendation =
    intelligence?.recommendation;

  const energySource =
    typeof recommendation === "object" &&
    recommendation !== null
      ? recommendation.energySource
      : null;

  const priority =
    typeof recommendation === "object" &&
    recommendation !== null
      ? recommendation.priority
      : null;

  const estimatedPumpDemand = pumpStatus
    ? 2.4
    : 0;

  const estimatedSolarCoverage =
    estimatedPumpDemand > 0
      ? Math.min(
          100,
          (solarPower / estimatedPumpDemand) * 100
        )
      : solarPower > 0
      ? 100
      : 0;

  const batteryStatus =
    batteryLevel < 20
      ? "Critical"
      : batteryLevel < 40
      ? "Low"
      : batteryLevel < 70
      ? "Moderate"
      : "Healthy";

  const batteryStatusClass =
    batteryLevel < 20
      ? "status-danger"
      : batteryLevel < 40
      ? "status-warning"
      : "status-success";

  const energyStatus =
    solarPower >= 2.5
      ? "Strong renewable generation"
      : solarPower > 0
      ? "Partial renewable generation"
      : "No solar generation";

  return (
    <div className="energy-page">
      <section className="energy-header">
        <div>
          <div className="energy-overline">
            ENERGY MANAGEMENT
          </div>

          <h1>
            Farm energy intelligence
          </h1>

          <p>
            Coordinate renewable generation,
            battery storage and irrigation demand
            to reduce unnecessary grid energy use.
          </p>
        </div>

        <div className="energy-header-status">
          <span className="energy-status-dot" />

          <div>
            <span>Energy state</span>
            <strong>{energyStatus}</strong>
          </div>
        </div>
      </section>

      <section className="energy-kpi-grid">
        <div className="energy-kpi-card">
          <div className="energy-kpi-label">
            Solar generation
          </div>

          <div className="energy-kpi-value">
            {solarPower.toFixed(1)}
            <span>kW</span>
          </div>

          <div className="energy-kpi-meta">
            Current renewable output
          </div>
        </div>

        <div className="energy-kpi-card">
          <div className="energy-kpi-label">
            Battery reserve
          </div>

          <div className="energy-kpi-value">
            {batteryLevel.toFixed(0)}
            <span>%</span>
          </div>

          <div className="energy-kpi-meta">
            {batteryStatus} storage state
          </div>
        </div>

        <div className="energy-kpi-card">
          <div className="energy-kpi-label">
            Pump demand
          </div>

          <div className="energy-kpi-value">
            {estimatedPumpDemand.toFixed(1)}
            <span>kW</span>
          </div>

          <div className="energy-kpi-meta">
            Estimated irrigation load
          </div>
        </div>

        <div className="energy-kpi-card">
          <div className="energy-kpi-label">
            Solar coverage
          </div>

          <div className="energy-kpi-value">
            {estimatedSolarCoverage.toFixed(0)}
            <span>%</span>
          </div>

          <div className="energy-kpi-meta">
            Estimated pump coverage
          </div>
        </div>
      </section>

      <section className="energy-main-grid">
        <div className="energy-flow-card">
          <div className="energy-panel-header">
            <div>
              <h2>Energy flow</h2>

              <p>
                How farm energy resources interact
                with irrigation demand.
              </p>
            </div>
          </div>

          <div className="energy-flow">
            <div className="energy-flow-node">
              <div className="energy-node-symbol">
                PV
              </div>

              <div>
                <strong>Solar</strong>

                <span>
                  {solarPower.toFixed(1)} kW
                </span>
              </div>
            </div>

            <div className="energy-flow-arrow">
              →
            </div>

            <div className="energy-flow-node">
              <div className="energy-node-symbol">
                BAT
              </div>

              <div>
                <strong>Battery</strong>

                <span>
                  {batteryLevel.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="energy-flow-arrow">
              →
            </div>

            <div className="energy-flow-node">
              <div className="energy-node-symbol">
                LOAD
              </div>

              <div>
                <strong>Farm load</strong>

                <span>
                  {estimatedPumpDemand.toFixed(1)} kW
                </span>
              </div>
            </div>
          </div>

          <div className="energy-flow-note">
            <span className="energy-note-dot" />

            <p>
              {solarPower >= estimatedPumpDemand &&
              estimatedPumpDemand > 0
                ? "Available solar generation can cover the estimated irrigation demand."
                : solarPower > 0
                ? "Solar generation is available, but additional energy may be required for irrigation."
                : "Solar generation is currently unavailable."}
            </p>
          </div>
        </div>

        <div className="energy-decision-card">
          <div className="energy-decision-label">
            AI ENERGY DECISION
          </div>

          <h2>
            {energySource
              ? String(energySource)
              : "Optimizing energy source"}
          </h2>

          <p>
            The farm intelligence engine uses
            current generation, storage and
            irrigation demand to determine the
            preferred energy source.
          </p>

          <div className="energy-decision-row">
            <span>Priority</span>

            <strong>
              {priority
                ? String(priority)
                : "Normal"}
            </strong>
          </div>

          <div className="energy-decision-row">
            <span>Battery state</span>

            <strong>
              {batteryLevel.toFixed(0)}%
            </strong>
          </div>

          <div className="energy-decision-row">
            <span>Solar output</span>

            <strong>
              {solarPower.toFixed(1)} kW
            </strong>
          </div>
        </div>
      </section>

      <section className="energy-panel">
        <div className="energy-panel-header">
          <div>
            <h2>Energy source strategy</h2>

            <p>
              The operating hierarchy used by the
              farm intelligence layer.
            </p>
          </div>
        </div>

        <div className="energy-strategy-grid">
          <div className="energy-strategy-item active">
            <div className="energy-strategy-number">
              01
            </div>

            <div>
              <h3>Solar</h3>

              <p>
                Use available renewable generation
                whenever farm demand can be served.
              </p>
            </div>
          </div>

          <div className="energy-strategy-item">
            <div className="energy-strategy-number">
              02
            </div>

            <div>
              <h3>Battery</h3>

              <p>
                Use stored energy when solar output
                does not match the required load.
              </p>
            </div>
          </div>

          <div className="energy-strategy-item">
            <div className="energy-strategy-number">
              03
            </div>

            <div>
              <h3>Grid</h3>

              <p>
                Use external power only when
                renewable and stored energy are
                insufficient.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="energy-panel">
        <div className="energy-panel-header">
          <div>
            <h2>Energy monitoring</h2>

            <p>
              Current values being considered by
              the decision engine.
            </p>
          </div>
        </div>

        <div className="energy-monitor-grid">
          <div>
            <span>Solar generation</span>

            <strong>
              {solarPower.toFixed(1)} kW
            </strong>
          </div>

          <div>
            <span>Battery charge</span>

            <strong>
              {batteryLevel.toFixed(0)}%
            </strong>
          </div>

          <div>
            <span>Irrigation load</span>

            <strong>
              {estimatedPumpDemand.toFixed(1)} kW
            </strong>
          </div>

          <div>
            <span>Battery condition</span>

            <strong>
              {batteryStatus}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Energy;