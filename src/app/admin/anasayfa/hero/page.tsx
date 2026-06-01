'use client'
import { useState, useEffect, useRef } from 'react'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Plus, Edit2, Trash2, Save, X, Loader2,
  ArrowUp, ArrowDown, Image as ImageIcon,
  Eye, EyeOff, Calendar, Sparkles, Upload, Link as LinkIcon,
  Monitor, Smartphone,
} from 'lucide-react'

interface HeroSlide {
  id: string
  label?: string
  title: string
  description?: string
  ctaText?: string
  ctaLink?: string
  imageUrl?: string
  mobileImageUrl?: string   // ✨ YENİ
  backgroundColor?: string
  layout: 'SPLIT_LEFT' | 'SPLIT_RIGHT' | 'OVERLAY' | 'IMAGE_ONLY'
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
  ctaText: string
  ctaLink: string
  imageUrl: string
  mobileImageUrl: string    // ✨ YENİ
  backgroundColor: string
  layout: HeroSlide['layout']
  active: boolean
  startsAt: string
  endsAt: string
}

const EMPTY_FORM: FormData = {
  label: '', title: '', description: '',
  ctaText: '', ctaLink: '',
  imageUrl: '', mobileImageUrl: '',
  backgroundColor: '#fef3c7',
  layout: 'SPLIT_LEFT', active: true,
  startsAt: '', endsAt: '',
}

const PRESET_COLORS = [
  '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3',
  '#fed7aa', '#e0e7ff', '#f3e8ff', '#ccfbf1',
]

const LAYOUT_LABELS: Record<HeroSlide['layout'], string> = {
  SPLIT_LEFT:  'Sol Görsel / Sağ Metin',
  SPLIT_RIGHT: 'Sol Metin / Sağ Görsel',
  OVERLAY:     'Görsel Üzerine Metin',
  IMAGE_ONLY:  'Sadece Görsel',
}

type ImageVariant = 'desktop' | 'mobile'

