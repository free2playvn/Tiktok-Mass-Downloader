# Multi-stage Dockerfile for TMD Studio Pro v3.2 AI
FROM node:20-bullseye-slim

# Install system dependencies including FFmpeg and curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    python3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for cached dependency layer
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Ensure output directory exists with proper permissions
RUN mkdir -p output

# Expose web port
EXPOSE 3000

# Healthcheck to ensure server responds
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/status || exit 1

# Start production server
CMD ["node", "server.js"]
