'use client'
import { useState, useEffect } from 'react'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import ImageUpload from '@/components/ui/ImageUpload'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save, Loader2,
  RefreshCw, Tag, Search,
} from 'lucide-react'

interface Brand {
  id: string
  slug: string
  name: string
  logoUrl?: string
  description?: string
  active: boolean
  productCount: number
}

interface FormData {
  slug: string
  name: string
  logoUrl: string
  description: string
  active: boolean
}

const EMPTY_FORM: FormData = {
  slug: '', name: '', logoUrl: '', description: '', active: true,
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

export default function AdminMarkalarPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api.get('/api/admin/catalog/brands')
      .then(r => setBrands(r.data.data || []))
      .catch(() => toast.error('Markalar yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const setName = (name: string) => {
    setForm(f => ({
      ...f, name,
      slug: editId ? f.slug : slugify(name)
    }))
  }

  const openNew = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (b: Brand) => {
    setEditId(b.id)
    setForm({
      slug: b.slug,
      name: b.name,
      logoUrl: b.logoUrl || '',
      description: b.description || '',
      active: b.active,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Ad ve slug zorunlu')
      return
    }
    if (!form.slug.match(/^[a-z0-9-]+$/)) {
      toast.error('Slug sadece küçük harf, rakam ve tire içerebilir')
      return
    }
    setSaving(true)
    const body = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      logoUrl: form.logoUrl.trim() || null,
      description: form.description.trim() || null,
      active: form.active,
    }
    try {
      if (editId) {
        await api.put(`/api/admin/catalog/brands/${editId}`, body)
        toast.success('Marka güncellendi')
      } else {
        await api.post('/api/admin/catalog/brands', body)
        toast.success('Marka oluşturuldu')
      }
      closeModal()
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally { setSaving(false) }
  }

  const handleToggle = async (b: Brand) => {
    setTogglingId(b.id)
    try {
      await api.patch(`/api/admin/catalog/brands/${b.id}/toggle`)
      load()
    } catch {
      toast.error('Değiştirilemedi')
    } finally { setTogglingId(null) }
  }

  const handleDelete = async (b: Brand) => {
    if (b.productCount > 0) {
      toast.error(`Bu markayı ${b.productCount} ürün kullanıyor, önce onları taşı`)
      return
    }
    if (!confirm(`"${b.name}" markasını silmek istediğine emin misin?`)) return
    setDeletingId(b.id)
    try {
      await api.delete(`/api/admin/catalog/brands/${b.id}`)
      toast.success('Marka silindi')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    } finally { setDeletingId(null) }
  }

  const filtered = brands.filter(b =>
    !search ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.includes(search.toLowerCase())
  )

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag size={18} className="text-[#F4821F]" />
                <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                  Marka Yönetimi
                </h1>
              </div>
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                Toplam {brands.length} marka · {brands.filter(b => b.active).length} aktif
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={openNew}
                className="flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-lg bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors">
                <Plus size={14} />
                Yeni Marka
              </button>
              <button onClick={load}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {brands.length > 0 && (
            <div className="relative mb-5 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Marka adı veya slug..."
                className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#F4821F]" />
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
              <Tag size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                Henüz marka tanımlı değil
              </p>
              <p className="text-[12px] mb-4 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                Markalı ürünleriniz için (İdeal, Trodat vs.) burada marka tanımları yaparsınız.
                Ürün eklerken opsiyonel olarak marka atayabilirsiniz.
              </p>
              <button onClick={openNew}
                className="text-[12px] font-bold text-[#F4821F] hover:underline">
                + İlk markayı oluştur
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-[13px]" style={{ color: 'var(--text-muted)' }}>
              "{search}" için marka bulunamadı
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map(b => (
                <div key={b.id} className="rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                  <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    {b.logoUrl
                      ? <img src={b.logoUrl} alt={b.name}
                          className="w-full h-full object-contain"
                          onError={e => (e.currentTarget.style.display = 'none')} />
                      : <Tag size={18} style={{ color: 'var(--text-muted)' }} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                        {b.name}
                      </span>
                      <code className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        /{b.slug}
                      </code>
                      {!b.active && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-[0.5px]"
                          style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: '1px solid rgba(107,114,128,0.2)' }}>
                          PASİF
                        </span>
                      )}
                    </div>
                    {b.description && (
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                        {b.description}
                      </p>
                    )}
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      <strong>{b.productCount}</strong> ürün
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(b)} title="Düzenle"
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-[#F4821F]"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleToggle(b)} disabled={togglingId === b.id}
                      title={b.active ? 'Pasife al' : 'Aktife al'}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                      {togglingId === b.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : b.active ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
                    </button>
                    <button onClick={() => handleDelete(b)} disabled={deletingId === b.id}
                      title="Sil"
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-red-500"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                      {deletingId === b.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={closeModal}>
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editId ? 'Markayı Düzenle' : 'Yeni Marka'}
                </h3>
                <button onClick={closeModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Marka Adı *</label>
                  <input value={form.name} onChange={e => setName(e.target.value)}
                    placeholder="İdeal"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Slug *</label>
                  <input value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase() }))}
                    placeholder="ideal"
                    className="w-full px-3.5 py-2.5 text-[12px] rounded-lg outline-none font-mono"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
                </div>

                {/* ─── Logo upload (eski URL input yerine) ─── */}
                <ImageUpload
                  value={form.logoUrl}
                  onChange={url => setForm(f => ({ ...f, logoUrl: url || '' }))}
                  type="brand"
                  label="Logo"
                  square
                />

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Açıklama</label>
                  <textarea value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Kısa marka açıklaması..."
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                      className="w-10 h-6 rounded-full transition-colors relative flex-shrink-0"
                      style={{ background: form.active ? '#10B981' : '#6B7280' }}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{ left: form.active ? 'calc(100% - 22px)' : '2px' }} />
                    </button>
                    <span className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                      {form.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={closeModal}
                  className="px-5 py-2.5 text-[13px] rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                  İptal
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                    : <><Save size={14} /> {editId ? 'Güncelle' : 'Kaydet'}</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminGuard>
  )
}