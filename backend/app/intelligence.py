from app.models import FarmData
from app.decision_engine import calculate_decision
from app.water_optimizer import calculate_water_requirement
from app.energy_optimizer import calculate_energy_plan


def calculate_farm_intelligence(data: FarmData):
    water = calculate_water_requirement(data)

    energy = calculate_energy_plan(
        data,
        water_requirement=water["waterRequirement"],
    )

    decision = calculate_decision(
        data,
        water_requirement=water["waterRequirement"],
    )

    irrigation_decision = decision[
        "irrigationDecision"
    ]

    if irrigation_decision == "IRRIGATE":
        action = "START_IRRIGATION"
    else:
        action = "WAIT"

    return {
        "farm": {
            "name": data.farm.name,
            "location": data.farm.location,
            "crop": data.farm.crop,
        },

        "status": "ANALYZED",

        "recommendation": {
            "action": action,
            "irrigation": irrigation_decision,
            "energySource": decision[
                "energyDecision"
            ],
            "priority": decision[
                "priority"
            ],
        },

        "water": {
            "required": water[
                "waterRequirement"
            ],
            "available": water[
                "waterAvailable"
            ],
            "deficit": water[
                "waterDeficit"
            ],
            "sufficient": water[
                "sufficientWater"
            ],
            "moistureGap": water[
                "moistureGap"
            ],
        },

        "energy": {
            "recommendedSource": energy[
                "recommendedSource"
            ],
            "solarGeneration": energy[
                "solarGeneration"
            ],
            "batteryLevel": energy[
                "batteryLevel"
            ],
            "estimatedRuntimeHours": energy[
                "estimatedRuntimeHours"
            ],
            "estimatedEnergyKwh": energy[
                "estimatedEnergyKwh"
            ],
        },

        "explanation": {
            "irrigation": decision[
                "reason"
            ],
            "energy": decision[
                "energyReason"
            ],
        },
    }