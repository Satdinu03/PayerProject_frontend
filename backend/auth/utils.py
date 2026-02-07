# import jwt
# from datetime import datetime, timedelta

# SECRET_KEY = 'healthcare-genai-secret-key-2024-secure-random-hex'
# JWT_ALGORITHM = 'HS256'
# ACCESS_TOKEN_EXPIRES_MIN = 30

# def create_access_token(member_id: str, role: str) -> str:
#     payload = {
#         'sub': member_id,
#         'role': role,
#         'iat': datetime.utcnow(),
#         'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MIN)
#     }
#     return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

# def decode_token(token: str) -> dict:
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
#         return payload
#     except jwt.ExpiredSignatureError:
#         raise Exception("Token has expired")
#     except jwt.InvalidTokenError:
#         raise Exception("Invalid token")