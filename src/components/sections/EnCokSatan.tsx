'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import FavoriteButton from '@/components/ui/FavoriteButton'
import { Loader2, Package, Flame, ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categoryName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  startingPriceUsd?: number
  orderCount?: number
}

function ProductCard({ product, rank }: { product: Product; rank: number }) {
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
          {rank <= 3 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-[1px]"
              style={{ background: '#F4821F', color: 'white' }}>
              <Flame size={9} fill="currentColor" />
              #{rank}
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
          {product.orderCount != null && product.orderCount > 0 && (
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {product.orderCount} sipariş
            </p>
          )}
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

export default function EnCokSatan() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    api.get('/api/catalog/products/best-sellers?limit=12')
      .then(r => setProducts(r.data.data || []))
      .catch(() => setProducts([]))
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

  if (!loading && products.length < 3) return null

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto">

        {/* Başlık */}
        <div className="flex items-center justify-between px-4 sm:px-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
              style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
              <Flame size={11} fill="#F4821F" />
              <span className="text-[10px] font-bold uppercase tracking-[2px]">En Çok Satan</span>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-black tracking-[-1px]"
              style={{ color: 'var(--text-primary)' }}>
              Çok Tercih Edilenler
            </h2>
            <p className="text-[12px] sm:text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              En çok sipariş verilen ürünler
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
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#F4821F]" />
          </div>
        ) : (
          <div className="relative">
            <div ref={scrollRef} onScroll={checkScroll}
              className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
              {products.map((p, idx) => <ProductCard key={p.id} product={p} rank={idx + 1} />)}
              <div className="flex-shrink-0 w-4" />
            </div>
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-4 w-12 pointer-events-none hidden sm:block"
                style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }} />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-4 w-12 pointer-events-none hidden sm:block"
                style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }} />
            )}
          </div>
        )}

        <div className="px-4 sm:px-6 mt-2">
          <Link href="/urunler?sort=popular"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold hover:underline"
            style={{ color: '#F4821F' }}>
            Tümünü gör →
          </Link>
        </div>
      </div>
    </section>
  )
}