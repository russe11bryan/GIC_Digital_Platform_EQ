# Railway Deployment Guide

This application consists of:
- **Frontend**: React/Vite app served by nginx on port 80
- **Backend**: ASP.NET Core API on port 8080
- **Database**: PostgreSQL

## Architecture on Railway

You need to create 3 services on Railway:

```
┌─────────────────────────────────────────────┐
│         Railway Project                     │
├─────────────────────────────────────────────┤
│  1. PostgreSQL (Database)                   │
│  2. Backend API (GIC Repo - /backend)       │
│  3. Frontend (GIC Repo - root)              │
└─────────────────────────────────────────────┘
```

## Step-by-Step Setup

### 1. PostgreSQL Database (Already Done ✓)
- Service Name: `postgresql`
- You already have the connection string:
  ```
  postgresql://postgres:VItaTchynfrzGHrAtxjoQsdODHYONMRz@maglev.proxy.rlwy.net:23295/railway
  ```

### 2. Backend API Service

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select your repository: `GIC_Digital_Platform_EQ`
3. Configure:
   - **Service Name**: `backend-api` (or any name)
   - **Root Directory**: `backend`
   - **Dockerfile**: `./Dockerfile` (default)

4. Go to **Variables** tab and add:
   ```
   DATABASE_URL=postgresql://postgres:VItaTchynfrzGHrAtxjoQsdODHYONMRz@maglev.proxy.rlwy.net:23295/railway
   ASPNETCORE_ENVIRONMENT=Production
   ```

5. Under **Networking**:
   - Enable "Public Networking" if you want external access
   - Note the service URL (e.g., `https://backend-api-prod.railway.app`)

6. Deploy and wait for it to complete

### 3. Frontend Service

**In Railway Dashboard:**
1. Click **"New"** → **"GitHub Repo"**
2. Select your repository: `GIC_Digital_Platform_EQ`
3. Configure:
   - **Service Name**: `frontend` (or any name)
   - **Root Directory**: (leave empty or set to `.`)
   - **Dockerfile**: `./Dockerfile` (root level)

4. Go to **Variables** tab and add:
   ```
   VITE_API_BASE_URL=https://<backend-api-service-url>/api
   ```
   
   Replace `<backend-api-service-url>` with your backend URL from step 2
   
   Example:
   ```
   VITE_API_BASE_URL=https://backend-api-prod.railway.app/api
   ```

5. Under **Networking**:
   - Enable "Public Networking"
   - This will be your main application URL

6. Deploy and wait for it to complete

## Environment Variables Summary

### Backend Service (`DATABASE_URL`)
```
DATABASE_URL=postgresql://postgres:VItaTchynfrzGHrAtxjoQsdODHYONMRz@maglev.proxy.rlwy.net:23295/railway
```

### Frontend Service (`VITE_API_BASE_URL`)
```
VITE_API_BASE_URL=https://backend-api-prod.railway.app/api
```

## Testing

Once deployed:

1. **Frontend URL**: `https://<your-frontend-url>`
   - You should see the React app
   
2. **Backend Health Check**: `https://<your-backend-url>/health`
   - Should return: `{"status":"healthy","timestamp":"2026-03-16T..."}`

3. **Backend API**: `https://<your-backend-url>/api/cafes`
   - Should return cafe data (after migrations run)

## Troubleshooting

### Frontend shows 502 error
- Check nginx logs in the Frontend service deployment logs
- Verify `VITE_API_BASE_URL` is correct
- Ensure the Dockerfile exists in root

### Backend won't start
- Check `DATABASE_URL` is correct
- Look for migration errors in logs
- Verify PostgreSQL service is running and accessible

### Frontend can't reach backend API
- Verify `VITE_API_BASE_URL` matches your backend service URL exactly
- Check CORS settings in `Program.cs`
- Ensure backend is publicly accessible

### Database tables are missing
- Backend should auto-run migrations on startup
- Check backend logs for migration output
- If migrations fail, manually run:
  ```bash
  cd backend
  dotnet ef database update --project src/CafeEmployeeManager.Infrastructure --startup-project src/CafeEmployeeManager.Api
  ```

## Local Development

To test locally before deploying:

```bash
# Terminal 1: Start database
cd backend
docker compose up -d

# Terminal 2: Start backend
cd backend
dotnet run --project src/CafeEmployeeManager.Api

# Terminal 3: Start frontend
cd frontend
npm run dev
```

Frontend will be at `http://localhost:5173`
Backend will be at `http://localhost:5068`

