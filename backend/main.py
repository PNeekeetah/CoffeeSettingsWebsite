from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.controller.coffee_controller import CoffeeController

def create_app() -> FastAPI:
    app = FastAPI(title="Coffee API")
    
    coffee_controller = CoffeeController()
    app.include_router(coffee_controller.router)
    
    app.mount("/", StaticFiles(directory="../webapp", html=True), name="frontend")
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
