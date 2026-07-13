from ..db import Base, SessionLocal
from ..models.extraction import Extraction
from ...api.dto.extraction_dto import ExtractionDto
from typing import List

class ExtractionStore:
    
    def __init__(self):
        self.session_local = SessionLocal
    
    def insert_extraction(self, extraction: ExtractionDto):
        coffee_database_object = Extraction(
            coffee_name=extraction.coffee,
            grinder_setting=extraction.grind,
            water_temperature_celsius=extraction.temperature,
            yield_ml=extraction.quantity,
            extraction_time=extraction.time,
        )
        with self.session_local() as session:
            session.add(coffee_database_object)
            session.commit()
            
    def list_extractions(self):
        extractions : List[Extraction] = []
        with self.session_local() as session:
            for extraction in session.query(Extraction).all():
                extractions.append(extraction)
        
        return extractions
        