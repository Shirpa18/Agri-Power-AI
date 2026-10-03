import React from "react";
import { useFarm } from "../context/FarmContext";

function Analytics() {
  const {
    farm,
    intelligence,
    loading,
    error,
  } = useFarm();

  if (loading && !farm) {
    return (
      <div className="analytics-page">
        <div className="dashboard-loading">
          Loading farm analytics...
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="analytics-page">
        <div className="dashboard-error">
          <div>
            <h3>Analytics unavailable</h3>
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
        intelligence?.message ||
        "Monitoring current farm conditions.";

  /*
   * These are presentation metrics for the prototype.
   * They should be replaced with historical measurements
   * once the sensor database contains time-series data.
   */
  const estimatedWaterEfficiency =
    soilMoisture >= 45 && waterLevel >= 50
      ? 82
      : soilMoisture >= 30
      ? 68
      : 54;

  const estimatedSolarUtilization =
    solarPower <= 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (solarPower / 3) * 100
          )
        );

  const estimatedEnergyEfficiency =
    pumpStatus
      ? Math.min(
          100,
          Math.round(
            55 +
              estimatedSolarUtilization * 0.35
          )
        )
      : 94;

  const overallScore = Math.round(
    estimatedWaterEfficiency * 0.4 +
      estimatedSolarUtilization * 0.3 +
      estimatedEnergyEfficiency * 0.3
  );

  return (
    <div className="analytics-page">
      <section className="analytics-header">
        <div>
          <div className="analytics-overline">
            FARM PERFORMANCE
          </div>

          <h1>
            Analytics & impact
          </h1>

          <p>
            Track the operational signals that
            determine water efficiency, energy
            efficiency and sustainable farm
            performance.
          </p>
        </div>

        <div className="analytics-score-card">
          <div className="analytics-score-ring">
            <strong>{overallScore}</strong>
            <span>/100</span>
          </div>

          <div>
            <span>Farm efficiency</span>
            <strong>Current estimate</strong>
          </div>
        </div>
      </section>

      <section className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon">
            W
          </div>

          <div>
            <span>Water efficiency</span>

            <strong>
              {estimatedWaterEfficiency}%
            </strong>

            <small>
              Based on current field conditions
            </small>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon">
            S
          </div>

          <div>
            <span>Solar utilization</span>

            <strong>
              {estimatedSolarUtilization}%
            </strong>

            <small>
              Based on current solar output
            </small>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon">
            E
          </div>

          <div>
            <span>Energy efficiency</span>

            <strong>
              {estimatedEnergyEfficiency}%
            </strong>

            <small>
              Current operating estimate
            </small>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon">
            A
          </div>

          <div>
            <span>AI decision state</span>

            <strong>
              Active
            </strong>

            <small>
              Farm intelligence connected
            </small>
          </div>
        </div>
      </section>

      <section className="analytics-main-grid">
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>
                Resource performance
              </h2>

              <p>
                Current indicators from the farm
                intelligence system.
              </p>
            </div>
          </div>

          <div className="analytics-resource-list">
            <div className="analytics-resource-row">
              <div className="analytics-resource-info">
                <div className="analytics-resource-title">
                  Soil moisture
                </div>

                <div className="analytics-resource-subtitle">
                  Current field condition
                </div>
              </div>

              <strong>
                {soilMoisture.toFixed(0)}%
              </strong>

              <div className="analytics-resource-bar">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, soilMoisture)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="analytics-resource-row">
              <div className="analytics-resource-info">
                <div className="analytics-resource-title">
                  Water reserve
                </div>

                <div className="analytics-resource-subtitle">
                  Available irrigation water
                </div>
              </div>

              <strong>
                {waterLevel.toFixed(0)}%
              </strong>

              <div className="analytics-resource-bar">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, waterLevel)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="analytics-resource-row">
              <div className="analytics-resource-info">
                <div className="analytics-resource-title">
                  Battery
                </div>

                <div className="analytics-resource-subtitle">
                  Available stored energy
                </div>
              </div>

              <strong>
                {batteryLevel.toFixed(0)}%
              </strong>

              <div className="analytics-resource-bar">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, batteryLevel)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="analytics-resource-row">
              <div className="analytics-resource-info">
                <div className="analytics-resource-title">
                  Solar generation
                </div>

                <div className="analytics-resource-subtitle">
                  Renewable power output
                </div>
              </div>

              <strong>
                {solarPower.toFixed(1)} kW
              </strong>

              <div className="analytics-resource-bar">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        solarPower * 33.33
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-panel analytics-impact-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>
                Sustainability impact
              </h2>

              <p>
                Prototype impact indicators.
              </p>
            </div>
          </div>

          <div className="analytics-impact-list">
            <div className="analytics-impact-item">
              <div className="analytics-impact-number">
                {estimatedWaterEfficiency}%
              </div>

              <div>
                <strong>
                  Water efficiency
                </strong>

                <span>
                  Smarter irrigation decisions
                </span>
              </div>
            </div>

            <div className="analytics-impact-item">
              <div className="analytics-impact-number">
                {estimatedSolarUtilization}%
              </div>

              <div>
                <strong>
                  Solar utilization
                </strong>

                <span>
                  Renewable energy opportunity
                </span>
              </div>
            </div>

            <div className="analytics-impact-item">
              <div className="analytics-impact-number">
                {estimatedEnergyEfficiency}%
              </div>

              <div>
                <strong>
                  Energy efficiency
                </strong>

                <span>
                  Coordinated farm energy use
                </span>
              </div>
            </div>
          </div>

          <div className="analytics-impact-note">
            These indicators are currently
            calculated from live prototype state.
            Historical impact reporting will use
            stored sensor measurements.
          </div>
        </div>
      </section>

      <section className="analytics-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>
              AI performance summary
            </h2>

            <p>
              How the current decision engine is
              interpreting farm conditions.
            </p>
          </div>

          <span className="analytics-active-badge">
            ENGINE ACTIVE
          </span>
        </div>

        <div className="analytics-summary-grid">
          <div className="analytics-summary-card">
            <span>
              Current recommendation
            </span>

            <strong>
              {recommendationAction}
            </strong>
          </div>

          <div className="analytics-summary-card">
            <span>
              Irrigation strategy
            </span>

            <strong>
              {irrigationRecommendation
                ? String(
                    irrigationRecommendation
                  )
                : "Monitoring"}
            </strong>
          </div>

          <div className="analytics-summary-card">
            <span>
              Energy strategy
            </span>

            <strong>
              {energyRecommendation
                ? String(
                    energyRecommendation
                  )
                : "Optimizing"}
            </strong>
          </div>
        </div>
      </section>

      <section className="analytics-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>
              Impact measurement roadmap
            </h2>

            <p>
              Metrics that will become available
              when the physical sensor system is
              connected.
            </p>
          </div>
        </div>

        <div className="analytics-roadmap">
          <div className="analytics-roadmap-item active">
            <span>01</span>

            <div>
              <strong>
                Live sensor monitoring
              </strong>

              <p>
                Soil moisture, water level,
                solar generation and battery
                state.
              </p>
            </div>
          </div>

          <div className="analytics-roadmap-item">
            <span>02</span>

            <div>
              <strong>
                Historical tracking
              </strong>

              <p>
                Store readings over time to
                calculate real resource savings.
              </p>
            </div>
          </div>

          <div className="analytics-roadmap-item">
            <span>03</span>

            <div>
              <strong>
                Farm impact reports
              </strong>

              <p>
                Quantify water saved, energy
                saved and renewable utilization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Analytics;