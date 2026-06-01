'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import SectionHeader from '@/components/ui/SectionHeader'
import FavoriteButton from '@/components/ui/FavoriteButton'
import { useFavorites } from '@/hooks/useFavorites'
import { Loader2, Package, HeartOff } from 'lucide-react'

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

export default function Favorilerim() {
  const { favorites } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    api.get('/api/catalog/products')
      .then(r => {
        const all: Product[] = r.data.data || []
        const ordered = favorites
          .map(id => all.find(p => p.id === id))
          .filter(Boolean) as Product[]
        setProducts(ordered.slice(0, 8))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [favorites])

  // Favori yoksa section'ı tamamen gizle
  if (favorites.length === 0) return null

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="FAVORİLERİM"
          badgeIcon="heart"
          title={`Beğendiklerin (${favorites.length})`}
          subtitle="Daha sonra sipariş etmek istediklerin"
          seeAllHref={favorites.length > 8 ? '/favorilerim' : undefined}
        />

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={20} className="animate-spin text-[#F4821F]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const img = (hovered && product.hoverImageUrl) ? product.hoverImageUrl : product.mainImageUrl

  return (
    <Link href={`/urun/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 relative"
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
          <p className="text-[10px] uppercase tracking-[1px] font-bold mb-1"
            style={{ color: 'var(--text-muted)' }}>{product.categoryName}</p>
        )}
        <h3 className="text-[14px] font-bold leading-tight line-clamp-2"
          style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
        {product.startingPriceUsd != null && (
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>başlangıç</span>
            <span className="text-[14px] font-black text-[#F4821F]">
              ${Number(product.startingPriceUsd).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
