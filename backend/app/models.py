from pydantic import BaseModel


class Farm(BaseModel):
    name: str
    location: str
    crop: str
    field_size: float
    growth_stage: str
    irrigation_method: str
    soil_type: str


class SoilData(BaseModel):
    moisture: float
    target_moisture: float


class WaterData(BaseModel):
    available: float
    required: float
    reservoir_capacity: float


class WeatherData(BaseModel):
    temperature: float
    rain_probability: float


class EnergyData(BaseModel):
    solar_generation: float
    solar_capacity: float
    battery_level: float
    battery_capacity: float
    pump_power: float
    grid_available: bool


class PumpData(BaseModel):
    running: bool


class FarmData(BaseModel):
    farm: Farm
    soil: SoilData
    water: WaterData
    weather: WeatherData
    energy: EnergyData
    pump: PumpData