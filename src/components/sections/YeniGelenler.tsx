'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Loader2, Package, ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categoryName?: string
  categorySlug?: string
  brandName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  startingPriceUsd?: number
  basePrice?: number
  priceUsd?: number
  price?: number
  createdAt?: string
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const image = hovered && product.hoverImageUrl ? product.hoverImageUrl : product.mainImageUrl
  const rawPrice = product.startingPriceUsd ?? product.basePrice ?? product.priceUsd ?? product.price
  const price = Number(rawPrice)
  const hasPrice = Number.isFinite(price) && price > 0

  return (
    <Link
      href={`/urun/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px] block"
      style={{ scrollSnapAlign: 'start' }}>
      <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        {/* Resim */}
        <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          {image ? (
            <img src={image} alt={product.name} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package size={34} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
          <span className="absolute left-2 top-2 z-10 rounded-full bg-[#F4821F] px-2 py-0.5 text-[8px] font-black uppercase tracking-[1px] text-white">
            Yeni
          </span>
          {hasPrice && (
            <div className="absolute bottom-2 right-2 z-10 rounded-full bg-white px-2.5 py-1 shadow-md dark:bg-gray-900">
              <span className="text-[11px] font-black text-[#F4821F]">${price.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Bilgi */}
        <div className="p-3">
          {product.categoryName && (
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
              {product.categoryName}
            </p>
          )}
          <h3 className="line-clamp-2 text-[12px] sm:text-[13px] font-bold leading-tight group-hover:text-[#F4821F] transition-colors"
            style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default function YeniGelenler() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    let mounted = true
    api.get('/api/catalog/products')
      .then(r => {
        if (!mounted) return
        const all: Product[] = r.data?.data || []
        const sorted = [...all].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return tb - ta
        })
        setProducts(sorted.slice(0, 12))
      })
      .catch(() => { if (mounted) setProducts([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
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
              <span className="text-[10px] font-bold uppercase tracking-[2px]">⭐ Yeni Gelenler</span>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-black tracking-[-1px]"
              style={{ color: 'var(--text-primary)' }}>
              En Son Ürünler
            </h2>
            <p className="text-[12px] sm:text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              En son eklenen baskı ürünlerimize göz at
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
              {products.map(p => <ProductCard key={p.id} product={p} />)}
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
          <Link href="/urunler?sort=newest"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold hover:underline"
            style={{ color: '#F4821F' }}>
            Tümünü gör →
          </Link>
        </div>
      </div>
    </section>
  )
}