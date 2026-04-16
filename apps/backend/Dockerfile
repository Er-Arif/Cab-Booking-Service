FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/admin_web/package.json apps/admin_web/package.json
COPY packages/shared-config/package.json packages/shared-config/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json

RUN npm install

COPY . .

RUN npm --workspace apps/backend run build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/backend/package.json apps/backend/package.json
COPY --from=builder /app/packages/shared-config/package.json packages/shared-config/package.json
COPY --from=builder /app/packages/shared-types/package.json packages/shared-types/package.json

RUN npm install --omit=dev

COPY --from=builder /app/apps/backend/dist apps/backend/dist
COPY --from=builder /app/packages/shared-config/src packages/shared-config/src
COPY --from=builder /app/packages/shared-types/src packages/shared-types/src
COPY --from=builder /app/database database

WORKDIR /app/apps/backend

EXPOSE 4000

CMD ["node", "dist/server.js"]
