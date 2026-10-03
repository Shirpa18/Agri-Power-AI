import React from "react";
import { useFarm } from "../context/FarmContext";

function Farm() {
  const {
    farm,
    loading,
    error,
  } = useFarm();

  if (loading && !farm) {
    return (
      <div className="farm-page">
        <div className="dashboard-loading">
          Loading farm configuration...
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="farm-page">
        <div className="dashboard-error">
          <h3>Farm configuration unavailable</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const farmName =
    farm?.name || "Green Valley Farm";

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

  const soilCondition =
    soilMoisture < 30
      ? "Very dry"
      : soilMoisture < 45
      ? "Dry"
      : soilMoisture < 70
      ? "Healthy"
      : "Wet";

  const waterCondition =
    waterLevel < 25
      ? "Critical"
      : waterLevel < 50
      ? "Low"
      : waterLevel < 75
      ? "Moderate"
      : "Healthy";

  return (
    <div className="farm-page">
      <section className="farm-header">
        <div>
          <div className="farm-overline">
            FARM CONFIGURATION
          </div>

          <h1>{farmName}</h1>

          <p>
            Manage farm information, field conditions
            and connected infrastructure.
          </p>
        </div>

        <div className="farm-location-card">
          <span>Farm location</span>
          <strong>{location}</strong>
        </div>
      </section>

      <section className="farm-main-grid">
        <div className="farm-panel farm-profile-panel">
          <div className="farm-panel-header">
            <div>
              <h2>Farm profile</h2>

              <p>
                Current farm configuration used by
                AgriPower AI.
              </p>
            </div>
          </div>

          <div className="farm-profile-grid">
            <div className="farm-field">
              <span>Farm name</span>
              <strong>{farmName}</strong>
            </div>

            <div className="farm-field">
              <span>Location</span>
              <strong>{location}</strong>
            </div>

            <div className="farm-field">
              <span>Operating mode</span>
              <strong>AI assisted</strong>
            </div>

            <div className="farm-field">
              <span>System type</span>
              <strong>Smart agriculture</strong>
            </div>
          </div>
        </div>

        <div className="farm-panel farm-status-panel">
          <div className="farm-panel-header">
            <div>
              <h2>Farm status</h2>

              <p>
                Live resource conditions.
              </p>
            </div>
          </div>

          <div className="farm-status-list">
            <div>
              <span>Soil condition</span>

              <strong
                className={
                  soilMoisture < 30
                    ? "farm-danger"
                    : soilMoisture < 45
                    ? "farm-warning"
                    : "farm-healthy"
                }
              >
                {soilCondition}
              </strong>
            </div>

            <div>
              <span>Water condition</span>

              <strong
                className={
                  waterLevel < 25
                    ? "farm-danger"
                    : waterLevel < 50
                    ? "farm-warning"
                    : "farm-healthy"
                }
              >
                {waterCondition}
              </strong>
            </div>

            <div>
              <span>Pump status</span>

              <strong
                className={
                  pumpStatus
                    ? "farm-warning"
                    : "farm-healthy"
                }
              >
                {pumpStatus ? "Running" : "Idle"}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="farm-panel">
        <div className="farm-panel-header">
          <div>
            <h2>Field conditions</h2>

            <p>
              Current measurements received by the
              farm intelligence system.
            </p>
          </div>
        </div>

        <div className="farm-condition-grid">
          <div className="farm-condition-card">
            <div className="farm-condition-top">
              <span>Soil moisture</span>
              <strong>
                {soilMoisture.toFixed(0)}%
              </strong>
            </div>

            <div className="farm-progress">
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
              Moisture available in the active
              growing area.
            </p>
          </div>

          <div className="farm-condition-card">
            <div className="farm-condition-top">
              <span>Water reserve</span>
              <strong>
                {waterLevel.toFixed(0)}%
              </strong>
            </div>

            <div className="farm-progress">
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
              Current irrigation water availability.
            </p>
          </div>

          <div className="farm-condition-card">
            <div className="farm-condition-top">
              <span>Solar generation</span>
              <strong>
                {solarPower.toFixed(1)} kW
              </strong>
            </div>

            <div className="farm-progress">
              <div
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, solarPower * 33.33)
                  )}%`,
                }}
              />
            </div>

            <p>
              Current renewable energy output.
            </p>
          </div>

          <div className="farm-condition-card">
            <div className="farm-condition-top">
              <span>Battery charge</span>
              <strong>
                {batteryLevel.toFixed(0)}%
              </strong>
            </div>

            <div className="farm-progress">
              <div
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, batteryLevel)
                  )}%`,
                }}
              />
            </div>

            <p>
              Stored energy available for farm
              operations.
            </p>
          </div>
        </div>
      </section>

      <section className="farm-panel">
        <div className="farm-panel-header">
          <div>
            <h2>Connected infrastructure</h2>

            <p>
              Components currently represented in
              the AgriPower AI system.
            </p>
          </div>
        </div>

        <div className="farm-infrastructure-grid">
          <div className="farm-infrastructure-item">
            <div className="farm-infrastructure-icon">
              SM
            </div>

            <div>
              <strong>Soil moisture sensor</strong>
              <span>Monitoring field moisture</span>
            </div>

            <b>Connected</b>
          </div>

          <div className="farm-infrastructure-item">
            <div className="farm-infrastructure-icon">
              WT
            </div>

            <div>
              <strong>Water monitoring</strong>
              <span>Tracking irrigation reserve</span>
            </div>

            <b>Connected</b>
          </div>

          <div className="farm-infrastructure-item">
            <div className="farm-infrastructure-icon">
              PV
            </div>

            <div>
              <strong>Solar generation</strong>
              <span>Monitoring renewable output</span>
            </div>

            <b>Connected</b>
          </div>

          <div className="farm-infrastructure-item">
            <div className="farm-infrastructure-icon">
              BAT
            </div>

            <div>
              <strong>Battery storage</strong>
              <span>Tracking stored energy</span>
            </div>

            <b>Connected</b>
          </div>

          <div className="farm-infrastructure-item">
            <div className="farm-infrastructure-icon">
              P
            </div>

            <div>
              <strong>Irrigation pump</strong>
              <span>
                {pumpStatus
                  ? "Currently operating"
                  : "Currently idle"}
              </span>
            </div>

            <b>
              {pumpStatus ? "Active" : "Ready"}
            </b>
          </div>

          <div className="farm-infrastructure-item">
            <div className="farm-infrastructure-icon">
              AI
            </div>

            <div>
              <strong>Decision engine</strong>
              <span>Farm intelligence active</span>
            </div>

            <b>Active</b>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Farm;