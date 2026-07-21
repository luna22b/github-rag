from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.schemas.schemas import (
    SignupRequest,
    LoginRequest,
    UserResponse,
)
from app.database.database import get_db
from app.database.models import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.core.dependencies import authenticate_user


router = APIRouter()


def set_auth_cookie(
    response: Response,
    user_id: int,
):
    access_token = create_access_token(
        {
            "sub": str(user_id),
        }
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # change to True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
)
def signup(
    user: SignupRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically log user in after signup
    set_auth_cookie(
        response,
        new_user.id,
    )

    return new_user


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=UserResponse,
)
def login(
    user: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(
            or_(
                User.email == user.identifier,
                User.username == user.identifier,
            )
        )
        .first()
    )

    if existing_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        user.password,
        existing_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create JWT cookie
    set_auth_cookie(
        response,
        existing_user.id,
    )

    return existing_user


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_current_user(
    user: User = Depends(authenticate_user),
):
    return user

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token"
    )

    return {
        "message": "Logged out successfully"
    }