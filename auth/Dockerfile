# ─── Stage 1: Builder ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Install bun for package management
RUN npm install -g bun

WORKDIR /app

# Copy manifests first for better layer caching
COPY package.json bun.lock ./

# Install ALL dependencies (including devDependencies needed for tsc)
RUN bun install --frozen-lockfile

# Copy source and compile TypeScript → dist/
COPY tsconfig.json ./
COPY src ./src
RUN bunx tsc

# ─── Stage 2: Runner ────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Install bun for package management
RUN npm install -g bun

# Copy manifests and install production dependencies only
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Non-root user for security
USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]