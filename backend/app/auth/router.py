from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.auth.schemas import (
    SignupRequest,
    LoginRequest,
    UserResponse,
)
from app.database.database import get_db
from app.database.models import User
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.core.dependencies import authenticate_user

from app.auth.github import oauth
from app.core.config import settings
from app.core.encryption import encrypt_token


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
        secure=False,  
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

@router.get("/github/login")
async def github_login(request: Request):
    redirect_uri = settings.GITHUB_REDIRECT_URI

    return await oauth.github.authorize_redirect(
        request,
        redirect_uri,
    )

@router.get("/github/callback")
async def github_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        token = await oauth.github.authorize_access_token(request)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not validate credentials from GitHub.",
        )

    github_access_token = encrypt_token(
        token["access_token"]
    )

    response = await oauth.github.get(
        "user",
        token=token,
    )

    github_user = response.json()

    github_id = str(github_user["id"])
    github_login = github_user["login"]

    user = (
        db.query(User)
        .filter(User.github_id == github_id)
        .first()
    )

    if not user:
        email = (
            github_user.get("email")
            or f"{github_id}@github.com"
        )

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if user:
            user.github_id = github_id
            user.github_username = github_login

        else:
            user = User(
                username=github_login,
                email=email,
                github_id=github_id,
                github_username=github_login,
            )

            db.add(user)

    user.github_access_token = github_access_token

    try:
        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()
        raise


    access_token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    redirect = RedirectResponse(
        url=f"{settings.FRONTEND_URL}/dashboard"
    )

    redirect.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )

    return redirect