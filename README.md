# Cafe Employee Manager

A full-stack web application for managing cafés and their employees.

This project was developed as part of a technical assessment. The system allows users to manage cafés and employees, assign employees to cafés, and track how long employees have worked at a specific café.

The backend follows **Clean Architecture principles**, implements **CQRS with MediatR**, and exposes **RESTful APIs**. The frontend is built with **React**, using **Ant Design** and **AG Grid** for UI components.

---

## 🚀 Live Deployment

The application is currently deployed on **Railway**:

- **Frontend**: https://gicdigitalplatformeq-production.up.railway.app
- **Backend API**: https://gic-backend-production.up.railway.app
- **Health Check**: https://gic-backend-production.up.railway.app/health

---

# Tech Stack

## Backend
- .NET 10 (ASP.NET Core Web API) - Preview
- CQRS Pattern
- MediatR
- Entity Framework Core
- PostgreSQL
- Autofac (Dependency Injection)
- Docker & Docker Compose

## Frontend
- React (Vite)
- Ant Design
- AG Grid
- TanStack Query
- DayJS
- Axios

## Infrastructure & Deployment
- Docker (Multi-stage builds with Alpine images)
- Docker Compose (Local development)
- Railway (Production deployment)
- GitHub Actions (CI/CD)

---

# Project Structure

gic-cafe-employee-manager
```
backend
 ├─ CafeEmployeeManager.sln
 ├─ docker-compose.yml
 └─ src
     ├─ CafeEmployeeManager.Api
     │   ├─ Controllers
     │   └─ Program.cs
     │
     ├─ CafeEmployeeManager.Application
     │   ├─ Cafes
     │   ├─ Employees
     │   └─ Common
     │
     ├─ CafeEmployeeManager.Domain
     │   └─ Entities
     │
     └─ CafeEmployeeManager.Infrastructure
         └─ Persistence

frontend
 └─ src
     ├─ pages
     ├─ components
     ├─ api
     ├─ hooks
     ├─ routes
     └─ utils
```
---

# Backend Architecture

The backend follows **Clean Architecture**:

### Api
- Controllers
- Application startup
- Dependency injection

### Application
- CQRS commands and queries
- MediatR handlers
- Validation

### Domain
- Core business entities
- Domain models

### Infrastructure
- Database access
- Entity Framework configuration
- Seed data

---

# Database Design

The application uses **PostgreSQL** with the following tables.

## Cafe

| Field | Type | Description |
|------|------|-------------|
| id | UUID | Unique café identifier |
| name | string | Café name |
| description | string | Café description |
| logo | string | Optional logo |
| location | string | Café location |

## Employee

| Field | Type | Description |
|------|------|-------------|
| id | string | Employee identifier (UIXXXXXXX) |
| name | string | Employee name |
| email_address | string | Email |
| phone_number | string | Singapore phone number |
| gender | string | Gender |

## EmployeeCafe

| Field | Type | Description |
|------|------|-------------|
| employee_id | string | Employee reference |
| cafe_id | UUID | Café reference |
| start_date | datetime | Employee start date |

Constraint:
- An employee **cannot work in more than one café at the same time**.

---

# API Endpoints

## Cafes

### Get Cafes

GET/cafes?location={location}

Returns cafés sorted by **highest number of employees**.

Response:

{
    "name":"CafeOne",
    "description":"Cozy cafe",
    "employee":"5",
    "logo":null,
    "location":"Orchard",
    "id":"uuid"
}

If:
- location is provided → filter by location
- location is invalid → return empty list
- location not provided → return all cafés

---

### Create Cafe

POST/cafes

Creates a new café.

---

### Update Cafe

PUT/cafes/{id}

Updates an existing café.

---

### Delete Cafe

DELETE/cafes/{id}

Deletes the café and all employees assigned to it.

---

## Employees

### Get Employees

GET/employees?cafe={cafe}

Returns employees sorted by **highest days worked**.

Response:

{ 
    "id": "UIA123456",
    "name": "Daniel",
    "email_address": "daniel@example.com",
    "phone_number": "91234567",
    "days_worked": 30, 
    "cafe": "CafeOne" 
}


Where:
days_worked = current_date - start_date


---

### Create Employee

POST/employees

Creates a new employee and assigns them to a café.

---

### Update Employee

PUT/employees/{id}


Updates employee information and café assignment.

---

### Delete Employee

DELETE/employees/{id}

Deletes an employee.

---

# Running the Application

## Prerequisites

Ensure the following are installed:

- .NET 10 SDK (or later)
- Node.js (v18 or later)
- Docker & Docker Compose

---

## Option 1: Local Development (Docker Compose)

### Navigate to backend directory:

```bash
cd backend
```

### Start PostgreSQL container:

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with credentials from `docker-compose.yml`.

### Apply database migrations:

```bash
dotnet ef database update --project src/CafeEmployeeManager.Infrastructure --startup-project src/CafeEmployeeManager.Api
```

### Run the backend API:

```bash
dotnet run --project src/CafeEmployeeManager.Api
```

The backend API will be available at:
- **API**: http://localhost:5068
- **Swagger**: http://localhost:5068/swagger
- **Health**: http://localhost:5068/health

### In another terminal, run the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:
- **Frontend**: http://localhost:5173

---

## Option 2: Production Docker Build

To build and run the entire system in Docker:

```bash
docker compose up -d --build
```

This will start all services in containerized environments.

---

## Option 3: Deployed on Railway

Access the live application directly:

- **Frontend**: https://gicdigitalplatformeq-production.up.railway.app
- **Backend**: https://gic-backend-production.up.railway.app/api

