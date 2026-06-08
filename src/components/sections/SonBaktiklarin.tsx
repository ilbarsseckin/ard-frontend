'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import FavoriteButton from '@/components/ui/FavoriteButton'
import { getRecentViews } from '@/hooks/useRecentView'
import { Loader2, Package, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categoryName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  startingPriceUsd?: number
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const img = (hovered && product.hoverImageUrl) ? product.hoverImageUrl : product.mainImageUrl

  return (
    <Link href={`/urun/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px] block"
      style={{ scrollSnapAlign: 'start' }}>
      <div className="rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 relative h-full"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        <FavoriteButton productId={product.id} productName={product.name} size="sm" absolute />

        <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          {img ? (
            <img src={img} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={36} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
        </div>

        <div className="p-3">
          {product.categoryName && (
            <p className="text-[9px] uppercase tracking-[1px] font-bold mb-0.5"
              style={{ color: 'var(--text-muted)' }}>{product.categoryName}</p>
          )}
          <h3 className="text-[12px] sm:text-[13px] font-bold leading-tight line-clamp-2 group-hover:text-[#F4821F] transition-colors"
            style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
          {product.startingPriceUsd != null && (
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>başlangıç</span>
              <span className="text-[14px] font-black text-[#F4821F]">
                ${Number(product.startingPriceUsd).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function SonBaktiklarin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const ids = getRecentViews()
    if (ids.length === 0) { setLoading(false); return }
    api.get('/api/catalog/products')
      .then(r => {
        const all: Product[] = r.data.data || []
        const ordered = ids.map(id => all.find(p => p.id === id)).filter(Boolean) as Product[]
        setProducts(ordered.slice(0, 12))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="py-10 md:py-14" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Başlık */}
        <div className="flex items-center justify-between px-4 sm:px-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
              style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
              <Clock size={11} />
              <span className="text-[10px] font-bold uppercase tracking-[2px]">Son Baktıkların</span>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-black tracking-[-1px]"
              style={{ color: 'var(--text-primary)' }}>
              Son Görüntülediklerin
            </h2>
            <p className="text-[12px] sm:text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Kaldığın yerden devam et
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
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
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={20} className="animate-spin text-[#F4821F]" />
          </div>
        ) : (
          <div className="relative">
            <div ref={scrollRef} onScroll={checkScroll}
              className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
              <div className="flex-shrink-0 w-4" />
            </div>
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-4 w-12 pointer-events-none hidden sm:block"
                style={{ background: 'linear-gradient(to right, var(--bg-secondary), transparent)' }} />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-4 w-12 pointer-events-none hidden sm:block"
                style={{ background: 'linear-gradient(to left, var(--bg-secondary), transparent)' }} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}