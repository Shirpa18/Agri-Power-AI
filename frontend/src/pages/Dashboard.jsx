import { useFarm } from "../context/FarmContext";
import { calculateFarmDecision } from "../utils/decisionEngine";

function Dashboard() {
  const {
    data,
    irrigationRequired,
    energySource,
  } = useFarm();

  const {
    farm,
    soil,
    water,
    weather,
    energy,
    sensors,
    pump,
  } = data;

  const decision =
    calculateFarmDecision(data);

  const moistureDifference = Math.max(
    soil.targetMoisture - soil.moisture,
    0
  );

  const waterStatus =
    water.available >= water.required
      ? "Sufficient"
      : "Low";

  const batteryStatus =
    energy.batteryLevel >= 50
      ? "Healthy"
      : energy.batteryLevel >= 30
        ? "Moderate"
        : "Low";

  const solarUtilization =
    energy.solarCapacity > 0
      ? Math.min(
          (energy.solarGeneration /
            energy.solarCapacity) *
            100,
          100
        )
      : 0;

  const batteryUtilization = Math.min(
    Math.max(energy.batteryLevel, 0),
    100
  );

  const waterUtilization =
    water.reservoirCapacity > 0
      ? Math.min(
          (water.available /
            water.reservoirCapacity) *
            100,
          100
        )
      : 0;

  const sensorCount = [
    sensors.soil,
    sensors.water,
    sensors.solar,
    sensors.pump,
  ].filter(Boolean).length;

  const actionRequired =
    decision.irrigationDecision ===
    "IRRIGATE";

  const irrigationMessage =
    decision.reason;

  return (
    <div className="dashboard">

      <div className="page-heading">
        <div>
          <h2>
            {farm.name}
          </h2>

          <p>
            {farm.location} · {farm.crop} ·{" "}
            {farm.fieldSize} hectares
          </p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-label">
            Soil Moisture
          </div>

          <div className="stat-value">
            {soil.moisture}%
          </div>

          <div className="stat-meta">
            Target {soil.targetMoisture}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Water Available
          </div>

          <div className="stat-value">
            {water.available.toLocaleString()} L
          </div>

          <div className="stat-meta">
            {waterStatus}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Solar Generation
          </div>

          <div className="stat-value">
            {energy.solarGeneration} kW
          </div>

          <div className="stat-meta">
            {Math.round(solarUtilization)}%
            utilization
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            Battery
          </div>

          <div className="stat-value">
            {energy.batteryLevel}%
          </div>

          <div className="stat-meta">
            {batteryStatus}
          </div>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">
                AI DECISION
              </p>

              <h3>
                Irrigation Intelligence
              </h3>
            </div>

            <span
              className={
                actionRequired
                  ? "status-badge warning"
                  : "status-badge success"
              }
            >
              {actionRequired
                ? "Action Required"
                : "Monitoring"}
            </span>
          </div>

          <div className="ai-decision">

            <div className="decision-status">
              <strong>
                {actionRequired
                  ? "Irrigation Recommended"
                  : "Irrigation Not Required"}
              </strong>

              <p>
                {irrigationMessage}
              </p>

              <p>
                {decision.energyReason}
              </p>
            </div>

            <div className="decision-grid">

              <div>
                <span>
                  Current Moisture
                </span>

                <strong>
                  {soil.moisture}%
                </strong>
              </div>

              <div>
                <span>
                  Target Moisture
                </span>

                <strong>
                  {soil.targetMoisture}%
                </strong>
              </div>

              <div>
                <span>
                  Moisture Gap
                </span>

                <strong>
                  {moistureDifference}%
                </strong>
              </div>

              <div>
                <span>
                  Rain Probability
                </span>

                <strong>
                  {weather.rainProbability}%
                </strong>
              </div>

            </div>

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">
                ENERGY MANAGEMENT
              </p>

              <h3>
                Energy Flow
              </h3>
            </div>

            <span className="status-badge success">
              {decision.energyDecision}
            </span>
          </div>

          <div className="energy-flow">

            <div
              className={
                decision.energyDecision ===
                "SOLAR"
                  ? "energy-row active"
                  : "energy-row"
              }
            >
              <div>
                <strong>
                  Solar
                </strong>

                <span>
                  {energy.solarGeneration} kW
                </span>
              </div>

              <span>
                {Math.round(
                  solarUtilization
                )}%
              </span>
            </div>

            <div
              className={
                decision.energyDecision ===
                "BATTERY"
                  ? "energy-row active"
                  : "energy-row"
              }
            >
              <div>
                <strong>
                  Battery
                </strong>

                <span>
                  {energy.batteryCapacity} kWh
                  capacity
                </span>
              </div>

              <span>
                {energy.batteryLevel}%
              </span>
            </div>

            <div
              className={
                decision.energyDecision ===
                "GRID"
                  ? "energy-row active"
                  : "energy-row"
              }
            >
              <div>
                <strong>
                  Grid
                </strong>

                <span>
                  {energy.gridAvailability
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              <span>
                Backup
              </span>
            </div>

          </div>

        </div>

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">
                WATER INTELLIGENCE
              </p>

              <h3>
                Water Status
              </h3>
            </div>

            <span
              className={
                waterStatus === "Sufficient"
                  ? "status-badge success"
                  : "status-badge warning"
              }
            >
              {waterStatus}
            </span>
          </div>

          <div className="metric-large">

            <strong>
              {water.available.toLocaleString()} L
            </strong>

            <span>
              available of{" "}
              {water.reservoirCapacity.toLocaleString()} L
            </span>

            <div className="progress-bar">
              <div
                className="progress-value"
                style={{
                  width: `${waterUtilization}%`,
                }}
              />
            </div>

          </div>

          <div className="detail-grid">

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
                Water Source
              </span>

              <strong>
                {water.waterSource}
              </strong>
            </div>

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">
                FARM SYSTEMS
              </p>

              <h3>
                Connected Systems
              </h3>
            </div>

            <span className="status-badge success">
              {sensorCount}/4 Online
            </span>
          </div>

          <div className="system-list">

            <div className="system-row">
              <span>
                Soil Sensor
              </span>

              <strong
                className={
                  sensors.soil
                    ? "online"
                    : "offline"
                }
              >
                {sensors.soil
                  ? "Connected"
                  : "Offline"}
              </strong>
            </div>

            <div className="system-row">
              <span>
                Water Sensor
              </span>

              <strong
                className={
                  sensors.water
                    ? "online"
                    : "offline"
                }
              >
                {sensors.water
                  ? "Connected"
                  : "Offline"}
              </strong>
            </div>

            <div className="system-row">
              <span>
                Solar System
              </span>

              <strong
                className={
                  sensors.solar
                    ? "online"
                    : "offline"
                }
              >
                {sensors.solar
                  ? "Connected"
                  : "Offline"}
              </strong>
            </div>

            <div className="system-row">
              <span>
                Pump Controller
              </span>

              <strong
                className={
                  sensors.pump
                    ? "online"
                    : "offline"
                }
              >
                {sensors.pump
                  ? "Connected"
                  : "Offline"}
              </strong>
            </div>

          </div>

        </div>

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>
            <p className="eyebrow">
              AI FARM INSIGHT
            </p>

            <h3>
              Current Farm Recommendation
            </h3>
          </div>

        </div>

        <div className="insight-content">

          <div>
            <strong>
              {actionRequired
                ? "Prepare irrigation"
                : "Continue monitoring"}
            </strong>

            <p>
              {decision.reason}{" "}
              {water.available.toLocaleString()} L
              of water is available and{" "}
              {decision.energyDecision.toLowerCase()}
              {" "}
              is currently the preferred energy
              source.
            </p>

            <p>
              Energy logic:{" "}
              {decision.energyReason}
            </p>

          </div>

        </div>

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">
                CROP PROFILE
              </p>

              <h3>
                Farm Configuration
              </h3>
            </div>
          </div>

          <div className="detail-grid">

            <div>
              <span>
                Crop
              </span>

              <strong>
                {farm.crop}
              </strong>
            </div>

            <div>
              <span>
                Growth Stage
              </span>

              <strong>
                {farm.growthStage}
              </strong>
            </div>

            <div>
              <span>
                Field Size
              </span>

              <strong>
                {farm.fieldSize} ha
              </strong>
            </div>

            <div>
              <span>
                Irrigation
              </span>

              <strong>
                {farm.irrigationMethod}
              </strong>
            </div>

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">
                LIVE STATUS
              </p>

              <h3>
                Pump & Weather
              </h3>
            </div>
          </div>

          <div className="detail-grid">

            <div>
              <span>
                Pump
              </span>

              <strong>
                {pump.running
                  ? "Running"
                  : "Stopped"}
              </strong>
            </div>

            <div>
              <span>
                Pump Power
              </span>

              <strong>
                {energy.pumpPower} kW
              </strong>
            </div>

            <div>
              <span>
                Temperature
              </span>

              <strong>
                {weather.temperature}°C
              </strong>
            </div>

            <div>
              <span>
                Rain Probability
              </span>

              <strong>
                {weather.rainProbability}%
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;