No setup required—just open in your browser!

---

## Environment Variables

### Backend (Railway)

Required environment variables for production deployment:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=Require
```

CORS is configured to accept requests from:
- `https://gicdigitalplatformeq-production.up.railway.app`
- `http://localhost:*` (for local development)
- Vercel URLs (if `VERCEL_URL` is set)
- Railway frontend URL (if `RAILWAY_FRONTEND_URL` is set)

### Frontend (Vite)

The API base URL is set at build time:

```
VITE_API_BASE_URL=https://gic-backend-production.up.railway.app/api
```

For local development, it defaults to `http://localhost:5068/api`.

---

## Database Migrations

### Create a new migration:

```bash
cd backend
dotnet ef migrations add MigrationName --project src/CafeEmployeeManager.Infrastructure --startup-project src/CafeEmployeeManager.Api
```

### Apply migrations to Railway database:

```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=Require" \
dotnet ef database update --project src/CafeEmployeeManager.Infrastructure --startup-project src/CafeEmployeeManager.Api
```

---

# Features

- ✅ View cafés and employees
- ✅ Assign employees to cafés
- ✅ Filter cafés by location
- ✅ View employees under a café
- ✅ Add / edit cafés on dedicated pages
- ✅ Add / edit employees on dedicated pages
- ✅ Delete records with confirmation
- ✅ Form validation with error messages
- ✅ Unsaved changes warning on add/edit pages
- ✅ **Name validation: 6-10 characters enforced at API level**
- ✅ Responsive UI with Ant Design
- ✅ Sortable data tables with AG Grid

---

# Validation Rules

## Cafe Name
- **Length**: 6-10 characters (required)
- **Enforced**: API level with validation errors

## Employee Name
- **Length**: 6-10 characters (required)
- **Enforced**: API level with validation errors

## Other Fields
- **Email**: Valid email format
- **Phone**: Singapore phone number (8 or 9 digits, starting with 8 or 9)
- **Gender**: Required selection
- **Cafe**: Required assignment (employees must be assigned to a cafe)
- **Location**: Required for cafes
- **Description**: Max 256 characters for cafes

---

# Frontend Pages

## Cafes Page

Displays cafés in a table with:

- Logo
- Name
- Description
- Employees count
- Location
- Edit/Delete actions

Clicking the employees count navigates to the employee page filtered by café.

---

## Employees Page

Displays employees with:

- Employee ID
- Name
- Email
- Phone
- Days worked
- Café
- Edit/Delete actions

---

## Add/Edit Cafe

Form validation:

- **Name**: 6–10 characters (enforced by API)
- **Description**: Optional, max 256 characters
- **Logo**: Optional image upload (max 2MB)
- **Location**: Required
- Cancel returns to the cafes list
- Leaving with unsaved changes prompts for confirmation

## Add/Edit Employee

Validation:

- **Name**: 6–10 characters (enforced by API)
- **Email**: Valid email format required
- **Phone**: Singapore phone number (8 or 9 digits)
- **Gender**: Required selection
- **Cafe**: Required assignment (cannot be unassigned)
- Cancel returns to the employees list
- Leaving with unsaved changes prompts for confirmation

---

# CI/CD Pipeline

GitHub Actions CI is configured at `.github/workflows/ci.yml` and runs on push to `main` and pull requests.

Checks included:

- Backend restore and release build (.NET 10)
- Frontend dependency install (`npm ci`)
- Frontend lint (`npm run lint`)
- Frontend production build (`npm run build`)

---

# Deployment on Railway

The application is deployed on Railway with automatic deployments on git push to main:

## Services

1. **PostgreSQL Database**: Managed PostgreSQL 18.3 instance
2. **Backend API**: ASP.NET Core service on port 8080
3. **Frontend**: React/Nginx service on port 80

## Deployment Flow

1. Push to `main` branch → GitHub Actions CI runs
2. If CI passes → Railway auto-deploys
3. Backend rebuilds with latest code
4. Frontend rebuilds with updated environment variables
5. Database migrations run automatically on backend startup

## Docker Images

- **Backend**: Multi-stage Alpine build (SDK → Runtime) ~200MB
- **Frontend**: Node.js builder → Nginx Alpine ~50MB

Both use lightweight Alpine images for faster deployments.

---

# Troubleshooting

## Backend won't start

Check the Railway logs:
```bash
# View logs in Railway dashboard or use Railway CLI
railway logs backend
```

Common issues:
- DATABASE_URL not set → Check environment variables in Railway dashboard
- Port already in use → Change the exposed port in backend Dockerfile
- Migrations failed → Run migrations manually with `DATABASE_URL` environment variable

## Frontend shows blank page

- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Check browser console for errors (F12)
- Verify `VITE_API_BASE_URL` is correctly set to backend URL

## CORS errors

Ensure the frontend URL is in the CORS allowed origins list in `Program.cs`. Railway frontend URL is already configured.

## Database connection errors

Verify the `DATABASE_URL` format:
```
postgresql://user:password@host:port/database?sslmode=Require
```

Note: SSL mode is required for Railway PostgreSQL connections.

---

# Development Notes

## Adding new features

1. Create a new command/query in Application layer
2. Implement handler with business logic
3. Add controller endpoint
4. Add frontend API client and React component
5. Test locally with `docker compose up -d`
6. Push to main for Railway auto-deployment

## Code Structure

- **API Layer**: Controllers handle HTTP requests
- **Application Layer**: CQRS commands/queries with MediatR
- **Domain Layer**: Core entities and business rules
- **Infrastructure Layer**: EF Core, database context, migrations

---

# Author

Russell Bryan

Created: 2026-03-17
