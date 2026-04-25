FROM node:20-slim

WORKDIR /app

# Copy package.json dan install production deps
COPY package.json ./
RUN npm install --omit=dev

# Copy prisma schema
COPY prisma ./prisma/

# Copy pre-built dist
COPY dist ./dist/

# Expose port
EXPOSE 4000

# Start app
CMD ["node", "dist/main.js"]
