#!/usr/bin/env python3
"""
Generate bcrypt hashes for your new passwords
Run this to get the correct password_hash values for SQL
"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

passwords = {
    'agent@123': 'prassana (agent)',
    'payer@123': 'syed (payer)',
    'membo@123': 'hari (member)'
}

print("=" * 70)
print("BCRYPT PASSWORD HASHES FOR YOUR SQL")
print("=" * 70)
print()

for password, user_info in passwords.items():
    hash_value = pwd_context.hash(password)
    print(f"Password: {password} ({user_info})")
    print(f"Hash: {hash_value}")
    print()

print("=" * 70)
print("COPY-PASTE SQL:")
print("=" * 70)
print()

# Generate hashes for SQL
agent_hash = pwd_context.hash('agent@123')
payer_hash = pwd_context.hash('payer@123')
member_hash = pwd_context.hash('membo@123')

sql = f"""
DELETE FROM users WHERE member_id IN ('10001', '20002', '30003');

INSERT INTO users (member_id, password_hash, role, name) VALUES 
('10001', '{agent_hash}', 'agent', 'prassana'),
('20002', '{payer_hash}', 'payer', 'syed'),
('30003', '{member_hash}', 'member', 'hari');
"""

print(sql)
