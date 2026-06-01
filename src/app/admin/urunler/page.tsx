'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Upload, TrendingUp, ToggleLeft, ToggleRight, Download,
  Save, Search, RefreshCw, Edit2, Trash2, Loader2, Star
} from 'lucide-react'

const KATEGORILER = [
  { slug: 'buyuk-format', label: 'Büyük Format', icon: '🖼️' },
  { slug: 'kartvizit',    label: 'Kartvizit',    icon: '🪪' },
  { slug: 'sticker',      label: 'Sticker',       icon: '🏷️' },
  { slug: 'tabela',       label: 'Tabela',        icon: '🪧' },
  { slug: 'brosur',       label: 'Broşür',        icon: '📄' },
  { slug: 'promosyon',    label: 'Promosyon',     icon: '🎁' },
]

const PRICING_MODELS = [
  { val: 'AREA_BASED',      label: 'Alan bazlı (m²)' },
  { val: 'TIERED_QUANTITY', label: 'Adet kademeli' },
  { val: 'PACKAGE',         label: 'Paket fiyatı' },
  { val: 'UNIT',            label: 'Adet bazlı' },
]

const UNITS = ['m2', 'adet', 'paket', 'tabaka']

interface PriceTier {
  minQty: number | null
  maxQty: number | null
  price: number
}

interface Product {
  id: string; name: string; slug: string
  pricingModel: string; unit: string
  minOrder: number; description: string; isActive: boolean
  imageUrl?: string
  basePrice?: number
  priceTiers?: PriceTier[]
  featured?: boolean
  badge?: string
  originalPrice?: number
}

interface UrunForm {
  name: string; slug: string; kategoriSlug: string
  pricingModel: string; unit: string
  minOrder: number; description: string; basePrice: number
  imageUrl: string
  priceTiers: PriceTier[]
  featured: boolean
  badge: string
  originalPrice: number
}

const EMPTY: UrunForm = {
  name: '', slug: '', kategoriSlug: 'buyuk-format',
  pricingModel: 'AREA_BASED', unit: 'm2',
  minOrder: 1, description: '', basePrice: 0, imageUrl: '',
  priceTiers: [],
  featured: false, badge: '', originalPrice: 0,
}

const isTieredModel = (m: string) => m === 'TIERED_QUANTITY' || m === 'PACKAGE'

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

function UrunlerContent() {
  const params = useSearchParams()
  const [tab, setTab] = useState<'list'|'ekle'|'import'|'fiyat'>(
    params.get('tab') === 'import' ? 'import' : 'list'
  )
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [aktifKat, setAktifKat] = useState('tumu')
  const [form, setForm] = useState<UrunForm>(EMPTY)
  const [editId, setEditId] = useState<string|null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [bulkType, setBulkType] = useState('PERCENT_INCREASE')
  const [bulkValue, setBulkValue] = useState(10)
  const [bulkKat, setBulkKat] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [togglingId, setTogglingId] = useState<string|null>(null)
  const [deletingId, setDeletingId] = useState<string|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    api.get('/api/products')
      .then(r => setProducts(r.data.data || []))
      .catch(() => toast.error('Ürünler yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const setName = (name: string) => {
    setForm(f => ({
      ...f, name,
      slug: editId ? f.slug : f.kategoriSlug + '-' + slugify(name)
    }))
  }

  const setKategori = (kat: string) => {
    const defaults: Record<string,{unit:string;pricingModel:string}> = {
      'buyuk-format': { unit: 'm2',    pricingModel: 'AREA_BASED' },
      'tabela':       { unit: 'm2',    pricingModel: 'AREA_BASED' },
      'kartvizit':    { unit: 'paket', pricingModel: 'PACKAGE' },
      'brosur':       { unit: 'paket', pricingModel: 'PACKAGE' },
      'sticker':      { unit: 'adet',  pricingModel: 'TIERED_QUANTITY' },
      'promosyon':    { unit: 'adet',  pricingModel: 'UNIT' },
    }
    const d = defaults[kat] || { unit: 'adet', pricingModel: 'UNIT' }
    setForm(f => ({
      ...f, kategoriSlug: kat, ...d,
      slug: editId ? f.slug : kat + (f.name ? '-' + slugify(f.name) : '')
    }))
  }

  const resetForm = () => { setForm(EMPTY); setEditId(null) }

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      toast.error('Ad ve slug zorunlu')
      return
    }

    const tiered = isTieredModel(form.pricingModel)
    let body: any

    if (tiered) {
      if (form.priceTiers.length === 0) {
        toast.error('En az bir fiyat baremi eklemelisiniz')
        return
      }
      const invalid = form.priceTiers.some(t =>
        t.minQty == null || t.minQty < 1 || !t.price || t.price <= 0
      )
      if (invalid) {
        toast.error('Tüm baremlerde min adet ve fiyat dolu olmalı')
        return
      }
      body = { ...form, priceTiers: form.priceTiers, basePrice: undefined }
    } else {
      if (form.basePrice <= 0) {
        toast.error('Fiyat zorunlu')
        return
      }
      body = { ...form, basePrice: form.basePrice, priceTiers: undefined }
    }

    setFormLoading(true)
    try {
      if (editId) {
        await api.put(`/api/admin/products/${editId}`, body)
        toast.success('Ürün güncellendi')
      } else {
        await api.post('/api/admin/products', body)
        toast.success('Ürün eklendi')
      }
      resetForm()
      setTab('list')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally { setFormLoading(false) }
  }

  const handleEdit = (p: Product) => {
    const kat = KATEGORILER.find(k => p.slug.startsWith(k.slug))?.slug || 'buyuk-format'
    setForm({
      name: p.name, slug: p.slug, kategoriSlug: kat,
      pricingModel: p.pricingModel, unit: p.unit,
      minOrder: p.minOrder, description: p.description,
      basePrice: Number(p.basePrice || 0),
      imageUrl: p.imageUrl || '',
      priceTiers: (p.priceTiers || []).map(t => ({
        minQty: t.minQty,
        maxQty: t.maxQty,
        price: Number(t.price),
      })),
      featured: p.featured || false,
      badge: p.badge || '',
      originalPrice: Number(p.originalPrice || 0),
    })
    setEditId(p.id)
    setTab('ekle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggle = async (id: string) => {
    setTogglingId(id)
    try {
      await api.patch(`/api/admin/products/${id}/toggle`)
      setProducts(ps => ps.map(p => p.id === id ? {...p, isActive: !p.isActive} : p))
    } catch { toast.error('Güncellenemedi') }
    finally { setTogglingId(null) }
  }

  const handleDelete = async (p: Product) => {
    if (!confirm(`"${p.name}" ürününü silmek istediğinize emin misiniz?`)) return
    setDeletingId(p.id)
    try {
      await api.delete(`/api/admin/products/${p.id}`)
      toast.success('Ürün silindi')
      setProducts(ps => ps.filter(x => x.id !== p.id))
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    } finally { setDeletingId(null) }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true); setImportResult(null)
    const fd = new FormData(); fd.append('file', file)
    try {
      const res = await api.post('/api/admin/products/import', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setImportResult(res.data.data)
      toast.success(`${res.data.data.imported} eklendi, ${res.data.data.updated} güncellendi`)
      load()
    } catch { toast.error('Import başarısız') }
    finally { setImporting(false); if(fileRef.current) fileRef.current.value = '' }
  }

  const handleBulk = async () => {
    setBulkLoading(true)
    try {
      const res = await api.patch('/api/admin/products/bulk-price', {
        categorySlug: bulkKat || undefined,
        updateType: bulkType, value: Number(bulkValue),
      })
      toast.success(`${res.data.data?.updatedRules || '?'} fiyat kuralı güncellendi`)
      load()
    } catch { toast.error('Toplu güncelleme başarısız') }
    finally { setBulkLoading(false) }
  }

  const downloadTemplate = () => {
    const csv = [
      'urun_adi,kategori,fiyatlandirma_modeli,birim,liste_fiyati,min_adet,aciklama,aktif',
      'Vinil Baskı 440gr,buyuk-format,AREA_BASED,m2,185,1,Yüksek kalite vinil baskı,1',
      'Kartvizit 350g Mat,kartvizit,PACKAGE,paket,180,250,350gr mat laminasyon,1',
      'Sticker Parlak,sticker,TIERED_QUANTITY,adet,8,10,Parlak yüzey sticker,1',
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    a.download = 'urun-sablonu.csv'; a.click()
  }

  const filtered = products.filter(p => {
    const katMatch = aktifKat === 'tumu' || p.slug.startsWith(aktifKat)
    const searchMatch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search.toLowerCase())
    return katMatch && searchMatch
  })

  const grouped = KATEGORILER.map(k => ({
    ...k,
    items: filtered.filter(p => p.slug.startsWith(k.slug))
  })).filter(g => g.items.length > 0)

  const counts = {
    tumu: products.length,
    aktif: products.filter(p => p.isActive).length,
    pasif: products.filter(p => !p.isActive).length,
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Başlık + tab */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                Ürün Yönetimi
              </h1>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {counts.tumu} ürün · {counts.aktif} aktif · {counts.pasif} pasif
              </p>
            </div>
            <div className="flex gap-2">
              {([
                { key: 'list',   label: 'Ürün Listesi' },
                { key: 'ekle',   label: editId ? '✏️ Düzenle' : '+ Yeni Ürün' },
                { key: 'import', label: '📥 Excel Import' },
                { key: 'fiyat',  label: '💰 Toplu Fiyat' },
              ] as const).map(t => (
                <button key={t.key}
                  onClick={() => { setTab(t.key); if(t.key !== 'ekle') resetForm() }}
                  className="text-[12px] px-4 py-2 rounded-lg border transition-colors font-medium"
                  style={{
                    background: tab === t.key ? 'var(--text-primary)' : 'var(--bg-card)',
                    color: tab === t.key ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    borderColor: 'var(--border)',
                  }}>
                  {t.label}
                </button>
              ))}
              <button onClick={load}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* ── ÜRÜN LİSTESİ ── */}
          {tab === 'list' && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-[280px]">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Ürün adı veya slug..."
                    className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <button onClick={() => setAktifKat('tumu')}
                    className="text-[11px] px-3 py-1.5 rounded-lg border transition-colors"
                    style={{
                      background: aktifKat === 'tumu' ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: aktifKat === 'tumu' ? 'var(--bg-primary)' : 'var(--text-muted)',
                      borderColor: 'var(--border)',
                    }}>
                    Tümü ({counts.tumu})
                  </button>
                  {KATEGORILER.map(k => {
                    const n = products.filter(p => p.slug.startsWith(k.slug)).length
                    return (
                      <button key={k.slug} onClick={() => setAktifKat(k.slug)}
                        className="text-[11px] px-3 py-1.5 rounded-lg border transition-colors"
                        style={{
                          background: aktifKat === k.slug ? 'var(--text-primary)' : 'var(--bg-card)',
                          color: aktifKat === k.slug ? 'var(--bg-primary)' : 'var(--text-muted)',
                          borderColor: 'var(--border)',
                        }}>
                        {k.icon} {k.label} ({n})
                      </button>
                    )
                  })}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 size={24} className="animate-spin text-[#F4821F]" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-14 text-[14px]" style={{ color: 'var(--text-muted)' }}>
                  {search ? `"${search}" için ürün bulunamadı` : 'Ürün bulunamadı'}
                </div>
              ) : (
                <div className="space-y-6">
                  {(aktifKat === 'tumu' ? grouped : [{
                    ...KATEGORILER.find(k => k.slug === aktifKat)!,
                    items: filtered
                  }]).map(g => (
                    <div key={g.slug}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[16px]">{g.icon}</span>
                        <h2 className="text-[12px] font-bold uppercase tracking-[1.5px]"
                          style={{ color: 'var(--text-muted)' }}>{g.label}</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                          {g.items.length}
                        </span>
                      </div>

                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                        <div className="grid grid-cols-[48px_1fr_110px_90px_70px_110px_90px] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.8px]"
                          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                          <span>Resim</span>
                          <span>Ürün adı / Slug</span>
                          <span>Fiyatlandırma</span>
                          <span>Birim</span>
                          <span>Min.</span>
                          <span>Rozet / Durum</span>
                          <span className="text-right">İşlem</span>
                        </div>

                        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                          {g.items.map(p => (
                            <div key={p.id}
                              className="grid grid-cols-[48px_1fr_110px_90px_70px_110px_90px] items-center px-4 py-3 transition-colors"
                              style={{ background: 'var(--bg-card)' }}>

                              {/* Resim */}
                              <div className="relative">
                                {p.featured && (
                                  <span className="absolute -top-1 -left-1 z-10">
                                    <Star size={12} className="text-[#F4821F] fill-[#F4821F]" />
                                  </span>
                                )}
                                {p.imageUrl
                                  ? <img src={p.imageUrl} alt={p.name}
                                      className="w-9 h-9 rounded-lg object-cover"
                                      style={{ border: '1px solid var(--border)' }}
                                      onError={e => (e.currentTarget.style.display = 'none')} />
                                  : <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px]"
                                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                      {KATEGORILER.find(k => p.slug.startsWith(k.slug))?.icon || '📦'}
                                    </div>
                                }
                              </div>

                              <div>
                                <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {p.name}
                                </p>
                                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                  {p.slug}
                                </p>
                                {p.description && (
                                  <p className="text-[11px] mt-0.5 truncate max-w-[280px]"
                                    style={{ color: 'var(--text-muted)' }}>
                                    {p.description}
                                  </p>
                                )}
                              </div>

                              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                                {PRICING_MODELS.find(m => m.val === p.pricingModel)?.label || p.pricingModel}
                              </span>
                              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{p.unit}</span>
                              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{p.minOrder}</span>

                              <div className="flex flex-col gap-1">
                                {p.badge && (
                                  <span className="text-[9px] font-black uppercase tracking-[0.5px] px-1.5 py-0.5 rounded text-white inline-block w-fit"
                                    style={{ background: 'linear-gradient(135deg, #ef4444, #ec4899)' }}>
                                    ⚡ {p.badge}
                                  </span>
                                )}
                                {p.isActive
                                  ? <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block w-fit"
                                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                                      Aktif
                                    </span>
                                  : <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block w-fit"
                                      style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: '1px solid rgba(107,114,128,0.2)' }}>
                                      Pasif
                                    </span>
                                }
                              </div>

                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => handleEdit(p)} title="Düzenle"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-[#F4821F]"
                                  style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                                  <Edit2 size={12} />
                                </button>
                                <button onClick={() => handleToggle(p.id)} disabled={togglingId === p.id}
                                  title={p.isActive ? 'Pasife al' : 'Aktife al'}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                  style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                                  {togglingId === p.id
                                    ? <Loader2 size={12} className="animate-spin" />
                                    : p.isActive ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
                                </button>
                                <button onClick={() => handleDelete(p)} disabled={deletingId === p.id}
                                  title="Sil"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-red-500"
                                  style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                                  {deletingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── YENİ ÜRÜN / DÜZENLE ── */}
          {tab === 'ekle' && (
            <div className="max-w-2xl">
              <div className="rounded-2xl p-6 space-y-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                    {editId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                  </p>
                  {editId && (
                    <button onClick={resetForm} className="text-[11px] text-[#F4821F] hover:underline">
                      Yeni ürüne geç
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">

                  {/* Kategori */}
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Kategori *</label>
                    <div className="flex gap-2 flex-wrap">
                      {KATEGORILER.map(k => (
                        <button key={k.slug} type="button" onClick={() => setKategori(k.slug)}
                          className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border transition-colors"
                          style={{
                            background: form.kategoriSlug === k.slug ? '#F4821F' : 'var(--bg-secondary)',
                            color: form.kategoriSlug === k.slug ? 'white' : 'var(--text-secondary)',
                            borderColor: form.kategoriSlug === k.slug ? '#F4821F' : 'var(--border)',
                            fontWeight: form.kategoriSlug === k.slug ? 600 : 400,
                          }}>
                          {k.icon} {k.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ürün adı */}
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Ürün adı *</label>
                    <input value={form.name} onChange={e => setName(e.target.value)}
                      placeholder="Vinil Baskı 440gr"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>

                  {/* Slug */}
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Slug (otomatik)</label>
                    <input value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))}
                      className="w-full px-3.5 py-2.5 text-[12px] rounded-lg outline-none font-mono"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }} />
                  </div>

                  {/* Fiyatlandırma */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Fiyatlandırma *</label>
                    <select value={form.pricingModel}
                      onChange={e => setForm(f => ({...f, pricingModel: e.target.value}))}
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      {PRICING_MODELS.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                    </select>
                  </div>

                  {/* Birim */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Birim *</label>
                    <select value={form.unit}
                      onChange={e => setForm(f => ({...f, unit: e.target.value}))}
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>

                  {/* Min sipariş */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Min. Sipariş *</label>
                    <input type="number" min="1" value={form.minOrder}
                      onChange={e => setForm(f => ({...f, minOrder: +e.target.value}))}
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>

                  {/* Fiyat — modele göre tek input ya da tier tablosu */}
                  {!isTieredModel(form.pricingModel) ? (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                        style={{ color: 'var(--text-muted)' }}>
                        Baz fiyat ($ USD / {form.unit}) *
                      </label>
                      <input type="number" min="0" step="0.01" value={form.basePrice || ''}
                        onChange={e => setForm(f => ({...f, basePrice: +e.target.value}))}
                        placeholder="3.20"
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                      <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                        Fiyat USD. Müşteriye Ayarlar'daki kur ile TL gösterilir.
                      </p>
                    </div>
                  ) : (
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                        style={{ color: 'var(--text-muted)' }}>
                        Fiyat Baremleri ($ USD) *
                      </label>
                      <div className="space-y-2">
                        {form.priceTiers.length === 0 && (
                          <div className="text-[12px] py-3 px-3 rounded-lg"
                            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                            Henüz barem yok. Aşağıdaki butondan ekle.
                          </div>
                        )}
                        {form.priceTiers.map((t, i) => (
                          <div key={i} className="grid grid-cols-[1fr_1fr_1.2fr_auto] gap-2 items-center">
                            <input type="number" min="1" placeholder="Min adet"
                              value={t.minQty ?? ''}
                              onChange={e => setForm(f => ({
                                ...f,
                                priceTiers: f.priceTiers.map((x, j) =>
                                  j === i ? { ...x, minQty: e.target.value ? +e.target.value : null } : x)
                              }))}
                              className="px-3 py-2 text-[13px] rounded-lg outline-none"
                              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />

                            <input type="number" min="1" placeholder="Max (boş=∞)"
                              value={t.maxQty ?? ''}
                              onChange={e => setForm(f => ({
                                ...f,
                                priceTiers: f.priceTiers.map((x, j) =>
                                  j === i ? { ...x, maxQty: e.target.value ? +e.target.value : null } : x)
                              }))}
                              className="px-3 py-2 text-[13px] rounded-lg outline-none"
                              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />

                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px]"
                                style={{ color: 'var(--text-muted)' }}>$</span>
                              <input type="number" min="0" step="0.01"
                                placeholder={form.pricingModel === 'PACKAGE' ? 'Paket fiyatı' : 'Birim fiyat'}
                                value={t.price || ''}
                                onChange={e => setForm(f => ({
                                  ...f,
                                  priceTiers: f.priceTiers.map((x, j) =>
                                    j === i ? { ...x, price: +e.target.value } : x)
                                }))}
                                className="w-full pl-7 pr-3 py-2 text-[13px] rounded-lg outline-none"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                            </div>

                            <button type="button"
                              onClick={() => setForm(f => ({
                                ...f,
                                priceTiers: f.priceTiers.filter((_, j) => j !== i)
                              }))}
                              className="w-9 h-9 rounded-lg text-red-500 hover:bg-red-500/10 flex items-center justify-center"
                              style={{ border: '1px solid var(--border)' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        <button type="button"
                          onClick={() => setForm(f => {
                            const last = f.priceTiers[f.priceTiers.length - 1]
                            const nextMin = last?.maxQty != null ? last.maxQty + 1
                              : last?.minQty != null ? last.minQty + 1
                              : 1
                            return {
                              ...f,
                              priceTiers: [...f.priceTiers, { minQty: nextMin, maxQty: null, price: 0 }]
                            }
                          })}
                          className="text-[12px] py-2 px-3 rounded-lg hover:bg-orange-500/5"
                          style={{ color: '#F4821F', border: '1px dashed var(--border)' }}>
                          + Barem ekle
                        </button>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                        Fiyatlar USD. Aralıklar çakışmamalı; üst barem için Max boş bırakılır.
                      </p>
                    </div>
                  )}

                  {/* Öne çıkan + Kampanya etiketi + Eski fiyat */}
                  <div className="col-span-2 grid grid-cols-3 gap-3 pt-3 mt-1"
                    style={{ borderTop: '1px dashed var(--border)' }}>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                        style={{ color: 'var(--text-muted)' }}>Öne çıkar</label>
                      <button type="button" onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                        className="w-full flex items-center justify-center gap-2 text-[12px] font-semibold px-3 py-2.5 rounded-lg transition-all"
                        style={form.featured
                          ? { background: 'rgba(244,130,31,0.15)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.4)' }
                          : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        {form.featured ? '⭐ Öne çıkan' : '☆ Normal'}
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                        style={{ color: 'var(--text-muted)' }}>Kampanya Etiketi</label>
                      <input value={form.badge}
                        onChange={e => setForm(f => ({ ...f, badge: e.target.value.toUpperCase().slice(0, 25) }))}
                        placeholder="FLASH, YENİ"
                        className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none uppercase"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                        style={{ color: 'var(--text-muted)' }}>Eski Fiyat ($)</label>
                      <input type="number" min="0" step="0.01" value={form.originalPrice || ''}
                        onChange={e => setForm(f => ({ ...f, originalPrice: +e.target.value }))}
                        placeholder="0 = indirim yok"
                        className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>

                  {/* Açıklama */}
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Açıklama</label>
                    <textarea value={form.description}
                      onChange={e => setForm(f => ({...f, description: e.target.value}))}
                      rows={2} placeholder="Kısa ürün açıklaması..."
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>

                  {/* Resim URL */}
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Ürün Görseli (URL)</label>
                    <div className="flex items-center gap-3">
                      {form.imageUrl && (
                        <img src={form.imageUrl} alt="önizleme"
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          style={{ border: '1px solid var(--border)' }}
                          onError={e => (e.currentTarget.style.display = 'none')} />
                      )}
                      <input value={form.imageUrl}
                        onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3.5 py-2.5 text-[12px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                      Unsplash veya herhangi bir resim URL'i girin. URL girince önizleme görünür.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { resetForm(); setTab('list') }}
                    className="px-5 py-2.5 text-[13px] rounded-lg border transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                    İptal
                  </button>
                  <button onClick={handleSave} disabled={formLoading}
                    className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-white rounded-lg transition-colors disabled:opacity-50"
                    style={{ background: '#F4821F' }}>
                    {formLoading
                      ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                      : <><Save size={14} /> {editId ? 'Güncelle' : 'Kaydet'}</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── EXCEL IMPORT ── */}
          {tab === 'import' && (
            <div className="max-w-2xl space-y-4">
              <div className="rounded-2xl p-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      Excel / CSV ile Toplu Import
                    </p>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      CSV veya Excel dosyasıyla ürünleri toplu ekle veya güncelle
                    </p>
                  </div>
                  <button onClick={downloadTemplate}
                    className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                    <Download size={13} /> Şablon indir
                  </button>
                </div>

                <div className="mb-5 p-3 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
                    Zorunlu kolonlar
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['urun_adi', 'kategori', 'liste_fiyati'].map(c => (
                      <code key={c} className="text-[11px] px-2 py-0.5 rounded"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#F4821F' }}>
                        {c}
                      </code>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
                    Opsiyonel kolonlar
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['fiyatlandirma_modeli', 'birim', 'min_adet', 'aciklama', 'aktif'].map(c => (
                      <code key={c} className="text-[11px] px-2 py-0.5 rounded"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {c}
                      </code>
                    ))}
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    Kategori değerleri: buyuk-format, kartvizit, sticker, tabela, brosur, promosyon
                  </p>
                </div>

                <label className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  importing ? 'border-[#F4821F]' : 'hover:border-[#F4821F]'}`}
                  style={{ borderColor: importing ? '#F4821F' : 'var(--border-strong)' }}>
                  {importing
                    ? <Loader2 size={28} className="mx-auto mb-3 animate-spin text-[#F4821F]" />
                    : <Upload size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />}
                  <p className="text-[14px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    {importing ? 'Import ediliyor...' : 'Dosyayı sürükle veya tıkla'}
                  </p>
                  <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>.csv · .xlsx · Maks 5MB</p>
                  <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls"
                    className="hidden" onChange={handleImport} disabled={importing} />
                </label>
              </div>

              {importResult && (
                <div className="rounded-2xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-[14px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Import Sonucu</p>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { l: 'Toplam Satır', v: importResult.totalRows, c: 'var(--text-primary)' },
                      { l: 'Eklendi',      v: importResult.imported,  c: '#10B981' },
                      { l: 'Güncellendi',  v: importResult.updated,   c: '#3B82F6' },
                      { l: 'Hata',         v: importResult.errors,    c: '#EF4444' },
                    ].map((m, i) => (
                      <div key={i} className="p-3 rounded-xl text-center"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                        <p className="text-[22px] font-black" style={{ color: m.c }}>{m.v}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.l}</p>
                      </div>
                    ))}
                  </div>
                  {importResult.errorMessages?.length > 0 && (
                    <div className="p-3 rounded-lg"
                      style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {importResult.errorMessages.map((e: string, i: number) => (
                        <p key={i} className="text-[11px] text-red-500">{e}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TOPLU FİYAT ── */}
          {tab === 'fiyat' && (
            <div className="max-w-lg">
              <div className="rounded-2xl p-6 space-y-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Toplu Fiyat Güncelleme
                </p>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Kategori (boş = tüm ürünler)</label>
                  <select value={bulkKat} onChange={e => setBulkKat(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Tüm ürünler</option>
                    {KATEGORILER.map(k => <option key={k.slug} value={k.slug}>{k.icon} {k.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>İşlem türü</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 'PERCENT_INCREASE', label: '% Zam uygula' },
                      { val: 'PERCENT_DECREASE', label: '% İndirim uygula' },
                      { val: 'FIXED_INCREASE',   label: '$ Artış ekle' },
                      { val: 'FIXED_PRICE',      label: 'Sabit fiyat yap' },
                    ].map(o => (
                      <button key={o.val} type="button" onClick={() => setBulkType(o.val)}
                        className="text-[12px] py-2.5 rounded-lg border transition-colors font-medium"
                        style={{
                          background: bulkType === o.val ? 'var(--text-primary)' : 'var(--bg-secondary)',
                          color: bulkType === o.val ? 'var(--bg-primary)' : 'var(--text-secondary)',
                          borderColor: 'var(--border)',
                        }}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>
                    Değer {bulkType.includes('PERCENT') ? '(%)' : '($)'}
                  </label>
                  <input type="number" min="0" value={bulkValue}
                    onChange={e => setBulkValue(+e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div className="p-3 rounded-xl text-[12px]"
                  style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.2)', color: '#F4821F' }}>
                  {bulkType === 'PERCENT_INCREASE' && `${bulkKat ? KATEGORILER.find(k=>k.slug===bulkKat)?.label+' ürünleri' : 'Tüm ürünler'} %${bulkValue} zamlanacak`}
                  {bulkType === 'PERCENT_DECREASE' && `${bulkKat ? KATEGORILER.find(k=>k.slug===bulkKat)?.label+' ürünleri' : 'Tüm ürünler'} %${bulkValue} indirilecek`}
                  {bulkType === 'FIXED_INCREASE'   && `${bulkKat ? KATEGORILER.find(k=>k.slug===bulkKat)?.label+' ürünleri' : 'Tüm ürünler'} fiyatlarına $${bulkValue} eklenecek`}
                  {bulkType === 'FIXED_PRICE'      && `${bulkKat ? KATEGORILER.find(k=>k.slug===bulkKat)?.label+' ürünleri' : 'Tüm ürünler'} fiyatı $${bulkValue} yapılacak`}
                </div>

                <button onClick={handleBulk} disabled={bulkLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white transition-colors disabled:opacity-50"
                  style={{ background: '#F4821F' }}>
                  {bulkLoading
                    ? <><Loader2 size={14} className="animate-spin" /> Güncelleniyor...</>
                    : <><TrendingUp size={14} /> Fiyatları Güncelle</>}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </AdminGuard>
  )
}

export default function AdminUrunlerPage() {
  return <Suspense><UrunlerContent /></Suspense>
}