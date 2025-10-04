# Multi-stage Dockerfile for Teams Clone
FROM node:18-alpine AS backend-build

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src
COPY backend/.env ./backend/

# Frontend build stage
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy frontend files
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine

# Install serve for frontend
RUN npm install -g serve

# Create app directory
WORKDIR /app

# Copy backend from build stage
COPY --from=backend-build /app/backend ./backend

# Copy frontend build from build stage
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy ecosystem config
COPY ecosystem.config.js ./

# Install PM2 globally
RUN npm install -g pm2

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S teams -u 1001

# Change ownership of the app directory to the node user
RUN chown -R teams:nodejs /app
USER teams

# Expose ports
EXPOSE 3001 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]