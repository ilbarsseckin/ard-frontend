'use client'
import { useState, useEffect } from 'react'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Save, X, Loader2, Eye, EyeOff, Megaphone } from 'lucide-react'

interface Bar {
  id: string
  message: string
  subMessage?: string
  couponCode?: string
  bgColor: string
  textColor: string
  endsAt?: string
  active: boolean
  sortOrder: number
}

interface FormData {
  message: string
  subMessage: string
  couponCode: string
  bgColor: string
  textColor: string
  endsAt: string
  active: boolean
}

const EMPTY_FORM: FormData = {
  message: '',
  subMessage: '',
  couponCode: '',
  bgColor: '#F4821F',
  textColor: '#FFFFFF',
  endsAt: '',
  active: true,
}

const PRESET_COLORS = ['#F4821F', '#111111', '#1D4ED8', '#16A34A', '#DC2626', '#7C3AED', '#0891B2', '#DB2777']

export default function AdminAnnouncementBarsPage() {
  return (
    <AdminGuard>
      <Inner />
    </AdminGuard>
  )
}

function Inner() {
  const [items, setItems] = useState<Bar[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/api/admin/announcement-bars')
      .then(r => setItems(r.data.data || []))
      .catch(() => toast.error('Yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (b: Bar) => {
    setEditId(b.id)
    setForm({
      message: b.message,
      subMessage: b.subMessage || '',
      couponCode: b.couponCode || '',
      bgColor: b.bgColor,
      textColor: b.textColor,
      endsAt: b.endsAt ? b.endsAt.substring(0, 16) : '',
      active: b.active,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.message.trim()) { toast.error('Mesaj zorunlu'); return }
    setSaving(true)
    const body = {
      message: form.message,
      subMessage: form.subMessage || null,
      couponCode: form.couponCode || null,
      bgColor: form.bgColor,
      textColor: form.textColor,
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      active: form.active,
    }
    try {
      if (editId) {
        await api.put(`/api/admin/announcement-bars/${editId}`, body)
        toast.success('Güncellendi')
      } else {
        await api.post('/api/admin/announcement-bars', body)
        toast.success('Oluşturuldu')
      }
      setModalOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (b: Bar) => {
    try {
      await api.patch(`/api/admin/announcement-bars/${b.id}/toggle`)
      load()
    } catch { toast.error('Durum değiştirilemedi') }
  }

  const handleDelete = async (b: Bar) => {
    if (!confirm(`"${b.message}" silinsin mi?`)) return
    try {
      await api.delete(`/api/admin/announcement-bars/${b.id}`)
      toast.success('Silindi')
      load()
    } catch { toast.error('Silinemedi') }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <AdminNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Megaphone size={20} style={{ color: '#F4821F' }} />
            <h1 className="text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Duyuru Bantları
            </h1>
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>({items.length})</span>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-2 rounded-lg text-white"
            style={{ background: '#F4821F' }}>
            <Plus size={15} /> Yeni Bant
          </button>
        </div>

        {/* Önizleme */}
        {items.filter(b => b.active).length > 0 && (
          <div className="mb-6 rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[1px] px-3 py-2"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              Önizleme
            </p>
            {items.filter(b => b.active).slice(0, 1).map(b => (
              <div key={b.id} className="flex items-center justify-center px-4 py-3 text-center"
                style={{ background: b.bgColor }}>
                <p className="text-[13px] font-bold" style={{ color: b.textColor }}>
                  {b.message}
                  {b.subMessage && <span className="ml-2 opacity-80 text-[12px]">{b.subMessage}</span>}
                  {b.couponCode && (
                    <span className="ml-2 px-2 py-0.5 rounded font-mono text-[11px]"
                      style={{ background: 'rgba(255,255,255,0.2)', color: b.textColor }}>
                      {b.couponCode}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[#F4821F]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
            <Megaphone size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-[14px]">Henüz duyuru bantı yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: b.active ? 1 : 0.5 }}>

                {/* Renk önizleme */}
                <div className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ background: b.bgColor, border: '1px solid var(--border)' }} />

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    {b.message}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {b.subMessage && <span className="truncate max-w-[120px]">{b.subMessage}</span>}
                    {b.couponCode && (
                      <span className="px-1.5 py-0.5 rounded font-mono"
                        style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                        {b.couponCode}
                      </span>
                    )}
                    {b.endsAt && (
                      <span>⏰ {new Date(b.endsAt).toLocaleDateString('tr-TR')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(b)}
                    className="p-2 rounded-lg" style={{ color: b.active ? '#16a34a' : 'var(--text-muted)' }}>
                    {b.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(b)}
                    className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(b)}
                    className="p-2 rounded-lg hover:text-red-500" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModalOpen(false)}>
          <div onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            <div className="sticky top-0 flex items-center justify-between px-5 py-4 z-10"
              style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {editId ? 'Bantı Düzenle' : 'Yeni Duyuru Bantı'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">

              {/* Önizleme */}
              <div className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-center px-4 py-3 text-center"
                  style={{ background: form.bgColor }}>
                  <p className="text-[13px] font-bold" style={{ color: form.textColor }}>
                    {form.message || 'Mesaj önizleme...'}
                    {form.subMessage && <span className="ml-2 opacity-80 text-[12px]">{form.subMessage}</span>}
                    {form.couponCode && (
                      <span className="ml-2 px-2 py-0.5 rounded font-mono text-[11px]"
                        style={{ background: 'rgba(255,255,255,0.2)', color: form.textColor }}>
                        {form.couponCode}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Ana Mesaj *
                </label>
                <input value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="örn. Tüm ürünlerde %20 indirim!"
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Alt Mesaj (opsiyonel)
                </label>
                <input value={form.subMessage} onChange={e => setForm(f => ({ ...f, subMessage: e.target.value }))}
                  placeholder="örn. Bugüne özel ekstra %10"
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Kupon Kodu (opsiyonel)
                </label>
                <input value={form.couponCode} onChange={e => setForm(f => ({ ...f, couponCode: e.target.value.toUpperCase() }))}
                  placeholder="örn. PS10XT"
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none font-mono"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Arka Plan Rengi
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.bgColor}
                      onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))}
                      className="w-9 h-9 rounded-lg cursor-pointer"
                      style={{ border: '1px solid var(--border)' }} />
                    <div className="flex flex-wrap gap-1">
                      {PRESET_COLORS.map(c => (
                        <button key={c} onClick={() => setForm(f => ({ ...f, bgColor: c }))}
                          className="w-5 h-5 rounded"
                          style={{ background: c, border: form.bgColor === c ? '2px solid var(--text-primary)' : '1px solid var(--border)' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Yazı Rengi
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.textColor}
                      onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))}
                      className="w-9 h-9 rounded-lg cursor-pointer"
                      style={{ border: '1px solid var(--border)' }} />
                    <div className="flex gap-1">
                      {['#FFFFFF', '#111111', '#F4821F'].map(c => (
                        <button key={c} onClick={() => setForm(f => ({ ...f, textColor: c }))}
                          className="w-5 h-5 rounded"
                          style={{ background: c, border: form.textColor === c ? '2px solid #F4821F' : '1px solid var(--border)' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Bitiş Tarihi (Countdown için, opsiyonel)
                </label>
                <input type="datetime-local" value={form.endsAt}
                  onChange={e => setForm(f => ({ ...f, endsAt: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="accent-[#F4821F]" />
                <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Aktif</span>
              </label>
            </div>

            <div className="sticky bottom-0 flex gap-2 px-5 py-4"
              style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 text-[13px] font-medium rounded-lg"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                İptal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold rounded-lg text-white disabled:opacity-60"
                style={{ background: '#F4821F' }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
