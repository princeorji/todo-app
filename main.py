from fastapi import FastAPI
from app.core.database import Base, engine
from app.routers import auth, todo

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(todo.router)

# @app.get("/")
# def read_root():
#     return "Hello World"
