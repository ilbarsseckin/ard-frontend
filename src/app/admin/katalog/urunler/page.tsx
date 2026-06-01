'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, RefreshCw,
  Package, Search, Star, X,
} from 'lucide-react'

interface Category {
  id: string
  slug: string
  name: string
  icon?: string
}

interface Brand {
  id: string
  slug: string
  name: string
}

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categoryId: string
  categoryName: string
  brandId?: string
  brandName?: string
  mainImageUrl?: string
  hoverImageUrl?: string
  minPriceUsd?: number
  minPriceQty?: number
  featured: boolean
  badge?: string
  originalPrice?: number
  active: boolean
  sortOrder: number
}

export default function AdminUrunlerPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [kur, setKur] = useState(45)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterBrand, setFilterBrand] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (filterCategory) qs.append('categoryId', filterCategory)
    if (filterBrand) qs.append('brandId', filterBrand)

    Promise.all([
      api.get(`/api/admin/catalog/products?${qs.toString()}`),
      api.get('/api/admin/catalog/categories'),
      api.get('/api/admin/catalog/brands'),
      api.get('/api/settings/public'),
    ]).then(([prodRes, catRes, brandRes, settRes]) => {
      setProducts(prodRes.data.data || [])
      setCategories(catRes.data.data || [])
      setBrands(brandRes.data.data || [])
      setKur(parseFloat(settRes.data.data?.usd_kur || '45'))
    }).catch(() => toast.error('Veri yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filterCategory, filterBrand])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (filterStatus === 'active' && !p.active) return false
      if (filterStatus === 'inactive' && p.active) return false
      if (search) {
        const s = search.toLowerCase()
        if (!p.name.toLowerCase().includes(s) && !p.slug.includes(s)) return false
      }
      return true
    })
  }, [products, search, filterStatus])

  const handleToggle = async (p: Product) => {
    setTogglingId(p.id)
    try {
      await api.patch(`/api/admin/catalog/products/${p.id}/toggle`)
      load()
    } catch {
      toast.error('Değiştirilemedi')
    } finally { setTogglingId(null) }
  }

  const handleDelete = async (p: Product) => {
    if (!confirm(`"${p.name}" ürününü silmek istediğine emin misin?\n\nResimler, fiyat baremleri ve attribute seçimleri de silinecek.`)) return
    setDeletingId(p.id)
    try {
      await api.delete(`/api/admin/catalog/products/${p.id}`)
      toast.success('Ürün silindi')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    } finally { setDeletingId(null) }
  }

  const clearFilters = () => {
    setSearch('')
    setFilterCategory('')
    setFilterBrand('')
    setFilterStatus('all')
  }

  const hasActiveFilter = search || filterCategory || filterBrand || filterStatus !== 'all'

  const counts = {
    total: products.length,
    active: products.filter(p => p.active).length,
    featured: products.filter(p => p.featured).length,
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package size={18} className="text-[#F4821F]" />
                <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                  Ürün Yönetimi
                </h1>
              </div>
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                Toplam {counts.total} ürün · {counts.active} aktif · {counts.featured} öne çıkan
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/katalog/urunler/new"
                className="flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-lg bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors">
                <Plus size={14} />
                Yeni Ürün
              </Link>
              <button onClick={load}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Ürün adı veya slug..."
                className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>

            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-[12px] rounded-lg outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', minWidth: 160 }}>
              <option value="">Tüm kategoriler</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>

            <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
              className="px-3 py-2 text-[12px] rounded-lg outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', minWidth: 140 }}>
              <option value="">Tüm markalar</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <div className="flex gap-1">
              {([
                { val: 'all',      label: 'Tümü' },
                { val: 'active',   label: 'Aktif' },
                { val: 'inactive', label: 'Pasif' },
              ] as const).map(s => (
                <button key={s.val} onClick={() => setFilterStatus(s.val)}
                  className="text-[11px] px-3 py-2 rounded-lg border transition-colors"
                  style={{
                    background: filterStatus === s.val ? 'var(--text-primary)' : 'var(--bg-card)',
                    color: filterStatus === s.val ? 'var(--bg-primary)' : 'var(--text-muted)',
                    borderColor: 'var(--border)',
                  }}>
                  {s.label}
                </button>
              ))}
            </div>

            {hasActiveFilter && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 text-[11px] px-3 py-2 rounded-lg"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <X size={11} /> Filtreleri temizle
              </button>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#F4821F]" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
              <Package size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                Henüz ürün yok
              </p>
              <p className="text-[12px] mb-4 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                Önce <Link href="/admin/katalog/kategoriler" className="text-[#F4821F] hover:underline">kategoriler</Link> ve
                istersen <Link href="/admin/katalog/markalar" className="text-[#F4821F] hover:underline">markalar</Link> tanımla,
                sonra ürün eklemeye başla.
              </p>
              <Link href="/admin/katalog/urunler/new"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#F4821F] hover:underline">
                <Plus size={12} /> İlk ürünü oluştur
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Filtreyle eşleşen ürün bulunamadı.
              <button onClick={clearFilters} className="ml-2 text-[#F4821F] hover:underline">
                Filtreleri temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => {
                const priceTl = p.minPriceUsd ? Number(p.minPriceUsd) * kur : 0
                const hasOriginal = p.originalPrice && p.minPriceUsd && Number(p.originalPrice) > Number(p.minPriceUsd)
                return (
                  <div key={p.id} className="rounded-2xl overflow-hidden transition-all hover:shadow-md group"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                    {/* Image */}
                    <div className="aspect-[4/3] relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
                      {p.mainImageUrl ? (
                        <img src={p.mainImageUrl} alt={p.name}
                          className="w-full h-full object-cover"
                          onError={e => (e.currentTarget.style.display = 'none')} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <Package size={36} />
                        </div>
                      )}

                      {/* Top-left badges */}
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {p.featured && (
                          <span className="w-7 h-7 rounded-full bg-[#F4821F] flex items-center justify-center shadow-md"
                            title="Öne çıkan">
                            <Star size={12} className="text-white fill-white" />
                          </span>
                        )}
                        {p.badge && (
                          <span className="text-[9px] font-black px-1.5 py-1 rounded text-white animate-pulse"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #ec4899)',
                              boxShadow: '0 2px 6px rgba(239,68,68,0.3)',
                            }}>
                            ⚡ {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Top-right status */}
                      <div className="absolute top-2 right-2 z-10">
                        {!p.active && (
                          <span className="text-[9px] font-black px-2 py-1 rounded uppercase tracking-[0.5px]"
                            style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                            Pasif
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-bold leading-tight truncate"
                            style={{ color: 'var(--text-primary)' }}>
                            {p.name}
                          </h3>
                          <code className="text-[10px] mt-0.5 inline-block px-1.5 py-0.5 rounded font-mono"
                            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                            {p.slug}
                          </code>
                        </div>
                      </div>

                      {/* Category + Brand */}
                      <div className="flex items-center gap-1.5 mb-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <span>{p.categoryName}</span>
                        {p.brandName && (
                          <>
                            <span>·</span>
                            <span className="font-semibold">{p.brandName}</span>
                          </>
                        )}
                      </div>

                      {/* Price */}
                      {p.minPriceUsd ? (
                        <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                          <div className="flex items-end gap-2">
                            {hasOriginal && (
                              <span className="text-[11px] line-through" style={{ color: 'var(--text-muted)' }}>
                                ₺{(Number(p.originalPrice) * kur).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                              </span>
                            )}
                            <span className={`text-[16px] font-black tracking-[-0.5px] ${hasOriginal ? 'text-red-500' : ''}`}
                              style={!hasOriginal ? { color: 'var(--text-primary)' } : {}}>
                              ₺{priceTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {p.minPriceQty} adet'ten başlayan
                          </p>
                        </div>
                      ) : (
                        <div className="mb-3 pb-3 text-[11px] italic" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                          Henüz fiyat baremi eklenmedi
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/katalog/urunler/${p.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold py-2 rounded-lg transition-colors hover:bg-orange-500/5"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                          <Edit2 size={11} /> Düzenle
                        </Link>
                        <button onClick={() => handleToggle(p)} disabled={togglingId === p.id}
                          title={p.active ? 'Pasife al' : 'Aktife al'}
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                          {togglingId === p.id
                            ? <Loader2 size={12} className="animate-spin" />
                            : p.active ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
                        </button>
                        <button onClick={() => handleDelete(p)} disabled={deletingId === p.id}
                          title="Sil"
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-red-500"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                          {deletingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 p-4 rounded-xl text-[12px]"
            style={{ background: 'rgba(244,130,31,0.05)', border: '1px solid rgba(244,130,31,0.2)', color: 'var(--text-secondary)' }}>
            💡 <strong>İpucu:</strong> Ürün eklemeden önce ürünün dahil olacağı kategori ve o kategorinin <strong>öznitelikleri</strong> tanımlı olmalı.
            Örn: Kartvizit kategorisinde "Kağıt", "Ebat", "Selefon" gibi öznitelikler. Ürün eklerken bu öznitelikler için hangi seçenekleri desteklediğini seçeceksin.
          </div>
        </div>
      </main>
    </AdminGuard>
  )
}