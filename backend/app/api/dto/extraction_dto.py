from pydantic import BaseModel
from datetime import datetime

class ExtractionDto(BaseModel):
    coffee: str
    grind: float
    time: float
    quantity: float
    temperature: float
    extracted_at : datetime