'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import MultiImageUpload from '@/components/ui/MultiImageUpload'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Save, Loader2, ChevronLeft, Plus, Trash2, Package, Image as ImageIcon,
  Sliders, DollarSign, Star, Layers, Info,
} from 'lucide-react'

interface Category { id: string; slug: string; name: string; icon?: string }
interface Brand    { id: string; slug: string; name: string }
interface AttrOption { id: string; value: string; colorHex?: string; sortOrder?: number }
interface Attribute  {
  id: string; attrKey: string; label: string; inputType: string;
  required: boolean; sortOrder: number; options?: AttrOption[]
}
interface ProductTier  { qty: number; priceUsd: number }
interface ProductImage { url: string; altText: string; sortOrder: number }

const EMPTY_FORM = {
  slug: '', name: '', shortDesc: '', longDesc: '',
  categoryId: '', brandId: '',
  featured: false, badge: '', originalPrice: 0,
  active: true, sortOrder: 0,
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

export default function ProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const isNew = id === 'new'

  // Form state
  const [form, setForm] = useState(EMPTY_FORM)
  // attributeId → Set<optionId>
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Set<string>>>({})
  const [tiers, setTiers] = useState<ProductTier[]>([])
  const [images, setImages] = useState<ProductImage[]>([])

  // Reference data
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [attrsLoading, setAttrsLoading] = useState(false)
  const [kur, setKur] = useState(45)

  // ─── İlk yükleme: kategoriler, markalar, kur, (varsa) ürün ───
  useEffect(() => {
    const promises: Promise<any>[] = [
      api.get('/api/admin/catalog/categories'),
      api.get('/api/admin/catalog/brands'),
      api.get('/api/settings/public'),
    ]
    if (!isNew) promises.push(api.get(`/api/admin/catalog/products/${id}`))

    Promise.all(promises).then(([catRes, brandRes, settRes, prodRes]) => {
      setCategories(catRes.data.data || [])
      setBrands(brandRes.data.data || [])
      setKur(parseFloat(settRes.data.data?.usd_kur || '45'))

      if (!isNew && prodRes) {
        const p = prodRes.data.data
        setForm({
          slug: p.slug || '',
          name: p.name || '',
          shortDesc: p.shortDesc || '',
          longDesc: p.longDesc || '',
          categoryId: p.categoryId || '',
          brandId: p.brandId || '',
          featured: p.featured || false,
          badge: p.badge || '',
          originalPrice: Number(p.originalPrice || 0),
          active: p.active !== false,
          sortOrder: p.sortOrder || 0,
        })
        // selectedOptions
        const selMap: Record<string, Set<string>> = {}
        for (const attr of (p.attributes || [])) {
          selMap[attr.attributeId] = new Set((attr.selectedOptions || []).map((o: any) => o.id))
        }
        setSelectedOptions(selMap)
        // tiers
        setTiers((p.tiers || []).map((t: any) => ({
          qty: t.qty, priceUsd: Number(t.priceUsd)
        })))
        // images
        setImages((p.images || []).map((img: any) => ({
          url: img.url, altText: img.altText || '', sortOrder: img.sortOrder || 0
        })))
      }
    }).catch(() => toast.error('Veri yüklenemedi'))
      .finally(() => setLoading(false))
  }, [id, isNew])

  // ─── Kategori değişince → o kategorinin attribute'larını çek ───
  useEffect(() => {
    if (!form.categoryId) {
      setAttributes([])
      return
    }
    setAttrsLoading(true)
    api.get(`/api/admin/catalog/categories/${form.categoryId}/attributes`)
      .then(r => setAttributes(r.data.data || []))
      .catch(() => toast.error('Öznitelikler yüklenemedi'))
      .finally(() => setAttrsLoading(false))
  }, [form.categoryId])

  // ─── Helpers ───
  const setName = (name: string) => {
    setForm(f => ({ ...f, name, slug: isNew ? slugify(name) : f.slug }))
  }

  const toggleOption = (attrId: string, optId: string) => {
    setSelectedOptions(prev => {
      const next = { ...prev }
      const set = new Set(next[attrId] || [])
      if (set.has(optId)) set.delete(optId)
      else set.add(optId)
      next[attrId] = set
      return next
    })
  }

  const addTier = () => {
    const last = tiers[tiers.length - 1]
    const nextQty = last ? last.qty * 2 : 100
    setTiers([...tiers, { qty: nextQty, priceUsd: 0 }])
  }

  const updateTier = (i: number, field: 'qty' | 'priceUsd', val: number) => {
    setTiers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t))
  }

  const removeTier = (i: number) => {
    setTiers(prev => prev.filter((_, idx) => idx !== i))
  }

  // ─── Kaydet ───
  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Ad ve slug zorunlu')
      return
    }
    if (!form.slug.match(/^[a-z0-9-]+$/)) {
      toast.error('Slug sadece küçük harf, rakam ve tire içerebilir')
      return
    }
    if (!form.categoryId) {
      toast.error('Kategori seçimi zorunlu')
      return
    }

    // Tier validasyonu
    for (const t of tiers) {
      if (!t.qty || t.qty < 1 || !t.priceUsd || t.priceUsd <= 0) {
        toast.error('Tüm baremlerde geçerli adet ve fiyat olmalı (0\'dan büyük)')
        return
      }
    }
    // Image validasyonu — MultiImageUpload zaten boş URL'leri eklemez
    // (eski "URL boş olamaz" check'i kaldırıldı)

    setSaving(true)
    const attributeValues = Object.entries(selectedOptions)
      .filter(([, set]) => set.size > 0)
      .map(([attrId, set]) => ({
        attributeId: attrId,
        optionIds: Array.from(set),
      }))

    const body = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      shortDesc: form.shortDesc.trim() || null,
      longDesc: form.longDesc.trim() || null,
      categoryId: form.categoryId,
      brandId: form.brandId || null,
      featured: form.featured,
      badge: form.badge.trim() || null,
      originalPrice: form.originalPrice || null,
      active: form.active,
      sortOrder: form.sortOrder,
      attributeValues,
      tiers: tiers.map((t, idx) => ({ ...t, sortOrder: idx })),
      images: images.map((img, idx) => ({ ...img, sortOrder: idx })),
    }

    try {
      if (isNew) {
        const res = await api.post('/api/admin/catalog/products', body)
        toast.success('Ürün oluşturuldu')
        router.push(`/admin/katalog/urunler/${res.data.data.id}`)
      } else {
        await api.put(`/api/admin/catalog/products/${id}`, body)
        toast.success('Ürün güncellendi')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminNavbar />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <Loader2 size={24} className="animate-spin text-[#F4821F]" />
        </main>
      </AdminGuard>
    )
  }

  const selectedCategory = categories.find(c => c.id === form.categoryId)

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Breadcrumb */}
          <div className="text-[12px] mb-4 flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
            <Link href="/admin" className="hover:underline">Admin</Link>
            <span>›</span>
            <Link href="/admin/katalog/urunler" className="hover:underline">Ürünler</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {isNew ? 'Yeni' : (form.name || '...')}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <ChevronLeft size={14} />
              </button>
              <div>
                <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                  {isNew ? 'Yeni Ürün' : 'Ürünü Düzenle'}
                </h1>
                {!isNew && form.name && (
                  <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {form.name}
                  </p>
                )}
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
              {saving
                ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                : <><Save size={14} /> {isNew ? 'Oluştur' : 'Güncelle'}</>}
            </button>
          </div>

          <div className="space-y-5">

            {/* ─── 1) Temel Bilgiler ─── */}
            <div className="rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Package size={16} className="text-[#F4821F]" />
                <h2 className="text-[14px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                  Temel Bilgiler
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Ürün Adı *</label>
                  <input value={form.name} onChange={e => setName(e.target.value)}
                    placeholder="Standart Kartvizit"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Slug (URL) *</label>
                  <input value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase() }))}
                    placeholder="standart-kartvizit"
                    className="w-full px-3.5 py-2.5 text-[12px] rounded-lg outline-none font-mono"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Kategori *</label>
                  <select value={form.categoryId}
                    onChange={e => {
                      setForm(f => ({ ...f, categoryId: e.target.value }))
                      // Kategori değişirse attribute seçimleri sıfırlanır
                      setSelectedOptions({})
                    }}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">— Kategori seç —</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Marka (opsiyonel)</label>
                  <select value={form.brandId}
                    onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">— Marka yok —</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Kısa Açıklama</label>
                  <input value={form.shortDesc}
                    onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))}
                    placeholder="350g mat/parlak kuse, ekonomik"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    Kart üzerinde ve listede görünür (1 satır)
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Uzun Açıklama</label>
                  <textarea value={form.longDesc}
                    onChange={e => setForm(f => ({ ...f, longDesc: e.target.value }))}
                    rows={4}
                    placeholder="Detay sayfasında görünür, ürünün tüm özelliklerini açıklayan metin..."
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>
            </div>

            {/* ─── 2) Öznitelikler ─── */}
            {form.categoryId && (
              <div className="rounded-2xl p-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sliders size={16} className="text-[#F4821F]" />
                    <h2 className="text-[14px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                      Öznitelikler
                    </h2>
                  </div>
                  {selectedCategory && (
                    <Link href={`/admin/katalog/kategoriler/${selectedCategory.id}/oznitelikler`}
                      target="_blank"
                      className="text-[11px] font-semibold text-[#F4821F] hover:underline">
                      Öznitelikleri yönet →
                    </Link>
                  )}
                </div>

                {attrsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={20} className="animate-spin text-[#F4821F]" />
                  </div>
                ) : attributes.length === 0 ? (
                  <div className="text-center py-8 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    <Info size={20} className="mx-auto mb-2 opacity-50" />
                    Bu kategoride henüz öznitelik tanımlı değil.
                    {selectedCategory && (
                      <p className="mt-2">
                        <Link href={`/admin/katalog/kategoriler/${selectedCategory.id}/oznitelikler`}
                          className="text-[#F4821F] hover:underline">
                          {selectedCategory.name} için öznitelik tanımla →
                        </Link>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {attributes.map(attr => {
                      const isText = attr.inputType === 'text'
                      const selectedSet = selectedOptions[attr.id] || new Set<string>()
                      return (
                        <div key={attr.id}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[12px] font-bold uppercase tracking-[1px]"
                              style={{ color: 'var(--text-muted)' }}>
                              {attr.label}
                            </span>
                            {attr.required && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase"
                                style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                                ZORUNLU
                              </span>
                            )}
                          </div>

                          {isText ? (
                            <div className="text-[11px] italic px-3 py-2 rounded-lg"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                              Serbest metin — kullanıcı sipariş sırasında doldurur
                            </div>
                          ) : (attr.options && attr.options.length > 0) ? (
                            <div className="flex flex-wrap gap-2">
                              {attr.options.map(opt => {
                                const sel = selectedSet.has(opt.id)
                                return (
                                  <button key={opt.id} type="button"
                                    onClick={() => toggleOption(attr.id, opt.id)}
                                    className="flex items-center gap-2 text-[12px] font-semibold px-3 py-2 rounded-lg transition-all"
                                    style={sel
                                      ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '2px solid #F4821F' }
                                      : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '2px solid var(--border)' }}>
                                    {opt.colorHex && (
                                      <span className="w-3.5 h-3.5 rounded-full"
                                        style={{ background: opt.colorHex, border: '1px solid var(--border)' }} />
                                    )}
                                    {opt.value}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <p className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>
                              Bu özniteliğe henüz seçenek eklenmedi.
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="mt-5 p-3 rounded-lg text-[11px]"
                  style={{ background: 'rgba(244,130,31,0.05)', color: 'var(--text-secondary)' }}>
                  💡 Bu üründe <strong>hangi seçeneklerin geçerli</strong> olduğunu işaretle.
                  Müşteri detay sayfasında sadece seçtiğin seçeneklerden tercih yapabilecek.
                </div>
              </div>
            )}

            {/* ─── 3) Fiyat Baremleri ─── */}
            <div className="rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-[#F4821F]" />
                  <h2 className="text-[14px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                    Fiyat Baremleri (USD)
                  </h2>
                </div>
                <button onClick={addTier}
                  className="flex items-center gap-1.5 text-[11px] font-semibold py-1.5 px-3 rounded-lg hover:bg-orange-500/5"
                  style={{ color: '#F4821F', border: '1px dashed rgba(244,130,31,0.4)' }}>
                  <Plus size={12} /> Barem ekle
                </button>
              </div>

              {tiers.length === 0 ? (
                <div className="text-center py-8 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  Henüz fiyat baremi yok. Yukarıdan ekle.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-3 text-[10px] font-bold uppercase tracking-[1px]"
                    style={{ color: 'var(--text-muted)' }}>
                    <span>Adet</span>
                    <span>Fiyat ($)</span>
                    <span>TL (önizleme)</span>
                    <span></span>
                  </div>
                  {tiers.map((t, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                      <input type="number" min="1" value={t.qty || ''}
                        onChange={e => updateTier(i, 'qty', parseInt(e.target.value) || 0)}
                        placeholder="500"
                        className="px-3 py-2 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                      <input type="number" min="0" step="0.01" value={t.priceUsd || ''}
                        onChange={e => updateTier(i, 'priceUsd', parseFloat(e.target.value) || 0)}
                        placeholder="16.00"
                        className="px-3 py-2 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                      <div className="px-3 py-2 text-[13px] font-bold rounded-lg"
                        style={{ background: 'var(--bg-secondary)', color: '#F4821F', border: '1px solid var(--border)' }}>
                        ₺{((t.priceUsd || 0) * kur).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                      </div>
                      <button onClick={() => removeTier(i)}
                        className="w-9 h-9 rounded-lg text-red-500 hover:bg-red-500/10 flex items-center justify-center"
                        style={{ border: '1px solid var(--border)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
                USD kuru: $1 = ₺{kur.toFixed(2)} · Ayarlar'dan güncellenir
              </p>
            </div>

            {/* ─── 4) Resimler ─── */}
            <div className="rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon size={16} className="text-[#F4821F]" />
                <h2 className="text-[14px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                  Resimler
                </h2>
              </div>

              <MultiImageUpload
                values={images.map(i => i.url)}
                onChange={urls => {
                  // mevcut altText'leri url eşleşmesine göre koru
                  const altMap = new Map(images.map(i => [i.url, i.altText]))
                  setImages(urls.map((url, idx) => ({
                    url,
                    altText: altMap.get(url) || '',
                    sortOrder: idx,
                  })))
                }}
                type="product"
                maxItems={8}
              />

              <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
                İlk resim (★1) ürün kartının ana görseli, ikincisi mouse hover'da gösterilir. Sıralamayı hover'daki oklarla değiştir.
              </p>
            </div>

            {/* ─── 5) Kampanya & Sıralama ─── */}
            <div className="rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Star size={16} className="text-[#F4821F]" />
                <h2 className="text-[14px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                  Kampanya & Sıralama
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Öne çıkar</label>
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                    className="w-full flex items-center justify-center gap-2 text-[12px] font-semibold py-2.5 rounded-lg transition-all"
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
                    onChange={e => setForm(f => ({ ...f, originalPrice: parseFloat(e.target.value) || 0 }))}
                    placeholder="0 = indirim yok"
                    className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Sıra</label>
                  <input type="number" value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Durum</label>
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                    className="w-full flex items-center justify-center gap-2 text-[12px] font-semibold py-2.5 rounded-lg transition-all"
                    style={form.active
                      ? { background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
                      : { background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: '1px solid var(--border)' }}>
                    {form.active ? '● Aktif' : '○ Pasif'}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer save */}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => router.push('/admin/katalog/urunler')}
                className="px-5 py-2.5 text-[13px] rounded-lg"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                İptal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
                {saving
                  ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                  : <><Save size={14} /> {isNew ? 'Oluştur' : 'Güncelle'}</>}
              </button>
            </div>

          </div>
        </div>
      </main>
    </AdminGuard>
  )
}