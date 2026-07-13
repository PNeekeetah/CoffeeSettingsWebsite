from pydantic import BaseModel

class ExtractionDto(BaseModel):
    coffee: str
    grind: float
    time: float
    quantity: float
    temperature: float