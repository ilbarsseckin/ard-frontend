'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Edit2, Trash2, Tag, Percent, DollarSign, Gift,
  Calendar, Users, Search, X, Loader2, Power, AlertCircle, Copy, Check,
} from 'lucide-react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  type: 'PERCENT' | 'AMOUNT' | 'GIFT'
  discountPercent?: number
  discountAmount?: number
  giftAmount?: number
  minOrderAmount?: number
  maxUsage?: number
  currentUsage?: number
  perUserLimit?: number
  startDate?: string
  endDate?: string
  active: boolean
  autoIssueOnFirstVisit: boolean
  autoIssueOnOrderAmount?: number
}

interface CouponForm {
  code: string
  name: string
  description: string
  type: 'PERCENT' | 'AMOUNT' | 'GIFT'
  discountPercent: string
  discountAmount: string
  giftAmount: string
  minOrderAmount: string
  maxUsage: string
  perUserLimit: string
  active: boolean
  autoIssueOnFirstVisit: boolean
  autoIssueOnOrderAmount: string
}

const emptyForm: CouponForm = {
  code: '', name: '', description: '',
  type: 'PERCENT',
  discountPercent: '', discountAmount: '', giftAmount: '',
  minOrderAmount: '', maxUsage: '', perUserLimit: '1',
  active: true, autoIssueOnFirstVisit: false,
  autoIssueOnOrderAmount: '',
}

