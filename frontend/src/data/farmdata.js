export const farmData = {
  farm: {
    name: "Green Valley Farm",
    location: "Karnataka, India",
    crop: "Tomato",
    fieldSize: 2.5,
    growthStage: "Flowering",
    irrigationMethod: "Drip Irrigation",
    soilType: "Loamy",
  },

  soil: {
    moisture: 42,
    targetMoisture: 55,
  },

  water: {
    available: 2400,
    required: 420,
    reservoirCapacity: 5000,
  },

  weather: {
    temperature: 29,
    rainProbability: 18,
  },

  energy: {
    solarGeneration: 2.8,
    solarCapacity: 5,
    batteryLevel: 78,
    batteryCapacity: 10,
    pumpPower: 0.6,
    gridAvailability: true,
  },

  sensors: {
    soil: true,
    water: true,
    solar: true,
    pump: true,
  },
};