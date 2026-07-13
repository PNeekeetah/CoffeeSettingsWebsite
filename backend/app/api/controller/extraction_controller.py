from fastapi import APIRouter, Depends, status
from app.services.extraction_service import ExtractionService
from app.api.dto.extraction_dto import ExtractionDto

class ExtractionController:
    def __init__(self):
        self.service = ExtractionService()
        self.router = APIRouter(prefix="", tags=["extraction"])
        self._register_routes()
    
    def _register_routes(self):
        self.router.add_api_route(
            "/extractions", self.list_extractions,
            methods=["GET"], response_model=list[ExtractionDto],
        )
        self.router.add_api_route(
            "/extraction", self.create_extraction,
            methods=["POST"], response_model=ExtractionDto,
            status_code=status.HTTP_201_CREATED
        )
        self.router.add_api_route(
            "/extraction", self.last_extraction,
            methods=["GET"], response_model=ExtractionDto,
            status_code=status.HTTP_200_OK
        )

    def list_extractions(self):
        return self.service.retrieve_extractions()

    def create_extraction(self, extraction: ExtractionDto):
        return self.service.add_extraction(extraction)
    
    def last_extraction(self):
        return self.service.retrieve_extractions()[-1]
