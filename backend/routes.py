from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import SessionLocal
import models
import schemas

import os
from dotenv import load_dotenv

from auth import (
    hash_password,
    verify_password,
    create_reset_token,
    hash_reset_token,
    create_access_token,
    verify_access_token
)

from email_service import send_reset_email

from datetime import datetime, timedelta, timezone


# APIRouter allows us to group related API endpoints
router = APIRouter()

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")


# --------------------------------------------------
# Database Dependency
# --------------------------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# JWT Authentication
# --------------------------------------------------

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db)
):
    # Get token from Authorization header
    token = credentials.credentials

    # Verify JWT
    user_id = verify_access_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # Find user in database
    user = db.query(models.Users).filter(
        models.Users.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# --------------------------------------------------
# Registration API
# --------------------------------------------------

@router.post("/register", tags=["Registration API"])
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.Users).filter(
        models.Users.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    new_user = models.Users(
        name=user.name,
        email=user.email,
        contact=user.contact,
        department=user.department,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# --------------------------------------------------
# Login API
# --------------------------------------------------

@router.post("/login", tags=["Login API"])
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.Users).filter(
        models.Users.email == user.email,
        models.Users.department == user.department
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or department"
        )

    if not verify_password(
        user.password,
        existing_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    # Create JWT access token
    access_token = create_access_token(
        data={
            "user_id": existing_user.id,
            "email": existing_user.email,
            "department": existing_user.department
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": existing_user.id,
        "name": existing_user.name,
        "email": existing_user.email,
        "department": existing_user.department
    }


# --------------------------------------------------
# Forgot Password API
# --------------------------------------------------

@router.post(
    "/forgot-password",
    tags=["Forgot Password API"]
)
def forgot_password(
    request: schemas.ForgotPassword,
    db: Session = Depends(get_db)
):

    # ----------------------------------------------
    # Find user
    # ----------------------------------------------

    user = db.query(models.Users).filter(
        models.Users.email == request.email
    ).first()


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # ----------------------------------------------
    # Create reset token
    # ----------------------------------------------

    token = create_reset_token()

    token_hash = hash_reset_token(token)


    # ----------------------------------------------
    # Token expiry - 30 minutes
    # ----------------------------------------------

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=30)
    )


    # ----------------------------------------------
    # Store reset token
    # ----------------------------------------------

    reset_token = models.PasswordResetToken(

        user_id=user.id,

        token_hash=token_hash,

        expires_at=expires_at,

        used=False
    )


    db.add(reset_token)

    db.commit()


    # ----------------------------------------------
    # Create React reset-password URL
    # ----------------------------------------------

    reset_link = (
        f"{FRONTEND_URL}/reset-password?token={token}"
    )


    # ----------------------------------------------
    # Send email
    # ----------------------------------------------

    try:

        send_reset_email(
            user.email,
            reset_link
        )

    except Exception as e:

        print(
            "Password reset email failed:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to send password reset email"
        )


    # ----------------------------------------------
    # Response
    # ----------------------------------------------

    return {
        "message":
            "Password reset link has been sent to your email"
    }

# --------------------------------------------------
# Reset Password API
# --------------------------------------------------

@router.post("/reset-password", tags=["Reset Password API"])
def reset_password(
    request: schemas.ResetPassword,
    db: Session = Depends(get_db)
):
    token_hash = hash_reset_token(request.token)

    reset_token = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token_hash == token_hash,
        models.PasswordResetToken.used == False
    ).first()

    if not reset_token:
        raise HTTPException(
            status_code=400,
            detail="Invalid or already used reset token"
        )

    if reset_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="Reset token has expired"
        )

    user = db.query(models.Users).filter(
        models.Users.id == reset_token.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Hash new password
    user.password = hash_password(request.new_password)

    # Mark reset token as used
    reset_token.used = True

    db.commit()

    return {
        "message": "Password reset successfully"
    }


# --------------------------------------------------
# Protected Profile API
# --------------------------------------------------

@router.get("/profile", tags=["Profile API"])
def profile(
    current_user: models.Users = Depends(get_current_user)
):
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "contact": current_user.contact,
        "department": current_user.department
    }