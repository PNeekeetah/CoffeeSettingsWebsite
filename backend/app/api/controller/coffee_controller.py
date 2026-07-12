from fastapi import APIRouter, Depends, status
from app.services.coffee_service import CoffeeService
from app.api.dto.coffee_dto import CoffeeDto

router = APIRouter(prefix="", tags=["coffee"])

class CoffeeController:
    def __init__(self):
        self.service = CoffeeService()
        self.router = APIRouter(prefix="", tags=["coffee"])
        self._register_routes()
    
    def _register_routes(self):
        self.router.add_api_route(
            "/coffee", self.list_coffees,
            methods=["GET"], response_model=list[CoffeeDto],
        )
        self.router.add_api_route(
            "/coffee", self.create_coffee,
            methods=["POST"], response_model=CoffeeDto,
            status_code=status.HTTP_201_CREATED
        )

    def list_coffees(self):
        return self.service.retrieve_coffees()

    def create_coffee(self, coffee: CoffeeDto):
        return self.service.add_coffee(coffee)
