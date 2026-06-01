'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FavoriteButton from '@/components/ui/FavoriteButton'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart, Loader2, Package, Trash2, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categoryName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  minPriceUsd?: number
  minPriceQty?: number
}

export default function FavorilerimPage() {
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
        setProducts(ordered)
      })
      .catch(() => toast.error('Ürünler yüklenemedi'))
      .finally(() => setLoading(false))
  }, [favorites])

  const handleClearAll = () => {
    if (favorites.length === 0) return
    if (!confirm(`Tüm favoriler (${favorites.length} ürün) silinsin mi?`)) return
    localStorage.removeItem('baski-favorites')
    window.dispatchEvent(new Event('baski-favorites-changed'))
    toast.success('Tüm favoriler temizlendi')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart size={20} className="text-[#F4821F]" fill="#F4821F" />
                <h1 className="text-[24px] md:text-[28px] font-black tracking-[-0.5px]"
                  style={{ color: 'var(--text-primary)' }}>
                  Favorilerim
                </h1>
              </div>
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {favorites.length} ürün favorilerinde
              </p>
            </div>

            {favorites.length > 0 && (
              <button onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-colors hover:text-red-500"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <Trash2 size={13} />
                Tümünü Sil
              </button>
            )}
          </div>

          {/* İçerik */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#F4821F]" />
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20 rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
      <Heart size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
      <h2 className="text-[18px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Henüz favori ürünün yok
      </h2>
      <p className="text-[13px] mb-6 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
        Beğendiğin ürünlerin kalp ❤️ ikonuna tıklayarak buraya ekleyebilirsin.
        Daha sonra hızlıca tekrar bakabilirsin.
      </p>
      <Link href="/urunler"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-bold rounded-lg bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors">
        <ShoppingBag size={14} />
        Ürünlere Göz At
      </Link>
    </div>
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
        {product.shortDesc && (
          <p className="text-[11px] line-clamp-1 mt-1" style={{ color: 'var(--text-muted)' }}>
            {product.shortDesc}
          </p>
        )}
        {product.minPriceUsd != null && (
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {product.minPriceQty ? `${product.minPriceQty} adet` : 'başlangıç'}
            </span>
            <span className="text-[14px] font-black text-[#F4821F]">
              ${Number(product.minPriceUsd).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
