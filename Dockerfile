FROM node:20-slim

WORKDIR /app

# Copy package.json dan install production deps
COPY apps/api/package.json ./
RUN npm install --omit=dev

# Copy prisma schema
COPY apps/api/prisma ./prisma/

# Copy pre-built dist
COPY apps/api/dist ./dist/

# Expose port
EXPOSE 4000

# Start app
CMD ["node", "dist/main.js"]
