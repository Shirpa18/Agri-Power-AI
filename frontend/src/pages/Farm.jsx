import { useState } from "react";
import { useFarm } from "../context/FarmContext";

function Farm() {
  const { data, updateFarm } = useFarm();

  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    ...data.farm,
    soilType: data.soil.soilType,
    targetMoisture: data.soil.targetMoisture,
    waterSource: data.water.waterSource,
    reservoirCapacity: data.water.reservoirCapacity,
    pumpPower: data.energy.pumpPower,
    solarCapacity: data.energy.solarCapacity,
    batteryCapacity: data.energy.batteryCapacity,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    updateFarm("farm", {
      name: form.name,
      location: form.location,
      crop: form.crop,
      fieldSize: Number(form.fieldSize),
      growthStage: form.growthStage,
      irrigationMethod: form.irrigationMethod,
      soilType: form.soilType,
    });

    updateFarm("soil", {
      soilType: form.soilType,
      targetMoisture: Number(
        form.targetMoisture
      ),
    });

    updateFarm("water", {
      waterSource: form.waterSource,
      reservoirCapacity: Number(
        form.reservoirCapacity
      ),
    });

    updateFarm("energy", {
      pumpPower: Number(form.pumpPower),
      solarCapacity: Number(
        form.solarCapacity
      ),
      batteryCapacity: Number(
        form.batteryCapacity
      ),
    });

    setSaved(true);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Farm Configuration
          </p>

          <h2>
            Build Your Farm Profile
          </h2>

          <p>
            Configure the farm once and let
            AgriPower use it across every intelligence
            module.
          </p>
        </div>

        <span className="status-badge success">
          Digital Profile Active
        </span>
      </div>

      <form onSubmit={handleSave}>
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                01
              </p>

              <h3>
                Farm Identity
              </h3>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Farm Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Primary Crop</label>

              <input
                name="crop"
                value={form.crop}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Field Size</label>

              <input
                type="number"
                step="0.1"
                name="fieldSize"
                value={form.fieldSize}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Growth Stage</label>

              <select
                name="growthStage"
                value={form.growthStage}
                onChange={handleChange}
              >
                <option>Seedling</option>
                <option>Vegetative</option>
                <option>Flowering</option>
                <option>Fruiting</option>
                <option>Harvest</option>
              </select>
            </div>

            <div className="form-group">
              <label>Irrigation Method</label>

              <select
                name="irrigationMethod"
                value={form.irrigationMethod}
                onChange={handleChange}
              >
                <option>
                  Drip Irrigation
                </option>

                <option>
                  Sprinkler Irrigation
                </option>

                <option>
                  Flood Irrigation
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                02
              </p>

              <h3>
                Water & Soil Intelligence
              </h3>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Soil Type</label>

              <select
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
              >
                <option>Loamy</option>
                <option>Sandy</option>
                <option>Clay</option>
                <option>Silty</option>
                <option>Black Soil</option>
                <option>Red Soil</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Target Soil Moisture
              </label>

              <input
                type="number"
                min="0"
                max="100"
                name="targetMoisture"
                value={form.targetMoisture}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Water Source</label>

              <select
                name="waterSource"
                value={form.waterSource}
                onChange={handleChange}
              >
                <option>
                  Farm Reservoir
                </option>

                <option>
                  Borewell
                </option>

                <option>
                  Rainwater Harvesting
                </option>

                <option>
                  Canal
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Reservoir Capacity
              </label>

              <input
                type="number"
                name="reservoirCapacity"
                value={form.reservoirCapacity}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                03
              </p>

              <h3>
                Energy Infrastructure
              </h3>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                Pump Power
              </label>

              <input
                type="number"
                step="0.1"
                name="pumpPower"
                value={form.pumpPower}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Solar Capacity
              </label>

              <input
                type="number"
                step="0.1"
                name="solarCapacity"
                value={form.solarCapacity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Battery Capacity
              </label>

              <input
                type="number"
                step="0.1"
                name="batteryCapacity"
                value={form.batteryCapacity}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                DIGITAL PROFILE
              </p>

              <h3>
                Configuration Preview
              </h3>
            </div>
          </div>

          <div className="detail-grid">
            <div>
              <span>
                Farm
              </span>

              <strong>
                {form.name}
              </strong>
            </div>

            <div>
              <span>
                Crop
              </span>

              <strong>
                {form.crop}
              </strong>
            </div>

            <div>
              <span>
                Soil Target
              </span>

              <strong>
                {form.targetMoisture}%
              </strong>
            </div>

            <div>
              <span>
                Solar
              </span>

              <strong>
                {form.solarCapacity} kW
              </strong>
            </div>
          </div>

          <div className="form-actions">
            {saved && (
              <span className="status-badge success">
                Configuration Saved
              </span>
            )}

            <button
              type="submit"
              className="button primary"
            >
              Save Farm Configuration
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export default Farm;