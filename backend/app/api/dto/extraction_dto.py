from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExtractionDto(BaseModel):
    coffee: str
    grind: float
    time: float
    quantity: float
    temperature: float
    extracted_at : Optional[datetime] = None