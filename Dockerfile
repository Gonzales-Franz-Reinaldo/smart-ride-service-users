# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm install --production=false && \
    npm cache clean --force

# ========================================
# Stage 2: Build
# ========================================
FROM node:24-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig*.json ./

COPY src ./src

RUN npm run build

# ========================================
# Stage 3: Production
# ========================================
FROM node:24-alpine AS production

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./

RUN mkdir -p /app/logs && \
    chown -R nestjs:nodejs /app/logs && \
    chmod -R 755 /app/logs

USER nestjs

EXPOSE 3001

ENV NODE_ENV=production \
    PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/main.js"]