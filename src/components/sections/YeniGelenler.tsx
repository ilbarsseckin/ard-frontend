'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import SectionHeader from '@/components/ui/SectionHeader'
import { Loader2, Package } from 'lucide-react'

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
  createdAt?: string
}

export default function YeniGelenler() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/catalog/products')
      .then(r => {
        const all: Product[] = r.data.data || []
        // En yeniden eskiye sırala
        const sorted = [...all].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return tb - ta
        })
        setProducts(sorted.slice(0, 8))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Hiç ürün yoksa veya sadece 1 ürün varsa (öne çıkanla aynı olacak), bölümü gösterme
  if (!loading && products.length < 3) return null

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="YENİ GELENLER"
          badgeIcon="star"
          title=""
          subtitle="En son ürünlerimize göz at"
          seeAllHref="/urunler?sort=newest"
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#F4821F]" />
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
      className="group block rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

      {/* Resim */}
      <div className="relative aspect-square overflow-hidden"
        style={{ background: 'var(--bg-secondary)' }}>
        {img ? (
          <img src={img} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        {/* "Yeni" rozeti */}
        <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-[1px] px-2 py-1 rounded-full"
          style={{ background: '#F4821F', color: 'white' }}>
          Yeni
        </span>
      </div>

      {/* İçerik */}
      <div className="p-3">
        {product.categoryName && (
          <p className="text-[10px] uppercase tracking-[1px] font-bold mb-1"
            style={{ color: 'var(--text-muted)' }}>
            {product.categoryName}
          </p>
        )}
        <h3 className="text-[14px] font-bold leading-tight line-clamp-2 mb-1"
          style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
        {product.shortDesc && (
          <p className="text-[11px] line-clamp-1 mb-2"
            style={{ color: 'var(--text-muted)' }}>
            {product.shortDesc}
          </p>
        )}
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
