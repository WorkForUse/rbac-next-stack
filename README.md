# RBAC - Task Management & CRM System

RBAC is a comprehensive task management and Customer Relationship Management (CRM) system built with modern web technologies. It provides role-based access control, task management, team collaboration, audit logs, and comprehensive reporting features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Running the Application](#running-the-application)
- [JWT Secret Key Generation](#jwt-secret-key-generation)
- [Features Overview](#features-overview)

---

## ✨ Features

### Core Features
- **User Management**: Create, read, update, and delete users with role-based permissions
- **Task Management**: Create, assign, and track tasks with priorities and due dates
- **Team Assignments**: Assign tasks to team members and track progress
- **Role Management**: Define custom roles with specific permissions
- **Permission System**: Granular control over user permissions
- **Calendar Integration**: View tasks and events in calendar format
- **Reminders**: Set reminders for important deadlines
- **Audit Logs**: Track all user activities and changes
- **Reports**: Generate comprehensive reports on tasks and team performance
- **Authentication**: JWT-based secure authentication

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class Validator
- **Logging**: Built-in NestJS Logger

### Frontend
- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks

---

## 📁 Project Structure

```
Digital-Pylot-Task/
├── backend/
│   ├── src/
│   │   ├── main.ts                 # Application entry point
│   │   ├── app.module.ts           # Root module
│   │   ├── app.controller.ts       # Root controller
│   │   ├── app.service.ts          # Root service
│   │   ├── auth/                   # Authentication module
│   │   ├── users/                  # User management module
│   │   ├── roles/                  # Role management module
│   │   ├── permissions/            # Permission management module
│   │   ├── tasks/                  # Task management module
│   │   ├── leads/                  # Leads management module
│   │   ├── assignments/            # Task assignments module
│   │   ├── reports/                # Reports module
│   │   ├── audit-logs/             # Audit logging module
│   │   └── dashboard/              # Dashboard analytics module
│   ├── .env                        # Environment variables
│   ├── data-source.ts              # Database connection config
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── (auth)/             # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/        # Dashboard pages
│   │   │   │   ├── page.tsx        # Dashboard home
│   │   │   │   ├── users/
│   │   │   │   ├── roles/
│   │   │   │   ├── permissions/
│   │   │   │   ├── tasks/
│   │   │   │   ├── leads/
│   │   │   │   ├── assignments/
│   │   │   │   ├── calendar/
│   │   │   │   ├── reminders/
│   │   │   │   ├── reports/
│   │   │   │   ├── audit/
│   │   │   │   └── settings/
│   │   ├── components/             # Shared components
│   │   ├── lib/                    # Utilities & helpers
│   │   │   ├── axios.ts            # Axios configuration
│   │   │   └── utils.ts
│   │   └── globals.css             # Global styles
│   ├── .env.local                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Postman** (optional, for API testing) - [Download](https://www.postman.com/downloads/)

### Verify Installation

```bash
node --version        # Should return v16+
npm --version         # Should return 8+
postgres --version    # Should return PostgreSQL version
```

---

## 🚀 Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-repo/Digital-Pylot-Task.git
cd Digital-Pylot-Task
```

---

### Database Setup

#### Step 1: Start PostgreSQL Service

**Windows:**
```bash
# PostgreSQL should auto-start or use Services app
# Or via Command Prompt:
pg_ctl -D "C:\Program Files\PostgreSQL\data" start
```

**macOS:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo service postgresql start
```

#### Step 2: Create Database

Connect to PostgreSQL:

```bash
psql -U postgres
```

Inside PostgreSQL shell:

```sql
-- Create database
CREATE DATABASE digital_pylot;

-- Verify creation
\l

-- Exit
\q
```

#### Step 3: Verify Connection

```bash
psql -U postgres -d digital_pylot -c "SELECT version();"
```

You should see the PostgreSQL version output.

---

### Backend Setup

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Setup Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123
DB_DATABASE=digital_pylot

# JWT Configuration
JWT_SECRET=cf36c55a6fe7bc6ec21961758d491d176a3f1efae7d4680b72cf76aed28dd8ff0185ec949fb48ae4096e79a7f5eee8b072ce27d93acd861ffc3301689c25299
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
PORT=3001
```

#### Step 4: Run Database Migrations

The database tables will be created automatically when the application starts (TypeORM will synchronize the schema).

#### Step 5: Start Backend Server

```bash
npm run start:dev
```

You should see:
```
[Nest] 12345 - 03/16/2026, 10:00:00 AM LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 03/16/2026, 10:00:00 AM LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345 - 03/16/2026, 10:00:00 AM LOG [RoutesResolver] AppController {/api}:
[Nest] 12345 - 03/16/2026, 10:00:00 AM LOG Listen on port 3001
```

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Setup Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# For production deployment:
# NEXT_PUBLIC_API_URL=https://your-api-link.com/api

# Node Environment
NODE_ENV=development
```

#### Step 4: Start Frontend Server

```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# PostgreSQL Database Configuration
DB_HOST=localhost           # Database host address
DB_PORT=5432               # PostgreSQL default port
DB_USERNAME=postgres       # Database username
DB_PASSWORD=123            # Database password
DB_DATABASE=digital_pylot  # Database name

# JWT (JSON Web Token) Configuration
JWT_SECRET=your_secret_key_here  # Secret key for signing JWTs
JWT_EXPIRES_IN=7d               # Token expiration time (7 days)

# Application Configuration
NODE_ENV=development        # Environment (development/production)
PORT=3001                   # Server port
```

**Important**: Change `DB_PASSWORD` to your PostgreSQL password and `JWT_SECRET` to a secure value in production.

### Frontend (.env.local)

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# For production deployment, use:
# NEXT_PUBLIC_API_URL=https://your-production-api.com/api

# Environment
NODE_ENV=development
```

**Security Note**: Never commit `.env` files to version control. Add them to `.gitignore`.

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

### Core API Endpoints

#### 1. **Authentication Module**

##### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "permissions": ["view_dashboard", "manage_tasks"]
}
```

---

##### POST /auth/login
Login user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "permissions": ["view_dashboard", "manage_tasks"]
}
```

---

#### 2. **User Management Module**

##### GET /users
Get all users (Admin only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": { "id": 1, "name": "Admin" },
      "isActive": true,
      "createdAt": "2026-03-16T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

##### GET /users/:id
Get user by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": { "id": 1, "name": "Admin" },
  "permissions": ["view_dashboard", "manage_tasks"],
  "isActive": true,
  "createdAt": "2026-03-16T10:00:00Z"
}
```

---

##### POST /users
Create new user (Admin only).

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "roleId": 2
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": { "id": 2, "name": "Manager" },
  "isActive": true,
  "createdAt": "2026-03-16T10:30:00Z"
}
```

---

##### PUT /users/:id
Update user (Admin or Self).

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": { "id": 2, "name": "Manager" }
}
```

---

##### DELETE /users/:id
Delete user (Admin only).

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

#### 3. **Task Management Module**

##### GET /tasks
Get all tasks with filtering.

**Query Parameters:**
- `status` (optional): pending, completed, in-progress
- `priority` (optional): low, medium, high
- `assignedTo` (optional): User ID
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Setup Database",
      "description": "Configure PostgreSQL database",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-03-20",
      "dueTime": "09:00",
      "category": "Development",
      "assignedTo": { "id": 2, "name": "Jane Doe" },
      "createdBy": { "id": 1, "name": "John Doe" },
      "createdAt": "2026-03-16T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

---

##### GET /tasks/:id
Get task by ID.

**Response:**
```json
{
  "id": 1,
  "title": "Setup Database",
  "description": "Configure PostgreSQL database",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-03-20",
  "dueTime": "09:00",
  "category": "Development",
  "assignedTo": { "id": 2, "name": "Jane Doe" },
  "createdBy": { "id": 1, "name": "John Doe" },
  "createdAt": "2026-03-16T10:00:00Z"
}
```

---

##### POST /tasks
Create new task.

**Request Body:**
```json
{
  "title": "Setup Database",
  "description": "Configure PostgreSQL database",
  "priority": "high",
  "dueDate": "2026-03-20",
  "dueTime": "09:00",
  "category": "Development",
  "assignedToId": 2
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Setup Database",
  "description": "Configure PostgreSQL database",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-03-20",
  "dueTime": "09:00",
  "category": "Development"
}
```

---

##### PUT /tasks/:id
Update task.

**Request Body:**
```json
{
  "title": "Setup Database (Updated)",
  "status": "completed",
  "priority": "medium"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Setup Database (Updated)",
  "status": "completed",
  "priority": "medium"
}
```

---

##### PATCH /tasks/:id
Partially update task (e.g., change status).

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "completed"
}
```

---

##### DELETE /tasks/:id
Delete task.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

#### 4. **Role Management Module**

##### GET /roles
Get all roles.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "description": "Administrator with full access",
      "permissions": [
        { "id": 1, "name": "view_dashboard" },
        { "id": 2, "name": "manage_users" }
      ]
    }
  ]
}
```

---

##### POST /roles
Create new role (Admin only).

**Request Body:**
```json
{
  "name": "Manager",
  "description": "Team manager with limited admin access",
  "permissionIds": [1, 3, 4]
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Manager",
  "description": "Team manager with limited admin access"
}
```

---

##### PUT /roles/:id
Update role (Admin only).

**Request Body:**
```json
{
  "name": "Team Lead",
  "permissionIds": [1, 3, 5]
}
```

---

##### DELETE /roles/:id
Delete role (Admin only).

---

#### 5. **Permission Management Module**

##### GET /permissions
Get all permissions.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "view_dashboard",
      "description": "View main dashboard"
    },
    {
      "id": 2,
      "name": "manage_users",
      "description": "Create, update, delete users"
    }
  ]
}
```

