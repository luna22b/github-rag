from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.database.database import engine, Base
from app.auth.router import router as auth_router
from app.github.router import router as github_router


app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Users"]
)

app.include_router(
    github_router,
    prefix="/api/repositories",
    tags=["Repositories"]
)



@app.get("/")
def home():
    return {
        "message": "GitHub RAG API is running"
    }

