# ---------- BUILDER IMAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci

# Copier le reste
COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build


# ---------- RUNNER IMAGE ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copier uniquement ce qui est nécessaire pour exécuter
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]