---

#### 6. **Reports Module**

##### GET /reports
Generate reports with filters.

**Query Parameters:**
- `type` (optional): tasks, users, performance
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response:**
```json
{
  "type": "tasks",
  "totalTasks": 50,
  "completedTasks": 35,
  "pendingTasks": 10,
  "inProgressTasks": 5,
  "completionRate": 0.70,
  "averageCompletionTime": "5.3 days",
  "tasksByPriority": {
    "high": 15,
    "medium": 25,
    "low": 10
  },
  "tasksByStatus": {
    "completed": 35,
    "pending": 10,
    "in-progress": 5
  }
}
```

---

##### POST /reports
Create custom report.

**Request Body:**
```json
{
  "title": "Q1 Performance Report",
  "type": "performance",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "includeMetrics": ["completion_rate", "average_time", "team_performance"]
}
```

---

#### 7. **Audit Logs Module**

##### GET /audit-logs
Get audit logs (Admin only).

**Query Parameters:**
- `action` (optional): create, update, delete, login
- `userId` (optional): Filter by user
- `entityType` (optional): user, task, role
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "action": "UPDATE",
      "entityType": "Task",
      "entityId": 1,
      "userId": 1,
      "userName": "John Doe",
      "changes": {
        "status": { "from": "pending", "to": "completed" },
        "priority": { "from": "high", "to": "medium" }
      },
      "timestamp": "2026-03-16T10:30:00Z",
      "ipAddress": "192.168.1.1"
    }
  ],
  "total": 100,
  "page": 1
}
```

---

#### 8. **Dashboard Module**

##### GET /dashboard
Get dashboard overview (summary statistics).

**Response:**
```json
{
  "totalUsers": 15,
  "totalTasks": 50,
  "completedTasks": 35,
  "pendingTasks": 10,
  "inProgressTasks": 5,
  "totalRoles": 4,
  "activeUsers": 12,
  "taskCompletionRate": 0.70,
  "topPerformers": [
    {
      "id": 2,
      "name": "Jane Doe",
      "completedTasks": 18,
      "averageCompletionTime": "4.2 days"
    }
  ],
  "recentActivities": [
    {
      "id": 1,
      "action": "Task Completed",
      "description": "Jane Doe completed 'Setup Database'",
      "timestamp": "2026-03-16T10:30:00Z"
    }
  ]
}
```

---

#### 9. **Leads Module**

##### GET /leads
Get all leads.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "company": "Acme Corp",
      "status": "active",
      "source": "website",
      "value": 50000,
      "assignedTo": { "id": 2, "name": "Jane Doe" },
      "createdAt": "2026-03-16T10:00:00Z"
    }
  ]
}
```

