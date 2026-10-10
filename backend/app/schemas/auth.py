from pydantic import BaseModel, ConfigDict, EmailStr

class UserRegister(BaseModel):
    username : str
    email    : EmailStr
    password : str
    role_id  : int


class LoginRequest(BaseModel):
    username : str
    password : str

class TokenResponse(BaseModel):
    access_token : str
    token_type   : str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role_id: int
    role: str

    model_config = ConfigDict(from_attributes=True)
