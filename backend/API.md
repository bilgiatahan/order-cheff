# Order-Cheff API Dokümantasyonu

## Tenant (İşletme) Endpoint'leri

### Tenant Oluşturma

```bash
curl -X POST http://localhost:3000/tenants \
-H "Content-Type: application/json" \
-d '{
  "subdomain": "test-restaurant",
  "businessName": "Test Restaurant",
  "email": "test@restaurant.com",
  "phone": "5551234567",
  "description": "Test Restaurant Description",
  "address": "Test Address",
  "settings": {
    "theme": "light",
    "currency": "TRY",
    "language": "tr"
  }
}'
```

### Tüm Tenant'ları Listeleme

```bash
curl http://localhost:3000/tenants
```

### Subdomain ile Tenant Bulma

```bash
curl http://localhost:3000/tenants/subdomain/{subdomain}
```

## Menü Endpoint'leri

Not: Menü endpoint'leri için `x-tenant-id` header'ı gereklidir.

### Mock Data Oluşturma

```bash
curl -X POST http://localhost:3000/menu/mock-data
```

### Tüm Menü Öğelerini Listeleme

```bash
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/menu
```

### Kategoriye Göre Menü Öğelerini Listeleme

```bash
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/menu/category/Burgerler
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/menu/category/Pizzalar
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/menu/category/Salatalar
curl -H "x-tenant-id: {TENANT_ID}" "http://localhost:3000/menu/category/İçecekler"
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/menu/category/Tatlılar
```

## Kategori Endpoint'leri

### Tüm Kategorileri Listeleme

```bash
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/categories
```

### Kategori Oluşturma

```bash
curl -X POST http://localhost:3000/categories \
-H "Content-Type: application/json" \
-H "x-tenant-id: {TENANT_ID}" \
-d '{
  "name": "Yeni Kategori",
  "description": "Kategori açıklaması",
  "order": 1
}'
```

## Ürün Endpoint'leri

### Tüm Ürünleri Listeleme

```bash
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/products
```

### Kategoriye Göre Ürünleri Listeleme

```bash
curl -H "x-tenant-id: {TENANT_ID}" http://localhost:3000/products?categoryId={CATEGORY_ID}
```

### Ürün Oluşturma

```bash
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-H "x-tenant-id: {TENANT_ID}" \
-d '{
  "name": "Yeni Ürün",
  "description": "Ürün açıklaması",
  "price": 100,
  "categoryId": "{CATEGORY_ID}",
  "preparationTime": 15,
  "nutritionInfo": {
    "calories": 500,
    "protein": 20,
    "carbs": 30,
    "fat": 25
  },
  "allergens": ["Gluten", "Süt"]
}'
```

## Önemli Notlar

1. `{TENANT_ID}`, `{CATEGORY_ID}` gibi değerleri kendi değerlerinizle değiştirmelisiniz.
2. Çoğu endpoint için `x-tenant-id` header'ı gereklidir.
3. Resim yükleme gerektiren endpoint'ler için `-F "image=@dosya_yolu.jpg"` parametresini eklemeniz gerekir.
4. Tüm tarihler UTC formatındadır.

## Hata Kodları

- 200: Başarılı
- 201: Başarıyla Oluşturuldu
- 400: Hatalı İstek
- 401: Yetkisiz Erişim
- 404: Bulunamadı
- 500: Sunucu Hatası
