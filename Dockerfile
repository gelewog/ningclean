FROM node:20-slim

# Install OpenSSL untuk Prisma
RUN apt-get update -y
RUN apt-get install -y openssl
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/

# Copy API package files
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY apps/api ./apps/api/

# Debug: Check if DTO files exist
RUN ls -la /app/apps/api/src/team-members/dto/
RUN ls -la /app/apps/api/src/testimonials/dto/

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Build API
WORKDIR /app/apps/api
RUN npx nest build

# Start
WORKDIR /app
ENV NODE_ENV=production
CMD ["./start.sh"]
