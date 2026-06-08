'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Sparkles, Package, ChevronLeft, ChevronRight } from 'lucide-react'
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

function ProductCard({ p, kur }: { p: Product; kur: number }) {
  const priceTl = p.minPriceUsd ? Number(p.minPriceUsd) * kur : 0
  const hasOriginal = p.originalPrice && p.minPriceUsd && Number(p.originalPrice) > Number(p.minPriceUsd)

  return (
    <Link href={`/urun/${p.slug}`}
      className="group flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px] block">
      <div className="rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 relative h-full"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        <FavoriteButton productId={p.id} productName={p.name} size="sm" absolute />

        {/* Resim */}
        <div className="aspect-square relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
          {p.mainImageUrl ? (
            <>
              <img src={p.mainImageUrl} alt={p.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${p.hoverImageUrl ? 'group-hover:opacity-0' : ''}`}
                onError={e => (e.currentTarget.style.display = 'none')} />
              {p.hoverImageUrl && (
                <img src={p.hoverImageUrl} alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <Package size={40} />
            </div>
          )}
          {p.badge && (
            <span className="absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded text-white"
              style={{ background: 'linear-gradient(135deg, #ef4444, #ec4899)' }}>
              ⚡ {p.badge}
            </span>
          )}
        </div>

        {/* Bilgi */}
        <div className="p-3">
          <div className="text-[9px] uppercase tracking-[1px] mb-0.5" style={{ color: 'var(--text-muted)' }}>
            {p.categoryName}
          </div>
          <h3 className="text-[12px] sm:text-[13px] font-bold leading-tight line-clamp-2 group-hover:text-[#F4821F] transition-colors mb-2"
            style={{ color: 'var(--text-primary)' }}>
            {p.name}
          </h3>
          {p.minPriceUsd ? (
            <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-baseline gap-1 flex-wrap">
                {hasOriginal && (
                  <span className="text-[9px] line-through" style={{ color: 'var(--text-muted)' }}>
                    ₺{(Number(p.originalPrice) * kur).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                  </span>
                )}
                <span className={`text-[15px] sm:text-[17px] font-black tracking-[-0.5px] ${hasOriginal ? 'text-red-500' : ''}`}
                  style={!hasOriginal ? { color: '#F4821F' } : {}}>
                  ₺{priceTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {p.minPriceQty} adet'ten
              </p>
            </div>
          ) : (
            <p className="text-[10px] italic" style={{ color: 'var(--text-muted)' }}>Fiyat için iletişim</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function EnCokSatan() {
  const [products, setProducts] = useState<Product[]>([])
  const [kur, setKur] = useState(45)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  if (loading || products.length === 0) return null

  return (
    <section className="py-12 sm:py-16" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Başlık */}
        <div className="flex items-center justify-between px-4 sm:px-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
              style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
              <Sparkles size={12} />
              <span className="text-[10px] font-bold uppercase tracking-[2px]">Öne Çıkan</span>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-black tracking-[-1px]"
              style={{ color: 'var(--text-primary)' }}>
              En Çok Tercih Edilenler
            </h2>
            <p className="text-[12px] sm:text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              En çok tercih edilen baskı ürünleri
            </p>
          </div>

          {/* Masaüstü ok butonları */}
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scroll('left')} disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} disabled={!canScrollRight}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Yatay kaydırma */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {products.map(p => (
              <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
                <ProductCard p={p} kur={kur} />
              </div>
            ))}
            {/* Sağda boşluk */}
            <div className="flex-shrink-0 w-4" />
          </div>

          {/* Solda gölge */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-12 pointer-events-none hidden sm:block"
              style={{ background: 'linear-gradient(to right, var(--bg-secondary), transparent)' }} />
          )}
          {/* Sağda gölge */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-4 w-12 pointer-events-none hidden sm:block"
              style={{ background: 'linear-gradient(to left, var(--bg-secondary), transparent)' }} />
          )}
        </div>

        {/* Tümünü gör */}
        <div className="px-4 sm:px-6 mt-2">
          <Link href="/urunler"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold hover:underline"
            style={{ color: '#F4821F' }}>
            Tüm ürünleri gör →
          </Link>
        </div>
      </div>
    </section>
  )
}