from typing import List
from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.todo import TodoBase, TodoUpdate, ShowTodo
from ..core.database import get_db
from ..models.todo import Todo
from ..models.user import User
from ..utils.dependencies import get_current_user

router = APIRouter(
    prefix="/api/v1/todos",
    tags=["todos"]
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_todo(
    request: TodoBase, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)):

    new_todo = Todo(
        title = request.title, 
        completed = request.completed,
        user_id = current_user.id
    )
    
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[ShowTodo])
def get_all(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    todos = db.query(Todo).filter(Todo.user_id == current_user.id).all()
    return todos

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=ShowTodo)
def get_one(id, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    todo = db.query(Todo).filter(Todo.user_id == current_user.id, Todo.id == id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return todo

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_todo(
    id, 
    request: TodoUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)):

    todo = db.query(Todo).filter(Todo.user_id == current_user.id, Todo.id == id).update(request.model_dump(exclude_unset=True))
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    db.commit()
    return {"detail": "Todo updated successfully"}

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(id, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    todo = db.query(Todo).filter(Todo.user_id == current_user.id, Todo.id == id).delete(synchronize_session=False)
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    db.commit()