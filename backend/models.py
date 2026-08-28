from sqlalchemy import Column,Integer,String,ForeignKey,DateTime,Boolean
from database import Base
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__ = "users"
    
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    email = Column(String,unique=True,nullable=False,index=True)
    contact = Column(String, nullable=False)
    department = Column(String, nullable=False)
    password = Column(String, nullable=False)
    
    reset_tokens = relationship(
        "PasswordResetToken",
        back_populates="user"
    )
    
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    token_hash = Column(String, nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    used = Column(Boolean, default=False, nullable=False)

    user = relationship(
        "Users",
        back_populates="reset_tokens"
    )