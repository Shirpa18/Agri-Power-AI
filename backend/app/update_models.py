from typing import Optional

from pydantic import BaseModel


class SoilUpdate(BaseModel):
    moisture: Optional[float] = None
    target_moisture: Optional[float] = None


class WaterUpdate(BaseModel):
    available: Optional[float] = None
    required: Optional[float] = None
    reservoir_capacity: Optional[float] = None


class WeatherUpdate(BaseModel):
    temperature: Optional[float] = None
    rain_probability: Optional[float] = None


class EnergyUpdate(BaseModel):
    solar_generation: Optional[float] = None
    solar_capacity: Optional[float] = None
    battery_level: Optional[float] = None
    battery_capacity: Optional[float] = None
    pump_power: Optional[float] = None
    grid_available: Optional[bool] = None


class PumpUpdate(BaseModel):
    running: Optional[bool] = None


class FarmUpdate(BaseModel):
    soil: Optional[SoilUpdate] = None
    water: Optional[WaterUpdate] = None
    weather: Optional[WeatherUpdate] = None
    energy: Optional[EnergyUpdate] = None
    pump: Optional[PumpUpdate] = None