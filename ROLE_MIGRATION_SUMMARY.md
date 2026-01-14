# Role Migration Summary: Customer/Agent → Agent/Payer

## Overview
Successfully migrated the application from `customer/agent` roles to `agent/payer` roles.

## Changes Made

### Backend Changes
1. **mysql_backend.py**
   - Changed `/auth/customer/dashboard` → `/auth/agent/dashboard`
   - Changed `/auth/agent/dashboard` → `/auth/payer/dashboard`
   - Updated role decorators accordingly
   - Updated test account print statements

### Frontend Changes

#### 1. Routing (App.jsx)
   - Changed imports from `customer/*` to `agent/*`
   - Changed imports from `agent/*` to `payer/*`
   - Updated all route paths:
     - `/customer/landing` → `/agent/landing`
     - `/customer/plan-shopper` → `/agent/plan-shopper`
     - `/customer/benefit-inquiry` → `/agent/benefit-inquiry`
     - `/agent/medical-code-extraction` → `/payer/medical-code-extraction`
     - `/agent/star-rating-analysis` → `/payer/star-rating-analysis`

#### 2. Components
   - Renamed `AgentRoute.jsx` → `PayerRoute.jsx`
   - Updated role check from `'agent'` to `'payer'`

#### 3. Pages Structure
   - Moved `customer/` pages → `agent/` directory
   - Moved `agent/` pages → `payer/` directory
   - Renamed `CustomerLanding.jsx` → `AgentLanding.jsx`
   - Updated component names inside files

#### 4. Landing Page (Landing.jsx)
   - Changed redirect logic: `customer` → `agent`
   - Changed dashboard display: `agent` → `payer`
   - Updated tile paths to `/payer/*`
   - Changed dashboard title to "Payer Dashboard"

## New Directory Structure

```
frontend/src/pages/
├── agent/
│   ├── AgentLanding.jsx       (formerly CustomerLanding)
│   ├── PlanShopper.jsx        (moved from customer/)
│   └── BenefitInquiry.jsx     (moved from customer/)
├── payer/
│   ├── MedicalCodeExtraction.jsx  (moved from agent/)
│   └── StarRatingAnalysis.jsx     (moved from agent/)
├── Landing.jsx
└── Login.jsx
```

## New Test Accounts

| Role  | Member ID | Password    | Name  | Access                                    |
|-------|-----------|-------------|-------|-------------------------------------------|
| Agent | 10001     | agent@123   | Alice | Plan Shopper, Benefit Inquiry             |
| Payer | 20002     | payer@123   | Bob   | Medical Code Extraction, Star Rating      |

## SQL Query to Update Database

Run this SQL query to update your existing database:

```sql
-- Update the database schema and data for role migration
USE authz_app;

-- Step 1: Update the ENUM type to include new roles
ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'agent', 'payer') NOT NULL;

-- Step 2: Update existing data (customer → agent, agent → payer)
UPDATE users SET role = 'payer' WHERE role = 'agent';
UPDATE users SET role = 'agent' WHERE role = 'customer';

-- Step 3: Remove old 'customer' from ENUM (optional, for cleanup)
ALTER TABLE users MODIFY COLUMN role ENUM('agent', 'payer') NOT NULL;

-- Step 4: Update test account credentials and names
UPDATE users SET 
    password_hash = SHA2('agent@123', 256),
    name = 'Alice'
WHERE member_id = '10001';

UPDATE users SET 
    password_hash = SHA2('payer@123', 256),
    name = 'Bob'
WHERE member_id = '20002';

-- Verify the changes
SELECT member_id, role, name FROM users ORDER BY member_id;
```

## Alternative: Fresh Database Setup

If you prefer to start fresh, use this complete schema:

```sql
-- Drop and recreate database
DROP DATABASE IF EXISTS authz_app;
CREATE DATABASE authz_app;
USE authz_app;

-- Create users table with new roles
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('agent', 'payer') NOT NULL,
    name VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
INSERT INTO users (member_id, password_hash, role, name) VALUES
('10001', SHA2('agent@123', 256), 'agent', 'Alice'),
('20002', SHA2('payer@123', 256), 'payer', 'Bob');

-- Verify
SELECT * FROM users;
```

## Testing Instructions

### 1. Update Database
Run the SQL query above in your MySQL client

### 2. Restart Backend
```bash
cd backend
python mysql_backend.py
```

### 3. Restart Frontend
```bash
cd frontend
npm run dev
```

### 4. Test Agent Login
- Member ID: `10001`
- Password: `agent@123`
- Should redirect to `/agent/landing`
- Should see Plan Shopper and Benefit Inquiry options

### 5. Test Payer Login
- Member ID: `20002`
- Password: `payer@123`
- Should redirect to `/landing` (shows Payer Dashboard)
- Should see Medical Code Extraction and Star Rating Analysis tiles

## API Endpoints (Updated)

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Role-Specific
- `GET /auth/agent/dashboard` - Agent dashboard (agent only)
- `GET /auth/payer/dashboard` - Payer dashboard (payer only)

## Notes

- All localStorage keys remain the same (`token`, `role`, `memberId`)
- JWT token structure unchanged
- Password hashing uses SHA256 (consider bcrypt for production)
- Frontend components maintain the same functionality, just reorganized

## Rollback (If Needed)

To rollback to customer/agent structure:

```sql
USE authz_app;
ALTER TABLE users MODIFY COLUMN role ENUM('agent', 'payer', 'customer') NOT NULL;
UPDATE users SET role = 'customer' WHERE role = 'agent';
UPDATE users SET role = 'agent' WHERE role = 'payer';
ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'agent') NOT NULL;
```

Then revert the code changes using git.
