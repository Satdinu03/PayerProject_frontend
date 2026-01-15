# from functools import wraps
# from flask import request, jsonify, g
# from auth.utils import decode_token

# def require_auth(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         auth_header = request.headers.get('Authorization')
#         if not auth_header or not auth_header.startswith('Bearer '):
#             return jsonify({'error': 'No valid authorization header'}), 401
        
#         token = auth_header.split(' ')[1]
#         try:
#             payload = decode_token(token)
#             g.user = {
#                 'member_id': payload['sub'],
#                 'role': payload['role']
#             }
#         except Exception as e:
#             return jsonify({'error': str(e)}), 401
        
#         return f(*args, **kwargs)
#     return decorated_function

# def require_role(required_role):
#     def decorator(f):
#         @wraps(f)
#         @require_auth
#         def decorated_function(*args, **kwargs):
#             if g.user['role'] != required_role:
#                 return jsonify({'error': 'Insufficient permissions'}), 403
#             return f(*args, **kwargs)
#         return decorated_function
#     return decorator