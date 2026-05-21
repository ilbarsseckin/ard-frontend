'use client'
import { useState, useEffect } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Check, X, Settings2, Loader2, ChevronDown, ChevronUp,
  Building2, Phone, MapPin, Globe, FileText, TrendingUp,
  Search, Filter, RefreshCw, BadgeCheck, Clock, Ban
} from 'lucide-react'

type Status = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Dealer {
  id: string
  user: { id: string; name: string; email: string; role: string }
  companyName: string
  taxNumber: string
  taxOffice: string
  phone: string
  address: string
  city: string
  district: string
  estimatedMonthlyRevenue: string
  businessType: string
  website: string
  note: string
  discountRate: number
  creditLimit: number
  status: Status
  notes: string
  rejectionReason: string
  createdAt: string
}

const STATUS = {
  PENDING:  { label: 'Beklemede', icon: Clock,       color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  APPROVED: { label: 'Onaylı',   icon: BadgeCheck,   color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  REJECTED: { label: 'Reddedildi', icon: Ban,        color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)' },
}

const SEVIYE = [
  { min: 0,     oran: 5,  label: 'Başlangıç' },
  { min: 5000,  oran: 8,  label: 'Bronz'     },
  { min: 15000, oran: 12, label: 'Gümüş'     },
  { min: 30000, oran: 15, label: 'Altın'     },
  { min: 60000, oran: 20, label: 'Platin'    },
]

function seviyeFromCiro(ciro: number) {
  return [...SEVIYE].reverse().find(s => ciro >= s.min) || SEVIYE[0]
}

export default function AdminBayilerPage() {
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [edited, setEdited] = useState<Record<string, { discount: string; credit: string; notes: string }>>({})

  const load = () => {
    setLoading(true)
    const url = filter === 'ALL' ? '/api/admin/dealers' : `/api/admin/dealers?status=${filter}`
    api.get(url)
      .then(r => setDealers(r.data.data || []))
      .catch(() => toast.error('Yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const setEdit = (id: string, key: string, val: string) =>
    setEdited(e => ({ ...e, [id]: { ...e[id], [key]: val } }))

  const getEdit = (d: Dealer) => ({
    discount: edited[d.id]?.discount ?? String(d.discountRate ?? 0),
    credit:   edited[d.id]?.credit   ?? String(d.creditLimit  ?? 0),
    notes:    edited[d.id]?.notes    ?? (d.notes || ''),
  })

  const approve = async (d: Dealer) => {
    const e = getEdit(d)
    setActionLoading(d.id + '-approve')
    try {
      await api.post(`/api/admin/dealers/${d.id}/approve`, {
        discountRate: parseFloat(e.discount || '0'),
        creditLimit:  parseFloat(e.credit   || '0'),
        notes: e.notes,
      })
      toast.success(`${d.companyName} onaylandı — %${e.discount} iskonto atandı`)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Onaylama başarısız')
    } finally { setActionLoading(null) }
  }

  const reject = async (d: Dealer) => {
    const reason = window.prompt('Red sebebi (opsiyonel):')
    if (reason === null) return
    setActionLoading(d.id + '-reject')
    try {
      await api.post(`/api/admin/dealers/${d.id}/reject`, { reason })
      toast.success('Başvuru reddedildi')
      load()
    } catch { toast.error('İşlem başarısız') }
    finally { setActionLoading(null) }
  }

  const save = async (d: Dealer) => {
    const e = getEdit(d)
    setActionLoading(d.id + '-save')
    try {
      await api.patch(`/api/admin/dealers/${d.id}/settings`, {
        discountRate: parseFloat(e.discount || '0'),
        creditLimit:  parseFloat(e.credit   || '0'),
        notes: e.notes,
      })
      toast.success('Bayi ayarları güncellendi')
      load()
    } catch { toast.error('Güncelleme başarısız') }
    finally { setActionLoading(null) }
  }

  const filtered = dealers.filter(d =>
    !search ||
    d.companyName.toLowerCase().includes(search.toLowerCase()) ||
    d.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.taxNumber?.includes(search) ||
    d.city?.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    ALL:      dealers.length,
    PENDING:  dealers.filter(d => d.status === 'PENDING').length,
    APPROVED: dealers.filter(d => d.status === 'APPROVED').length,
    REJECTED: dealers.filter(d => d.status === 'REJECTED').length,
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                Bayi Yönetimi
              </h1>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {counts.ALL} toplam · {counts.PENDING > 0 &&
                  <span className="text-amber-500 font-semibold">{counts.PENDING} bekleyen başvuru</span>}
              </p>
            </div>
            <button onClick={load}
              className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
              <RefreshCw size={12} /> Yenile
            </button>
          </div>

          {/* İstatistik kartları */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { key: 'ALL',      label: 'Toplam Başvuru', color: 'var(--text-primary)' },
              { key: 'PENDING',  label: 'Bekleyen',       color: STATUS.PENDING.color   },
              { key: 'APPROVED', label: 'Onaylı Bayi',    color: STATUS.APPROVED.color  },
              { key: 'REJECTED', label: 'Reddedilen',     color: STATUS.REJECTED.color  },
            ].map(s => (
              <button key={s.key}
                onClick={() => setFilter(s.key as any)}
                className="p-4 rounded-xl text-left transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${filter === s.key ? s.color : 'var(--border)'}`,
                  boxShadow: filter === s.key ? `0 0 0 1px ${s.color}` : 'none',
                }}>
                <p className="text-[28px] font-black" style={{ color: s.color }}>
                  {counts[s.key as keyof typeof counts]}
                </p>
                <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </button>
            ))}
          </div>

          {/* Arama */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Firma adı, e-posta, vergi no, şehir..."
              className="w-full pl-9 pr-4 py-2.5 text-[13px] rounded-xl outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>

          {/* Liste */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>

            {/* Tablo başlığı */}
            <div className="grid grid-cols-[1fr_140px_80px_100px_120px_48px] px-5 py-3 text-[10px] font-bold uppercase tracking-[1px]"
              style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <span>Firma / Kişi</span>
              <span>Konum</span>
              <span>Tip</span>
              <span>Baskı Hacmi</span>
              <span>Durum / İskonto</span>
              <span />
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16" style={{ background: 'var(--bg-card)' }}>
                <Loader2 size={24} className="animate-spin text-[#F4821F]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-14 text-[14px]"
                style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                Kayıt bulunamadı
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filtered.map(d => {
                  const st = STATUS[d.status]
                  const Icon = st.icon
                  const isExpanded = expanded === d.id
                  const e = getEdit(d)
                  const ciro = parseFloat(d.estimatedMonthlyRevenue || '0')
                  const seviye = seviyeFromCiro(ciro)

                  return (
                    <div key={d.id} style={{ background: 'var(--bg-card)' }}>

                      {/* Ana satır */}
                      <div className="grid grid-cols-[1fr_140px_80px_100px_120px_48px] items-center px-5 py-4 gap-3">

                        {/* Firma + kişi */}
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {d.companyName}
                          </p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {d.user?.name} · {d.user?.email}
                          </p>
                          <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {d.taxNumber}
                          </p>
                        </div>

                        {/* Konum */}
                        <div className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                          <div className="flex items-center gap-1">
                            <MapPin size={11} />
                            {d.city}{d.district ? ` / ${d.district}` : ''}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Phone size={11} />
                            {d.phone}
                          </div>
                        </div>

                        {/* İşletme tipi */}
                        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {d.businessType || '—'}
                        </div>

                        {/* Baskı hacmi + seviye */}
                        <div>
                          {ciro > 0 ? (
                            <>
                              <p className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {ciro.toLocaleString('tr-TR')} ₺
                              </p>
                              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {seviye.label} · önerilen %{seviye.oran}
                              </p>
                            </>
                          ) : <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Belirtilmedi</span>}
                        </div>

                        {/* Durum + iskonto */}
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold mb-1"
                            style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                            <Icon size={10} />
                            {st.label}
                          </div>
                          {d.status === 'APPROVED' && (
                            <p className="text-[11px] font-bold text-[#F4821F]">%{d.discountRate} iskonto</p>
                          )}
                        </div>

                        {/* Genişlet */}
                        <button
                          onClick={() => setExpanded(isExpanded ? null : d.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{
                            background: isExpanded ? 'rgba(244,130,31,0.1)' : 'var(--bg-secondary)',
                            border: `1px solid ${isExpanded ? 'rgba(244,130,31,0.3)' : 'var(--border)'}`,
                            color: isExpanded ? '#F4821F' : 'var(--text-muted)'
                          }}>
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>

                      {/* Genişletilmiş panel */}
                      {isExpanded && (
                        <div className="px-5 pb-6 pt-4 space-y-5"
                          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>

                          {/* Üst bilgi satırı */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                              <p className="text-[10px] uppercase tracking-[1px] font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                                İş Adresi
                              </p>
                              <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{d.address}</p>
                              {d.taxOffice && (
                                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                  Vergi dairesi: {d.taxOffice}
                                </p>
                              )}
                              {d.website && (
                                <a href={d.website} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-[11px] text-[#F4821F] mt-1 hover:underline">
                                  <Globe size={10} /> {d.website}
                                </a>
                              )}
                            </div>

                            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                              <p className="text-[10px] uppercase tracking-[1px] font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                                Başvuru Notu
                              </p>
                              <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                                {d.note || '—'}
                              </p>
                              {d.rejectionReason && (
                                <p className="text-[11px] text-red-500 mt-2">
                                  Red sebebi: {d.rejectionReason}
                                </p>
                              )}
                            </div>

                            {/* Ciro ve önerilen iskonto */}
                            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                              <p className="text-[10px] uppercase tracking-[1px] font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                                İskonto Önerisi
                              </p>
                              {ciro > 0 ? (
                                <div className="space-y-1.5">
                                  {SEVIYE.map(s => (
                                    <div key={s.min}
                                      className="flex items-center justify-between text-[11px] px-2 py-1 rounded"
                                      style={{
                                        background: seviye.min === s.min ? 'rgba(244,130,31,0.1)' : 'transparent',
                                        color: seviye.min === s.min ? '#F4821F' : 'var(--text-muted)',
                                        fontWeight: seviye.min === s.min ? 700 : 400,
                                      }}>
                                      <span>{s.label}</span>
                                      <span>%{s.oran}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Ciro bilgisi yok</p>}
                            </div>
                          </div>

                          {/* Ayar alanları */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-[0.5px]"
                                style={{ color: 'var(--text-muted)' }}>
                                İskonto Oranı (%)
                              </label>
                              <div className="flex gap-2">
                                <input type="number" min="0" max="50" step="0.5"
                                  value={e.discount}
                                  onChange={ev => setEdit(d.id, 'discount', ev.target.value)}
                                  className="flex-1 px-3 py-2 text-[13px] font-bold rounded-lg outline-none"
                                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#F4821F' }} />
                                {/* Hızlı seç */}
                                <div className="flex gap-1">
                                  {[5, 8, 12, 15, 20].map(v => (
                                    <button key={v} type="button"
                                      onClick={() => setEdit(d.id, 'discount', String(v))}
                                      className="w-7 h-9 text-[10px] font-bold rounded transition-colors"
                                      style={{
                                        background: e.discount === String(v) ? '#F4821F' : 'var(--bg-card)',
                                        color: e.discount === String(v) ? 'white' : 'var(--text-muted)',
                                        border: '1px solid var(--border)',
                                      }}>
                                      {v}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {ciro > 0 && (
                                <button type="button"
                                  onClick={() => setEdit(d.id, 'discount', String(seviye.oran))}
                                  className="mt-1.5 text-[10px] text-[#F4821F] hover:underline">
                                  Önerilen: %{seviye.oran} ({seviye.label}) uygula
                                </button>
                              )}
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-[0.5px]"
                                style={{ color: 'var(--text-muted)' }}>
                                Kredi Limiti (₺)
                              </label>
                              <input type="number" min="0" step="1000"
                                value={e.credit}
                                onChange={ev => setEdit(d.id, 'credit', ev.target.value)}
                                className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                              <div className="flex gap-1.5 mt-1.5">
                                {[0, 5000, 10000, 25000, 50000].map(v => (
                                  <button key={v} type="button"
                                    onClick={() => setEdit(d.id, 'credit', String(v))}
                                    className="text-[9px] px-1.5 py-0.5 rounded transition-colors"
                                    style={{
                                      background: e.credit === String(v) ? 'var(--text-primary)' : 'var(--bg-card)',
                                      color: e.credit === String(v) ? 'var(--bg-primary)' : 'var(--text-muted)',
                                      border: '1px solid var(--border)',
                                    }}>
                                    {v === 0 ? 'Yok' : (v / 1000) + 'K'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-[0.5px]"
                                style={{ color: 'var(--text-muted)' }}>
                                Admin Notu
                              </label>
                              <textarea rows={2}
                                value={e.notes}
                                onChange={ev => setEdit(d.id, 'notes', ev.target.value)}
                                className="w-full px-3 py-2 text-[12px] rounded-lg outline-none resize-none"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                            </div>
                          </div>

                          {/* Aksiyon butonları */}
                          <div className="flex items-center gap-3 pt-2">
                            {d.status === 'PENDING' && (
                              <>
                                <button onClick={() => approve(d)}
                                  disabled={!!actionLoading}
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                                  style={{ background: '#10B981' }}>
                                  {actionLoading === d.id + '-approve'
                                    ? <Loader2 size={14} className="animate-spin" />
                                    : <Check size={14} />}
                                  Onayla & %{e.discount} İskonto Ver
                                </button>
                                <button onClick={() => reject(d)}
                                  disabled={!!actionLoading}
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                                  style={{ background: '#EF4444' }}>
                                  <X size={14} />
                                  Reddet
                                </button>
                              </>
                            )}

                            {d.status === 'APPROVED' && (
                              <button onClick={() => save(d)}
                                disabled={!!actionLoading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                                style={{ background: '#F4821F' }}>
                                {actionLoading === d.id + '-save'
                                  ? <Loader2 size={14} className="animate-spin" />
                                  : <Settings2 size={14} />}
                                Ayarları Kaydet
                              </button>
                            )}

                            {d.status === 'REJECTED' && (
                              <button onClick={() => approve(d)}
                                disabled={!!actionLoading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                                style={{ background: '#10B981' }}>
                                <Check size={14} />
                                Yeniden Onayla
                              </button>
                            )}

                            <div className="ml-auto text-right">
                              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                Kullanıcı rolü: <strong style={{ color: 'var(--text-secondary)' }}>{d.user?.role}</strong>
                              </p>
                              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                Başvuru: {new Date(d.createdAt).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminGuard>
  )
}