#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal, init_db
from models import User

def seed_users():
    init_db()
    db = SessionLocal()
    
    # Check if users already exist
    if db.query(User).count() > 0:
        print("Users already exist. Skipping seed.")
        db.close()
        return
    
    # Create seed users
    users = [
        {
            'member_id': '10001',
            'password': 'cust@123',
            'role': 'agent',
            'name': 'Alice'
        },
        {
            'member_id': '20002',
            'password': 'agent@123',
            'role': 'payer',
            'name': 'Bob'
        },
        {
            'member_id': '30003',
            'password': 'member@123',
            'role': 'member',
            'name': 'Charlie'
        }
    ]
    
    for user_data in users:
        user = User(
            member_id=user_data['member_id'],
            role=user_data['role'],
            name=user_data['name']
        )
        user.set_password(user_data['password'])
        db.add(user)
    
    db.commit()
    db.close()
    print("Seed users created successfully!")

if __name__ == '__main__':
    seed_users()