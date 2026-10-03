from app.models import FarmData


def calculate_water_requirement(data: FarmData):
    soil = data.soil
    farm = data.farm
    weather = data.weather

    moisture_gap = max(
        soil.target_moisture - soil.moisture,
        0,
    )

    base_requirement = (
        farm.field_size
        * 120
        * (moisture_gap / 20)
    )

    temperature_factor = 1.0

    if weather.temperature >= 35:
        temperature_factor = 1.20
    elif weather.temperature >= 30:
        temperature_factor = 1.10
    elif weather.temperature < 20:
        temperature_factor = 0.85

    rain_factor = 1.0

    if weather.rain_probability >= 70:
        rain_factor = 0.0
    elif weather.rain_probability >= 40:
        rain_factor = 0.50

    water_requirement = (
        base_requirement
        * temperature_factor
        * rain_factor
    )

    water_requirement = round(
        max(water_requirement, 0),
        2,
    )

    water_available = data.water.available

    sufficient_water = (
        water_available >= water_requirement
    )

    water_deficit = round(
        max(
            water_requirement - water_available,
            0,
        ),
        2,
    )

    return {
        "waterRequirement": water_requirement,
        "waterAvailable": water_available,
        "waterDeficit": water_deficit,
        "sufficientWater": sufficient_water,
        "moistureGap": round(
            moisture_gap,
            2,
        ),
        "temperatureFactor": temperature_factor,
        "rainFactor": rain_factor,
    }