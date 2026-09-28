import { useFarm } from "../context/FarmContext";
import { calculateFarmDecision } from "../utils/decisionEngine";

function Energy() {
  const { data, energySource } = useFarm();

  const {
    farm,
    energy,
    pump,
  } = data;

  const decision = calculateFarmDecision(data);

  const solarUtilization =
    energy.solarCapacity > 0
      ? Math.min(
          (energy.solarGeneration / energy.solarCapacity) * 100,
          100
        )
      : 0;

  const batteryCapacity = energy.batteryCapacity || 1;

  const batteryEnergy =
    (energy.batteryLevel / 100) * batteryCapacity;

  const pumpCoverage =
    energy.pumpPower > 0
      ? Math.min(
          (energy.solarGeneration / energy.pumpPower) * 100,
          100
        )
      : 0;

  const getEnergyStatus = () => {
    if (decision.energyDecision === "SOLAR") {
      return "Solar power available";
    }

    if (decision.energyDecision === "BATTERY") {
      return "Battery support active";
    }

    if (decision.energyDecision === "GRID") {
      return "Grid fallback available";
    }

    return "Energy unavailable";
  };

  const getEnergyStatusClass = () => {
    if (decision.energyDecision === "UNAVAILABLE") {
      return "warning";
    }

    return "success";
  };

  return (
    <div className="energy-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Energy Intelligence</p>

          <h2>Energy Management</h2>

          <p>
            Optimize solar, battery and grid energy for
            efficient farm operations.
          </p>
        </div>

        <span
          className={`status-badge ${getEnergyStatusClass()}`}
        >
          {getEnergyStatus()}
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            Solar Generation
          </div>

          <div className="stat-value">
            {energy.solarGeneration}
            <span> kW</span>
          </div>

          <div className="stat-meta">
            Capacity: {energy.solarCapacity} kW
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Battery Level
          </div>

          <div className="stat-value">
            {energy.batteryLevel}
            <span>%</span>
          </div>

          <div className="stat-meta">
            {batteryEnergy.toFixed(1)} kWh stored
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Pump Power
          </div>

          <div className="stat-value">
            {energy.pumpPower}
            <span> kW</span>
          </div>

          <div className="stat-meta">
            Pump status:{" "}
            {pump.running ? "Running" : "Standby"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Grid Availability
          </div>

          <div className="stat-value">
            {energy.gridAvailability
              ? "Available"
              : "Offline"}
          </div>

          <div className="stat-meta">
            Backup energy source
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                AI Energy Decision
              </p>

              <h3>Recommended Energy Source</h3>
            </div>

            <span
              className={`status-badge ${
                decision.energyDecision === "UNAVAILABLE"
                  ? "warning"
                  : "success"
              }`}
            >
              {decision.energyDecision}
            </span>
          </div>

          <div className="ai-decision">
            <div className="decision-status">
              <div>
                <span className="metric-label">
                  Current recommendation
                </span>

                <strong>
                  {decision.energyDecision}
                </strong>
              </div>

              <div>
                <span className="metric-label">
                  Farm
                </span>

                <strong>
                  {farm.name}
                </strong>
              </div>
            </div>

            <div className="decision-grid">
              <div>
                <span className="metric-label">
                  Energy logic
                </span>

                <p>
                  {decision.energyReason}
                </p>
              </div>

              <div>
                <span className="metric-label">
                  Pump requirement
                </span>

                <p>
                  {energy.pumpPower} kW
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                Energy Flow
              </p>

              <h3>Source Priority</h3>
            </div>
          </div>

          <div className="energy-flow">
            <div
              className={
                decision.energyDecision === "SOLAR"
                  ? "energy-row active"
                  : "energy-row"
              }
            >
              <div>
                <strong>Solar</strong>

                <span>
                  Renewable primary source
                </span>
              </div>

              <strong>
                {energy.solarGeneration} kW
              </strong>
            </div>

            <div
              className={
                decision.energyDecision === "BATTERY"
                  ? "energy-row active"
                  : "energy-row"
              }
            >
              <div>
                <strong>Battery</strong>

                <span>
                  Stored renewable energy
                </span>
              </div>

              <strong>
                {energy.batteryLevel}%
              </strong>
            </div>

            <div
              className={
                decision.energyDecision === "GRID"
                  ? "energy-row active"
                  : "energy-row"
              }
            >
              <div>
                <strong>Grid</strong>

                <span>
                  Backup energy source
                </span>
              </div>

              <strong>
                {energy.gridAvailability
                  ? "Available"
                  : "Offline"}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                Solar Performance
              </p>

              <h3>Solar Utilization</h3>
            </div>

            <strong>
              {solarUtilization.toFixed(0)}%
            </strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-value"
              style={{
                width: `${solarUtilization}%`,
              }}
            />
          </div>

          <div className="detail-grid">
            <div>
              <span className="metric-label">
                Current generation
              </span>

              <strong>
                {energy.solarGeneration} kW
              </strong>
            </div>

            <div>
              <span className="metric-label">
                Solar capacity
              </span>

              <strong>
                {energy.solarCapacity} kW
              </strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                Battery Storage
              </p>

              <h3>Battery Status</h3>
            </div>

            <strong>
              {energy.batteryLevel}%
            </strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-value"
              style={{
                width: `${Math.min(
                  energy.batteryLevel,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="detail-grid">
            <div>
              <span className="metric-label">
                Stored energy
              </span>

              <strong>
                {batteryEnergy.toFixed(1)} kWh
              </strong>
            </div>

            <div>
              <span className="metric-label">
                Battery capacity
              </span>

              <strong>
                {energy.batteryCapacity} kWh
              </strong>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              Pump Intelligence
            </p>

            <h3>Solar Pump Coverage</h3>
          </div>

          <span
            className={`status-badge ${
              pumpCoverage >= 100
                ? "success"
                : "warning"
            }`}
          >
            {pumpCoverage >= 100
              ? "Fully Covered"
              : "Partially Covered"}
          </span>
        </div>

        <div className="metric-large">
          {pumpCoverage.toFixed(0)}%
        </div>

        <p>
          Current solar generation can cover{" "}
          {pumpCoverage.toFixed(0)}% of the pump's
          {` `}{energy.pumpPower} kW power requirement.
        </p>

        <div className="progress-bar">
          <div
            className="progress-value"
            style={{
              width: `${pumpCoverage}%`,
            }}
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              AI Decision Logic
            </p>

            <h3>Energy Selection Process</h3>
          </div>
        </div>

        <div className="condition-grid">
          <div className="condition-item">
            <span>Solar generation</span>

            <strong>
              {energy.solarGeneration >=
              energy.pumpPower
                ? "Sufficient"
                : "Insufficient"}
            </strong>
          </div>

          <div className="condition-item">
            <span>Battery reserve</span>

            <strong>
              {energy.batteryLevel >= 30
                ? "Available"
                : "Low"}
            </strong>
          </div>

          <div className="condition-item">
            <span>Grid status</span>

            <strong>
              {energy.gridAvailability
                ? "Available"
                : "Offline"}
            </strong>
          </div>

          <div className="condition-item">
            <span>Selected source</span>

            <strong>
              {decision.energyDecision}
            </strong>
          </div>
        </div>

        <div className="insight-content">
          <div>
            <span className="metric-label">
              Decision explanation
            </span>

            <p>
              {decision.energyReason}
            </p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              Farm Energy Status
            </p>

            <h3>Current Operating Conditions</h3>
          </div>
        </div>

        <div className="system-list">
          <div className="system-row">
            <div>
              <strong>Solar System</strong>

              <span>
                {energy.solarGeneration} kW generation
              </span>
            </div>

            <span className="online">
              Online
            </span>
          </div>

          <div className="system-row">
            <div>
              <strong>Battery System</strong>

              <span>
                {energy.batteryLevel}% charge
              </span>
            </div>

            <span
              className={
                energy.batteryLevel >= 30
                  ? "online"
                  : "offline"
              }
            >
              {energy.batteryLevel >= 30
                ? "Available"
                : "Low"}
            </span>
          </div>

          <div className="system-row">
            <div>
              <strong>Grid Connection</strong>

              <span>
                Backup energy source
              </span>
            </div>

            <span
              className={
                energy.gridAvailability
                  ? "online"
                  : "offline"
              }
            >
              {energy.gridAvailability
                ? "Online"
                : "Offline"}
            </span>
          </div>

          <div className="system-row">
            <div>
              <strong>Farm Pump</strong>

              <span>
                {energy.pumpPower} kW rated power
              </span>
            </div>

            <span
              className={
                pump.running
                  ? "online"
                  : "offline"
              }
            >
              {pump.running
                ? "Running"
                : "Standby"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Energy;