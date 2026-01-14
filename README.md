# Healthcare GenAI Portal - DineshHealth Insurance Platform

A complete full-stack web application with role-based authentication for a healthcare GenAI POC. Built with React 18 + Vite frontend and Python Flask backend with JWT authentication. Features the SureHealth brand design with integrated chatbot for plan comparison.

## Features

- **Secure Authentication**: JWT-based login with bcrypt password hashing
- **Role-Based Access Control**: Customer and Agent roles with different permissions
- **DineshHealth Brand Design**: Modern insurance portal with sky-blue branding
- **Interactive Chatbot**: Plan Shopper Assistant with static demo responses
- **Protected Routing**: Frontend and backend route protection
- **Modern UI**: Clean, responsive design with TailwindCSS
- **RESTful API**: Well-structured Flask backend with proper error handling

## New DineshHealth Features

### Customer Experience
- **Hero Landing Page**: "Find Your Perfect Policy" with insurance illustration
- **Floating Chat Widget**: Bottom-right chat icon with helpful tooltip
- **Plan Shopper Assistant**: Interactive chatbot for plan comparison
- **Static Demo Responses**: Compare SureCare vs DineshHealth plans, copays, drug coverage

### Navigation
- **DineshHealth Header**: Sticky navigation with brand colors (sky-700)
- **Menu Items**: Home, Plan Shopper, About Us, Contact, FAQs
- **Search Integration**: Placeholder search functionality

## Quick Demo Instructions

### Customer Flow
1. **Login as Customer**: Use Member ID `10001` and password `cust@123`
2. **Landing Page**: See the DineshHealth hero section with "Find Your Perfect Policy"
3. **Chat Widget**: Click the floating chat icon (bottom-right) to open Plan Shopper Assistant
4. **Try Chat Commands**:
   - "Compare SureCare vs DineshHealth"
   - "Show emergency room copay"
   - "Drug coverage for diabetes"
5. **Plan Shopper Page**: Navigate to `/customer/plan-shopper` - chat opens automatically

### Agent Flow (Unchanged)
- Login as Agent: Member ID `20002` and password `agent@123`
- Access Medical Code Extraction and Star Rating Analysis tools

## Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Axios for API calls
- TailwindCSS for styling

### Backend
- Python 3.11 + Flask
- JWT authentication (HS256)
- SQLAlchemy ORM
- MySQL 8.x database
- bcrypt password hashing

## Project Structure

```
healthcare-auth-app/
├── backend/
│   ├── auth/
│   │   ├── routes.py          # Authentication endpoints
│   │   ├── utils.py           # JWT utilities
│   │   └── decorators.py      # Auth decorators
│   ├── scripts/
│   │   ├── create_schema.sql  # Database schema
│   │   └── seed_users.py      # Seed data script
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration management
│   ├── models.py              # SQLAlchemy models
│   ├── db.py                  # Database connection
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── pages/             # React pages
│   │   ├── components/        # Reusable components
│   │   └── lib/               # API configuration
│   ├── package.json           # Node.js dependencies
│   └── .env.example           # Frontend environment variables
└── docker-compose.yml         # Docker setup (optional)
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.x
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd healthcare-auth-app
```

### 2. Database Setup
```bash
# Connect to MySQL and run:
mysql -u root -p < backend/scripts/create_schema.sql
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Seed database with test users
python scripts/seed_users.py

# Start backend server
python app.py
```

Backend will run on http://localhost:8000

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## Test Accounts

| Role     | Member ID | Password  | Name  |
|----------|-----------|-----------|-------|
| Customer | 10001     | cust@123  | Alice |
| Agent    | 20002     | agent@123 | Bob   |

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Role-Specific
- `GET /auth/customer/dashboard` - Customer dashboard (customer only)
- `GET /auth/agent/dashboard` - Agent dashboard (agent only)

## API Testing with cURL

### 1. Login as Customer
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"memberId": "10001", "password": "cust@123"}'
```

Expected response:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "role": "customer",
  "memberId": "10001"
}
```

### 2. Login as Agent
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"memberId": "20002", "password": "agent@123"}'
```

### 3. Access Profile (Protected)
```bash
# Replace TOKEN with actual JWT from login response
curl -X GET http://localhost:8000/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### 4. Test Role Protection
```bash
# Try accessing agent dashboard with customer token (should return 403)
curl -X GET http://localhost:8000/auth/agent/dashboard \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

Expected response:
```json
{
  "error": "Insufficient permissions"
}
```

## Docker Setup (Optional)

### Run with Docker Compose
```bash
# Build and start all services
docker compose up --build

# Seed users (run after containers are up)
docker compose exec backend python scripts/seed_users.py
```

Services:
- MySQL: localhost:3306
- Backend: localhost:8000
- Frontend: Run separately with `npm run dev`

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: HS256 algorithm, 30-minute expiration
- **CORS Protection**: Restricted to frontend origin
- **Route Protection**: Both frontend and backend validation
- **Role-Based Access**: Granular permissions by user role

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here-use-random-hex
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_MIN=30
CORS_ORIGINS=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=authz_app
```

### Frontend (.env)
```env
VITE_API_BASE=http://localhost:8000
```

## Application Flow

1. **Login**: User enters Member ID and password
2. **Authentication**: Backend validates credentials and returns JWT
3. **Token Storage**: Frontend stores token in localStorage
4. **Role-Based Landing**: User sees tiles based on their role
5. **Protected Navigation**: Routes are protected by authentication and role
6. **Logout**: Token is cleared and user redirected to login

## Role-Based Features

### Customer Role
- Plan Shopper: Browse and compare health plans
- Benefit Inquiry: Check benefits and coverage

### Agent Role
- Medical Code Extraction: AI-powered code analysis
- Star Rating Analysis: Provider performance metrics

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS_ORIGINS includes frontend URL
2. **Database Connection**: Verify MySQL is running and credentials are correct
3. **Token Expiration**: Tokens expire in 30 minutes, re-login required
4. **Port Conflicts**: Ensure ports 3306, 5173, and 8000 are available

### Database Issues
```bash
# Reset database
mysql -u root -p -e "DROP DATABASE IF EXISTS authz_app; CREATE DATABASE authz_app;"
mysql -u root -p authz_app < backend/scripts/create_schema.sql
python backend/scripts/seed_users.py
```

### Backend Logs
```bash
# Check backend logs for errors
cd backend
python app.py
```

## Development Notes

- Frontend uses localStorage for token storage (consider httpOnly cookies for production)
- JWT tokens are short-lived (30 minutes) for security
- All passwords are hashed with bcrypt before storage
- API responses exclude sensitive data (password hashes, raw tokens)

## Production Considerations

1. **Environment Variables**: Use secure random keys
2. **HTTPS**: Enable SSL/TLS in production
3. **Token Storage**: Consider httpOnly cookies
4. **Database**: Use connection pooling and proper indexing
5. **Logging**: Implement structured logging (avoid logging sensitive data)
6. **Rate Limiting**: Add API rate limiting
7. **Input Validation**: Enhanced validation and sanitization

## License

This project is for demonstration purposes as part of a healthcare GenAI POC.