from pydantic import BaseModel, Field, EmailStr, validator
import uuid
from datetime import datetime
from typing import List


class UserCreateModel(BaseModel):
    """Schema for creating a new user."""

    first_name: str = Field(max_length=25)
    last_name: str = Field(max_length=25)
    username: str = Field(max_length=8, min_length=3)
    email: EmailStr
    password: str = Field(min_length=6)

    @validator("username")
    def validate_username(cls, value):
        if " " in value:
            raise ValueError("Username should not contain spaces.")
        return value


class UserModel(BaseModel):
    """Schema for displaying user details."""

    uid: uuid.UUID
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLoginModel(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str = Field(min_length=6)


class EmailModel(BaseModel):
    """Schema for sending emails."""

    addresses: List[EmailStr]


class PasswordResetRequestModel(BaseModel):
    """Schema for requesting a password reset."""

    email: EmailStr


class PasswordResetConfirmModel(BaseModel):
    """Schema for confirming a password reset."""

    new_password: str = Field(min_length=6)
    confirm_new_password: str = Field(min_length=6)

    @validator("confirm_new_password")
    def passwords_match(cls, value, values):
        if "new_password" in values and value != values["new_password"]:
            raise ValueError("Passwords do not match.")
        return value
