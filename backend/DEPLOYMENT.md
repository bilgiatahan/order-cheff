# Backend Deployment Kılavuzu

Bu belge, OrderCheff backend uygulamasının farklı ortamlarda nasıl deploy edileceğini açıklar.

## 1. Docker ile Deployment

### Ön Koşullar

- Docker yüklü olmalı
- Docker Compose yüklü olmalı

### Adımlar

#### 1.1. Docker image oluşturma

```bash
npm run docker:build
```

#### 1.2. Docker container çalıştırma

```bash
npm run docker:run
```

#### 1.3. Docker Compose ile çalıştırma

Ana dizinde:

```bash
docker-compose up -d
```

#### 1.4. Docker imajını registry'ye gönderme (opsiyonel)

```bash
npm run docker:push
```

## 2. PM2 ile Deployment (Direkt Sunucu Üzerinde)

### Ön Koşullar

- Node.js (v18+) yüklü olmalı
- PM2 global olarak yüklü olmalı (`npm install -g pm2`)

### Adımlar

#### 2.1. Uygulamayı derle

```bash
npm run build
```

#### 2.2. PM2 ile başlat

```bash
npm run pm2:start
```

#### 2.3. Diğer PM2 komutları

- Yeniden başlatma: `npm run pm2:restart`
- Durdurma: `npm run pm2:stop`
- Silme: `npm run pm2:delete`
- Logları izleme: `npm run pm2:logs`
- Durum görüntüleme: `npm run pm2:status`

## 3. Heroku ile Deployment

### Ön Koşullar

- Heroku CLI yüklü olmalı
- Heroku hesabı olmalı

### Adımlar

#### 3.1. Heroku uygulaması oluştur

```bash
heroku create ordercheff-backend
```

#### 3.2. Çevresel değişkenleri ayarla

```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set CLOUDINARY_CLOUD_NAME=ORDERCHEFF
heroku config:set CLOUDINARY_API_KEY=747125696852236
heroku config:set CLOUDINARY_API_SECRET=zRvdtjZrqWhKWo0wPsU13CjMiHw
heroku config:set NODE_ENV=production
```

#### 3.3. Deploy et

```bash
git push heroku main
```

## 4. AWS EC2 Deployment

### Ön Koşullar

- AWS hesabı
- EC2 instance (Ubuntu önerilir)
- SSH erişimi

### Adımlar

#### 4.1. Node.js kurulumu

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4.2. PM2 kurulumu

```bash
npm install -g pm2
```

#### 4.3. Kodu sunucuya kopyala

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend
```

#### 4.4. Bağımlılıkları yükle ve derle

```bash
npm install
npm run build
```

#### 4.5. Çevresel değişkenleri ayarla

```bash
cp .env.example .env.production
# .env.production dosyasını düzenle
```

#### 4.6. PM2 ile başlat

```bash
npm run pm2:start
```

#### 4.7. PM2'yi sistem başlangıcında başlatılacak şekilde yapılandır

```bash
pm2 startup
pm2 save
```

## 5. Subdomain Yapılandırması

### Cloudflare ile Wildcard DNS Yapılandırması

1. Cloudflare hesabı oluştur
2. Domain'i Cloudflare'e ekle
3. DNS ayarlarından yeni bir wildcard kaydı ekle: `*.ordercheff.com` -> Backend sunucunun IP adresi

### NGINX ile Reverse Proxy (EC2 veya VPS için)

```nginx
server {
    listen 80;
    server_name *.ordercheff.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 6. SSL Sertifikası (HTTPS)

### Let's Encrypt / Certbot ile HTTPS

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d *.ordercheff.com -d ordercheff.com
```

### Cloudflare ile SSL

1. Cloudflare SSL/TLS bölümünden "Full" veya "Full (strict)" modunu seç
2. Edge sertifikaları kısmından wildcard sertifikasını etkinleştir

## 7. Sık Karşılaşılan Sorunlar ve Çözümleri

### Docker'da MongoDB bağlantı hatası

- Docker container'ı ayrı bir network'te çalıştığı için localhost yerine tam MongoDB URI kullanın.

### PM2 başlatma hatası

- Önce `npm run build` ile uygulamayı derleyin
- dist/ klasörünün oluştuğunu kontrol edin
- İzinlerin doğru olduğunu kontrol edin

### Subdomain algılama problemi

- `hosts` dosyasını test için düzenleyin:
  ```
  127.0.0.1 mystore.ordercheff.com
  ```
