FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/admin_web/package.json apps/admin_web/package.json
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared-config/package.json packages/shared-config/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json

RUN npm install

COPY . .

RUN npm --workspace apps/admin_web run build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/admin_web/package.json apps/admin_web/package.json
COPY --from=builder /app/packages/shared-config/package.json packages/shared-config/package.json
COPY --from=builder /app/packages/shared-types/package.json packages/shared-types/package.json

RUN npm install --omit=dev

COPY --from=builder /app/apps/admin_web/.next apps/admin_web/.next
COPY --from=builder /app/apps/admin_web/app apps/admin_web/app
COPY --from=builder /app/apps/admin_web/components apps/admin_web/components
COPY --from=builder /app/apps/admin_web/lib apps/admin_web/lib
COPY --from=builder /app/apps/admin_web/next.config.js apps/admin_web/next.config.js
COPY --from=builder /app/apps/admin_web/next-env.d.ts apps/admin_web/next-env.d.ts
COPY --from=builder /app/apps/admin_web/tsconfig.json apps/admin_web/tsconfig.json
COPY --from=builder /app/packages/shared-config/src packages/shared-config/src
COPY --from=builder /app/packages/shared-types/src packages/shared-types/src

WORKDIR /app/apps/admin_web

EXPOSE 3000

CMD ["npm", "run", "start"]
