# app/Dockerfile

FROM node:20-alpine

WORKDIR /app

# 1) Installer les dépendances
COPY package*.json ./
RUN npm install

# 2) Copier le reste du code
COPY . .

# 3) Build (pour prod) – tu peux commenter en dev
RUN npm run build

EXPOSE 3000

# 4) Commande par défaut
CMD ["npm", "run", "start"]
