from flask import Blueprint, request, jsonify, g
from models_sqlite import SessionLocal, User
from auth.utils import create_access_token
from auth.decorators import require_auth, require_role

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'memberId' not in data or 'password' not in data:
        return jsonify({'error': 'Missing memberId or password'}), 400
    
    db = SessionLocal()
    user = db.query(User).filter(User.member_id == data['memberId']).first()
    
    if not user or not user.verify_password(data['password']):
        db.close()
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = create_access_token(user.member_id, user.role)
    db.close()
    
    return jsonify({
        'token': token,
        'role': user.role,
        'memberId': user.member_id
    })

@auth_bp.route('/profile', methods=['GET'])
@require_auth
def profile():
    db = SessionLocal()
    user = db.query(User).filter(User.member_id == g.user['member_id']).first()
    
    if not user:
        db.close()
        return jsonify({'error': 'User not found'}), 404
    
    result = {
        'memberId': user.member_id,
        'role': user.role,
        'name': user.name
    }
    db.close()
    return jsonify(result)

@auth_bp.route('/payer/dashboard', methods=['GET'])
@require_role('payer')
def payer_dashboard():
    return jsonify({'data': 'payer dashboards, tools, metrics'})

@auth_bp.route('/agent/dashboard', methods=['GET'])
@require_role('agent')
def agent_dashboard():
    return jsonify({'data': 'agent landing data'})

@auth_bp.route('/member/dashboard', methods=['GET'])
@require_role('member')
def member_dashboard():
    return jsonify({'data': 'member landing data'})