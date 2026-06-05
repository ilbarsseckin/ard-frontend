import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/hesabim/', '/odeme/', '/sepet/'],
      },
    ],
    sitemap: 'https://baskiurunleri.com/sitemap.xml',
  }
}
