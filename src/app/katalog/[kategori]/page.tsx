'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import api from '@/lib/api'
import { Package, Loader2, ChevronLeft } from 'lucide-react'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface Category {
  id: string
  slug: string
  name: string
  icon?: string
  tagline?: string
}

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categoryId: string
  categoryName: string
  categorySlug: string
  brandName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  minPriceUsd?: number
  minPriceQty?: number
  featured?: boolean
  badge?: string
  originalPrice?: number
}

export default function KatalogKategoriPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.kategori as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [kur, setKur] = useState(45)
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/api/catalog/categories/${slug}`)
      .then(catRes => {
        const cat: Category = catRes.data.data
        setCategory(cat)
        return Promise.all([
          api.get(`/api/catalog/products?categoryId=${cat.id}`),
          api.get('/api/settings/public'),
        ])
      })
      .then(([prodRes, settRes]) => {
        const prods: Product[] = prodRes.data.data || []
        // Tek ürünlü kategori → araya liste girmeden doğrudan ürün detayına git
        if (prods.length === 1) {
          setRedirecting(true)
          router.replace(`/urun/${prods[0].slug}`)
          return
        }
        setProducts(prods)
        setKur(parseFloat(settRes.data.data?.usd_kur || '45'))
      })
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
        else console.error('Kategori sayfası yüklenemedi:', err)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading || redirecting) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <Loader2 size={32} className="animate-spin text-[#F4821F]" />
        </main>
      </>
    )
  }

  if (notFound || !category) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-secondary)' }}>
          <div className="text-center">
            <Package size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <h1 className="text-[24px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Kategori bulunamadı
            </h1>
            <p className="text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
              "{slug}" diye bir kategori yok.
            </p>
            <Link href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors">
              <ChevronLeft size={14} /> Ana sayfaya dön
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* Breadcrumb */}
          <div className="text-[12px] mb-5 flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline">Ana Sayfa</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{category.name}</span>
          </div>

          {/* Kategori başlığı */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {category.icon && <span className="text-[36px]">{category.icon}</span>}
              <h1 className="text-[32px] md:text-[40px] font-black tracking-[-1.5px]"
                style={{ color: 'var(--text-primary)' }}>
                {category.name}
              </h1>
            </div>
            {category.tagline && (
              <p className="text-[14px] md:text-[15px]" style={{ color: 'var(--text-muted)' }}>
                {category.tagline}
              </p>
            )}
            <p className="text-[12px] mt-2 font-semibold" style={{ color: 'var(--text-muted)' }}>
              {products.length} ürün
            </p>
          </div>

          {/* Ürün grid */}
          {products.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
              <Package size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px] mb-2" style={{ color: 'var(--text-secondary)' }}>
                Bu kategoride henüz ürün yok
              </p>
              <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                Yakında eklenecek.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(p => {
                const priceTl = p.minPriceUsd ? Number(p.minPriceUsd) * kur : 0
                const hasOriginal = p.originalPrice && p.minPriceUsd
                  && Number(p.originalPrice) > Number(p.minPriceUsd)
                return (
                  <Link key={p.id} href={`/urun/${p.slug}`}
                    className="group block">
                    <div className="rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 relative"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                      {/* ❤️ Favori butonu — sağ üst köşe */}
                      <FavoriteButton productId={p.id} productName={p.name} size="sm" absolute />

                      {/* Resim (hover swap) */}
                      <div className="aspect-square relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
                        {p.mainImageUrl ? (
                          <>
                            <img src={p.mainImageUrl} alt={p.name}
                              className={`w-full h-full object-cover transition-opacity duration-300 ${
                                p.hoverImageUrl ? 'group-hover:opacity-0' : ''
                              }`}
                              onError={e => (e.currentTarget.style.display = 'none')} />
                            {p.hoverImageUrl && (
                              <img src={p.hoverImageUrl} alt={p.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onError={e => (e.currentTarget.style.display = 'none')} />
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <Package size={48} />
                          </div>
                        )}

                        {p.badge && (
                          <span className="absolute top-3 left-3 text-[10px] font-black px-2 py-1 rounded text-white animate-pulse"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #ec4899)',
                              boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                            }}>
                            ⚡ {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Bilgi */}
                      <div className="p-4">
                        {p.brandName && (
                          <div className="text-[10px] uppercase tracking-[1px] mb-1 font-bold"
                            style={{ color: 'var(--text-muted)' }}>
                            {p.brandName}
                          </div>
                        )}
                        <h3 className="text-[14px] font-bold mb-1 leading-tight line-clamp-2 group-hover:text-[#F4821F] transition-colors"
                          style={{ color: 'var(--text-primary)' }}>
                          {p.name}
                        </h3>
                        {p.shortDesc && (
                          <p className="text-[11px] mb-3 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                            {p.shortDesc}
                          </p>
                        )}

                        {p.minPriceUsd ? (
                          <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              {hasOriginal && (
                                <span className="text-[10px] line-through" style={{ color: 'var(--text-muted)' }}>
                                  ₺{(Number(p.originalPrice) * kur).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                </span>
                              )}
                              <span className={`text-[18px] font-black tracking-[-0.5px] ${hasOriginal ? 'text-red-500' : ''}`}
                                style={!hasOriginal ? { color: '#F4821F' } : {}}>
                                ₺{priceTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {p.minPriceQty} adet'ten başlayan
                            </p>
                          </div>
                        ) : (
                          <div className="pt-3 text-[11px] italic"
                            style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
                            Fiyat için iletişim
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}