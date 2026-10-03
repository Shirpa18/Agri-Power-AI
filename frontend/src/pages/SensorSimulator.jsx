import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";

function SensorSimulator() {
  const {
    farm,
    sendSensorData,
    loading,
    error,
  } = useFarm();

  const [soilMoisture, setSoilMoisture] = useState(
    Number(
      farm?.soil_moisture ??
        farm?.soilMoisture ??
        55
    )
  );

  const [waterLevel, setWaterLevel] = useState(
    Number(
      farm?.water_level ??
        farm?.waterLevel ??
        70
    )
  );

  const [solarPower, setSolarPower] = useState(
    Number(
      farm?.solar_power ??
        farm?.solarPower ??
        2.5
    )
  );

  const [batteryLevel, setBatteryLevel] = useState(
    Number(
      farm?.battery_level ??
        farm?.batteryLevel ??
        65
    )
  );

  const [pumpStatus, setPumpStatus] = useState(
    Boolean(
      farm?.pump_status ??
        farm?.pumpStatus ??
        false
    )
  );

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendData = async () => {
    setSending(true);
    setMessage("");

    try {
      await sendSensorData({
        soil_moisture: Number(soilMoisture),
        water_level: Number(waterLevel),
        solar_power: Number(solarPower),
        battery_level: Number(batteryLevel),
        pump_status: Boolean(pumpStatus),
      });

      setMessage(
        "Sensor data successfully sent to the farm system."
      );
    } catch (err) {
      setMessage(
        err?.message ||
          "Unable to send sensor data."
      );
    } finally {
      setSending(false);
    }
  };

  const applyScenario = (scenario) => {
    if (scenario === "normal") {
      setSoilMoisture(58);
      setWaterLevel(72);
      setSolarPower(2.8);
      setBatteryLevel(68);
      setPumpStatus(false);
    }

    if (scenario === "dry") {
      setSoilMoisture(24);
      setWaterLevel(62);
      setSolarPower(2.4);
      setBatteryLevel(58);
      setPumpStatus(true);
    }

    if (scenario === "low-water") {
      setSoilMoisture(34);
      setWaterLevel(18);
      setSolarPower(2.1);
      setBatteryLevel(42);
      setPumpStatus(false);
    }

    if (scenario === "low-energy") {
      setSoilMoisture(38);
      setWaterLevel(55);
      setSolarPower(0.4);
      setBatteryLevel(16);
      setPumpStatus(false);
    }

    setMessage(
      "Scenario loaded. Send the simulated data to apply it."
    );
  };

  return (
    <div className="sensor-page">
      <section className="sensor-header">
        <div>
          <div className="sensor-overline">
            HARDWARE PROTOTYPE
          </div>

          <h1>Sensor simulator</h1>

          <p>
            Simulate ESP32 sensor readings and send
            them directly into the AgriPower AI
            decision system.
          </p>
        </div>

        <div className="sensor-mode-card">
          <span>Input mode</span>

          <strong>
            Software simulation
          </strong>
        </div>
      </section>

      <section className="sensor-layout">
        <div className="sensor-panel">
          <div className="sensor-panel-header">
            <div>
              <h2>Live sensor inputs</h2>

              <p>
                Adjust the values below to simulate
                physical farm sensors.
              </p>
            </div>

            <span className="sensor-live-badge">
              SIMULATOR
            </span>
          </div>

          <div className="sensor-control-list">
            <div className="sensor-control">
              <div className="sensor-control-header">
                <div>
                  <strong>Soil moisture</strong>

                  <span>
                    Simulated capacitive soil sensor
                  </span>
                </div>

                <b>
                  {soilMoisture}%
                </b>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(event) =>
                  setSoilMoisture(
                    Number(event.target.value)
                  )
                }
              />

              <div className="sensor-range-labels">
                <span>Dry</span>
                <span>Healthy</span>
                <span>Wet</span>
              </div>
            </div>

            <div className="sensor-control">
              <div className="sensor-control-header">
                <div>
                  <strong>Water level</strong>

                  <span>
                    Simulated tank or reservoir sensor
                  </span>
                </div>

                <b>
                  {waterLevel}%
                </b>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={waterLevel}
                onChange={(event) =>
                  setWaterLevel(
                    Number(event.target.value)
                  )
                }
              />

              <div className="sensor-range-labels">
                <span>Empty</span>
                <span>Moderate</span>
                <span>Full</span>
              </div>
            </div>

            <div className="sensor-control">
              <div className="sensor-control-header">
                <div>
                  <strong>Solar generation</strong>

                  <span>
                    Simulated solar power output
                  </span>
                </div>

                <b>
                  {solarPower.toFixed(1)} kW
                </b>
              </div>

              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={solarPower}
                onChange={(event) =>
                  setSolarPower(
                    Number(event.target.value)
                  )
                }
              />

              <div className="sensor-range-labels">
                <span>0 kW</span>
                <span>2.5 kW</span>
                <span>5 kW</span>
              </div>
            </div>

            <div className="sensor-control">
              <div className="sensor-control-header">
                <div>
                  <strong>Battery level</strong>

                  <span>
                    Simulated energy storage
                  </span>
                </div>

                <b>
                  {batteryLevel}%
                </b>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={batteryLevel}
                onChange={(event) =>
                  setBatteryLevel(
                    Number(event.target.value)
                  )
                }
              />

              <div className="sensor-range-labels">
                <span>Empty</span>
                <span>Medium</span>
                <span>Full</span>
              </div>
            </div>

            <div className="sensor-pump-control">
              <div>
                <strong>Irrigation pump</strong>

                <span>
                  Simulated pump controller state
                </span>
              </div>

              <button
                type="button"
                className={
                  pumpStatus
                    ? "sensor-toggle active"
                    : "sensor-toggle"
                }
                onClick={() =>
                  setPumpStatus(
                    (previous) => !previous
                  )
                }
              >
                <span />

                {pumpStatus
                  ? "Pump ON"
                  : "Pump OFF"}
              </button>
            </div>
          </div>

          <div className="sensor-submit-area">
            <button
              type="button"
              className="primary-button sensor-send-button"
              onClick={handleSendData}
              disabled={sending}
            >
              {sending
                ? "Sending data..."
                : "Send sensor data"}
            </button>

            {message && (
              <div className="sensor-message">
                {message}
              </div>
            )}

            {error && (
              <div className="sensor-error">
                {error}
              </div>
            )}
          </div>
        </div>

        <aside className="sensor-panel sensor-preview-panel">
          <div className="sensor-panel-header">
            <div>
              <h2>Sensor payload</h2>

              <p>
                Values that will be sent to the
                backend.
              </p>
            </div>
          </div>

          <div className="sensor-payload">
            <div>
              <span>soil_moisture</span>
              <strong>{soilMoisture}</strong>
            </div>

            <div>
              <span>water_level</span>
              <strong>{waterLevel}</strong>
            </div>

            <div>
              <span>solar_power</span>
              <strong>
                {solarPower.toFixed(1)}
              </strong>
            </div>

            <div>
              <span>battery_level</span>
              <strong>{batteryLevel}</strong>
            </div>

            <div>
              <span>pump_status</span>
              <strong>
                {pumpStatus ? "true" : "false"}
              </strong>
            </div>
          </div>

          <div className="sensor-preview-note">
            <strong>
              Hardware connection
            </strong>

            <p>
              The same data structure can later be
              sent by an ESP32 instead of this
              simulator.
            </p>
          </div>
        </aside>
      </section>

      <section className="sensor-panel">
        <div className="sensor-panel-header">
          <div>
            <h2>Demo scenarios</h2>

            <p>
              Quickly load realistic farm conditions
              for your hackathon demonstration.
            </p>
          </div>
        </div>

        <div className="sensor-scenario-grid">
          <button
            type="button"
            onClick={() =>
              applyScenario("normal")
            }
          >
            <strong>Normal conditions</strong>

            <span>
              Healthy soil, adequate water and
              strong renewable generation.
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario("dry")
            }
          >
            <strong>Dry field</strong>

            <span>
              Low soil moisture requiring an
              irrigation decision.
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario("low-water")
            }
          >
            <strong>Low water reserve</strong>

            <span>
              Limited irrigation water requiring
              careful resource management.
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario("low-energy")
            }
          >
            <strong>Low energy</strong>

            <span>
              Weak solar output and low battery
              reserve.
            </span>
          </button>
        </div>
      </section>

      <section className="sensor-panel sensor-hardware-panel">
        <div className="sensor-panel-header">
          <div>
            <h2>ESP32 integration path</h2>

            <p>
              The simulator is designed to be replaced
              by real sensor data without changing the
              dashboard architecture.
            </p>
          </div>
        </div>

        <div className="sensor-hardware-flow">
          <div className="sensor-flow-step">
            <span>01</span>

            <div>
              <strong>Physical sensors</strong>

              <p>
                Soil moisture, water level, solar
                and battery sensors.
              </p>
            </div>
          </div>

          <div className="sensor-flow-arrow">
            →
          </div>

          <div className="sensor-flow-step">
            <span>02</span>

            <div>
              <strong>ESP32</strong>

              <p>
                Reads sensors and sends structured
                data over Wi-Fi.
              </p>
            </div>
          </div>

          <div className="sensor-flow-arrow">
            →
          </div>

          <div className="sensor-flow-step">
            <span>03</span>

            <div>
              <strong>FastAPI backend</strong>

              <p>
                Stores readings and runs the farm
                decision engine.
              </p>
            </div>
          </div>

          <div className="sensor-flow-arrow">
            →
          </div>

          <div className="sensor-flow-step">
            <span>04</span>

            <div>
              <strong>AgriPower dashboard</strong>

              <p>
                Displays decisions and system state
                to the farmer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SensorSimulator;