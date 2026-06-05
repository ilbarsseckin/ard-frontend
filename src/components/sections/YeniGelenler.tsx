'use client'

import { useEffect, useState } from 'react'
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
  basePrice?: number
  priceUsd?: number
  price?: number
  createdAt?: string
}

export default function YeniGelenler() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    api
      .get('/api/catalog/products')
      .then((r) => {
        if (!mounted) return

        const all: Product[] = r.data?.data || []

        const sorted = [...all].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return tb - ta
        })

        setProducts(sorted.slice(0, 8))
      })
      .catch(() => {
        if (mounted) setProducts([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (!loading && products.length < 3) return null

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)

  const image =
    hovered && product.hoverImageUrl
      ? product.hoverImageUrl
      : product.mainImageUrl

  const rawPrice =
    product.startingPriceUsd ??
    product.basePrice ??
    product.priceUsd ??
    product.price

  const price = Number(rawPrice)
  const hasPrice = Number.isFinite(price) && price > 0

  return (
    <Link
      href={`/urun/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package
              size={34}
              className="opacity-30 md:size-10"
              style={{ color: 'var(--text-muted)' }}
            />
          </div>
        )}

        <span className="absolute left-2 top-2 z-10 rounded-full bg-[#F4821F] px-2.5 py-1 text-[8px] font-black uppercase tracking-[1px] text-white md:text-[9px]">
          Yeni
        </span>

        {hasPrice && (
          <div className="absolute bottom-2 right-2 z-10 rounded-full bg-white px-3 py-1.5 shadow-md backdrop-blur-sm dark:bg-gray-900">
            <span className="text-[12px] font-black text-[#F4821F]">
              ${price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="p-2.5 md:p-4">
        {product.categoryName && (
          <p
            className="mb-1 line-clamp-1 text-[9px] font-bold uppercase tracking-[1px] md:text-[10px]"
            style={{ color: 'var(--text-muted)' }}
          >
            {product.categoryName}
          </p>
        )}

        <h3
          className="line-clamp-2 min-h-[34px] text-[12px] font-bold leading-tight md:min-h-[42px] md:text-[15px]"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.name}
        </h3>

        {product.shortDesc && (
          <p
            className="mt-2 hidden text-[12px] leading-relaxed md:line-clamp-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {product.shortDesc}
          </p>
        )}
      </div>
    </Link>
  )
}