function HeroAdminInner() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  // Desktop image state
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ✨ YENİ: Mobile image state
  const [mobileImageMode, setMobileImageMode] = useState<'url' | 'upload'>('url')
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false)
  const mobileFileInputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    api.get('/api/admin/hero-slides')
      .then(r => setSlides(r.data.data || []))
      .catch(() => toast.error('Slide\'lar yüklenemedi'))
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

  const openEdit = (s: HeroSlide) => {
    setEditId(s.id)
    setForm({
      label: s.label || '',
      title: s.title || '',
      description: s.description || '',
      ctaText: s.ctaText || '',
      ctaLink: s.ctaLink || '',
      imageUrl: s.imageUrl || '',
      mobileImageUrl: s.mobileImageUrl || '',
      backgroundColor: s.backgroundColor || '#fef3c7',
      layout: s.layout,
      active: s.active,
      startsAt: s.startsAt ? s.startsAt.substring(0, 16) : '',
      endsAt: s.endsAt ? s.endsAt.substring(0, 16) : '',
    })
    setImageMode('url')
    setMobileImageMode('url')
    setModalOpen(true)
  }

  // ✨ Tek fonksiyon, hem desktop hem mobile için
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
      fd.append('folder', 'hero')
      const res = await api.post('/api/admin/images/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(f => ({ ...f, [formField]: res.data.data.url }))
      toast.success(variant === 'mobile' ? 'Mobil resim yüklendi' : 'Desktop resim yüklendi')
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
    if (!form.title.trim()) {
      toast.error('Başlık zorunlu')
      return
    }

    setSaving(true)
    const body: any = {
      label: form.label || null,
      title: form.title,
      description: form.description || null,
      ctaText: form.ctaText || null,
      ctaLink: form.ctaLink || null,
      imageUrl: form.imageUrl || null,
      mobileImageUrl: form.mobileImageUrl || null,  // ✨ YENİ
      backgroundColor: form.backgroundColor || null,
      layout: form.layout,
      active: form.active,
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
    }

    try {
      if (editId) {
        await api.put(`/api/admin/hero-slides/${editId}`, body)
        toast.success('Slide güncellendi')
      } else {
        await api.post('/api/admin/hero-slides', body)
        toast.success('Slide oluşturuldu')
      }
      setModalOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (s: HeroSlide) => {
    try {
      await api.patch(`/api/admin/hero-slides/${s.id}/toggle`)
      load()
    } catch {
      toast.error('Toggle başarısız')
    }
  }

  const handleDelete = async (s: HeroSlide) => {
    if (!confirm(`"${s.title}" slide'ı silinsin mi?`)) return
    try {
      await api.delete(`/api/admin/hero-slides/${s.id}`)
      toast.success('Slide silindi')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    }
  }

  const handleReorder = async (s: HeroSlide, dir: 'up' | 'down') => {
    const sorted = [...slides].sort((a, b) => a.sortOrder - b.sortOrder)
    const idx = sorted.findIndex(x => x.id === s.id)
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= sorted.length) return

    try {
      await Promise.all([
        api.patch(`/api/admin/hero-slides/${sorted[idx].id}`, { sortOrder: sorted[swap].sortOrder }),
        api.patch(`/api/admin/hero-slides/${sorted[swap].id}`, { sortOrder: sorted[idx].sortOrder }),
      ])
      load()
    } catch {
      toast.error('Sıralama başarısız')
    }
  }

  const sortedSlides = [...slides].sort((a, b) => a.sortOrder - b.sortOrder)

  // ─── Reusable image uploader section ───
  const renderImageUploader = (variant: ImageVariant) => {
    const isMobile = variant === 'mobile'
    const value = isMobile ? form.mobileImageUrl : form.imageUrl
    const field = isMobile ? 'mobileImageUrl' : 'imageUrl'
    const mode = isMobile ? mobileImageMode : imageMode
    const setMode = isMobile ? setMobileImageMode : setImageMode
    const uploading = isMobile ? uploadingMobileImage : uploadingImage
    const ref = isMobile ? mobileFileInputRef : fileInputRef

    const Icon = isMobile ? Smartphone : Monitor
    const titleText = isMobile ? 'Mobil Görseli' : 'Desktop Görseli'
    const subtitleText = isMobile
      ? 'Opsiyonel · Önerilen: 750 × 900 (dikey) · Bırakılırsa desktop kullanılır'
      : 'Önerilen: 1920 × 600 (yatay) · Maks 10 MB'

    return (
      <div className="rounded-xl p-4"
        style={{
          background: isMobile ? 'rgba(244,130,31,0.03)' : 'var(--bg-secondary)',
          border: isMobile ? '1px dashed rgba(244,130,31,0.3)' : '1px solid var(--border)',
        }}>
        <div className="flex items-center gap-2 mb-2">
          <Icon size={14} className="text-[#F4821F]" />
          <label className="text-[11px] font-bold uppercase tracking-[1px]"
            style={{ color: 'var(--text-primary)' }}>
            {titleText}
          </label>
          {isMobile && (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: 'rgba(244,130,31,0.15)', color: '#F4821F' }}>
              Opsiyonel
            </span>
          )}
        </div>
        <p className="text-[10px] mb-3" style={{ color: 'var(--text-muted)' }}>
          {subtitleText}
        </p>

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button type="button" onClick={() => setMode('url')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-bold rounded-lg transition-all"
            style={mode === 'url'
              ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1.5px solid #F4821F' }
              : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1.5px solid var(--border)' }}>
            <LinkIcon size={12} />
            URL ile
          </button>
          <button type="button" onClick={() => setMode('upload')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-bold rounded-lg transition-all"
            style={mode === 'upload'
              ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1.5px solid #F4821F' }
              : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1.5px solid var(--border)' }}>
            <Upload size={12} />
            Dosya Yükle
          </button>
        </div>

        {/* URL modu */}
        {mode === 'url' && (
          <input value={value}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            placeholder="https://... veya boş bırak"
            className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        )}

        {/* Upload modu */}
        {mode === 'upload' && (
          <div>
            <button type="button"
              onClick={() => uploading || ref.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-1.5 py-6 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
              style={{
                border: '2px dashed var(--border)',
                background: 'var(--bg-card)',
              }}>
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-[#F4821F]" />
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Yükleniyor...
                  </p>
                </>
              ) : (
                <>
                  <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                  <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                    Resim seç veya sürükle
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    JPG · PNG · WEBP · SVG — Maks 10 MB
                  </p>
                </>
              )}
            </button>
            <input ref={ref} type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
              className="hidden"
              onChange={e => handleFileSelect(e, variant)} />
          </div>
        )}

        {/* Önizleme */}
        {value && (
          <div className="mt-3 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              background: form.backgroundColor || '#f3f4f6',
              height: isMobile ? '160px' : '128px',
              maxWidth: isMobile ? '180px' : '100%',
              margin: isMobile ? '0 auto' : '0',
            }}>
            <img src={value} className="w-full h-full object-cover"
              onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
        )}

        {value && (
          <button type="button"
            onClick={() => setForm({ ...form, [field]: '' })}
            className="mt-2 text-[10px] font-bold transition-colors hover:underline"
            style={{ color: '#EF4444' }}>
            × Görseli kaldır
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen pb-12" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.5px] flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}>
                <Sparkles size={20} className="text-[#F4821F]" />
                Hero Slider
              </h1>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Ana sayfa üst banner slide'larını yönet · {slides.length} slide
              </p>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold rounded-lg bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors">
              <Plus size={13} /> Yeni Slide
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#F4821F]" />
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-20 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
              <ImageIcon size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px] mb-2" style={{ color: 'var(--text-secondary)' }}>
                Henüz hero slide yok
              </p>
              <button onClick={openCreate}
                className="text-[12px] font-bold text-[#F4821F] hover:underline">
                İlk slide'ı oluştur →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedSlides.map((s, idx) => (
                <div key={s.id} className="rounded-xl overflow-hidden flex items-stretch gap-0"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                  <div className="flex flex-col items-center justify-center px-3 gap-1"
                    style={{ borderRight: '1px solid var(--border)' }}>
                    <button onClick={() => handleReorder(s, 'up')}
                      disabled={idx === 0}
                      className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-orange-500/10 disabled:opacity-20">
                      <ArrowUp size={14} />
                    </button>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                      {idx + 1}
                    </span>
                    <button onClick={() => handleReorder(s, 'down')}
                      disabled={idx === sortedSlides.length - 1}
                      className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-orange-500/10 disabled:opacity-20">
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div className="w-28 flex-shrink-0 flex items-center justify-center relative"
                    style={{ background: s.backgroundColor || '#f3f4f6' }}>
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.title}
                        className="w-full h-full object-cover"
                        onError={e => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <ImageIcon size={28} className="opacity-30" />
                    )}
                    {/* Mobile image varsa indicator */}
                    {s.mobileImageUrl && (
                      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#F4821F' }}
                        title="Ayrı mobil görseli var">
                      <Smartphone size={10} className="text-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {s.label && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded text-white bg-[#F4821F]">
                          {s.label}
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-[0.5px]"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                        {LAYOUT_LABELS[s.layout]}
                      </span>
                      {s.active ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                          ● AKTİF
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(156,163,175,0.1)', color: 'var(--text-muted)' }}>
                          ○ PASİF
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-bold leading-tight mb-0.5 truncate"
                      style={{ color: 'var(--text-primary)' }}>
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {s.description}
                      </p>
                    )}
                    {s.ctaLink && (
                      <p className="text-[10px] mt-1 truncate"
                        style={{ color: 'var(--text-muted)' }}>
                        → {s.ctaText} ({s.ctaLink})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center px-3 gap-1"
                    style={{ borderLeft: '1px solid var(--border)' }}>
                    <button onClick={() => handleToggle(s)}
                      title={s.active ? 'Pasifleştir' : 'Aktifleştir'}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-orange-500/10"
                      style={{ color: s.active ? '#22c55e' : 'var(--text-muted)' }}>
                      {s.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => openEdit(s)}
                      title="Düzenle"
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-orange-500/10"
                      style={{ color: 'var(--text-secondary)' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(s)}
                      title="Sil"
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-500"
                      style={{ color: 'var(--text-muted)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--bg-card)' }}>

            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {editId ? 'Slide Düzenle' : 'Yeni Slide'}
              </h2>
              <button onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                  style={{ color: 'var(--text-secondary)' }}>
                  Düzen
                </label>
                <select value={form.layout}
                  onChange={e => setForm({ ...form, layout: e.target.value as any })}
                  className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  {Object.entries(LAYOUT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* ✨ Desktop görsel */}
              {renderImageUploader('desktop')}

              {/* ✨ Mobil görsel */}
              {renderImageUploader('mobile')}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                  style={{ color: 'var(--text-secondary)' }}>
                  Arka Plan Rengi
                </label>
                <div className="flex gap-2 flex-wrap items-center">
                  {PRESET_COLORS.map(c => (
                    <button key={c} type="button"
                      onClick={() => setForm({ ...form, backgroundColor: c })}
                      className="w-8 h-8 rounded-lg transition-transform hover:scale-110"
                      style={{
                        background: c,
                        border: form.backgroundColor === c ? '2px solid #F4821F' : '2px solid var(--border)',
                      }} />
                  ))}
                  <input value={form.backgroundColor}
                    onChange={e => setForm({ ...form, backgroundColor: e.target.value })}
                    placeholder="#hex"
                    className="px-3 py-1.5 text-[12px] rounded-lg outline-none w-24"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Etiket <span style={{ color: 'var(--text-muted)' }}>(badge)</span>
                  </label>
                  <input value={form.label}
                    onChange={e => setForm({ ...form, label: e.target.value })}
                    placeholder="%50 İNDİRİM"
                    className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Başlık <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Standart Kartvizit"
                    className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                  style={{ color: 'var(--text-secondary)' }}>
                  Açıklama
                </label>
                <textarea value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="1000 adet sadece 850 TL"
                  className="w-full px-3 py-2 text-[13px] rounded-lg outline-none resize-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Buton Yazısı
                  </label>
                  <input value={form.ctaText}
                    onChange={e => setForm({ ...form, ctaText: e.target.value })}
                    placeholder="İncele"
                    className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Buton Linki
                  </label>
                  <input value={form.ctaLink}
                    onChange={e => setForm({ ...form, ctaLink: e.target.value })}
                    placeholder="/urun/standart-kartvizit"
                    className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1"
                    style={{ color: 'var(--text-secondary)' }}>
                    <Calendar size={11} /> Başlangıç
                  </label>
                  <input type="datetime-local" value={form.startsAt}
                    onChange={e => setForm({ ...form, startsAt: e.target.value })}
                    className="w-full px-3 py-2 text-[12px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1"
                    style={{ color: 'var(--text-secondary)' }}>
                    <Calendar size={11} /> Bitiş
                  </label>
                  <input type="datetime-local" value={form.endsAt}
                    onChange={e => setForm({ ...form, endsAt: e.target.value })}
                    className="w-full px-3 py-2 text-[12px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-[#F4821F]" />
                <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Aktif
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  (siteye yayınla)
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3"
              style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-[12px] font-medium rounded-lg"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                İptal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {editId ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function HeroAdminPage() {
  return (
    <AdminGuard>
      <HeroAdminInner />
    </AdminGuard>
  )
}