export default function AdminKuponlarPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [form, setForm] = useState<CouponForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api.get('/api/admin/coupons')
      .then(res => setCoupons(res.data.data || []))
      .catch(() => toast.error('Kuponlar yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (c: Coupon) => {
    setEditing(c)
    setForm({
      code: c.code,
      name: c.name,
      description: c.description || '',
      type: c.type,
      discountPercent: c.discountPercent?.toString() || '',
      discountAmount: c.discountAmount?.toString() || '',
      giftAmount: c.giftAmount?.toString() || '',
      minOrderAmount: c.minOrderAmount?.toString() || '',
      maxUsage: c.maxUsage?.toString() || '',
      perUserLimit: c.perUserLimit?.toString() || '1',
      active: c.active,
      autoIssueOnFirstVisit: c.autoIssueOnFirstVisit,
      autoIssueOnOrderAmount: c.autoIssueOnOrderAmount?.toString() || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error('Kupon kodu ve adı zorunlu')
      return
    }
    setSubmitting(true)
    try {
      const body: any = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        type: form.type,
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
        maxUsage: form.maxUsage ? parseInt(form.maxUsage) : null,
        perUserLimit: form.perUserLimit ? parseInt(form.perUserLimit) : 1,
        active: form.active,
        autoIssueOnFirstVisit: form.autoIssueOnFirstVisit,
        autoIssueOnOrderAmount: form.autoIssueOnOrderAmount ? parseFloat(form.autoIssueOnOrderAmount) : null,
      }
      if (form.type === 'PERCENT') body.discountPercent = form.discountPercent ? parseFloat(form.discountPercent) : null
      if (form.type === 'AMOUNT') body.discountAmount = form.discountAmount ? parseFloat(form.discountAmount) : null
      if (form.type === 'GIFT') body.giftAmount = form.giftAmount ? parseFloat(form.giftAmount) : null

      if (editing) {
        await api.put(`/api/admin/coupons/${editing.id}`, body)
        toast.success('Kupon güncellendi')
      } else {
        await api.post('/api/admin/coupons', body)
        toast.success('Kupon oluşturuldu')
      }
      setModalOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (c: Coupon) => {
    try {
      await api.put(`/api/admin/coupons/${c.id}`, { active: !c.active })
      toast.success(c.active ? 'Kupon kapatıldı' : 'Kupon açıldı')
      load()
    } catch {
      toast.error('İşlem başarısız')
    }
  }

  const handleDelete = async (c: Coupon) => {
    if (!confirm(`"${c.code}" kuponunu silmek istediğinize emin misiniz?`)) return
    try {
      await api.delete(`/api/admin/coupons/${c.id}`)
      toast.success('Kupon silindi')
      load()
    } catch {
      toast.error('Silme başarısız')
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('Kod kopyalandı')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Filtreleme
  const filtered = coupons.filter(c => {
    if (filter === 'active' && !c.active) return false
    if (filter === 'inactive' && c.active) return false
    if (search) {
      const s = search.toLowerCase()
      return c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s)
    }
    return true
  })

  // İstatistikler
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.active).length,
    totalUsage: coupons.reduce((sum, c) => sum + (c.currentUsage || 0), 0),
    welcome: coupons.filter(c => c.autoIssueOnFirstVisit).length,
  }

  const formatValue = (c: Coupon) => {
    if (c.type === 'PERCENT') return `%${c.discountPercent || 0}`
    if (c.type === 'AMOUNT') return `₺${(c.discountAmount || 0).toLocaleString('tr-TR')}`
    if (c.type === 'GIFT') return `₺${(c.giftAmount || 0).toLocaleString('tr-TR')} hediye`
    return '-'
  }

  const typeIcon = (type: string) => {
    if (type === 'PERCENT') return <Percent size={14} />
    if (type === 'AMOUNT') return <DollarSign size={14} />
    return <Gift size={14} />
  }

  const typeColor = (type: string) => {
    if (type === 'PERCENT') return '#3B82F6'
    if (type === 'AMOUNT') return '#10B981'
    return '#F59E0B'
  }

  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen pt-6 pb-12" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-black tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                Kuponlar
              </h1>
              <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
                İndirim kodları ve hediye kuponlarını yönet
              </p>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold text-white rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #F4821F, #e07010)',
                boxShadow: '0 4px 12px rgba(244,130,31,0.3)',
              }}>
              <Plus size={15} /> Yeni Kupon
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Toplam Kupon', value: stats.total, icon: Tag, color: '#6366F1' },
              { label: 'Aktif', value: stats.active, icon: Power, color: '#10B981' },
              { label: 'Welcome Kupon', value: stats.welcome, icon: Gift, color: '#F4821F' },
              { label: 'Toplam Kullanım', value: stats.totalUsage, icon: Users, color: '#EC4899' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px]" style={{ color: 'var(--text-muted)' }}>
                    {s.label}
                  </p>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <p className="text-[22px] font-black" style={{ color: 'var(--text-primary)' }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex gap-1.5">
              {[
                { v: 'all' as const, label: 'Tümü', count: coupons.length },
                { v: 'active' as const, label: 'Aktif', count: stats.active },
                { v: 'inactive' as const, label: 'Pasif', count: coupons.length - stats.active },
              ].map(f => (
                <button key={f.v} onClick={() => setFilter(f.v)}
                  className="px-3 py-2 text-[12px] font-bold rounded-lg transition-all whitespace-nowrap"
                  style={{
                    background: filter === f.v ? '#F4821F' : 'var(--bg-card)',
                    color: filter === f.v ? '#fff' : 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}>
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Kupon kodu veya adıyla ara..."
                className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg outline-none transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }} />
            </div>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin text-[#F4821F]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Tag size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Henüz kupon yok
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Yeni kupon eklemek için yukarıdaki butonu kullanın
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(c => (
                <div key={c.id}
                  className="rounded-xl p-4 transition-all"
                  style={{
                    background: 'var(--bg-card)',
                    border: c.active ? '1px solid var(--border)' : '1px solid #FCA5A5',
                    opacity: c.active ? 1 : 0.7,
                  }}>
                  <div className="flex items-center gap-4">

                    {/* Tip ikonu */}
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${typeColor(c.type)}15`, color: typeColor(c.type) }}>
                      {typeIcon(c.type)}
                    </div>

                    {/* Bilgi */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => handleCopy(c.code)}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[13px] font-black tracking-wider transition-colors"
                          style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                          {c.code}
                          {copiedCode === c.code ? <Check size={11} /> : <Copy size={11} className="opacity-60" />}
                        </button>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded"
                          style={{ background: `${typeColor(c.type)}20`, color: typeColor(c.type) }}>
                          {formatValue(c)}
                        </span>
                        {c.autoIssueOnFirstVisit && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-700">
                            🎁 Welcome
                          </span>
                        )}
                        {c.autoIssueOnOrderAmount && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-700">
                            ≥ ₺{c.autoIssueOnOrderAmount.toLocaleString('tr-TR')} → Auto
                          </span>
                        )}
                        {!c.active && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-700">
                            PASİF
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {c.name}
                      </p>
                      {c.description && (
                        <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                          {c.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {c.minOrderAmount && (
                          <span>Min ₺{c.minOrderAmount.toLocaleString('tr-TR')}</span>
                        )}
                        <span>•</span>
                        <span>{c.currentUsage || 0}{c.maxUsage ? ` / ${c.maxUsage}` : ''} kullanım</span>
                        {c.perUserLimit && (
                          <>
                            <span>•</span>
                            <span>Kullanıcı başı: {c.perUserLimit}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Aksiyon butonları */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleToggleActive(c)}
                        title={c.active ? 'Kapat' : 'Aç'}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'var(--bg-secondary)', color: c.active ? '#10B981' : '#9CA3AF' }}>
                        <Power size={14} />
                      </button>
                      <button onClick={() => openEdit(c)}
                        title="Düzenle"
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(c)}
                        title="Sil"
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'var(--bg-secondary)', color: '#EF4444' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ─── MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModalOpen(false)}>

          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg-card)' }}
            onClick={e => e.stopPropagation()}>

            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
              style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-[18px] font-black" style={{ color: 'var(--text-primary)' }}>
                {editing ? 'Kuponu Düzenle' : 'Yeni Kupon'}
              </h2>
              <button onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">

              {/* Tip seçici */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[1px] mb-2 block"
                  style={{ color: 'var(--text-secondary)' }}>
                  Kupon Türü *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { t: 'PERCENT' as const, icon: Percent, label: '% İndirim', color: '#3B82F6' },
                    { t: 'AMOUNT' as const, icon: DollarSign, label: '₺ İndirim', color: '#10B981' },
                    { t: 'GIFT' as const, icon: Gift, label: 'Hediye', color: '#F59E0B' },
                  ].map(opt => (
                    <button key={opt.t}
                      onClick={() => setForm({ ...form, type: opt.t })}
                      disabled={!!editing}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all disabled:opacity-50"
                      style={{
                        background: form.type === opt.t ? `${opt.color}15` : 'var(--bg-secondary)',
                        border: form.type === opt.t ? `2px solid ${opt.color}` : '1px solid var(--border)',
                        color: form.type === opt.t ? opt.color : 'var(--text-primary)',
                      }}>
                      <opt.icon size={18} />
                      <span className="text-[12px] font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Kupon Kodu * <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>(ör: HOSGELDIN100)</span>
                  </label>
                  <input value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    disabled={!!editing}
                    placeholder="HOSGELDIN100"
                    className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none transition-all disabled:opacity-50"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Görünen Ad *
                  </label>
                  <input value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Hoş Geldin Kuponu"
                    className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none transition-all"
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
                  placeholder="Kupon hakkında kısa açıklama..."
                  rows={2}
                  className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none transition-all resize-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              {/* Türe göre değişen alan */}
              <div className="grid grid-cols-2 gap-3">
                {form.type === 'PERCENT' && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                      style={{ color: 'var(--text-secondary)' }}>
                      İndirim Yüzdesi * (%)
                    </label>
                    <input type="number" value={form.discountPercent}
                      onChange={e => setForm({ ...form, discountPercent: e.target.value })}
                      placeholder="10"
                      className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                )}
                {form.type === 'AMOUNT' && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                      style={{ color: 'var(--text-secondary)' }}>
                      İndirim Tutarı * (₺)
                    </label>
                    <input type="number" value={form.discountAmount}
                      onChange={e => setForm({ ...form, discountAmount: e.target.value })}
                      placeholder="100"
                      className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                )}
                {form.type === 'GIFT' && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                      style={{ color: 'var(--text-secondary)' }}>
                      Hediye Değeri * (₺)
                    </label>
                    <input type="number" value={form.giftAmount}
                      onChange={e => setForm({ ...form, giftAmount: e.target.value })}
                      placeholder="1000"
                      className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Min. Sepet Tutarı (₺)
                  </label>
                  <input type="number" value={form.minOrderAmount}
                    onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="500"
                    className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Toplam Kullanım Sınırı <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>(boş = sınırsız)</span>
                  </label>
                  <input type="number" value={form.maxUsage}
                    onChange={e => setForm({ ...form, maxUsage: e.target.value })}
                    placeholder="100"
                    className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                    style={{ color: 'var(--text-secondary)' }}>
                    Kullanıcı Başına Limit
                  </label>
                  <input type="number" value={form.perUserLimit}
                    onChange={e => setForm({ ...form, perUserLimit: e.target.value })}
                    placeholder="1"
                    className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              {/* Auto issue */}
              <div className="p-4 rounded-lg space-y-3"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-secondary)' }}>
                  Otomatik Verme
                </p>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.autoIssueOnFirstVisit}
                    onChange={e => setForm({ ...form, autoIssueOnFirstVisit: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#F4821F]" />
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                    🎁 İlk ziyarette Welcome Dialog'da göster
                  </span>
                </label>

                {form.type === 'GIFT' && (
                  <div>
                    <label className="text-[11px] font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                      Sipariş Tutarı Eşiği <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>(bu tutar üstü siparişte otomatik verilir)</span>
                    </label>
                    <input type="number" value={form.autoIssueOnOrderAmount}
                      onChange={e => setForm({ ...form, autoIssueOnOrderAmount: e.target.value })}
                      placeholder="5000"
                      className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#F4821F]" />
                <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  Kupon aktif
                </span>
              </label>
            </div>

            <div className="sticky bottom-0 px-6 py-4 flex justify-end gap-2"
              style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-[13px] font-bold rounded-lg transition-colors"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                İptal
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="px-4 py-2 text-[13px] font-bold text-white rounded-lg transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #F4821F, #e07010)',
                  boxShadow: '0 4px 12px rgba(244,130,31,0.3)',
                }}>
                {submitting ? <Loader2 size={14} className="animate-spin" /> : editing ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}