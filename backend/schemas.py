from pydantic import BaseModel, EmailStr
from enum import Enum

class Department(str, Enum):
    SALES = "sales"
    DEVELOPMENT = "development"
    HR = "hr"
    MANAGER = "manager"
    INTERN = "intern"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    contact: str
    department: Department
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    department: str
    password: str
    
    
class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str