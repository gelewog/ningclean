FROM node:20-slim

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Create symlink untuk prisma client
RUN ln -sf /app/prisma/node_modules/.prisma/client /app/node_modules/.prisma/client 2>/dev/null || true

# Build NestJS
RUN npm run build

# Expose port
EXPOSE 4000

# Start app
CMD ["npm", "run", "start:prod"]
