from flask import Flask, request, jsonify, g
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
from functools import wraps
import hashlib
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# Configuration
SECRET_KEY = 'healthcare-genai-secret-key-2024-secure-random-hex'
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRES_MIN = 30

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'auth_app',
    'user': 'root',
    'password': 'root'  # MySQL root password
}

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
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No valid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        try:
            payload = decode_token(token)
            g.user = {
                'member_id': payload['sub'],
                'role': payload['role']
            }
        except Exception as e:
            return jsonify({'error': str(e)}), 401
        
        return f(*args, **kwargs)
    return decorated_function

def require_role(required_role):
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated_function(*args, **kwargs):
            if g.user['role'] != required_role:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'memberId' not in data or 'password' not in data:
        return jsonify({'error': 'Missing memberId or password'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM people WHERE member_id = %s", (data['memberId'],))
        user = cursor.fetchone()
        
        if not user or not verify_password(data['password'], user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = create_access_token(user['member_id'], user['role'])
        
        return jsonify({
            'token': token,
            'role': user['role'],
            'memberId': user['member_id']
        })
    
    except Error as e:
        return jsonify({'error': 'Database error'}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/auth/profile', methods=['GET'])
@require_auth
def profile():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM people WHERE member_id = %s", (g.user['member_id'],))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'memberId': user['member_id'],
            'role': user['role'],
            'name': user['name']
        })
    
    except Error as e:
        return jsonify({'error': 'Database error'}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/auth/payer/dashboard', methods=['GET'])
@require_role('payer')
def payer_dashboard():
    return jsonify({'data': 'payer dashboards, tools, metrics'})

@app.route('/auth/agent/dashboard', methods=['GET'])
@require_role('agent')
def agent_dashboard():
    return jsonify({'data': 'agent landing data'})

@app.route('/auth/member/dashboard', methods=['GET'])
@require_role('member')
def member_dashboard():
    return jsonify({'data': 'member landing data'})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'database': 'mysql'})

if __name__ == '__main__':
    print("Backend server with MySQL starting on http://localhost:8000")
    print("Test accounts:")
    print("   Agent: 10001 / agent@123")
    print("   Payer: 20002 / payer@123")
    print("   Member: 30003 / member@123")
    app.run(host='0.0.0.0', port=8000, debug=True)