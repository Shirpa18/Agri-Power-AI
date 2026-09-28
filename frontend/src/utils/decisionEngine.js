export function calculateFarmDecision(data) {
  const {
    soil,
    water,
    weather,
    energy,
    pump,
  } = data;

  const moistureGap = Math.max(
    soil.targetMoisture - soil.moisture,
    0
  );

  const soilDry =
    soil.moisture < soil.targetMoisture;

  const rainExpected =
    weather.rainProbability >= 60;

  const waterAvailable =
    water.available >= water.required;

  const solarAvailable =
    energy.solarGeneration >= energy.pumpPower;

  const batteryAvailable =
    energy.batteryLevel >= 30;

  let irrigationDecision = "WAIT";
  let energyDecision = "GRID";
  let priority = "NORMAL";

  if (rainExpected) {
    irrigationDecision = "WAIT";
    priority = "LOW";
  } else if (
    soilDry &&
    waterAvailable
  ) {
    irrigationDecision = "IRRIGATE";

    if (solarAvailable) {
      energyDecision = "SOLAR";
    } else if (batteryAvailable) {
      energyDecision = "BATTERY";
    } else if (energy.gridAvailability) {
      energyDecision = "GRID";
    } else {
      energyDecision = "UNAVAILABLE";
      irrigationDecision = "WAIT";
    }

    if (moistureGap >= 20) {
      priority = "HIGH";
    } else {
      priority = "MEDIUM";
    }
  }

  if (!waterAvailable) {
    irrigationDecision = "WAIT";
    priority = "HIGH";
  }

  if (
    !energy.gridAvailability &&
    !solarAvailable &&
    !batteryAvailable
  ) {
    irrigationDecision = "WAIT";
    energyDecision = "UNAVAILABLE";
    priority = "HIGH";
  }

  let reason =
    "Current farm conditions do not require immediate irrigation.";

  if (rainExpected) {
    reason =
      "Rain probability is high, so irrigation is being delayed to avoid unnecessary water use.";
  } else if (!waterAvailable) {
    reason =
      "Available water is below the calculated irrigation requirement.";
  } else if (
    irrigationDecision === "IRRIGATE"
  ) {
    reason =
      `Soil moisture is ${moistureGap}% below the target and irrigation conditions are suitable.`;
  }

  let energyReason =
    "Grid power is available as the fallback energy source.";

  if (energyDecision === "SOLAR") {
    energyReason =
      "Solar generation is sufficient to operate the irrigation pump.";
  } else if (energyDecision === "BATTERY") {
    energyReason =
      "Solar generation is insufficient, so the battery can support the pump.";
  } else if (
    energyDecision === "UNAVAILABLE"
  ) {
    energyReason =
      "No suitable energy source is currently available.";
  }

  return {
    irrigationDecision,
    energyDecision,
    priority,
    moistureGap,
    reason,
    energyReason,
    soilDry,
    rainExpected,
    waterAvailable,
    solarAvailable,
    batteryAvailable,
    pumpRunning: pump.running,
  };
}