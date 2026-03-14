# Cafe Employee Manager

A full-stack web application for managing cafés and their employees.

This project was developed as part of a technical assessment. The system allows users to manage cafés and employees, assign employees to cafés, and track how long employees have worked at a specific café.

The backend follows **Clean Architecture principles**, implements **CQRS with MediatR**, and exposes **RESTful APIs**. The frontend is built with **React**, using **Ant Design** and **AG Grid** for UI components.

---

# Tech Stack

## Backend
- .NET 8 (ASP.NET Core Web API)
- CQRS Pattern
- MediatR
- Entity Framework Core
- PostgreSQL
- Autofac (Dependency Injection)
- Docker

## Frontend
- React (Vite)
- Ant Design
- AG Grid
- TanStack Query
- DayJS
- Axios

## Infrastructure
- Docker
- Docker Compose

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

PUT/cafes

Updates an existing café.

---

### Delete Cafe

DELETE/cafes

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

GET/employees

Creates a new employee and assigns them to a café.

---

### Update Employee

PUT/employees


Updates employee information and café assignment.

---

### Delete Employee

DELETE/employees

Deletes an employee.

---

# Running the Application

## Prerequisites

Ensure the following are installed:

- .NET 8 SDK
- Node.js
- Docker
- Docker Compose

---

# Backend Setup

### Navigate to backend directory:

cd backend

### Start PostgreSQL container:

docker compose up -d

### Create database migration:

dotnet ef migrations add InitialCreate
--project src/CafeEmployeeManager.Infrastructure
--startup-project src/CafeEmployeeManager.Api

### Run the API:

dotnet run --project src/CafeEmployeeManager.Api

### Swagger will be available at:

http://localhost:5000/swagger

---

# Frontend Setup

### Navigate to frontend:

cd frontend

### Install dependencies:

npm install

### Run the development server:

npm run dev

### Frontend will run at:

http://localhost:5173

---

# Docker Deployment

To run the entire system (PostgreSQL + API + Frontend):

cd gic-cafe-employee-manager
docker compose up -d --build

This will start:

- Backend API
- PostgreSQL
- Frontend

Containerized endpoints:

- Frontend: `http://localhost:5180`
- Backend API: `http://localhost:5068`
- PostgreSQL: `localhost:5432`

Quick smoke checks:

- `curl http://localhost:5068/api/cafes`
- `curl http://localhost:5180/health`

To stop all services:

- `docker compose down`

---

# Features

- View cafés and employees
- Assign employees to cafés
- Filter cafés by location
- View employees under a café
- Add / edit cafés
- Add / edit employees
- Delete records with confirmation
- Form validation

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

Clicking employees navigates to employee page.

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

- Name: 6–10 characters
- Description: max 256 characters
- Logo: max 2MB
- Location required

---

## Add/Edit Employee

Validation:

- Name: 6–10 characters
- Valid email format
- Singapore phone number (starts with 8 or 9)
- Gender required
- Café selection required

---

# Seed Data

The database is seeded with sample cafés and employees during application startup.

---

# CI Pipeline (Day 7)

GitHub Actions CI is configured at `.github/workflows/ci.yml` and runs on push to `main` and pull requests.

Checks included:

- Backend restore and release build (`.NET 10`)
- Frontend dependency install (`npm ci`)
- Frontend lint (`npm run lint`)
- Frontend production build (`npm run build`)

---

# Future Improvements

- Authentication and authorization
- Image upload for café logos
- Pagination for large datasets
- Unit and integration tests

---

# Author

Russell Bryan
