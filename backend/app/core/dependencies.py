from fastapi import Depends, HTTPException, Request
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.database import get_db
from app.database.models import User


def authenticate_user(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user