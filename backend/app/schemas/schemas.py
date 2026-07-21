from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = {
        "from_attributes": True
    }    

class LoginRequest(BaseModel):
    identifier: str
    password: str