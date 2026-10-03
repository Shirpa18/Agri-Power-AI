from app.models import FarmData


def calculate_decision(
    data: FarmData,
    water_requirement=None,
):
    soil = data.soil
    water = data.water
    weather = data.weather
    energy = data.energy

    moisture_gap = max(
        soil.target_moisture
        - soil.moisture,
        0,
    )

    if water_requirement is None:
        water_requirement = water.required

    soil_dry = (
        soil.moisture
        < soil.target_moisture
    )

    rain_expected = (
        weather.rain_probability >= 60
    )

    water_available = (
        water.available
        >= water_requirement
    )

    solar_available = (
        energy.solar_generation
        >= energy.pump_power
    )

    battery_available = (
        energy.battery_level >= 30
    )

    irrigation_decision = "WAIT"
    energy_decision = "GRID"
    priority = "NORMAL"

    if rain_expected:
        irrigation_decision = "WAIT"
        priority = "LOW"

    elif soil_dry and water_available:
        irrigation_decision = "IRRIGATE"

        if solar_available:
            energy_decision = "SOLAR"

        elif battery_available:
            energy_decision = "BATTERY"

        elif energy.grid_available:
            energy_decision = "GRID"

        else:
            energy_decision = "UNAVAILABLE"
            irrigation_decision = "WAIT"

        if moisture_gap >= 20:
            priority = "HIGH"
        else:
            priority = "MEDIUM"

    if not water_available:
        irrigation_decision = "WAIT"
        priority = "HIGH"

    if (
        not energy.grid_available
        and not solar_available
        and not battery_available
    ):
        irrigation_decision = "WAIT"
        energy_decision = "UNAVAILABLE"
        priority = "HIGH"

    if rain_expected:
        reason = (
            "Rain probability is high, so "
            "irrigation is delayed to avoid "
            "unnecessary water use."
        )

    elif not water_available:
        reason = (
            "Available water is below the "
            "calculated irrigation requirement."
        )

    elif irrigation_decision == "IRRIGATE":
        reason = (
            f"Soil moisture is "
            f"{moisture_gap:.1f}% below the "
            "target and irrigation conditions "
            "are suitable."
        )

    else:
        reason = (
            "Current farm conditions do not "
            "require immediate irrigation."
        )

    if energy_decision == "SOLAR":
        energy_reason = (
            "Solar generation is sufficient "
            "to operate the irrigation pump."
        )

    elif energy_decision == "BATTERY":
        energy_reason = (
            "Solar generation is insufficient, "
            "so the battery can support the pump."
        )

    elif energy_decision == "UNAVAILABLE":
        energy_reason = (
            "No suitable energy source is "
            "currently available."
        )

    else:
        energy_reason = (
            "Grid power is available as the "
            "fallback energy source."
        )

    return {
        "irrigationDecision":
            irrigation_decision,

        "energyDecision":
            energy_decision,

        "priority":
            priority,

        "moistureGap":
            round(
                moisture_gap,
                2,
            ),

        "waterRequirement":
            round(
                water_requirement,
                2,
            ),

        "reason":
            reason,

        "energyReason":
            energy_reason,
    }