from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from ..db import Base

class Coffee(Base):
    __tablename__ = "tCoffees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    roast_level: Mapped[str] = mapped_column(String, nullable=False)
    