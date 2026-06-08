'use client'
import { useState, useEffect, useRef } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload, X, Star, StarOff, FolderOpen, Check } from 'lucide-react'

const CATEGORIES = ['Zincir Market', 'İçecek & FMCG', 'Restoran', 'Otel & Turizm', 'Etkinlik & Fuar', 'Diğer']
const COLORS = ['#E31E24','#003087','#E8000D','#F40009','#D62300','#006491','#F26522','#012169','#8A1538','#1B4F72','#F4821F','#1D9E75','#534AB7']

const emptyForm = { name: '', sector: '', category: CATEGORIES[0], description: '', color: '#F4821F', abbr: '', featured: false, active: true, showText: true, displayOrder: 0, logoUrl: '' }
// Dosya adından marka adı çıkar: "migros-logo.png" → "Migros"
const nameFromFile = (filename: string) =>
  filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export default function ReferanslarPage() {
  const [references, setReferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [filterCat, setFilterCat] = useState('Tümü')
  const logoRef = useRef<HTMLInputElement>(null)
  const bulkRef = useRef<HTMLInputElement>(null)

  // Toplu yükleme state
  const [bulkFiles, setBulkFiles] = useState<{ file: File; preview: string; name: string; category: string; sector: string; order: number }[]>([])
  const [bulkSaving, setBulkSaving] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)

  const load = () => {
    setLoading(true)
    api.get('/api/references').then(r => setReferences(r.data.data || [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setLogoFile(null)
    setLogoPreview('')
    setShowForm(true)
  }
const openEdit = (ref: any) => {
    setEditing(ref)
    setForm({
      name: ref.name, sector: ref.sector, category: ref.category,
      description: ref.description || '', color: ref.color || '#F4821F',
      abbr: ref.abbr || '', featured: ref.featured, active: ref.active,
      showText: ref.showText !== false,
      displayOrder: ref.displayOrder || 0, logoUrl: ref.logoUrl || '',
    })
    setLogoFile(null)
    setLogoPreview(ref.logoUrl || '')
    setShowForm(true)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setLogoFile(f)
    setLogoPreview(URL.createObjectURL(f))
  }

  // Toplu dosya seçimi
  const handleBulkSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const items = files.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      name: nameFromFile(file.name),
      category: CATEGORIES[0],
      sector: '',
      order: references.length + i,
    }))
    setBulkFiles(items)
    setShowBulk(true)
  }

  const handleBulkSave = async () => {
    if (!bulkFiles.length) return
    setBulkSaving(true)
    setBulkProgress(0)
    let success = 0
    for (let i = 0; i < bulkFiles.length; i++) {
      const item = bulkFiles[i]
      try {
        const fd = new FormData()
        fd.append('name', item.name)
        fd.append('sector', item.sector || item.category)
        fd.append('category', item.category)
        fd.append('active', 'true')
        fd.append('featured', 'false')
        fd.append('displayOrder', String(item.order))
        fd.append('logo', item.file)
        await api.post('/api/references', fd, { headers: { 'Content-Type': undefined } })
        success++
      } catch { /* devam et */ }
      setBulkProgress(Math.round(((i + 1) / bulkFiles.length) * 100))
    }
    toast.success(`${success}/${bulkFiles.length} referans eklendi`)
    setBulkSaving(false)
    setShowBulk(false)
    setBulkFiles([])
    load()
  }

