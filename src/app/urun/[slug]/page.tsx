import type { Metadata } from 'next'
import { UrunDetayClient } from './UrunDetayClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baskiurunleri.com'

interface Props {
  params: { slug: string }
}

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/catalog/products/${slug}`, {
      next: { revalidate: 3600 }, // 1 saatte bir yenile
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as {
      name: string
      shortDesc?: string
      longDesc?: string
      categoryName: string
      categorySlug: string
      brandName?: string
      images?: Array<{ url: string; altText?: string }>
      tiers?: Array<{ priceUsd: number; qty: number }>
    }
  } catch {
    return null
  }
}

async function fetchSettings() {
  try {
    const res = await fetch(`${API_URL}/api/settings/public`, {
      next: { revalidate: 3600 },
    })
    const json = await res.json()
    return json.data as { usd_kur?: string }
  } catch {
    return { usd_kur: '45' }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [product, settings] = await Promise.all([
    fetchProduct(params.slug),
    fetchSettings(),
  ])

  if (!product) {
    return {
      title: 'Ürün Bulunamadı | baskıurunleri.com',
      robots: { index: false },
    }
  }

  const kur = parseFloat(settings.usd_kur || '45')
  const minTier = product.tiers?.sort((a, b) => a.priceUsd - b.priceUsd)[0]
  const priceTl = minTier ? Math.round(minTier.priceUsd * kur * 1.2) : null // KDV dahil

  const title = `${product.name} | baskıurunleri.com`
  const description = product.shortDesc
    ? `${product.shortDesc}${priceTl ? ` ₺${priceTl.toLocaleString('tr-TR')}'den başlayan fiyatlarla.` : ''} Hızlı teslimat, kaliteli baskı.`
    : `${product.name} — ${product.categoryName} kategorisinde profesyonel baskı çözümleri. Türkiye'nin hızlı online matbaası.`

  const ogImage = product.images?.[0]?.url

  const canonical = `${SITE_URL}/urun/${params.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'baskıurunleri.com',
      locale: 'tr_TR',
      type: 'website',
      ...(ogImage && {
        images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function UrunDetayPage({ params }: Props) {
  // JSON-LD için ürün verisini server'da çekiyoruz
  const [product, settings] = await Promise.all([
    fetchProduct(params.slug),
    fetchSettings(),
  ])

  let jsonLd: string | null = null
  if (product) {
    const kur = parseFloat(settings.usd_kur || '45')
    const minTier = product.tiers?.sort((a, b) => a.priceUsd - b.priceUsd)[0]
    const priceTl = minTier ? (minTier.priceUsd * kur * 1.2).toFixed(2) : null

    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.shortDesc || product.longDesc || product.name,
      url: `${SITE_URL}/urun/${params.slug}`,
      category: product.categoryName,
      ...(product.brandName && {
        brand: { '@type': 'Brand', name: product.brandName },
      }),
      ...(product.images?.[0]?.url && {
        image: product.images[0].url,
      }),
      ...(priceTl && {
        offers: {
          '@type': 'Offer',
          priceCurrency: 'TRY',
          price: priceTl,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'baskıurunleri.com',
          },
        },
      }),
    }
    jsonLd = JSON.stringify(schema)
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <UrunDetayClient />
    </>
  )
}
