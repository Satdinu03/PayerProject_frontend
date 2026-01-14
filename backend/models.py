from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from passlib.context import CryptContext

Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(String(32), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('agent', 'payer', 'member'), nullable=False)
    name = Column(String(64))
    created_at = Column(DateTime, default=func.current_timestamp())
    
    def set_password(self, password):
        self.password_hash = pwd_context.hash(password)
    
    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)
    
    def to_dict(self):
        return {
            'id': self.id,
            'member_id': self.member_id,
            'role': self.role,
            'name': self.name
        }