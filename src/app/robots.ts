import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baskiurunleri.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/hesabim/',
          '/hesabim',
          '/sepet/',
          '/sepet',
          '/odeme/',
          '/odeme',
          '/odeme-katalog/',
          '/odeme-katalog',
          '/giris/',
          '/giris',
          '/kayit/',
          '/kayit',
          '/ayarlar/',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
