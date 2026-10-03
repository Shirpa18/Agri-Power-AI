import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getFarm,
  getFarmIntelligence,
  updateFarm,
  sendSensorData,
  automaticPumpControl,
} from "../utils/api";

const FarmContext = createContext(null);

const defaultFarmData = {
  farm: {
    name: "Green Valley Farm",
    location: "Karnataka, India",
    crop: "Tomato",
    field_size: 2.5,
    growth_stage: "Flowering",
    irrigation_method: "Drip Irrigation",
    soil_type: "Loamy",
  },

  soil: {
    moisture: 42,
    target_moisture: 55,
  },

  water: {
    available: 2400,
    required: 420,
    reservoir_capacity: 5000,
  },

  weather: {
    temperature: 29,
    rain_probability: 18,
  },

  energy: {
    solar_generation: 2.8,
    solar_capacity: 5,
    battery_level: 78,
    battery_capacity: 10,
    pump_power: 0.6,
    grid_available: true,
  },

  pump: {
    running: false,
  },
};

export function FarmProvider({ children }) {
  const [data, setData] = useState(defaultFarmData);

  const [intelligence, setIntelligence] =
    useState(null);

  const [pumpStatus, setPumpStatus] =
    useState({
      pumpRunning: false,
      recommendedAction: "WAIT",
      energySource: "GRID",
      priority: "NORMAL",
    });

  const [backendOnline, setBackendOnline] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const loadBackendData = async () => {
    try {
      const [
        farm,
        intelligenceData,
      ] = await Promise.all([
        getFarm(),
        getFarmIntelligence(),
      ]);

      setData(farm);

      setIntelligence(
        intelligenceData
      );

      setPumpStatus({
        pumpRunning:
          farm?.pump?.running ?? false,

        recommendedAction:
          intelligenceData
            ?.recommendation
            ?.action || "WAIT",

        energySource:
          intelligenceData
            ?.recommendation
            ?.energySource ||
          intelligenceData
            ?.energy
            ?.recommendedSource ||
          "GRID",

        priority:
          intelligenceData
            ?.recommendation
            ?.priority || "NORMAL",
      });

      setBackendOnline(true);
      setError(null);

    } catch (requestError) {
      console.error(
        "Backend connection error:",
        requestError
      );

      setBackendOnline(false);

      setError(
        requestError?.message ||
          "Unable to connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackendData();

    const interval = setInterval(
      () => {
        loadBackendData();
      },
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  const refreshData = async () => {
    await loadBackendData();
  };

  const updateFarmData = async (
    payload
  ) => {
    try {
      const result =
        await updateFarm(payload);

      if (result?.farm) {
        setData(result.farm);
      }

      if (result?.intelligence) {
        setIntelligence(
          result.intelligence
        );

        setPumpStatus({
          pumpRunning:
            result?.farm?.pump
              ?.running ?? false,

          recommendedAction:
            result
              ?.intelligence
              ?.recommendation
              ?.action || "WAIT",

          energySource:
            result
              ?.intelligence
              ?.recommendation
              ?.energySource ||
            result
              ?.intelligence
              ?.energy
              ?.recommendedSource ||
            "GRID",

          priority:
            result
              ?.intelligence
              ?.recommendation
              ?.priority ||
            "NORMAL",
        });
      }

      setBackendOnline(true);
      setError(null);

      return result;

    } catch (requestError) {
      setError(
        requestError?.message ||
          "Failed to update farm."
      );

      throw requestError;
    }
  };

  const startPump = async () => {
    return updateFarmData({
      pump: {
        running: true,
      },
    });
  };

  const stopPump = async () => {
    return updateFarmData({
      pump: {
        running: false,
      },
    });
  };

  const runAutomaticControl =
    async () => {
      try {
        const result =
          await automaticPumpControl();

        if (
          result?.pumpRunning !==
          undefined
        ) {
          setPumpStatus({
            pumpRunning:
              result.pumpRunning,

            recommendedAction:
              result.recommendedAction ||
              "WAIT",

            energySource:
              result.energySource ||
              "GRID",

            priority:
              result.priority ||
              "NORMAL",
          });
        }

        await refreshData();

        return result;

      } catch (requestError) {
        setError(
          requestError?.message ||
            "Automatic control failed."
        );

        throw requestError;
      }
    };

  const sendSensors = async (
    sensorData
  ) => {
    try {
      const result =
        await sendSensorData(
          sensorData
        );

      if (result?.intelligence) {
        setIntelligence(
          result.intelligence
        );
      }

      await refreshData();

      return result;

    } catch (requestError) {
      setError(
        requestError?.message ||
          "Failed to send sensor data."
      );

      throw requestError;
    }
  };

  const irrigationRequired =
    intelligence
      ?.recommendation
      ?.irrigation === "IRRIGATE";

  const energySource =
    intelligence
      ?.recommendation
      ?.energySource ||
    intelligence
      ?.energy
      ?.recommendedSource ||
    "GRID";

  const contextValue = {
    data,
    setData,

    intelligence,

    pumpStatus,

    backendOnline,

    loading,

    error,

    refreshData,

    updateFarm:
      updateFarmData,

    startPump,

    stopPump,

    runAutomaticControl,

    sendSensors,

    irrigationRequired,

    energySource,
  };

  return (
    <FarmContext.Provider
      value={contextValue}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context =
    useContext(FarmContext);

  if (!context) {
    throw new Error(
      "useFarm must be used inside FarmProvider"
    );
  }

  return context;
}