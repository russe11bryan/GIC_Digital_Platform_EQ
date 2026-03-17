# Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

# Set API base URL - default to production backend
ENV VITE_API_BASE_URL=https://gic-backend-production.up.railway.app/api

RUN npm run build && echo "Build completed successfully" && ls -la dist/

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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
