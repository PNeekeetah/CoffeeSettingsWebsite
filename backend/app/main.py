from app.database.db import engine, Base, SessionLocal
from app.services.coffee_service import CoffeeService
from app.api.dto.coffee_dto import CoffeeDto

coffee_service = CoffeeService()
coffee_service.add_coffee(CoffeeDto(name="x", roast_level="x"))
coffees = coffee_service.retrieve_coffees()
print(coffees)