import { MetadataRoute } from 'next'

const BASE_URL = 'https://baskiurunleri.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.baskiurunleri.com'

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/api/catalog/products?size=200`, {
      next: { revalidate: 3600 }
    })
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/catalog/categories/tree`, {
      next: { revalidate: 3600 }
    })
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

function flattenCategories(categories: any[]): any[] {
  const result: any[] = []
  for (const cat of categories) {
    result.push(cat)
    if (cat.children?.length > 0) {
      result.push(...flattenCategories(cat.children))
    }
  }
  return result
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  const flatCategories = flattenCategories(categories)

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/urunler`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/nasil-siparis`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/tasarim-yukleme`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/tasarim-destegi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/kampanyalar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const categoryPages: MetadataRoute.Sitemap = flatCategories.map((cat: any) => ({
    url: `${BASE_URL}/kategori/${cat.slug}`,
    lastModified: new Date(cat.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${BASE_URL}/urun/${product.slug}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
