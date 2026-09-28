import {
  createContext,
  useContext,
  useState,
} from "react";

const FarmContext = createContext(null);

const defaultFarmData = {
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
    soilType: "Loamy",
    moisture: 42,
    targetMoisture: 55,
  },

  water: {
    available: 2400,
    required: 420,
    reservoirCapacity: 5000,
    waterSource: "Farm Reservoir",
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

  pump: {
    running: false,
  },
};

function loadFarmData() {
  try {
    const savedData = localStorage.getItem(
      "agripower-farm-data"
    );

    if (savedData) {
      const parsedData = JSON.parse(savedData);

      return {
        ...defaultFarmData,
        ...parsedData,

        farm: {
          ...defaultFarmData.farm,
          ...(parsedData.farm || {}),
        },

        soil: {
          ...defaultFarmData.soil,
          ...(parsedData.soil || {}),
        },

        water: {
          ...defaultFarmData.water,
          ...(parsedData.water || {}),
        },

        weather: {
          ...defaultFarmData.weather,
          ...(parsedData.weather || {}),
        },

        energy: {
          ...defaultFarmData.energy,
          ...(parsedData.energy || {}),
        },

        sensors: {
          ...defaultFarmData.sensors,
          ...(parsedData.sensors || {}),
        },

        pump: {
          ...defaultFarmData.pump,
          ...(parsedData.pump || {}),
        },
      };
    }
  } catch (error) {
    console.error(
      "Error loading farm data:",
      error
    );
  }

  return defaultFarmData;
}

export function FarmProvider({ children }) {
  const [data, setData] = useState(loadFarmData);

  const saveData = (updatedData) => {
    try {
      localStorage.setItem(
        "agripower-farm-data",
        JSON.stringify(updatedData)
      );
    } catch (error) {
      console.error(
        "Error saving farm data:",
        error
      );
    }
  };

  const updateFarm = (section, values) => {
    setData((current) => {
      const updatedData = {
        ...current,

        [section]: {
          ...current[section],
          ...values,
        },
      };

      saveData(updatedData);

      return updatedData;
    });
  };

  const setPumpRunning = (running) => {
    setData((current) => {
      const updatedData = {
        ...current,

        pump: {
          ...current.pump,
          running,
        },
      };

      saveData(updatedData);

      return updatedData;
    });
  };

  const irrigationRequired =
    data.soil.moisture <
      data.soil.targetMoisture &&
    data.weather.rainProbability < 40 &&
    data.water.available >= data.water.required;

  let energySource = "Grid";

  if (
    data.energy.solarGeneration >=
    data.energy.pumpPower
  ) {
    energySource = "Solar";
  } else if (
    data.energy.batteryLevel >= 30
  ) {
    energySource = "Battery";
  }

  const contextValue = {
    data,
    setData,
    updateFarm,
    setPumpRunning,
    irrigationRequired,
    energySource,
  };

  return (
    <FarmContext.Provider value={contextValue}>
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);

  if (context === null) {
    throw new Error(
      "useFarm must be used inside FarmProvider"
    );
  }

  return context;
}