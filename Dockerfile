FROM node:20-alpine AS base
WORKDIR /app
# libc6-compat: native modules (sharp, bcrypt)
# openssl: lets Prisma detect OpenSSL 3.x — without it Prisma defaults to 1.1 which is missing on modern Alpine
RUN apk add --no-cache libc6-compat openssl

# ── Stage 1: All deps (build + prisma CLI tools) ────────────────────────────
FROM base AS all-deps
COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build ───────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=all-deps /app/node_modules ./node_modules
COPY . .
# Placeholder values satisfy NextAuth + Prisma at build time — real values come from .env at runtime
RUN DATABASE_URL="postgresql://build:build@localhost/build" \
    NEXTAUTH_SECRET="build-placeholder-secret" \
    NEXTAUTH_URL="http://localhost:3000" \
    npm run build

# ── Stage 3: Minimal production runner ──────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma schema + full CLI for running migrations at startup.
# Copy the entire @prisma scope — the CLI pulls in @prisma/debug, @prisma/internals,
# @prisma/migrate, etc. Copying only @prisma/engines leaves those missing.
COPY --from=builder /app/prisma ./prisma
COPY --from=all-deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=all-deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=all-deps /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
