from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..schemas.auth import Signup, Token
from ..core.database import get_db
from ..models.user import User
from ..utils.hashing import hash_password, verify_password
from ..utils.token import create_access_token

router = APIRouter(
    prefix="/api/v1",
    tags=["auth"]
)

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(request: Signup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="User already exists"
        )
    
    new_user = User(
        username = request.username,
        password = hash_password(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"detail": "User created successfully"}

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }