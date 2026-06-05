'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import { Loader2, Search, X, SlidersHorizontal, ArrowRight } from 'lucide-react'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categoryId: string
  categoryName?: string
  categorySlug?: string
  brandName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  minPriceUsd?: number
  minPriceQty?: number
  featured?: boolean
  badge?: string
  originalPrice?: number
}

interface Category {
  id: string
  slug: string
  name: string
  icon?: string
  parentId?: string
}

function UrunlerInner() {
  const sp = useSearchParams()
  const initialQ = sp.get('q') || ''

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const [activeCat, setActiveCat] = useState<string>('all')
  const [search, setSearch] = useState(initialQ)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [onlyDiscount, setOnlyDiscount] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/api/catalog/categories/tree'),
      api.get('/api/catalog/products'),
      api.get('/api/settings/public'),
    ]).then(([catRes, prodRes, settRes]) => {
      setCategories(catRes.data.data || [])
      setProducts(prodRes.data.data || [])
      setSettings(settRes.data.data || {})
    }).finally(() => setLoading(false))
  }, [])

  const kur = parseFloat(settings.usd_kur || '45')

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (activeCat !== 'all' && p.categorySlug !== activeCat) return false
      if (search) {
        const s = search.toLowerCase()
        if (!p.name.toLowerCase().includes(s) &&
            !(p.shortDesc?.toLowerCase().includes(s)) &&
            !(p.categoryName?.toLowerCase().includes(s)))
          return false
      }
      if (priceMin) {
        const priceTl = p.minPriceUsd ? Number(p.minPriceUsd) * kur : 0
        if (priceTl < parseFloat(priceMin)) return false
      }
      if (priceMax) {
        const priceTl = p.minPriceUsd ? Number(p.minPriceUsd) * kur : 0
        if (priceTl > parseFloat(priceMax)) return false
      }
      if (onlyFeatured && !p.featured) return false
      if (onlyDiscount && (!p.originalPrice || !p.minPriceUsd ||
          Number(p.originalPrice) <= Number(p.minPriceUsd))) return false
      return true
    })
  }, [products, activeCat, search, priceMin, priceMax, onlyFeatured, onlyDiscount, kur])

  const mainCategories = useMemo(() => {
    // parentId'si listede olmayan kategoriler kök sayılır
    // Eğer hepsi parentId'li ise tüm kategorileri göster
    const ids = new Set(categories.map(c => c.id))
    const roots = categories.filter(c => !c.parentId || !ids.has(c.parentId))
    return roots.length > 0 ? roots : categories
  }, [categories])

  const productCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      if (!p.categorySlug) continue
      map.set(p.categorySlug, (map.get(p.categorySlug) || 0) + 1)
    }
    return map
  }, [products])

  const clearFilters = () => {
    setActiveCat('all'); setSearch(''); setPriceMin(''); setPriceMax('')
    setOnlyFeatured(false); setOnlyDiscount(false)
  }

  const activeFilterCount =
    (activeCat !== 'all' ? 1 : 0) + (search ? 1 : 0) +
    (priceMin ? 1 : 0) + (priceMax ? 1 : 0) +
    (onlyFeatured ? 1 : 0) + (onlyDiscount ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-5">

      <div>
        <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
          style={{ color: 'var(--text-secondary)' }}>Arama</label>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ürün adı..."
            className="w-full pl-9 pr-3 py-2.5 text-[13px] rounded-lg outline-none"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }} />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-[1px] mb-2 block"
          style={{ color: 'var(--text-secondary)' }}>Kategori</label>
        <div className="space-y-0.5 max-h-[400px] overflow-y-auto pr-1">
          <button onClick={() => setActiveCat('all')}
            className="w-full flex items-center justify-between px-3 py-2 text-[12px] rounded-lg transition-colors"
            style={activeCat === 'all'
              ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', fontWeight: 700 }
              : { color: 'var(--text-secondary)' }}>
            <span>Tümü</span>
            <span className="text-[10px] opacity-60">{products.length}</span>
          </button>
          {mainCategories.map(c => {
            const count = productCounts.get(c.slug) || 0
            return (
              <button key={c.id} onClick={() => setActiveCat(c.slug)}
                className="w-full flex items-center justify-between px-3 py-2 text-[12px] rounded-lg transition-colors"
                style={activeCat === c.slug
                  ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', fontWeight: 700 }
                  : { color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5 truncate">
                  {c.icon && <span className="text-[14px]">{c.icon}</span>}
                  <span className="truncate">{c.name}</span>
                </span>
                <span className="text-[10px] opacity-60 flex-shrink-0">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-[1px] mb-2 block"
          style={{ color: 'var(--text-secondary)' }}>Fiyat Aralığı (₺)</label>
        <div className="flex items-center gap-2">
          <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)}
            placeholder="Min" min="0"
            className="flex-1 px-3 py-2 text-[12px] rounded-lg outline-none"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }} />
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)}
            placeholder="Max" min="0"
            className="flex-1 px-3 py-2 text-[12px] rounded-lg outline-none"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }} />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-[1px] mb-2 block"
          style={{ color: 'var(--text-secondary)' }}>Özel</label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-500/5 transition-colors">
            <input type="checkbox" checked={onlyFeatured}
              onChange={e => setOnlyFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#F4821F] cursor-pointer" />
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              ⭐ Öne çıkan ürünler
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-500/5 transition-colors">
            <input type="checkbox" checked={onlyDiscount}
              onChange={e => setOnlyDiscount(e.target.checked)}
              className="w-4 h-4 accent-[#F4821F] cursor-pointer" />
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              🏷️ İndirimli ürünler
            </span>
          </label>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-bold rounded-lg transition-colors"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}>
          <X size={13} /> Filtreleri Temizle ({activeFilterCount})
        </button>
      )}
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">

          <h1 className="text-[24px] font-black tracking-[-0.5px] mb-1"
            style={{ color: 'var(--text-primary)' }}>
            Ürün Kataloğu
          </h1>
          <p className="text-[12px] mb-5" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} ürün
          </p>

          <div className="lg:hidden mb-4">
            <button onClick={() => setMobileFilterOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold rounded-xl"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}>
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={14} />
                Filtreler
              </span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black text-white rounded-full"
                  style={{ background: '#F4821F' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

            <aside className="hidden lg:block">
              <div className="sticky top-24 p-5 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <FilterContent />
              </div>
            </aside>

            <div>
              {loading ? (
                <div className="py-20 flex items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-[#F4821F]" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center rounded-xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-[16px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Ürün bulunamadı
                  </p>
                  <p className="text-[12px] mb-4" style={{ color: 'var(--text-muted)' }}>
                    Filtreleri değiştirip tekrar deneyin
                  </p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters}
                      className="px-4 py-2 text-[12px] font-bold text-white rounded-lg"
                      style={{ background: '#F4821F' }}>
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map(p => <ProductCard key={p.id} product={p} kur={kur} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" onClick={() => setMobileFilterOpen(false)}>
          <div className="flex-1" style={{ background: 'rgba(0,0,0,0.5)' }} />
          <div className="w-[300px] max-w-[85vw] h-full overflow-y-auto"
            style={{ background: 'var(--bg-primary)' }}
            onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between px-5 py-4 z-10"
              style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Filtreler
              </h3>
              <button onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-secondary)' }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ProductCard({ product, kur }: { product: Product; kur: number }) {
  const [hovered, setHovered] = useState(false)
  const img = (hovered && product.hoverImageUrl) ? product.hoverImageUrl : product.mainImageUrl
  const priceTl = product.minPriceUsd ? Number(product.minPriceUsd) * kur : 0
  const hasOriginal = product.originalPrice && product.minPriceUsd
    && Number(product.originalPrice) > Number(product.minPriceUsd)

  return (
    <Link href={`/urun/${product.slug}`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="group rounded-xl overflow-hidden transition-all hover:shadow-md relative"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

      <FavoriteButton productId={product.id} productName={product.name} size="sm" absolute />

      <div className="aspect-square overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
        {img ? (
          <img src={img} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => (e.currentTarget.style.display = 'none')} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[60px]">📦</div>
        )}
        {product.badge && (
          <span className="absolute top-2 left-2 text-[9px] font-black px-2 py-1 rounded text-white"
            style={{ background: 'linear-gradient(135deg, #ef4444, #ec4899)' }}>
            ⚡ {product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] uppercase tracking-wider mb-1 truncate"
          style={{ color: 'var(--text-muted)' }}>
          {product.categoryName}{product.brandName && ` · ${product.brandName}`}
        </p>
        <h3 className="text-[13px] font-bold leading-tight mb-1.5 line-clamp-2 min-h-[34px]"
          style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
        {product.shortDesc && (
          <p className="text-[10px] mb-2 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
            {product.shortDesc}
          </p>
        )}
        {product.minPriceUsd ? (
          <div className="flex items-end justify-between">
            <div>
              {hasOriginal && (
                <p className="text-[10px] line-through" style={{ color: 'var(--text-muted)' }}>
                  ₺{(Number(product.originalPrice) * kur).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                </p>
              )}
              <p className="text-[14px] font-black tracking-[-0.5px]" style={{ color: '#F4821F' }}>
                ₺{priceTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                {product.minPriceQty} adet'ten başlayan
              </p>
            </div>
            <ArrowRight size={14} className="text-[#F4821F] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <p className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>Fiyat soruşturun</p>
        )}
      </div>
    </Link>
  )
}

export default function UrunlerClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <Loader2 size={28} className="animate-spin text-[#F4821F]" />
      </div>
    }>
      <UrunlerInner />
    </Suspense>
  )
}