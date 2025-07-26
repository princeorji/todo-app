from fastapi import FastAPI
from app.core.database import Base, engine
from app.routers import auth

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

# @app.get("/")
# def read_root():
#     return "Hello World"
