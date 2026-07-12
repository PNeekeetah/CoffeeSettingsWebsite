from pydantic import BaseModel

class CoffeeDto(BaseModel):
    name : str
    roast_level : str