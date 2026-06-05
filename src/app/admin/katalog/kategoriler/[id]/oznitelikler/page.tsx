'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Plus, Edit2, Trash2, X, Save, Loader2, RefreshCw, ChevronLeft,
  Sliders, Type, Image as ImageIcon, Palette, ListChecks, AlertCircle,
} from 'lucide-react'

interface Category {
  id: string
  slug: string
  name: string
  icon?: string
}

interface AttrOption {
  id: string
  attributeId: string
  value: string
  colorHex?: string
  sortOrder: number
  priceModifier: number
}

interface Attribute {
  id: string
  categoryId: string
  attrKey: string
  label: string
  inputType: string
  required: boolean
  sortOrder: number
  options?: AttrOption[]
}

const INPUT_TYPES = [
  { val: 'select', label: 'Seçim listesi', icon: ListChecks, desc: 'Önceden tanımlı seçeneklerden biri' },
  { val: 'text',   label: 'Serbest metin', icon: Type,       desc: 'Kullanıcı kendi yazar' },
  { val: 'color',  label: 'Renk seçici',    icon: Palette,    desc: 'Renk paletinden seçim (hex kod ile)' },
  { val: 'image',  label: 'Görsel seçici',  icon: ImageIcon,  desc: 'Görsel önizlemeli seçim' },
]

function snakeKey(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')
}

