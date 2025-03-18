FROM node:18-alpine

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install --production

# Uygulama kodunu kopyala
COPY . .

# Uygulamayı derle
RUN npm run build

# Çevre değişkenlerini tanımla
ENV NODE_ENV=production
ENV PORT=3000

# Portu aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "dist/main.js"] 