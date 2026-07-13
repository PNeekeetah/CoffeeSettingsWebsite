from app.database.stores.extraction_store import ExtractionStore
from app.api.dto.extraction_dto import ExtractionDto

class ExtractionService:
    
    def __init__(self):
        self.extraction_store : ExtractionStore = ExtractionStore()
        
    def add_extraction(self, extraction : ExtractionDto):
        self.extraction_store.insert_extraction(extraction)
        return extraction

    def retrieve_extractions(self):        
        extraction_database_objects = self.extraction_store.list_extractions()
        return [
            ExtractionDto(
                coffee=extraction.coffee_name, 
                grind=extraction.grinder_setting,
                time=extraction.extraction_time,
                quantity=extraction.yield_ml,
                temperature=extraction.water_temperature_celsius
            ) for extraction in extraction_database_objects
        ]
 