export default function CategoryAttributesPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [loading, setLoading] = useState(true)
  const [savingAttr, setSavingAttr] = useState(false)
  const [savingOpt, setSavingOpt] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [attrModalOpen, setAttrModalOpen] = useState(false)
  const [editingAttrId, setEditingAttrId] = useState<string | null>(null)
  const [attrForm, setAttrForm] = useState({ attrKey: '', label: '', inputType: 'select', required: false, sortOrder: 0 })

  const [optModalOpen, setOptModalOpen] = useState(false)
  const [editingOpt, setEditingOpt] = useState<{ id: string } | null>(null)
  const [targetAttr, setTargetAttr] = useState<Attribute | null>(null)
  const [optForm, setOptForm] = useState({ value: '', colorHex: '', sortOrder: 0, priceModifier: 1 })

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get(`/api/admin/catalog/categories/${categoryId}`),
      api.get(`/api/admin/catalog/categories/${categoryId}/attributes`),
    ]).then(([catRes, attrRes]) => {
      setCategory(catRes.data.data)
      setAttributes(attrRes.data.data || [])
    }).catch(() => toast.error('Veri yüklenemedi'))
    .finally(() => setLoading(false))
  }

  useEffect(() => { if (categoryId) load() }, [categoryId])

  const openNewAttr = () => {
    setEditingAttrId(null)
    setAttrForm({ attrKey: '', label: '', inputType: 'select', required: false, sortOrder: 0 })
    setAttrModalOpen(true)
  }

  const openEditAttr = (a: Attribute) => {
    setEditingAttrId(a.id)
    setAttrForm({
      attrKey: a.attrKey, label: a.label, inputType: a.inputType,
      required: a.required, sortOrder: a.sortOrder,
    })
    setAttrModalOpen(true)
  }

  const setAttrLabel = (label: string) => {
    setAttrForm(f => ({
      ...f, label,
      attrKey: editingAttrId ? f.attrKey : snakeKey(label),
    }))
  }

  const saveAttr = async () => {
    if (!attrForm.label.trim() || !attrForm.attrKey.trim()) {
      toast.error('Etiket ve anahtar zorunlu')
      return
    }
    if (!attrForm.attrKey.match(/^[a-z][a-z0-9_]*$/)) {
      toast.error('Anahtar küçük harfle başlamalı, sadece harf+rakam+alt çizgi')
      return
    }
    setSavingAttr(true)
    try {
      if (editingAttrId) {
        await api.put(`/api/admin/catalog/attributes/${editingAttrId}`, attrForm)
        toast.success('Öznitelik güncellendi')
      } else {
        await api.post(`/api/admin/catalog/categories/${categoryId}/attributes`, attrForm)
        toast.success('Öznitelik eklendi')
      }
      setAttrModalOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally { setSavingAttr(false) }
  }

  const deleteAttr = async (a: Attribute) => {
    if (!confirm(`"${a.label}" özniteliğini silmek istediğine emin misin? Tüm seçenekleri de silinecek.`)) return
    setDeletingId(a.id)
    try {
      await api.delete(`/api/admin/catalog/attributes/${a.id}`)
      toast.success('Öznitelik silindi')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    } finally { setDeletingId(null) }
  }

  const openNewOpt = (attr: Attribute) => {
    setEditingOpt(null)
    setTargetAttr(attr)
    setOptForm({ value: '', colorHex: '', sortOrder: (attr.options?.length || 0) + 1, priceModifier: 1 })
    setOptModalOpen(true)
  }

  const openEditOpt = (attr: Attribute, opt: AttrOption) => {
    setEditingOpt({ id: opt.id })
    setTargetAttr(attr)
    setOptForm({ value: opt.value, colorHex: opt.colorHex || '', sortOrder: opt.sortOrder, priceModifier: opt.priceModifier ?? 1 })
    setOptModalOpen(true)
  }

  const saveOpt = async () => {
    if (!optForm.value.trim()) {
      toast.error('Değer zorunlu')
      return
    }
    setSavingOpt(true)
    const body = {
      value: optForm.value.trim(),
      colorHex: optForm.colorHex.trim() || null,
      sortOrder: optForm.sortOrder,
      priceModifier: optForm.priceModifier,
    }
    try {
      if (editingOpt) {
        await api.put(`/api/admin/catalog/attribute-options/${editingOpt.id}`, body)
        toast.success('Seçenek güncellendi')
      } else if (targetAttr) {
        await api.post(`/api/admin/catalog/attributes/${targetAttr.id}/options`, body)
        toast.success('Seçenek eklendi')
      }
      setOptModalOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally { setSavingOpt(false) }
  }

  const deleteOpt = async (opt: AttrOption) => {
    if (!confirm(`"${opt.value}" seçeneğini silmek istediğine emin misin?`)) return
    setDeletingId(opt.id)
    try {
      await api.delete(`/api/admin/catalog/attribute-options/${opt.id}`)
      toast.success('Seçenek silindi')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    } finally { setDeletingId(null) }
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">

          <div className="text-[12px] mb-4 flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
            <Link href="/admin" className="hover:underline">Admin</Link>
            <span>›</span>
            <Link href="/admin/katalog/kategoriler" className="hover:underline">Kategoriler</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{category?.name || '...'}</span>
            <span>›</span>
            <span>Öznitelikler</span>
          </div>

          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <ChevronLeft size={14} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Sliders size={18} className="text-[#F4821F]" />
                  <h1 className="text-[20px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                    Öznitelikler
                  </h1>
                  {category && (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                      <span className="text-[18px]">{category.icon}</span>
                      <span className="text-[16px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                        {category.name}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  {attributes.length} öznitelik tanımlı
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={openNewAttr}
                className="flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-lg bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors">
                <Plus size={14} /> Yeni Öznitelik
              </button>
              <button onClick={load}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#F4821F]" />
            </div>
          ) : attributes.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
              <Sliders size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                Henüz öznitelik tanımlı değil
              </p>
              <p className="text-[12px] mb-4 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                Bu kategorideki ürünlerin sahip olabileceği özellikleri (ebat, renk, kağıt vb.) burada tanımlarsın.
              </p>
              <button onClick={openNewAttr}
                className="text-[12px] font-bold text-[#F4821F] hover:underline">
                + İlk özniteliği ekle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {attributes.map(attr => {
                const meta = INPUT_TYPES.find(t => t.val === attr.inputType) || INPUT_TYPES[0]
                const Icon = meta.icon
                const isSelectish = attr.inputType === 'select' || attr.inputType === 'color' || attr.inputType === 'image'
                return (
                  <div key={attr.id} className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                    <div className="p-5 flex items-center justify-between gap-4 flex-wrap"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(244,130,31,0.08)', color: '#F4821F' }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                              {attr.label}
                            </span>
                            <code className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                              {attr.attrKey}
                            </code>
                            {attr.required && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-[0.5px]"
                                style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                                ZORUNLU
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {meta.label} · {attr.options?.length || 0} seçenek
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEditAttr(attr)} title="Düzenle"
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:text-[#F4821F]"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => deleteAttr(attr)} disabled={deletingId === attr.id}
                          title="Sil"
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:text-red-500"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                          {deletingId === attr.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        </button>
                      </div>
                    </div>

                    {isSelectish ? (
                      <div className="p-5">
                        {attr.options && attr.options.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {attr.options.map(opt => (
                              <div key={opt.id} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                {opt.colorHex && (
                                  <span className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ background: opt.colorHex, border: '1px solid var(--border)' }} />
                                )}
                                <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {opt.value}
                                </span>
                                {opt.priceModifier && opt.priceModifier !== 1 ? (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}>
                                    x{Number(opt.priceModifier).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                                    style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                    baz
                                  </span>
                                )}
                                <button onClick={() => openEditOpt(attr, opt)} title="Düzenle"
                                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#F4821F]">
                                  <Edit2 size={11} />
                                </button>
                                <button onClick={() => deleteOpt(opt)} disabled={deletingId === opt.id} title="Sil"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500">
                                  {deletingId === opt.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[12px] mb-3 italic" style={{ color: 'var(--text-muted)' }}>
                            Henüz seçenek eklenmedi
                          </p>
                        )}
                        <button onClick={() => openNewOpt(attr)}
                          className="flex items-center gap-1.5 text-[11px] font-semibold py-1.5 px-3 rounded-lg hover:bg-orange-500/5 transition-colors"
                          style={{ color: '#F4821F', border: '1px dashed rgba(244,130,31,0.4)' }}>
                          <Plus size={12} /> Seçenek ekle
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 flex items-center gap-2 text-[12px]"
                        style={{ color: 'var(--text-muted)' }}>
                        <AlertCircle size={13} />
                        Serbest metin özniteliği için seçenek tanımlanmaz, ürün kullanıcısı doldurur.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ATTRIBUTE MODAL */}
        {attrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setAttrModalOpen(false)}>
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editingAttrId ? 'Özniteliği Düzenle' : 'Yeni Öznitelik'}
                </h3>
                <button onClick={() => setAttrModalOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Etiket *</label>
                  <input value={attrForm.label} onChange={e => setAttrLabel(e.target.value)}
                    placeholder="Kağıt, Ebat, Renk vb."
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Anahtar *</label>
                  <input value={attrForm.attrKey}
                    onChange={e => setAttrForm(f => ({ ...f, attrKey: e.target.value.toLowerCase() }))}
                    placeholder="kagit"
                    className="w-full px-3.5 py-2.5 text-[12px] rounded-lg outline-none font-mono"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    Küçük harfle başlamalı, sadece harf+rakam+alt çizgi.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Giriş Tipi *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {INPUT_TYPES.map(t => {
                      const Icon = t.icon
                      const sel = attrForm.inputType === t.val
                      return (
                        <button key={t.val} type="button"
                          onClick={() => setAttrForm(f => ({ ...f, inputType: t.val }))}
                          className="flex items-start gap-2 text-left p-3 rounded-lg transition-all"
                          style={sel
                            ? { background: 'rgba(244,130,31,0.08)', border: '2px solid #F4821F' }
                            : { background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
                          <Icon size={14}
                            style={{ color: sel ? '#F4821F' : 'var(--text-muted)', marginTop: 2 }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold mb-0.5"
                              style={{ color: sel ? '#F4821F' : 'var(--text-primary)' }}>
                              {t.label}
                            </p>
                            <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                              {t.desc}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Sıra</label>
                    <input type="number" value={attrForm.sortOrder}
                      onChange={e => setAttrForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Zorunlu</label>
                    <button type="button"
                      onClick={() => setAttrForm(f => ({ ...f, required: !f.required }))}
                      className="w-full text-[12px] font-semibold py-2.5 rounded-lg transition-all"
                      style={attrForm.required
                        ? { background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }
                        : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {attrForm.required ? 'Zorunlu' : 'İsteğe bağlı'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setAttrModalOpen(false)}
                  className="px-5 py-2.5 text-[13px] rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                  İptal
                </button>
                <button onClick={saveAttr} disabled={savingAttr}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
                  {savingAttr
                    ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                    : <><Save size={14} /> {editingAttrId ? 'Güncelle' : 'Kaydet'}</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OPTION MODAL */}
        {optModalOpen && targetAttr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOptModalOpen(false)}>
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editingOpt ? 'Seçeneği Düzenle' : 'Yeni Seçenek'}
                </h3>
                <button onClick={() => setOptModalOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>

              <p className="text-[12px] mb-4" style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>{targetAttr.label}</strong> özniteliğine seçenek
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Değer *</label>
                  <input value={optForm.value}
                    onChange={e => setOptForm(f => ({ ...f, value: e.target.value }))}
                    placeholder="350g Mat Kuse"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                {targetAttr.inputType === 'color' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Renk (hex)</label>
                    <div className="flex gap-2">
                      <input type="color" value={optForm.colorHex || '#000000'}
                        onChange={e => setOptForm(f => ({ ...f, colorHex: e.target.value }))}
                        className="w-12 h-10 rounded-lg cursor-pointer"
                        style={{ border: '1px solid var(--border)' }} />
                      <input value={optForm.colorHex}
                        onChange={e => setOptForm(f => ({ ...f, colorHex: e.target.value }))}
                        placeholder="#000000"
                        className="flex-1 px-3.5 py-2.5 text-[13px] rounded-lg outline-none font-mono"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Sıra</label>
                  <input type="number" value={optForm.sortOrder}
                    onChange={e => setOptForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                    style={{ color: 'var(--text-muted)' }}>
                    Fiyat Katsayısı
                  </label>
                  <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                    1.0 = baz fiyat · 1.3 = %30 pahalı · 0.8 = %20 ucuz
                  </p>
                  <input
                    type="number" step="0.01" min="0.01" max="9.99"
                    value={optForm.priceModifier}
                    onChange={e => setOptForm(f => ({ ...f, priceModifier: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none font-mono"
                    style={{
                      background: optForm.priceModifier !== 1 ? 'rgba(244,130,31,0.06)' : 'var(--bg-secondary)',
                      border: optForm.priceModifier !== 1 ? '1.5px solid #F4821F' : '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }} />
                  {optForm.priceModifier !== 1 && (
                    <p className="text-[11px] mt-1 font-semibold" style={{ color: '#F4821F' }}>
                      Baz fiyata göre {optForm.priceModifier > 1
                        ? `+%${((optForm.priceModifier - 1) * 100).toFixed(0)} daha pahalı`
                        : `-%${((1 - optForm.priceModifier) * 100).toFixed(0)} daha ucuz`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setOptModalOpen(false)}
                  className="px-5 py-2.5 text-[13px] rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                  İptal
                </button>
                <button onClick={saveOpt} disabled={savingOpt}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
                  {savingOpt
                    ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                    : <><Save size={14} /> {editingOpt ? 'Güncelle' : 'Kaydet'}</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminGuard>
  )
}