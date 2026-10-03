from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)

from sqlalchemy.orm import Mapped, mapped_column


from app.database import Base


class FarmDB(Base):
    __tablename__ = "farms"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    crop: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    field_size: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    growth_stage: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    irrigation_method: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    soil_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class FarmStateDB(Base):
    __tablename__ = "farm_states"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    farm_id: Mapped[int] = mapped_column(
        ForeignKey("farms.id"),
        nullable=False,
        index=True,
    )

    soil_moisture: Mapped[float] = mapped_column(
        Float,
        default=42,
    )

    target_moisture: Mapped[float] = mapped_column(
        Float,
        default=55,
    )

    water_available: Mapped[float] = mapped_column(
        Float,
        default=2400,
    )

    water_required: Mapped[float] = mapped_column(
        Float,
        default=420,
    )

    reservoir_capacity: Mapped[float] = mapped_column(
        Float,
        default=5000,
    )

    temperature: Mapped[float] = mapped_column(
        Float,
        default=29,
    )

    rain_probability: Mapped[float] = mapped_column(
        Float,
        default=18,
    )

    solar_generation: Mapped[float] = mapped_column(
        Float,
        default=2.8,
    )

    solar_capacity: Mapped[float] = mapped_column(
        Float,
        default=5,
    )

    battery_level: Mapped[float] = mapped_column(
        Float,
        default=78,
    )

    battery_capacity: Mapped[float] = mapped_column(
        Float,
        default=10,
    )

    pump_power: Mapped[float] = mapped_column(
        Float,
        default=0.6,
    )

    grid_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    pump_running: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class SensorReadingDB(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    farm_id: Mapped[int] = mapped_column(
        ForeignKey("farms.id"),
        nullable=False,
        index=True,
    )

    soil_moisture: Mapped[float] = mapped_column(
        Float,
    )

    water_level: Mapped[float] = mapped_column(
        Float,
    )

    temperature: Mapped[float] = mapped_column(
        Float,
    )

    rain_probability: Mapped[float] = mapped_column(
        Float,
    )

    solar_generation: Mapped[float] = mapped_column(
        Float,
    )

    battery_level: Mapped[float] = mapped_column(
        Float,
    )

    pump_running: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )


class DecisionLogDB(Base):
    __tablename__ = "decision_logs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    farm_id: Mapped[int] = mapped_column(
        ForeignKey("farms.id"),
        nullable=False,
        index=True,
    )

    irrigation_decision: Mapped[str] = mapped_column(
        String(50),
    )

    energy_decision: Mapped[str] = mapped_column(
        String(50),
    )

    priority: Mapped[str] = mapped_column(
        String(50),
    )

    moisture_gap: Mapped[float] = mapped_column(
        Float,
    )

    reason: Mapped[str] = mapped_column(
        String(500),
    )

    energy_reason: Mapped[str] = mapped_column(
        String(500),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )