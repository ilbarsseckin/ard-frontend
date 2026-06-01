'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  Star, Loader2, Trash2, Check, X, Search, MessageSquare, Eye, EyeOff,
  Calendar, Mail, Filter,
} from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import AdminGuard from '@/components/admin/AdminGuard'

interface Review {
  id: string
  productId: string
  rating: number
  comment: string
  displayName: string
  anonymous: boolean
  approved: boolean
  createdAt: string
}

type Filter = 'all' | 'approved' | 'pending'

function YorumlarPageInner() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api.get('/api/admin/catalog/reviews')
      .then(r => setReviews(r.data.data || []))
      .catch(() => toast.error('Yorumlar yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      if (filter === 'approved' && !r.approved) return false
      if (filter === 'pending' && r.approved) return false
      if (search) {
        const s = search.toLowerCase()
        if (!r.comment.toLowerCase().includes(s) && !r.displayName.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [reviews, filter, search])

  const counts = useMemo(() => ({
    all:      reviews.length,
    approved: reviews.filter(r => r.approved).length,
    pending:  reviews.filter(r => !r.approved).length,
  }), [reviews])

  const handleToggleApproved = async (r: Review) => {
    setActionLoading(r.id + '-toggle')
    try {
      await api.patch(`/api/admin/catalog/reviews/${r.id}/approve`, { approved: !r.approved })
      setReviews(rs => rs.map(x => x.id === r.id ? { ...x, approved: !r.approved } : x))
      toast.success(r.approved ? 'Yayından kaldırıldı' : 'Yayınlandı')
    } catch {
      toast.error('İşlem başarısız')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (r: Review) => {
    if (!confirm(`Bu yorumu silmek istediğine emin misin?\n\n"${r.comment.substring(0, 80)}..."\n\nGeri alınamaz.`)) return
    setActionLoading(r.id + '-delete')
    try {
      await api.delete(`/api/admin/catalog/reviews/${r.id}`)
      setReviews(rs => rs.filter(x => x.id !== r.id))
      toast.success('Yorum silindi')
    } catch {
      toast.error('Silme işlemi başarısız')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) +
           ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(244,130,31,0.1)' }}>
            <MessageSquare size={18} className="text-[#F4821F]" />
          </div>
          <div>
            <h1 className="text-[20px] font-black tracking-[-0.5px]"
              style={{ color: 'var(--text-primary)' }}>Ürün Yorumları</h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Müşteri yorumlarını yönet, onayla veya yayından kaldır
            </p>
          </div>
        </div>

        {/* Filtreler ve arama */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="flex gap-2">
            {([
              { key: 'all' as const,      label: 'Tümü',           color: '#6B7280' },
              { key: 'approved' as const, label: 'Yayında',        color: '#10B981' },
              { key: 'pending' as const,  label: 'Beklemede',      color: '#F59E0B' },
            ]).map(t => (
              <button key={t.key} onClick={() => setFilter(t.key)}
                className="px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-2"
                style={{
                  background: filter === t.key ? t.color + '20' : 'var(--bg-card)',
                  color: filter === t.key ? t.color : 'var(--text-secondary)',
                  border: `1px solid ${filter === t.key ? t.color + '40' : 'var(--border)'}`,
                }}>
                <span>{t.label}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black"
                  style={{
                    background: filter === t.key ? t.color : 'var(--bg-secondary)',
                    color: filter === t.key ? 'white' : 'var(--text-muted)',
                  }}>
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Yorum içeriği veya kullanıcı ara..."
              className="w-full pl-9 pr-3 py-2.5 text-[13px] rounded-xl outline-none"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }} />
          </div>
        </div>

        {/* İstatistik özeti */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <StatCard label="Toplam"     value={counts.all}      color="#6B7280" />
            <StatCard label="Yayında"    value={counts.approved} color="#10B981" />
            <StatCard label="Beklemede"  value={counts.pending}  color="#F59E0B" />
            <StatCard label="Ortalama Puan"
              value={(reviews.reduce((s, r) => s + r.rating, 0) / Math.max(reviews.length, 1)).toFixed(1)}
              color="#F4821F" suffix={<Star size={16} className="text-yellow-400 fill-yellow-400" />} />
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-[#F4821F]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <MessageSquare size={40} className="mx-auto mb-3 opacity-20"
              style={{ color: 'var(--text-muted)' }} />
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              {search || filter !== 'all' ? 'Bu kriterlere uygun yorum yok' : 'Henüz hiç yorum yok'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="p-5 rounded-xl"
                style={{
                  background: 'var(--bg-card)',
                  border: r.approved ? '1px solid var(--border)' : '1px solid #F59E0B40',
                }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                      style={{ background: r.anonymous ? '#6B7280' : 'linear-gradient(135deg, #F4821F, #e07010)' }}>
                      {r.anonymous ? <EyeOff size={14} /> : r.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {r.displayName}
                        </p>
                        {r.anonymous && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                            style={{ background: 'rgba(107,114,128,0.15)', color: '#6B7280' }}>
                            Anonim
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                        <Calendar size={10} /> {formatDate(r.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={13}
                          className={i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                      {r.rating}/5
                    </span>
                  </div>
                </div>

                <p className="text-[12px] leading-relaxed whitespace-pre-wrap pl-[52px] mb-3"
                  style={{ color: 'var(--text-secondary)' }}>
                  {r.comment}
                </p>

                <div className="flex items-center gap-2 pl-[52px] pt-3 flex-wrap"
                  style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => handleToggleApproved(r)}
                    disabled={actionLoading === r.id + '-toggle'}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all disabled:opacity-50"
                    style={{
                      background: r.approved ? 'rgba(107,114,128,0.1)' : 'rgba(16,185,129,0.1)',
                      color: r.approved ? '#6B7280' : '#10B981',
                      border: `1px solid ${r.approved ? '#6B728040' : '#10B98140'}`,
                    }}>
                    {actionLoading === r.id + '-toggle'
                      ? <Loader2 size={12} className="animate-spin" />
                      : r.approved ? <EyeOff size={12} /> : <Check size={12} />}
                    {r.approved ? 'Yayından kaldır' : 'Yayınla'}
                  </button>

                  <button onClick={() => handleDelete(r)}
                    disabled={actionLoading === r.id + '-delete'}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      color: '#EF4444',
                      border: '1px solid #EF444440',
                    }}>
                    {actionLoading === r.id + '-delete'
                      ? <Loader2 size={12} className="animate-spin" />
                      : <Trash2 size={12} />}
                    Sil
                  </button>

                  <div className="ml-auto text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Status: <span className="font-bold"
                      style={{ color: r.approved ? '#10B981' : '#F59E0B' }}>
                      {r.approved ? 'YAYINDA' : 'BEKLEMEDE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color, suffix }:
  { label: string; value: number | string; color: string; suffix?: React.ReactNode }) {
  return (
    <div className="p-3.5 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-[1px] mb-1"
        style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        <p className="text-[22px] font-black tracking-[-0.5px]" style={{ color }}>
          {value}
        </p>
        {suffix}
      </div>
    </div>
  )
}

export default function AdminYorumlarPage() {
  return (
    <AdminGuard>
      <YorumlarPageInner />
    </AdminGuard>
  )
}