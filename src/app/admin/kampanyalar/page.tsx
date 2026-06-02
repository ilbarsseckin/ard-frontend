'use client'
import { useState, useEffect, useRef } from 'react'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Plus, Edit2, Trash2, Save, X, Loader2,
  ArrowUp, ArrowDown, Eye, EyeOff, Megaphone, Upload,
  Link as LinkIcon, Monitor, Smartphone,
} from 'lucide-react'

interface Campaign {
  id: string
  label?: string
  title: string
  description?: string
  badgeText?: string
  badgeColor?: string
  imageUrl?: string
  mobileImageUrl?: string
  backgroundColor?: string
  ctaText?: string
  ctaLink?: string
  sortOrder: number
  active: boolean
  startsAt?: string
  endsAt?: string
  createdAt?: string
  updatedAt?: string
}

interface FormData {
  label: string
  title: string
  description: string
  badgeText: string
  badgeColor: string
  imageUrl: string
  mobileImageUrl: string
  backgroundColor: string
  ctaText: string
  ctaLink: string
  active: boolean
  startsAt: string
  endsAt: string
}

const EMPTY_FORM: FormData = {
  label: '', title: '', description: '',
  badgeText: '', badgeColor: '#F4821F',
  imageUrl: '', mobileImageUrl: '',
  backgroundColor: '#fef3c7',
  ctaText: '', ctaLink: '',
  active: true,
  startsAt: '', endsAt: '',
}

const PRESET_COLORS = [
  '#F4821F', '#ef4444', '#16a34a', '#2563eb',
  '#9333ea', '#db2777', '#0891b2', '#fef3c7',
]

type ImageVariant = 'desktop' | 'mobile'

