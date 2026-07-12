from ..db import Base, SessionLocal
from ..models.coffee import Coffee
from ...api.dto.coffee_dto import CoffeeDto
from typing import List

class CoffeeStore:
    
    def __init__(self):
        self.session_local = SessionLocal
    
    def insert_coffee(self, coffee: CoffeeDto):
        coffee_database_object = Coffee(name=coffee.name, roast_level=coffee.roast_level)
        with self.session_local() as session:
            session.add(coffee_database_object)
            session.commit()
            
    def list_coffees(self):
        coffees : List[Coffee] = []
        with self.session_local() as session:
            for coffee in session.query(Coffee).all():
                coffees.append(coffee)
        
        return coffees
        