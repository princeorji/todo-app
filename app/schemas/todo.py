from uuid import UUID
from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    completed: bool = False

class ShowTodo(TodoBase):
    id: UUID

    class Config:
        orm_mode = True

class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool = False