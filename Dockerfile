# Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

# Build with API base URL - use arg with default fallback
ARG VITE_API_BASE_URL=https://gic-backend-production.up.railway.app/api

RUN VITE_API_BASE_URL=${VITE_API_BASE_URL} npm run build

# Final stage - serve frontend with nginx
FROM nginx:1.27-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend build to nginx html directory
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Verify files are present
RUN ls -la /usr/share/nginx/html/ && test -f /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
