# BaskıPro Frontend

Next.js 14 + TypeScript + Tailwind CSS ile geliştirilmiş baskı şirketi web uygulaması.

## Kurulum

```bash
npm install
npm run dev
```

## Ortam değişkenleri

`.env.local` dosyasını oluşturun:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Sayfalar

| Sayfa | Açıklama |
|---|---|
| `/` | Ana sayfa |
| `/urunler` | Ürün kataloğu |
| `/siparis` | Sipariş wizard formu |
| `/sepet` | Sepet ve ödeme |
| `/giris` | Giriş |
| `/kayit` | Kayıt |
| `/hesabim` | Sipariş takibi |

## Backend bağlantısı

Backend Spring Boot `localhost:8080`'de çalışmalı.
