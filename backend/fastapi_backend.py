from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
import hashlib
import mysql.connector
from mysql.connector import Error
from typing import Optional
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add planshopper_bot to path
sys.path.append(str(Path(__file__).parent / 'planshopper_bot'))
from planshopper_bot.routes import chat_router

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Plan Shopper chatbot routes
app.include_router(chat_router.router)

# Configuration
SECRET_KEY = os.getenv('SECRET_KEY')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')
ACCESS_TOKEN_EXPIRES_MIN = int(os.getenv('ACCESS_TOKEN_EXPIRES_MIN'))

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

# Pydantic models
class LoginRequest(BaseModel):
    memberId: str
    password: str

class LoginResponse(BaseModel):
    token: str
    role: str
    memberId: str

class ProfileResponse(BaseModel):
    memberId: str
    role: str
    name: Optional[str]

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Database connection error: {e}")
        return None

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    return hashlib.sha256(password.encode()).hexdigest() == hashed

def create_access_token(member_id: str, role: str) -> str:
    payload = {
        'sub': member_id,
        'role': role,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MIN)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="No valid authorization header")
    
    token = authorization.split(' ')[1]
    payload = decode_token(token)
    return {
        'member_id': payload['sub'],
        'role': payload['role']
    }

def require_role(required_role: str):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user['role'] != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

@app.post('/auth/login', response_model=LoginResponse)
def login(request: LoginRequest):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM people WHERE member_id = %s", (request.memberId,))
        user = cursor.fetchone()
        
        if not user or not verify_password(request.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = create_access_token(user['member_id'], user['role'])
        
        return LoginResponse(
            token=token,
            role=user['role'],
            memberId=user['member_id']
        )
    
    except Error as e:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.get('/auth/profile', response_model=ProfileResponse)
def profile(current_user: dict = Depends(get_current_user)):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM people WHERE member_id = %s", (current_user['member_id'],))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return ProfileResponse(
            memberId=user['member_id'],
            role=user['role'],
            name=user.get('name')
        )
    
    except Error as e:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.get('/auth/payer/dashboard')
def payer_dashboard(current_user: dict = Depends(require_role('payer'))):
    return {'data': 'payer dashboards, tools, metrics'}

@app.get('/auth/agent/dashboard')
def agent_dashboard(current_user: dict = Depends(require_role('agent'))):
    return {'data': 'agent landing data'}

@app.get('/auth/member/dashboard')
def member_dashboard(current_user: dict = Depends(require_role('member'))):
    return {'data': 'member landing data'}

@app.get('/health')
def health():
    return {'status': 'healthy', 'database': 'mysql'}

if __name__ == '__main__':
    import uvicorn
    print("Backend server with MySQL starting on http://localhost:8000")
    print("Test accounts:")
    print("   Agent: 10001 / agent@123")
    print("   Payer: 20002 / payer@123")
    print("   Member: 30003 / member@123")
    uvicorn.run(app, host='0.0.0.0', port=8000)
