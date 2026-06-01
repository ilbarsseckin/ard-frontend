'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Sparkles, Package } from 'lucide-react'
import FavoriteButton from '@/components/ui/FavoriteButton'

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
  badge?: string
  originalPrice?: number
}

export default function UrunlerSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [kur, setKur] = useState(45)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/catalog/products/featured'),
      api.get('/api/settings/public'),
    ]).then(([prodRes, settRes]) => {
      setProducts(prodRes.data.data || [])
      setKur(parseFloat(settRes.data.data?.usd_kur || '45'))
    }).catch(err => console.error('Öne çıkan ürünler yüklenemedi:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading || products.length === 0) return null

  return (
    <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Başlık */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
            <Sparkles size={14} />
            <span className="text-[11px] font-bold uppercase tracking-[2px]">Öne Çıkan</span>
          </div>
          <h2 className="text-[32px] md:text-[42px] font-black tracking-[-1.5px]"
            style={{ color: 'var(--text-primary)' }}>
          </h2>
          <p className="text-[13px] md:text-[14px] mt-2" style={{ color: 'var(--text-muted)' }}>
            En çok tercih edilen baskı ürünleri
          </p>
        </div>

        {/* Grid */}
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

                  {/* ❤️ Favori butonu — kartın sağ üst köşesinde */}
                  <FavoriteButton productId={p.id} productName={p.name} size="sm" absolute />

                  {/* Resim (hover swap destekli) */}
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

                    {/* Kampanya etiketi */}
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
                    <div className="text-[10px] uppercase tracking-[1px] mb-1"
                      style={{ color: 'var(--text-muted)' }}>
                      {p.categoryName}{p.brandName && ` · ${p.brandName}`}
                    </div>
                    <h3 className="text-[14px] font-bold mb-1 leading-tight line-clamp-2 group-hover:text-[#F4821F] transition-colors"
                      style={{ color: 'var(--text-primary)' }}>
                      {p.name}
                    </h3>
                    {p.shortDesc && (
                      <p className="text-[11px] mb-3 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                        {p.shortDesc}
                      </p>
                    )}

                    {/* Fiyat */}
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
      </div>
    </section>
  )
}