const handleSave = async () => {
    if (!form.name || !form.sector || !form.category) {
      toast.error('İsim, sektör ve kategori zorunlu')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('sector', form.sector)
      fd.append('category', form.category)
      if (form.description) fd.append('description', form.description)
      if (form.color) fd.append('color', form.color)
      if (form.abbr) fd.append('abbr', form.abbr)
      fd.append('featured', String(form.featured))
      fd.append('active', String(form.active))
      fd.append('showText', String(form.showText))
      fd.append('displayOrder', String(form.displayOrder ?? 0))
      if (logoFile) fd.append('logo', logoFile)
      if (form.logoUrl) fd.append('logoUrl', form.logoUrl)

      if (editing) {
        await api.put(`/api/references/${editing.id}`, fd, { headers: { 'Content-Type': undefined } })
        toast.success('Referans güncellendi')
      } else {
        await api.post('/api/references', fd, { headers: { 'Content-Type': undefined } })
        toast.success('Referans eklendi')
      }
      setShowForm(false)
      load()
    } catch { toast.error('İşlem başarısız') }
    finally { setSaving(false) }
  }

  const handleToggle = async (id: string) => {
    try { await api.patch(`/api/references/${id}/toggle`); load() }
    catch { toast.error('Güncelleme başarısız') }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" referansını silmek istediğinizden emin misiniz?`)) return
    try { await api.delete(`/api/references/${id}`); toast.success('Silindi'); load() }
    catch { toast.error('Silme başarısız') }
  }

  const filtered = filterCat === 'Tümü' ? references : references.filter(r => r.category === filterCat)

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[24px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                Referans Yönetimi
              </h1>
              <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
                {references.length} referans · {references.filter(r => r.active).length} aktif
              </p>
            </div>
            <div className="flex gap-2">
              {/* Toplu logo yükle */}
              <button onClick={() => bulkRef.current?.click()}
                className="flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
                <FolderOpen size={14} /> Toplu Logo Yükle
              </button>
              <input ref={bulkRef} type="file" accept="image/*" multiple className="hidden" onChange={handleBulkSelect} />

              <button onClick={openNew}
                className="flex items-center gap-2 bg-[#F4821F] text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-[#e07010] transition-colors">
                <Plus size={15} /> Yeni Referans
              </button>
            </div>
          </div>

          {/* Kategori filtresi */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['Tümü', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className="text-[12px] px-3.5 py-1.5 rounded-lg font-semibold transition-all"
                style={filterCat === cat
                  ? { background: '#F4821F', color: 'white', border: '1px solid #F4821F' }
                  : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Liste */}
          {loading ? (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map(ref => (
                <div key={ref.id} className="rounded-2xl p-4 transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: ref.active ? 1 : 0.5 }}>
                  <div className="flex items-center gap-3 mb-3">
                    {(ref.logoBase64 || ref.logoUrl) ? (
                      <img src={ref.logoBase64 || ref.logoUrl} alt={ref.name}
                        className="w-12 h-12 rounded-xl object-contain"
                        style={{ background: 'var(--bg-secondary)', padding: '6px' }} />
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                        style={{ background: ref.color }}>
                        {ref.abbr || ref.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{ref.name}</span>
                        {ref.featured && <Star size={11} className="text-[#F4821F] flex-shrink-0" fill="#F4821F" />}
                      </div>
                      <span className="text-[11px] text-[#F4821F] font-semibold">{ref.sector}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={() => handleToggle(ref.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold"
                      style={{ color: ref.active ? '#1D9E75' : 'var(--text-muted)' }}>
                      {ref.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {ref.active ? 'Aktif' : 'Pasif'}
                    </button>
                    <div className="flex-1" />
                    <button onClick={() => openEdit(ref)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(ref.id, ref.name)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-red-500"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-16" style={{ color: 'var(--text-muted)' }}>
                  Bu kategoride referans yok
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Tekli Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                {editing ? 'Referansı Düzenle' : 'Yeni Referans Ekle'}
              </h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Logo yükleme */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden"
                  style={{ background: logoPreview ? 'var(--bg-secondary)' : form.color, border: '2px dashed var(--border)', padding: logoPreview ? '4px' : 0 }}
                  onClick={() => logoRef.current?.click()}>
                  {logoPreview
                    ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain" />
                    : <span className="text-white text-[16px] font-bold">{form.abbr || form.name.slice(0, 2).toUpperCase() || '?'}</span>}
                </div>
                <button onClick={() => logoRef.current?.click()}
                  className="flex items-center gap-2 text-[12px] font-semibold px-4 py-2 rounded-lg flex-1 justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
                  <Upload size={13} />
                  {logoPreview ? 'Logoyu değiştir' : 'Logo yükle'}
                </button>
              </div>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              <div className="mt-2">
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  veya Logo URL girin
                </label>
                <input value={form.logoUrl || ''} onChange={e => { setForm({ ...form, logoUrl: e.target.value }); if(e.target.value) setLogoPreview(e.target.value) }}
                  placeholder="https://logo.clearbit.com/migros.com.tr"
                  className="w-full px-3 py-2.5 rounded-lg text-[12px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Clearbit: https://logo.clearbit.com/domain.com · veya herhangi bir resim URL'i
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>Marka adı *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Migros"
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>Kısaltma</label>
                  <input value={form.abbr} onChange={e => setForm({ ...form, abbr: e.target.value.slice(0, 3).toUpperCase() })} placeholder="M"
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>Sektör *</label>
                  <input value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} placeholder="Zincir Market"
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>Kategori *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>Açıklama</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="Ne yaptık?"
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>Sıra</label>
                  <input type="number" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: +e.target.value })} min={0}
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <button onClick={() => setForm({ ...form, featured: !form.featured })}
                  className="flex items-center gap-2 text-[12px] font-semibold px-3 py-2.5 rounded-lg transition-all self-end"
                  style={form.featured
                    ? { background: 'rgba(244,130,31,0.15)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.4)' }
                    : { background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {form.featured ? <Star size={13} fill="currentColor" /> : <StarOff size={13} />} Öne çıkar
                </button>
                <button onClick={() => setForm({ ...form, active: !form.active })}
                  className="flex items-center gap-2 text-[12px] font-semibold px-3 py-2.5 rounded-lg transition-all self-end"
                  style={form.active
                    ? { background: 'rgba(29,158,117,0.15)', color: '#1D9E75', border: '1px solid rgba(29,158,117,0.4)' }
                    : { background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  Aktif
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
                İptal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white disabled:opacity-60"
                style={{ background: '#F4821F' }}>
                {saving ? 'Kaydediliyor...' : (editing ? 'Güncelle' : 'Kaydet')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toplu Yükleme Modal */}
      {showBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-3xl rounded-2xl p-6 max-h-[90vh] flex flex-col"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                  Toplu Logo Yükleme
                </h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {bulkFiles.length} logo seçildi — isim ve kategori düzenleyebilirsiniz
                </p>
              </div>
              <button onClick={() => { setShowBulk(false); setBulkFiles([]) }}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Progress bar */}
            {bulkSaving && (
              <div className="mb-4 rounded-full overflow-hidden h-2" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full bg-[#F4821F] transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
              </div>
            )}

            {/* Logo listesi */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-5 pr-1">
              {bulkFiles.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>

                  {/* Sıra + önizleme */}
                  <span className="text-[11px] font-bold w-5 text-center flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                  <img src={item.preview} alt={item.name}
                    className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
                    style={{ background: 'white', padding: '4px' }} />

                  {/* İsim */}
                  <input value={item.name}
                    onChange={e => setBulkFiles(f => f.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    className="flex-1 px-3 py-2 rounded-lg text-[13px] font-semibold outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />

                  {/* Kategori */}
                  <select value={item.category}
                    onChange={e => setBulkFiles(f => f.map((x, j) => j === i ? { ...x, category: e.target.value, sector: e.target.value } : x))}
                    className="px-3 py-2 rounded-lg text-[12px] outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  {/* Sil */}
                  <button onClick={() => setBulkFiles(f => f.filter((_, j) => j !== i))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 hover:text-red-500"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => { setShowBulk(false); setBulkFiles([]) }}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
                İptal
              </button>
              <button onClick={handleBulkSave} disabled={bulkSaving || !bulkFiles.length}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: '#F4821F' }}>
                <Check size={15} />
                {bulkSaving ? `Yükleniyor... ${bulkProgress}%` : `${bulkFiles.length} Referansı Ekle`}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}