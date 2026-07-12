from app.database.stores.coffee_store import CoffeeStore
from app.api.dto.coffee_dto import CoffeeDto

class CoffeeService:
    
    def __init__(self):
        self.coffee_store : CoffeeStore = CoffeeStore()
        
    def add_coffee(self, coffee : CoffeeDto):
        self.coffee_store.insert_coffee(coffee)
        return coffee

    def retrieve_coffees(self):        
        coffee_database_objects = self.coffee_store.list_coffees()
        return [CoffeeDto(name=coffee.name, roast_level=coffee.roast_level) for coffee in coffee_database_objects]
