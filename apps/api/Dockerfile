FROM node:20-slim

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (pakai npm install, bukan npm ci)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client dan build
RUN npx prisma generate && npm run build

# Expose port
EXPOSE 4000

# Start app
CMD ["npm", "run", "start:prod"]
