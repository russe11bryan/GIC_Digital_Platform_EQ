# Build backend API
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS backend-build
WORKDIR /src

COPY backend/CafeEmployeeManager.slnx ./
COPY backend/src/CafeEmployeeManager.Api/CafeEmployeeManager.Api.csproj ./src/CafeEmployeeManager.Api/
COPY backend/src/CafeEmployeeManager.Application/CafeEmployeeManager.Application.csproj ./src/CafeEmployeeManager.Application/
COPY backend/src/CafeEmployeeManager.Domain/CafeEmployeeManager.Domain.csproj ./src/CafeEmployeeManager.Domain/
COPY backend/src/CafeEmployeeManager.Infrastructure/CafeEmployeeManager.Infrastructure.csproj ./src/CafeEmployeeManager.Infrastructure/

RUN dotnet restore CafeEmployeeManager.slnx

COPY backend/src ./src
RUN dotnet publish ./src/CafeEmployeeManager.Api/CafeEmployeeManager.Api.csproj -c Release -o /app/publish

# Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend . .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Final stage - serve frontend with nginx and backend with reverse proxy
FROM nginx:1.27-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
