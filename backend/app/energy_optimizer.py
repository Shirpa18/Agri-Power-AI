from app.models import FarmData


def calculate_energy_plan(
    data: FarmData,
    water_requirement=None,
):
    energy = data.energy
    pump = data.pump

    pump_power = energy.pump_power

    if water_requirement is None:
        water_requirement = data.water.required

    estimated_runtime_hours = 0.0

    if pump_power > 0:
        estimated_runtime_hours = round(
            water_requirement
            / 1000
            / pump_power,
            2,
        )

    solar_available = (
        energy.solar_generation
        >= pump_power
    )

    battery_available = (
        energy.battery_level >= 30
    )

    grid_available = (
        energy.grid_available
    )

    if solar_available:
        recommended_source = "SOLAR"

        reason = (
            "Solar generation is sufficient "
            "to operate the irrigation pump."
        )

    elif battery_available:
        recommended_source = "BATTERY"

        reason = (
            "Solar generation is insufficient, "
            "so the battery can support the "
            "irrigation pump."
        )

    elif grid_available:
        recommended_source = "GRID"

        reason = (
            "Solar and battery resources are "
            "insufficient, so grid power is used "
            "as the fallback."
        )

    else:
        recommended_source = "UNAVAILABLE"

        reason = (
            "No suitable energy source is "
            "currently available for the "
            "irrigation pump."
        )

    estimated_energy_kwh = round(
        pump_power
        * estimated_runtime_hours,
        2,
    )

    return {
        "recommendedSource":
            recommended_source,

        "reason": reason,

        "solarGeneration":
            energy.solar_generation,

        "solarCapacity":
            energy.solar_capacity,

        "batteryLevel":
            energy.battery_level,

        "gridAvailable":
            grid_available,

        "pumpPower":
            pump_power,

        "estimatedRuntimeHours":
            estimated_runtime_hours,

        "estimatedEnergyKwh":
            estimated_energy_kwh,

        "pumpRunning":
            pump.running,

        "waterRequirement":
            water_requirement,
    }