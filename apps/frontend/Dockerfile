# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
RUN npm install -g pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
RUN npm install -g pnpm
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build shared package first
RUN pnpm turbo run build --filter=@sellyourwine/shared

# Build frontend
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm turbo run build --filter=@sellyourwine/frontend

# Runtime stage with nginx
FROM nginx:alpine AS runner

# Copy built app
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Add healthcheck
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]