---

#### 10. **Assignments Module**

##### GET /assignments
Get task assignments.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "taskId": 1,
      "taskTitle": "Setup Database",
      "assignedTo": { "id": 2, "name": "Jane Doe" },
      "assignedBy": { "id": 1, "name": "John Doe" },
      "status": "accepted",
      "priority": "high",
      "dueDate": "2026-03-20"
    }
  ]
}
```

---

## 🐍 JWT Secret Key Generation

### Generate a Secure JWT Secret

You can generate a strong JWT secret using several methods:

#### Method 1: Using OpenSSL (Recommended)

```bash
openssl rand -hex 64
```

**Output Example:**
```
cf36c55a6fe7bc6ec21961758d491d176a3f1efae7d4680b72cf76aed28dd8ff0185ec949fb48ae4096e79a7f5eee8b072ce27d93acd861ffc3301689c25299
```

#### Method 2: Using Node.js

Create a file `generate-secret.js`:

```javascript
const crypto = require('crypto');

// Generate 64 bytes of random data and convert to hex
const secret = crypto.randomBytes(64).toString('hex');
console.log('Your JWT Secret:');
console.log(secret);
```

Run it:
```bash
node generate-secret.js
```

#### Method 3: Using Python

```bash
python -c "import secrets; print(secrets.token_hex(64))"
```

#### Method 4: Online Generator

Use an online tool (for development only):
- [Random.org](https://www.random.org/) - Generate random strings
- [Passwordsgenerator.com](https://passwordsgenerator.com/)

### Best Practices for JWT Secrets

1. **Use Strong Secrets**: Minimum 32 characters, preferably 64+ characters
2. **Keep It Secret**: Never commit to version control
3. **Rotate Periodically**: Change secrets every 3-6 months in production
4. **Use Environment Variables**: Store in `.env` file (not in code)
5. **Different Secrets**: Use different secrets for development and production

---

## ▶️ Running the Application

### Step 1: Start PostgreSQL

```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\data" start

