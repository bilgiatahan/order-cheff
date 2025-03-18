QR Kod ile Dijital Menu Sistemi

📌 Proje Tanımı

Bu proje, hizmet sektöründeki işletmecilerin menülerini QR kod ile dijital ortama taşımasını sağlayan bir sistemdir. İşletmeler, kendi özel subdomain'leri üzerinden menülerini yönetebilir ve sınırsız ürün ekleyebilir. Sistemin en önemli özellikleri arasında görsel optimizasyonu, subdomain bazlı müşteri yönetimi ve ölçeklenebilir bir yapı bulunmaktadır.

📋 Gereksinim Analizi

Genel Gereksinimler

✅ Subdomain Yönetimi:

Her müşteri için cacaoroute-ordercheff.com gibi özel bir subdomain atanmalı.

\*.ordercheff.com için wildcard DNS yapılandırması yapılmalı.

Backend, gelen subdomain'i algılayarak ilgili işletmenin verilerini sunmalı.

✅ Dijital Menü Yönetimi:

İşletmeler sınırsız ürün ekleyebilmeli.

Ürünlere görsel ve kategori bazlı filtreleme desteği sağlanmalı.

QR kod üzerinden doğrudan menüye erişim sağlanmalı.

✅ Görsel Optimizasyonu:

Yüklenen görseller otomatik optimize edilmeli.

Cloudinary veya AWS S3 gibi bir servis kullanılmalı.

WebP formatı ve lazy-loading desteklenmeli.

✅ Ölçeklenebilirlik ve Maliyet Optimizasyonu:

Başlangıçta düşük maliyetli bir yapı ile kurulmalı.

Kullanıcı ve trafik arttıkça veri tabanı, API ve hosting ölçeklenebilir olmalı.

CDN (Cloudflare veya AWS CloudFront) kullanılmalı.

Teknik Gereksinimler

✅ Frontend:

Teknoloji: Next.js

Hosting: Vercel veya AWS S3 + CloudFront

QR Kod Üretimi: qrcode npm paketi veya Firebase

✅ Backend:

Teknoloji: NestJS

Veritabanı: MongoDB Atlas (tenant bazlı veri yönetimi)

Subdomain Algılama: req.headers.host üzerinden yapılmalı

API Geliştirme: REST veya GraphQL

✅ Veri Yönetimi:

Tek veritabanında tenant bazlı ayrım yapılmalı (her işletmenin verisi tenant alanıyla saklanmalı).

Alternatif olarak her müşteri için ayrı veritabanı kullanılabilir (ancak maliyetli olur).

✅ Hosting & Yönlendirme:

Wildcard DNS Yönetimi: Cloudflare veya AWS Route 53

Reverse Proxy: NGINX veya Vercel rewrites

CDN & Cache: Cloudflare veya AWS CloudFront
