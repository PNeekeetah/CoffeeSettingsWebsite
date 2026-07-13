from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column
from ..db import Base

class Extraction(Base):
    __tablename__ = "tExtractions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    coffee_name: Mapped[str] = mapped_column(String, nullable=False)
    grinder_setting: Mapped[Float] = mapped_column(Float, nullable=False)
    water_temperature_celsius: Mapped[Float] = mapped_column(Float, nullable=False)
    yield_ml: Mapped[Float] = mapped_column(Float, nullable=False)
    extraction_time: Mapped[Float] = mapped_column(Float, nullable=False)
    
