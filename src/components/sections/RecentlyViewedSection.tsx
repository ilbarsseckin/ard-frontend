'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { getRecentViews } from '@/hooks/useRecentView'
import { Package, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name: string
  categoryName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  startingPriceUsd?: number
  tiers?: Array<{ priceUsd: number }>
}

interface Props {
  currentProductId: string  // mevcut ürünü listeden çıkar
}

export default function RecentlyViewedSection({ currentProductId }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  useEffect(() => {
    const ids = getRecentViews().filter(id => id !== currentProductId)
    if (ids.length === 0) return

    api.get('/api/catalog/products')
      .then(r => {
        const all: Product[] = r.data?.data || []
        const ordered = ids
          .map(id => all.find(p => p.id === id))
          .filter(Boolean) as Product[]
        setProducts(ordered.slice(0, 12))
      })
      .catch(() => {})
  }, [currentProductId])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: '#F4821F' }} />
          <h2 className="text-[16px] sm:text-[18px] font-black" style={{ color: 'var(--text-primary)' }}>
            Son Baktıkların
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <button onClick={() => scroll('left')} disabled={!canLeft}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => scroll('right')} disabled={!canRight}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Yatay scroll */}
      <div className="relative">
        <div ref={scrollRef} onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
          <div className="flex-shrink-0 w-2" />
        </div>
        {canLeft && (
          <div className="absolute left-0 top-0 bottom-3 w-10 pointer-events-none hidden sm:block"
            style={{ background: 'linear-gradient(to right, var(--bg-secondary), transparent)' }} />
        )}
        {canRight && (
          <div className="absolute right-0 top-0 bottom-3 w-10 pointer-events-none hidden sm:block"
            style={{ background: 'linear-gradient(to left, var(--bg-secondary), transparent)' }} />
        )}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const img = hovered && product.hoverImageUrl ? product.hoverImageUrl : product.mainImageUrl

  const minPrice = product.tiers && product.tiers.length > 0
    ? Math.min(...product.tiers.map(t => Number(t.priceUsd)))
    : product.startingPriceUsd

  return (
    <Link href={`/urun/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex-shrink-0 w-[140px] sm:w-[160px]"
      style={{ scrollSnapAlign: 'start' }}>
      <div className="rounded-xl overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="relative aspect-square overflow-hidden"
          style={{ background: 'var(--bg-secondary)' }}>
          {img ? (
            <img src={img} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="opacity-20" style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
        </div>
        <div className="p-2.5">
          {product.categoryName && (
            <p className="text-[9px] font-bold uppercase tracking-[1px] mb-0.5 truncate"
              style={{ color: 'var(--text-muted)' }}>
              {product.categoryName}
            </p>
          )}
          <p className="text-[12px] font-bold leading-tight line-clamp-2 group-hover:text-[#F4821F] transition-colors"
            style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </p>
          {minPrice != null && Number(minPrice) > 0 && (
            <p className="text-[11px] font-black mt-1.5 text-[#F4821F]">
              ${Number(minPrice).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}