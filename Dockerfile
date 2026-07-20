# Build stage
FROM node:18-slim AS builder
WORKDIR /app

# Install build dependencies for native modules (like better-sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install run-time build requirements if needed (better-sqlite3 needs them sometimes to load)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
RUN mkdir -p data

# Expose port 3000
EXPOSE 3000

CMD ["npm", "start"]