# macOS
brew services start postgresql

# Linux
sudo service postgresql start
```

### Step 2: Start Backend (Terminal 1)

```bash
cd backend
npm run start:dev
```

Expected output:
```
[Nest] 12345 - 03/16/2026, 10:00:00 AM LOG Listen on port 3001
```

### Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 4: Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

---

## 🧪 Testing the API

### Using Postman

1. **Download Postman**: [postman.com/downloads](https://www.postman.com/downloads/)
2. **Import Collection**: Create a new collection for this project
3. **Set Environment Variables**:
   - `base_url`: http://localhost:3001/api
   - `token`: Your JWT token from login response

### Example Requests

#### Login Request
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get All Tasks
```
GET http://localhost:3001/api/tasks
Authorization: Bearer <your-jwt-token>
```

#### Create Task
```
POST http://localhost:3001/api/tasks
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2026-03-25",
  "dueTime": "14:00",
  "category": "Development"
}
```

---

## 📊 Database Schema

### Key Tables

- **users**: Store user information
- **roles**: Define user roles
- **permissions**: Define system permissions
- **user_roles**: Map users to roles
- **role_permissions**: Map roles to permissions
- **tasks**: Store tasks
- **task_assignments**: Track task assignments
- **leads**: Store leads information
- **reports**: Store generated reports
- **audit_logs**: Store activity logs

---

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-Based Access Control**: Fine-grained permission system
3. **Password Hashing**: Secure password storage
4. **SQL Injection Prevention**: TypeORM parameterized queries
5. **CORS Protection**: Cross-origin request validation
6. **Input Validation**: Request data validation using Class Validator
7. **Audit Logging**: Track all user activities

---

## 🐛 Troubleshooting

### Backend won't start

**Issue**: Port 3001 already in use
```bash
# Find process using port 3001
lsof -i :3001      # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process
kill -9 <PID>      # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database connection error

**Issue**: Can't connect to PostgreSQL
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check credentials in .env file match PostgreSQL setup
# If password is wrong, reset it:
psql -U postgres
ALTER USER postgres WITH PASSWORD 'your_new_password';
\q
```

### Frontend can't reach API

**Issue**: API URL incorrect
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running on port 3001
- Check browser console for CORS errors

### JWT Token Expired

**Issue**: Token expired error
- Login again to get a new token
- Change `JWT_EXPIRES_IN` in backend `.env` if needed

---

## 📝 Common npm Commands

### Backend

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start

# Run tests
npm run test

# Lint code
npm run lint
```

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)

---

## 👥 Team & Support

For issues, questions, or contributions, please:
1. Check existing documentation
2. Search GitHub issues
3. Create a new issue with detailed description
4. Contact the development team

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Last Updated**: March 16, 2026

For the latest updates and improvements, visit the project repository Thanks - This RBAC SYSTEM IS CREATED BY MUHAMMAD HAMZA SHAHID!
