FROM node:20-slim

WORKDIR /app

# Install dependencies at root level
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --prefix .

# Copy prisma schema
COPY prisma ./prisma/

# Copy source
COPY apps/api ./apps/api/

# Build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# Start
WORKDIR /app
CMD ["node", "apps/api/dist/main.js"]