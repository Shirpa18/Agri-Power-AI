from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import (
    Base,
    SessionLocal,
    engine,
    get_db,
)

from app.db_models import (
    DecisionLogDB,
    FarmDB,
    FarmStateDB,
    SensorReadingDB,
)

from app.models import FarmData
from app.update_models import FarmUpdate
from app.sensor_models import SensorData

from app.decision_engine import (
    calculate_decision,
)

from app.water_optimizer import (
    calculate_water_requirement,
)

from app.energy_optimizer import (
    calculate_energy_plan,
)

from app.intelligence import (
    calculate_farm_intelligence,
)

from app.farm_ai import (
    ask_farm_ai,
)


app = FastAPI(
    title="AgriPower AI",
    description=(
        "AI-powered agriculture energy "
        "and water optimization platform."
    ),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(
    bind=engine
)


class FarmAIRequest(BaseModel):
    question: str
    context: dict | None = None


def seed_database():
    db = SessionLocal()

    try:
        existing_farm = (
            db.query(FarmDB).first()
        )

        if existing_farm:
            return

        farm = FarmDB(
            name="Green Valley Farm",
            location="Karnataka, India",
            crop="Tomato",
            field_size=2.5,
            growth_stage="Flowering",
            irrigation_method="Drip Irrigation",
            soil_type="Loamy",
        )

        db.add(farm)
        db.commit()
        db.refresh(farm)

        state = FarmStateDB(
            farm_id=farm.id,
            soil_moisture=42,
            target_moisture=55,
            water_available=2400,
            water_required=420,
            reservoir_capacity=5000,
            temperature=29,
            rain_probability=18,
            solar_generation=2.8,
            solar_capacity=5,
            battery_level=78,
            battery_capacity=10,
            pump_power=0.6,
            grid_available=True,
            pump_running=False,
        )

        db.add(state)
        db.commit()

    finally:
        db.close()


seed_database()


def get_farm_data(
    db: Session,
) -> FarmData:

    farm = (
        db.query(FarmDB).first()
    )

    if not farm:
        raise RuntimeError(
            "No farm found in database."
        )

    state = (
        db.query(FarmStateDB)
        .filter(
            FarmStateDB.farm_id
            == farm.id
        )
        .first()
    )

    if not state:
        raise RuntimeError(
            "No farm state found in database."
        )

    return FarmData(
        farm={
            "name": farm.name,
            "location": farm.location,
            "crop": farm.crop,
            "field_size": farm.field_size,
            "growth_stage": farm.growth_stage,
            "irrigation_method": (
                farm.irrigation_method
            ),
            "soil_type": farm.soil_type,
        },

        soil={
            "moisture": state.soil_moisture,
            "target_moisture": (
                state.target_moisture
            ),
        },

        water={
            "available": (
                state.water_available
            ),
            "required": (
                state.water_required
            ),
            "reservoir_capacity": (
                state.reservoir_capacity
            ),
        },

        weather={
            "temperature": (
                state.temperature
            ),
            "rain_probability": (
                state.rain_probability
            ),
        },

        energy={
            "solar_generation": (
                state.solar_generation
            ),
            "solar_capacity": (
                state.solar_capacity
            ),
            "battery_level": (
                state.battery_level
            ),
            "battery_capacity": (
                state.battery_capacity
            ),
            "pump_power": (
                state.pump_power
            ),
            "grid_available": (
                state.grid_available
            ),
        },

        pump={
            "running": (
                state.pump_running
            ),
        },
    )


@app.get("/")
def root():

    return {
        "name": "AgriPower AI",
        "status": "online",
        "version": "1.0.0",
        "database": "SQLite",
        "message": (
            "AgriPower AI backend "
            "is running."
        ),
    }


@app.get("/api/health")
def health(
    db: Session = Depends(get_db),
):

    farm_count = (
        db.query(FarmDB).count()
    )

    return {
        "status": "healthy",
        "service": "AgriPower AI",
        "backend": "FastAPI",
        "database": "connected",
        "farms": farm_count,
    }


@app.get("/api/farm")
def get_farm(
    db: Session = Depends(get_db),
):

    return get_farm_data(db)


@app.get("/api/farm/decision")
def get_farm_decision(
    db: Session = Depends(get_db),
):

    farm_data = get_farm_data(db)

    water = (
        calculate_water_requirement(
            farm_data
        )
    )

    return calculate_decision(
        farm_data,
        water_requirement=(
            water["waterRequirement"]
        ),
    )


@app.get("/api/farm/water")
def get_water_requirement(
    db: Session = Depends(get_db),
):

    farm_data = get_farm_data(db)

    return calculate_water_requirement(
        farm_data
    )


@app.get("/api/farm/energy")
def get_energy_plan(
    db: Session = Depends(get_db),
):

    farm_data = get_farm_data(db)

    water = (
        calculate_water_requirement(
            farm_data
        )
    )

    return calculate_energy_plan(
        farm_data,
        water_requirement=(
            water["waterRequirement"]
        ),
    )


@app.get("/api/farm/intelligence")
def get_farm_intelligence(
    db: Session = Depends(get_db),
):

    farm_data = get_farm_data(db)

    intelligence = (
        calculate_farm_intelligence(
            farm_data
        )
    )

    farm = (
        db.query(FarmDB).first()
    )

    decision = calculate_decision(
        farm_data,
        water_requirement=(
            intelligence["water"]["required"]
        ),
    )

    log = DecisionLogDB(
        farm_id=farm.id,

        irrigation_decision=(
            decision[
                "irrigationDecision"
            ]
        ),

        energy_decision=(
            decision[
                "energyDecision"
            ]
        ),

        priority=decision["priority"],

        moisture_gap=(
            decision["moistureGap"]
        ),

        reason=decision["reason"],

        energy_reason=(
            decision["energyReason"]
        ),
    )

    db.add(log)
    db.commit()

    return intelligence


@app.post("/api/farm-ai")
def farm_ai(
    request: FarmAIRequest,
    db: Session = Depends(get_db),
):
    """
    AI farm assistant endpoint.

    The database is the source of truth for current
    farm data.

    The deterministic decision engines calculate
    irrigation, water, and energy decisions.

    The AI explains those results to the farmer.
    """

    question = request.question.strip()

    if not question:
        raise ValueError(
            "Question cannot be empty."
        )

    # Get the latest farm state directly
    # from the backend database.
    farm_data = get_farm_data(db)

    # Calculate current water requirement.
    water = calculate_water_requirement(
        farm_data
    )

    # Calculate current energy plan.
    energy = calculate_energy_plan(
        farm_data,
        water_requirement=(
            water["waterRequirement"]
        ),
    )

    # Calculate deterministic farm decision.
    decision = calculate_decision(
        farm_data,
        water_requirement=(
            water["waterRequirement"]
        ),
    )

    # Calculate complete farm intelligence.
    intelligence = calculate_farm_intelligence(
        farm_data
    )

    # Explicitly construct a JSON-safe context.
    #
    # The frontend-provided context is intentionally
    # NOT used as the source of truth.
    #
    # The database is authoritative.
    context = {
        "farm": {
            "name": farm_data.farm.name,
            "location": farm_data.farm.location,
            "crop": farm_data.farm.crop,
            "field_size": float(
                farm_data.farm.field_size
            ),
            "growth_stage": (
                farm_data.farm.growth_stage
            ),
            "irrigation_method": (
                farm_data.farm.irrigation_method
            ),
            "soil_type": (
                farm_data.farm.soil_type
            ),
        },

        "soil": {
            "moisture": float(
                farm_data.soil.moisture
            ),
            "target_moisture": float(
                farm_data.soil.target_moisture
            ),
        },

        "water": {
            "available": float(
                farm_data.water.available
            ),
            "required": float(
                farm_data.water.required
            ),
            "reservoir_capacity": float(
                farm_data.water.reservoir_capacity
            ),
        },

        "weather": {
            "temperature": float(
                farm_data.weather.temperature
            ),
            "rain_probability": float(
                farm_data.weather.rain_probability
            ),
        },

        "energy": {
            "solar_generation": float(
                farm_data.energy.solar_generation
            ),
            "solar_capacity": float(
                farm_data.energy.solar_capacity
            ),
            "battery_level": float(
                farm_data.energy.battery_level
            ),
            "battery_capacity": float(
                farm_data.energy.battery_capacity
            ),
            "pump_power": float(
                farm_data.energy.pump_power
            ),
            "grid_available": bool(
                farm_data.energy.grid_available
            ),
        },

        "pump": {
            "running": bool(
                farm_data.pump.running
            ),
        },

        "decision": decision,

        "waterOptimization": water,

        "energyOptimization": energy,

        "intelligence": intelligence,
    }

    # Send only the backend-generated context
    # to the AI service.
    answer = ask_farm_ai(
        question=question,
        context=context,
    )

    return {
        "answer": answer,
        "context": context,
    }


@app.post("/api/farm/update")
def update_farm(
    updates: FarmUpdate,
    db: Session = Depends(get_db),
):

    farm = (
        db.query(FarmDB).first()
    )

    if not farm:
        raise RuntimeError(
            "No farm found in database."
        )

    state = (
        db.query(FarmStateDB)
        .filter(
            FarmStateDB.farm_id
            == farm.id
        )
        .first()
    )

    if not state:
        raise RuntimeError(
            "No farm state found in database."
        )

    update_data = (
        updates.model_dump(
            exclude_none=True
        )
    )

    if "soil" in update_data:

        soil = update_data["soil"]

        if "moisture" in soil:
            state.soil_moisture = (
                soil["moisture"]
            )

        if "target_moisture" in soil:
            state.target_moisture = (
                soil["target_moisture"]
            )

    if "water" in update_data:

        water = update_data["water"]

        if "available" in water:
            state.water_available = (
                water["available"]
            )

        if "required" in water:
            state.water_required = (
                water["required"]
            )

        if "reservoir_capacity" in water:
            state.reservoir_capacity = (
                water[
                    "reservoir_capacity"
                ]
            )

    if "weather" in update_data:

        weather = update_data["weather"]

        if "temperature" in weather:
            state.temperature = (
                weather["temperature"]
            )

        if "rain_probability" in weather:
            state.rain_probability = (
                weather[
                    "rain_probability"
                ]
            )

    if "energy" in update_data:

        energy = update_data["energy"]

        if "solar_generation" in energy:
            state.solar_generation = (
                energy[
                    "solar_generation"
                ]
            )

        if "solar_capacity" in energy:
            state.solar_capacity = (
                energy[
                    "solar_capacity"
                ]
            )

        if "battery_level" in energy:
            state.battery_level = (
                energy["battery_level"]
            )

        if "battery_capacity" in energy:
            state.battery_capacity = (
                energy[
                    "battery_capacity"
                ]
            )

        if "pump_power" in energy:
            state.pump_power = (
                energy["pump_power"]
            )

        if "grid_available" in energy:
            state.grid_available = (
                energy[
                    "grid_available"
                ]
            )

    if "pump" in update_data:

        pump = update_data["pump"]

        if "running" in pump:
            state.pump_running = (
                pump["running"]
            )

    db.commit()

    farm_data = get_farm_data(db)

    return {
        "status": "updated",

        "farm": farm_data,

        "intelligence": (
            calculate_farm_intelligence(
                farm_data
            )
        ),
    }


@app.post("/api/farm/automatic-control")
def automatic_control(
    db: Session = Depends(get_db),
):

    farm_data = get_farm_data(db)

    water = (
        calculate_water_requirement(
            farm_data
        )
    )

    energy = (
        calculate_energy_plan(
            farm_data,
            water_requirement=(
                water[
                    "waterRequirement"
                ]
            ),
        )
    )

    decision = calculate_decision(
        farm_data,
        water_requirement=(
            water[
                "waterRequirement"
            ]
        ),
    )

    farm = (
        db.query(FarmDB).first()
    )

    if not farm:
        raise RuntimeError(
            "No farm found in database."
        )

    state = (
        db.query(FarmStateDB)
        .filter(
            FarmStateDB.farm_id
            == farm.id
        )
        .first()
    )

    if not state:
        raise RuntimeError(
            "No farm state found in database."
        )

    should_run = (
        decision[
            "irrigationDecision"
        ]
        == "IRRIGATE"
        and decision[
            "energyDecision"
        ]
        != "UNAVAILABLE"
    )

    state.pump_running = should_run

    log = DecisionLogDB(
        farm_id=farm.id,

        irrigation_decision=(
            decision[
                "irrigationDecision"
            ]
        ),

        energy_decision=(
            decision[
                "energyDecision"
            ]
        ),

        priority=decision["priority"],

        moisture_gap=(
            decision["moistureGap"]
        ),

        reason=decision["reason"],

        energy_reason=(
            decision[
                "energyReason"
            ]
        ),
    )

    db.add(log)
    db.commit()

    updated_farm_data = (
        get_farm_data(db)
    )

    return {
        "status": (
            "automatic_control_executed"
        ),

        "pumpRunning": (
            updated_farm_data
            .pump
            .running
        ),

        "recommendedAction": (
            "START_IRRIGATION"
            if should_run
            else "WAIT"
        ),

        "irrigationDecision": (
            decision[
                "irrigationDecision"
            ]
        ),

        "energySource": (
            decision[
                "energyDecision"
            ]
        ),

        "priority": (
            decision["priority"]
        ),

        "waterRequirement": (
            water[
                "waterRequirement"
            ]
        ),

        "waterAvailable": (
            water[
                "waterAvailable"
            ]
        ),

        "moistureGap": (
            water[
                "moistureGap"
            ]
        ),

        "estimatedRuntimeHours": (
            energy[
                "estimatedRuntimeHours"
            ]
        ),

        "estimatedEnergyKwh": (
            energy[
                "estimatedEnergyKwh"
            ]
        ),

        "reason": (
            decision["reason"]
        ),

        "energyReason": (
            decision[
                "energyReason"
            ]
        ),
    }


@app.post("/api/sensors")
def receive_sensor_data(
    sensor_data: SensorData,
    db: Session = Depends(get_db),
):

    farm = (
        db.query(FarmDB).first()
    )

    if not farm:
        raise RuntimeError(
            "No farm found in database."
        )

    state = (
        db.query(FarmStateDB)
        .filter(
            FarmStateDB.farm_id
            == farm.id
        )
        .first()
    )

    if not state:
        raise RuntimeError(
            "No farm state found in database."
        )

    state.soil_moisture = (
        sensor_data.soil_moisture
    )

    state.water_available = (
        sensor_data.water_level
    )

    state.temperature = (
        sensor_data.temperature
    )

    state.rain_probability = (
        sensor_data.rain_probability
    )

    state.solar_generation = (
        sensor_data.solar_generation
    )

    state.battery_level = (
        sensor_data.battery_level
    )

    state.pump_running = (
        sensor_data.pump_running
    )

    reading = SensorReadingDB(
        farm_id=farm.id,

        soil_moisture=(
            sensor_data.soil_moisture
        ),

        water_level=(
            sensor_data.water_level
        ),

        temperature=(
            sensor_data.temperature
        ),

        rain_probability=(
            sensor_data.rain_probability
        ),

        solar_generation=(
            sensor_data.solar_generation
        ),

        battery_level=(
            sensor_data.battery_level
        ),

        pump_running=(
            sensor_data.pump_running
        ),
    )

    db.add(reading)
    db.commit()

    farm_data = get_farm_data(db)

    intelligence = (
        calculate_farm_intelligence(
            farm_data
        )
    )

    return {
        "status": (
            "sensor_data_received"
        ),

        "sensorData": sensor_data,

        "intelligence": intelligence,
    }


@app.post("/api/simulation")
def simulate_farm_state(
    simulation: dict,
    db: Session = Depends(get_db),
):

    farm = (
        db.query(FarmDB).first()
    )

    if not farm:
        raise RuntimeError(
            "No farm found in database."
        )

    state = (
        db.query(FarmStateDB)
        .filter(
            FarmStateDB.farm_id
            == farm.id
        )
        .first()
    )

    if not state:
        raise RuntimeError(
            "No farm state found in database."
        )

    if "soil_moisture" in simulation:

        state.soil_moisture = float(
            simulation[
                "soil_moisture"
            ]
        )

    if "water_available" in simulation:

        state.water_available = float(
            simulation[
                "water_available"
            ]
        )

    if "temperature" in simulation:

        state.temperature = float(
            simulation[
                "temperature"
            ]
        )

    if "rain_probability" in simulation:

        state.rain_probability = float(
            simulation[
                "rain_probability"
            ]
        )

    if "solar_generation" in simulation:

        state.solar_generation = float(
            simulation[
                "solar_generation"
            ]
        )

    if "battery_level" in simulation:

        state.battery_level = float(
            simulation[
                "battery_level"
            ]
        )

    db.commit()

    farm_data = get_farm_data(db)

    intelligence = (
        calculate_farm_intelligence(
            farm_data
        )
    )

    return {
        "status": (
            "simulation_updated"
        ),

        "farm": farm_data,

        "intelligence": intelligence,
    }


@app.get("/api/sensors/history")
def get_sensor_history(
    db: Session = Depends(get_db),
):

    readings = (
        db.query(SensorReadingDB)
        .order_by(
            SensorReadingDB.recorded_at.desc()
        )
        .limit(100)
        .all()
    )

    return [
        {
            "id": reading.id,

            "soilMoisture": (
                reading.soil_moisture
            ),

            "waterLevel": (
                reading.water_level
            ),

            "temperature": (
                reading.temperature
            ),

            "rainProbability": (
                reading.rain_probability
            ),

            "solarGeneration": (
                reading.solar_generation
            ),

            "batteryLevel": (
                reading.battery_level
            ),

            "pumpRunning": (
                reading.pump_running
            ),

            "recordedAt": (
                reading.recorded_at
            ),
        }

        for reading in readings
    ]


@app.get("/api/decisions/history")
def get_decision_history(
    db: Session = Depends(get_db),
):

    decisions = (
        db.query(DecisionLogDB)
        .order_by(
            DecisionLogDB.created_at.desc()
        )
        .limit(100)
        .all()
    )

    return [
        {
            "id": decision.id,

            "irrigationDecision": (
                decision.irrigation_decision
            ),

            "energyDecision": (
                decision.energy_decision
            ),

            "priority": (
                decision.priority
            ),

            "moistureGap": (
                decision.moisture_gap
            ),

            "reason": (
                decision.reason
            ),

            "energyReason": (
                decision.energy_reason
            ),

            "createdAt": (
                decision.created_at
            ),
        }

        for decision in decisions
    ]