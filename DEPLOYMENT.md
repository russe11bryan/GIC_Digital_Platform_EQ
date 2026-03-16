# Railway Deployment Guide

This application has a frontend (React/Vite) and backend (ASP.NET Core) that need to be deployed separately on Railway.

## Setup Steps

### 1. Create PostgreSQL Database Service
1. Go to your Railway project
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will automatically create environment variables
4. Note the connection details - you'll need these for the backend

### 2. Deploy Backend Service
1. Click "New" → "GitHub Repo"
2. Select your repository
3. In the service settings:
   - **Root Directory**: `backend`
   - **Dockerfile**: `./Dockerfile` (relative to backend directory)
4. Configure environment variables:
   ```
   ConnectionStrings__DefaultConnection=postgresql://<username>:<password>@<host>:<port>/<database>
   ```
   - You can get these from the PostgreSQL service Railway created
   - OR use the `DATABASE_URL` that Railway provides

5. Under "Networking" → "Public Networking" (if you want it public)

### 3. Deploy Frontend Service
1. Click "New" → "GitHub Repo"
2. Select your repository
3. In the service settings:
   - **Root Directory**: (empty - use root Dockerfile)
   - **Dockerfile**: `./Dockerfile`
4. Configure environment variables:
   ```
   VITE_API_BASE_URL=https://<backend-service-url>/api
   ```
   - Get the backend service URL from Railway (e.g., `https://backend-service-prod.railway.app/api`)

### 4. Link Database to Backend
1. Go to your Backend service
2. Click "Variables"
3. Add the PostgreSQL connection string
4. OR click the PostgreSQL service and Railway will auto-link it

### 5. Deploy Migrations
Once the backend is running:
```bash
cd backend
dotnet ef database update --project src/CafeEmployeeManager.Infrastructure --startup-project src/CafeEmployeeManager.Api
```

Or add a migration command as a startup hook in Railway.

## Environment Variables Needed

### Backend Service
- `ConnectionStrings__DefaultConnection` - PostgreSQL connection string
- Or just `DATABASE_URL` if using Railway's PostgreSQL

### Frontend Service
- `VITE_API_BASE_URL` - Full URL to backend API (e.g., `https://your-backend.railway.app/api`)

## Troubleshooting

### Frontend shows 404 or API errors
- Check that `VITE_API_BASE_URL` is set correctly
- Verify it points to the backend service URL
- Check CORS settings in backend's `Program.cs`

### Backend can't connect to database
- Verify `ConnectionStrings__DefaultConnection` is correct
- Check PostgreSQL service is running and linked
- Run migrations after deploying

### Port Issues
- Frontend expects to run on port 80 (nginx)
- Backend expects to run on port 8080 (ASP.NET)
- Railway will expose these automatically
