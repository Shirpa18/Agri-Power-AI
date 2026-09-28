import { useState } from "react";
import { useFarm } from "../context/FarmContext";

function Analytics() {
  const { data } = useFarm();

  const {
    farm,
    soil,
    water,
    weather,
    energy,
    pump,
  } = data;

  const [period, setPeriod] = useState("Today");

  const waterEfficiency = Math.min(
    (water.available / water.reservoirCapacity) * 100,
    100
  );

  const solarUtilization = Math.min(
    (energy.solarGeneration / energy.solarCapacity) * 100,
    100
  );

  const solarCoverage = Math.min(
    (energy.solarGeneration / energy.pumpPower) * 100,
    100
  );

  const moistureEfficiency = Math.min(
    (soil.moisture / soil.targetMoisture) * 100,
    100
  );

  const renewableShare =
    energy.solarGeneration + energy.pumpPower > 0
      ? Math.min(
          (energy.solarGeneration /
            (energy.solarGeneration + energy.pumpPower)) *
            100,
          100
        )
      : 0;

  const estimatedDailySolar =
    energy.solarGeneration * 6;

  const estimatedPumpEnergy =
    energy.pumpPower * 4;

  const estimatedGridEnergy = Math.max(
    estimatedPumpEnergy - estimatedDailySolar,
    0
  );

  const estimatedWaterSaved = Math.round(
    water.required * 0.18
  );

  const efficiencyStatus =
    moistureEfficiency >= 90
      ? "Within target"
      : moistureEfficiency >= 70
        ? "Needs attention"
        : "Below target";

  return (
    <div className="analytics-page">
      <div className="page-heading">
        <div>
          <span className="section-label">FARM ANALYTICS</span>

          <h2>Performance Analytics</h2>

          <p>
            Understand how efficiently {farm.name} is using water
            and energy.
          </p>
        </div>

        <div className="analytics-period">
          {["Today", "7 Days", "30 Days"].map((item) => (
            <button
              key={item}
              type="button"
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="analytics-overview">
        <div>
          <span className="section-label">EFFICIENCY INDICATOR</span>

          <h3>
            {efficiencyStatus}
          </h3>

          <p>
            Soil moisture is currently {soil.moisture}% compared
            with the configured target of {soil.targetMoisture}%.
          </p>
        </div>

        <div className="efficiency-score">
          <strong>{moistureEfficiency.toFixed(0)}%</strong>
          <span>Moisture efficiency</span>
        </div>
      </section>

      <div className="analytics-kpi-grid">
        <div className="stat-card">
          <span className="stat-label">WATER AVAILABLE</span>

          <strong>
            {water.available.toLocaleString()} L
          </strong>

          <small>
            {waterEfficiency.toFixed(0)}% of storage capacity
          </small>
        </div>

        <div className="stat-card">
          <span className="stat-label">SOLAR UTILIZATION</span>

          <strong>
            {solarUtilization.toFixed(0)}%
          </strong>

          <small>
            {energy.solarGeneration} kW of {energy.solarCapacity} kW
          </small>
        </div>

        <div className="stat-card">
          <span className="stat-label">SOLAR COVERAGE</span>

          <strong>
            {solarCoverage.toFixed(0)}%
          </strong>

          <small>
            Pump demand {energy.pumpPower} kW
          </small>
        </div>

        <div className="stat-card">
          <span className="stat-label">RENEWABLE SHARE</span>

          <strong>
            {renewableShare.toFixed(0)}%
          </strong>

          <small>
            Current operating conditions
          </small>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Water Efficiency</h3>

              <p>
                Current water storage and irrigation requirement.
              </p>
            </div>
          </div>

          <div className="analytics-meter">
            <div className="analytics-meter-header">
              <span>Storage utilization</span>

              <strong>
                {waterEfficiency.toFixed(0)}%
              </strong>
            </div>

            <div className="analytics-track">
              <div
                className="analytics-fill"
                style={{
                  width: `${waterEfficiency}%`,
                }}
              ></div>
            </div>

            <div className="analytics-meter-footer">
              <span>
                {water.available.toLocaleString()} L available
              </span>

              <span>
                {water.reservoirCapacity.toLocaleString()} L capacity
              </span>
            </div>
          </div>

          <div className="analytics-data-list">
            <div>
              <span>Recommended irrigation</span>
              <strong>{water.required} L</strong>
            </div>

            <div>
              <span>Estimated water saved</span>
              <strong>{estimatedWaterSaved} L</strong>
            </div>

            <div>
              <span>Water remaining after irrigation</span>

              <strong>
                {Math.max(
                  water.available - water.required,
                  0
                ).toLocaleString()} L
              </strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Energy Efficiency</h3>

              <p>
                Current solar generation compared with farm demand.
              </p>
            </div>
          </div>

          <div className="energy-efficiency-visual">
            <div className="energy-ring">
              <strong>
                {solarCoverage.toFixed(0)}%
              </strong>

              <span>Solar coverage</span>
            </div>

            <div className="energy-efficiency-details">
              <div>
                <span>Solar generation</span>
                <strong>
                  {energy.solarGeneration} kW
                </strong>
              </div>

              <div>
                <span>Pump demand</span>
                <strong>
                  {energy.pumpPower} kW
                </strong>
              </div>

              <div>
                <span>Battery reserve</span>
                <strong>
                  {energy.batteryLevel}%
                </strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-label">ENERGY TREND</span>

            <h3>Estimated Daily Energy Profile</h3>

            <p>
              A prototype estimate based on current generation and
              pump demand.
            </p>
          </div>
        </div>

        <div className="trend-chart">
          <div className="trend-axis">
            <span>24 kWh</span>
            <span>18 kWh</span>
            <span>12 kWh</span>
            <span>6 kWh</span>
            <span>0 kWh</span>
          </div>

          <div className="trend-bars">
            <div className="trend-column">
              <div
                className="trend-bar solar"
                style={{
                  height: `${Math.min(
                    estimatedDailySolar * 4,
                    180
                  )}px`,
                }}
              ></div>

              <span>Solar</span>
            </div>

            <div className="trend-column">
              <div
                className="trend-bar pump"
                style={{
                  height: `${Math.min(
                    estimatedPumpEnergy * 4,
                    180
                  )}px`,
                }}
              ></div>

              <span>Pump</span>
            </div>

            <div className="trend-column">
              <div
                className="trend-bar grid"
                style={{
                  height: `${Math.min(
                    estimatedGridEnergy * 4,
                    180
                  )}px`,
                }}
              ></div>

              <span>Grid</span>
            </div>
          </div>
        </div>
      </section>

      <div className="analytics-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Farm Sustainability</h3>

              <p>
                Indicators generated from the current farm state.
              </p>
            </div>
          </div>

          <div className="sustainability-list">
            <div className="sustainability-row">
              <div>
                <strong>Water Conservation</strong>
                <span>
                  AI-based irrigation planning
                </span>
              </div>

              <strong>
                {estimatedWaterSaved} L
              </strong>
            </div>

            <div className="sustainability-row">
              <div>
                <strong>Renewable Energy</strong>
                <span>
                  Current solar contribution
                </span>
              </div>

              <strong>
                {solarUtilization.toFixed(0)}%
              </strong>
            </div>

            <div className="sustainability-row">
              <div>
                <strong>Battery Reserve</strong>
                <span>
                  Stored energy available
                </span>
              </div>

              <strong>
                {energy.batteryLevel}%
              </strong>
            </div>

            <div className="sustainability-row">
              <div>
                <strong>Weather Awareness</strong>
                <span>
                  Rain probability integrated
                </span>
              </div>

              <strong>
                {weather.rainProbability}%
              </strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Operational Summary</h3>

              <p>
                Current conditions affecting farm performance.
              </p>
            </div>
          </div>

          <div className="analytics-summary-box">
            <div>
              <span>Crop</span>
              <strong>{farm.crop}</strong>
            </div>

            <div>
              <span>Growth Stage</span>
              <strong>{farm.growthStage}</strong>
            </div>

            <div>
              <span>Pump</span>
              <strong>
                {pump.running ? "Running" : "Stopped"}
              </strong>
            </div>

            <div>
              <span>Temperature</span>
              <strong>{weather.temperature}°C</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="panel analytics-report">
        <div>
          <span className="section-label">SMART AGRICULTURE REPORT</span>

          <h3>AI-generated performance summary</h3>

          <p>
            {farm.name} is currently operating with{" "}
            {energy.solarGeneration} kW of solar generation and{" "}
            {energy.batteryLevel}% battery reserve. Soil moisture is{" "}
            {soil.moisture}% and the current water availability is{" "}
            {water.available.toLocaleString()} L. The analytics
            engine combines these conditions to support more efficient
            irrigation and energy planning.
          </p>
        </div>

        <div className="report-period">
          <span>Selected period</span>
          <strong>{period}</strong>
        </div>
      </section>
    </div>
  );
}

export default Analytics;