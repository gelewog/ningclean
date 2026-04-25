FROM node:20-slim

WORKDIR /app

# Install OpenSSL untuk Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy root package files
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy prisma schema dari root
COPY prisma ./prisma/

# Copy source code API
COPY apps/api ./apps/api/

# Generate Prisma Client
RUN npx prisma generate

# Build the API
RUN cd apps/api && npm run build

# Expose port
EXPOSE 4000

# Start app
CMD ["node", "apps/api/dist/main.js"]
