from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str | None = None
    github_username: str | None = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    identifier: str
    password: str