function KampanyalarInner() {
  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [mobileImageMode, setMobileImageMode] = useState<'url' | 'upload'>('url')
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false)
  const mobileFileInputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    api.get('/api/admin/campaigns')
      .then(r => setItems(r.data.data || []))
      .catch(() => toast.error('Kampanyalar yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditId(null)
    setForm({ ...EMPTY_FORM })
    setImageMode('url')
    setMobileImageMode('url')
    setModalOpen(true)
  }

  const openEdit = (c: Campaign) => {
    setEditId(c.id)
    setForm({
      label: c.label || '',
      title: c.title || '',
      description: c.description || '',
      badgeText: c.badgeText || '',
      badgeColor: c.badgeColor || '#F4821F',
      imageUrl: c.imageUrl || '',
      mobileImageUrl: c.mobileImageUrl || '',
      backgroundColor: c.backgroundColor || '#fef3c7',
      ctaText: c.ctaText || '',
      ctaLink: c.ctaLink || '',
      active: c.active,
      startsAt: c.startsAt ? c.startsAt.substring(0, 16) : '',
      endsAt: c.endsAt ? c.endsAt.substring(0, 16) : '',
    })
    setImageMode('url')
    setMobileImageMode('url')
    setModalOpen(true)
  }

  const handleImageUpload = async (file: File, variant: ImageVariant) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Resim 10 MB üstü')
      return
    }
    const setUploading = variant === 'mobile' ? setUploadingMobileImage : setUploadingImage
    const formField = variant === 'mobile' ? 'mobileImageUrl' : 'imageUrl'

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'banner')
      const res = await api.post('/api/admin/images/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(f => ({ ...f, [formField]: res.data.data.url }))
      toast.success(variant === 'mobile' ? 'Mobil görsel yüklendi' : 'Görsel yüklendi')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Yüklenemedi')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, variant: ImageVariant) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file, variant)
    e.target.value = ''
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Başlık zorunlu'); return }
    if (!form.imageUrl.trim()) { toast.error('Görsel zorunlu'); return }

    setSaving(true)
    const body: any = {
      label: form.label || null,
      title: form.title,
      description: form.description || null,
      badgeText: form.badgeText || null,
      badgeColor: form.badgeColor || null,
      imageUrl: form.imageUrl || null,
      mobileImageUrl: form.mobileImageUrl || null,
      backgroundColor: form.backgroundColor || null,
      ctaText: form.ctaText || null,
      ctaLink: form.ctaLink || null,
      active: form.active,
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
    }

    try {
      if (editId) {
        await api.put(`/api/admin/campaigns/${editId}`, body)
        toast.success('Kampanya güncellendi')
      } else {
        await api.post('/api/admin/campaigns', body)
        toast.success('Kampanya oluşturuldu')
      }
      setModalOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (c: Campaign) => {
    try {
      await api.patch(`/api/admin/campaigns/${c.id}/toggle`)
      load()
    } catch {
      toast.error('Durum değiştirilemedi')
    }
  }

  const handleDelete = async (c: Campaign) => {
    if (!confirm(`"${c.title}" kampanyası silinsin mi?`)) return
    try {
      await api.delete(`/api/admin/campaigns/${c.id}`)
      toast.success('Kampanya silindi')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    }
  }

  const handleReorder = async (c: Campaign, dir: 'up' | 'down') => {
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)
    const idx = sorted.findIndex(x => x.id === c.id)
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= sorted.length) return

    const reordered = [...sorted]
    ;[reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]]
    try {
      await api.post('/api/admin/campaigns/reorder', { ids: reordered.map(x => x.id) })
      load()
    } catch {
      toast.error('Sıralama başarısız')
    }
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  const renderImageUploader = (variant: ImageVariant) => {
    const isMobile = variant === 'mobile'
    const value = isMobile ? form.mobileImageUrl : form.imageUrl
    const field = isMobile ? 'mobileImageUrl' : 'imageUrl'
    const mode = isMobile ? mobileImageMode : imageMode
    const setMode = isMobile ? setMobileImageMode : setImageMode
    const uploading = isMobile ? uploadingMobileImage : uploadingImage
    const ref = isMobile ? mobileFileInputRef : fileInputRef

    return (
      <div>
        <label className="flex items-center gap-1.5 text-[12px] font-semibold mb-1.5"
          style={{ color: 'var(--text-secondary)' }}>
          {isMobile ? <Smartphone size={13} /> : <Monitor size={13} />}
          {isMobile ? 'Mobil Görsel (opsiyonel)' : 'Banner Görseli *'}
        </label>

        <div className="flex gap-1 mb-2">
          <button type="button" onClick={() => setMode('url')}
            className="flex-1 text-[11px] py-1.5 rounded-lg font-medium transition-colors"
            style={mode === 'url'
              ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.2)' }
              : { color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <LinkIcon size={11} className="inline mr-1" /> URL
          </button>
          <button type="button" onClick={() => setMode('upload')}
            className="flex-1 text-[11px] py-1.5 rounded-lg font-medium transition-colors"
            style={mode === 'upload'
              ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.2)' }
              : { color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <Upload size={11} className="inline mr-1" /> Yükle
          </button>
        </div>

        {mode === 'url' ? (
          <input value={value}
            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg text-[13px]"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        ) : (
          <div onClick={() => !uploading && ref.current?.click()}
            className="w-full py-4 rounded-lg flex items-center justify-center cursor-pointer text-[12px]"
            style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
            {uploading
              ? <><Loader2 size={14} className="animate-spin mr-1.5" /> Yükleniyor...</>
              : <><Upload size={14} className="mr-1.5" /> Dosya seç (maks. 10 MB)</>}
            <input ref={ref} type="file" accept="image/*" hidden
              onChange={e => handleFileSelect(e, variant)} />
          </div>
        )}

        {value && (
          <div className="mt-2 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-24 object-cover" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminNavbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Megaphone size={20} style={{ color: '#F4821F' }} />
            <h1 className="text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Kampanyalar
            </h1>
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
              ({items.length})
            </span>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-2 rounded-lg text-white"
            style={{ background: '#F4821F' }}>
            <Plus size={15} /> Yeni Kampanya
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin" style={{ color: '#F4821F' }} />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
            <Megaphone size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-[14px]">Henüz kampanya yok. İlk kampanyanı oluştur.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((c, i) => (
              <div key={c.id}
                className="flex items-center gap-4 p-3 rounded-2xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: c.active ? 1 : 0.55 }}>

                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleReorder(c, 'up')} disabled={i === 0}
                    className="p-1 rounded disabled:opacity-25" style={{ color: 'var(--text-muted)' }}>
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => handleReorder(c, 'down')} disabled={i === sorted.length - 1}
                    className="p-1 rounded disabled:opacity-25" style={{ color: 'var(--text-muted)' }}>
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="relative w-28 h-16 rounded-lg overflow-hidden shrink-0"
                  style={{ background: c.backgroundColor || 'var(--surface)' }}>
                  {c.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                  {c.badgeText && (
                    <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                      style={{ background: c.badgeColor || '#F4821F' }}>
                      {c.badgeText}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {c.label && (
                    <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#F4821F' }}>
                      {c.label}
                    </p>
                  )}
                  <p className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    {c.title}
                  </p>
                  {c.description && (
                    <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {c.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(c)} title={c.active ? 'Pasifleştir' : 'Aktifleştir'}
                    className="p-2 rounded-lg" style={{ color: c.active ? '#16a34a' : 'var(--text-muted)' }}>
                    {c.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(c)}
                    className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(c)}
                    className="p-2 rounded-lg hover:text-red-500" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModalOpen(false)}>
          <div onClick={e => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            <div className="sticky top-0 flex items-center justify-between px-5 py-3.5 z-10"
              style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {editId ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <Field label="Üst Etiket (opsiyonel)">
                <Input value={form.label} onChange={v => setForm(f => ({ ...f, label: v }))}
                  placeholder="örn. FIRSAT" />
              </Field>

              <Field label="Başlık *">
                <Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))}
                  placeholder="örn. 3 Yelken Bayrak Alana Kartvizit 1 TL" />
              </Field>

              <Field label="Açıklama (opsiyonel)">
                <textarea value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} placeholder="Teklif detayı..."
                  className="w-full px-3 py-2 rounded-lg text-[13px] resize-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Rozet Metni">
                  <Input value={form.badgeText} onChange={v => setForm(f => ({ ...f, badgeText: v }))}
                    placeholder="örn. 1 TL" />
                </Field>
                <Field label="Rozet Rengi">
                  <ColorPicker value={form.badgeColor} onChange={v => setForm(f => ({ ...f, badgeColor: v }))} />
                </Field>
              </div>

              {renderImageUploader('desktop')}
              {renderImageUploader('mobile')}

              <Field label="Arka Plan Rengi">
                <ColorPicker value={form.backgroundColor} onChange={v => setForm(f => ({ ...f, backgroundColor: v }))} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Buton Metni">
                  <Input value={form.ctaText} onChange={v => setForm(f => ({ ...f, ctaText: v }))}
                    placeholder="örn. İncele" />
                </Field>
                <Field label="Buton Linki">
                  <Input value={form.ctaLink} onChange={v => setForm(f => ({ ...f, ctaLink: v }))}
                    placeholder="/katalog" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Başlangıç (opsiyonel)">
                  <input type="datetime-local" value={form.startsAt}
                    onChange={e => setForm(f => ({ ...f, startsAt: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px]"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </Field>
                <Field label="Bitiş (opsiyonel)">
                  <input type="datetime-local" value={form.endsAt}
                    onChange={e => setForm(f => ({ ...f, endsAt: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px]"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </Field>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Aktif</span>
              </label>
            </div>

            <div className="sticky bottom-0 flex gap-2 px-5 py-3.5"
              style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setModalOpen(false)}
                className="flex-1 text-[13px] font-medium py-2.5 rounded-lg"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                İptal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold py-2.5 rounded-lg text-white disabled:opacity-60"
                style={{ background: '#F4821F' }}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── küçük yardımcı bileşenler ───
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg text-[13px]"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
  )
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-9 h-9 rounded-lg cursor-pointer shrink-0"
        style={{ border: '1px solid var(--border)', background: 'transparent' }} />
      <div className="flex flex-wrap gap-1">
        {PRESET_COLORS.map(col => (
          <button key={col} type="button" onClick={() => onChange(col)}
            className="w-5 h-5 rounded" style={{ background: col, border: value === col ? '2px solid var(--text-primary)' : '1px solid var(--border)' }} />
        ))}
      </div>
    </div>
  )
}

export default function KampanyalarAdmin() {
  return (
    <AdminGuard>
      <KampanyalarInner />
    </AdminGuard>
  )
}