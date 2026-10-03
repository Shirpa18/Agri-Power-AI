from pydantic import BaseModel, Field


class SensorData(BaseModel):
    soil_moisture: float = Field(
        ge=0,
        le=100,
    )

    water_level: float = Field(
        ge=0,
    )

    temperature: float = Field(
        ge=-20,
        le=60,
    )

    rain_probability: float = Field(
        ge=0,
        le=100,
    )

    solar_generation: float = Field(
        ge=0,
    )

    battery_level: float = Field(
        ge=0,
        le=100,
    )

    pump_running: bool = False