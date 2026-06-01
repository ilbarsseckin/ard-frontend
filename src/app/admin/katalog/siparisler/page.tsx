'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Package, Loader2, RefreshCw, Search, ExternalLink,
  Phone, Calendar, Paperclip, AlertTriangle,
} from 'lucide-react'

interface OrderSummary {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  city?: string
  totalTl: number
  status: string
  paymentStatus?: string
  items: Array<{ productName: string; tierQty: number }>
  createdAt: string
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:       { label: 'Beklemede',     color: '#D97706', bg: 'rgba(245,158,11,0.1)' },
  CONFIRMED:     { label: 'Onaylandı',     color: '#2563EB', bg: 'rgba(59,130,246,0.1)' },
  IN_PRODUCTION: { label: 'Üretimde',      color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  READY:         { label: 'Hazır',         color: '#0891B2', bg: 'rgba(8,145,178,0.1)' },
  SHIPPED:       { label: 'Kargoda',       color: '#059669', bg: 'rgba(16,185,129,0.1)' },
  DELIVERED:     { label: 'Teslim Edildi', color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
  CANCELLED:     { label: 'İptal',         color: '#DC2626', bg: 'rgba(239,68,68,0.1)' },
}

const PAYMENT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:    { label: 'Ödeme Beklemede',  color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  PROCESSING: { label: '3DS Bekliyor',     color: '#D97706', bg: 'rgba(245,158,11,0.1)' },
  PAID:       { label: 'Ödendi',           color: '#16A34A', bg: 'rgba(22,163,74,0.15)' },
  FAILED:     { label: 'Başarısız',        color: '#DC2626', bg: 'rgba(239,68,68,0.1)' },
  REFUNDED:   { label: 'İade Edildi',      color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}

function relativeTime(iso: string): string {
  if (!iso) return '-'
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'şimdi'
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`
  return new Date(iso).toLocaleDateString('tr-TR')
}

export default function AdminCatalogOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const router = useRouter()

  const load = () => {
    setLoading(true)
    const url = filter ? `/api/admin/catalog/orders?status=${filter}` : '/api/admin/catalog/orders'
    api.get(url)
      .then(r => setOrders(r.data.data || []))
      .catch(() => toast.error('Siparişler yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const filtered = orders.filter(o =>
    !search ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.customerPhone.includes(search)
  )

  // Stat counts
  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    inProduction: orders.filter(o => o.status === 'IN_PRODUCTION').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    paid: orders.filter(o => o.paymentStatus === 'PAID').length,
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package size={18} className="text-[#F4821F]" />
                <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                  Katalog Siparişleri
                </h1>
              </div>
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                Toplam {counts.total} sipariş · {counts.pending} bekleyen · {counts.paid} ödendi
              </p>
            </div>
            <button onClick={load}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            {[
              { label: 'Toplam',        value: counts.total,        color: '#F4821F' },
              { label: 'Beklemede',     value: counts.pending,      color: '#D97706' },
              { label: 'Üretimde',      value: counts.inProduction, color: '#7C3AED' },
              { label: 'Kargoda',       value: counts.shipped,      color: '#059669' },
              { label: 'Ödendi',        value: counts.paid,         color: '#16A34A' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
                  {s.label}
                </p>
                <p className="text-[24px] font-black tracking-[-1px] mt-1" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter + search */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setFilter('')}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
                  !filter ? 'text-white' : ''
                }`}
                style={{
                  background: !filter ? '#F4821F' : 'var(--bg-card)',
                  color: !filter ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}>
                Hepsi
              </button>
              {Object.entries(STATUS_LABELS).map(([key, info]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className="px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors"
                  style={{
                    background: filter === key ? info.color : 'var(--bg-card)',
                    color: filter === key ? 'white' : 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}>
                  {info.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Sipariş no, ad, telefon..."
                className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#F4821F]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
              <Package size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                {orders.length === 0 ? 'Henüz katalog siparişi yok' : 'Filtreye uygun sipariş bulunamadı'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(o => {
                const st = STATUS_LABELS[o.status] || STATUS_LABELS.PENDING
                const pay = o.paymentStatus ? PAYMENT_LABELS[o.paymentStatus] : null
                return (
                  <div key={o.id}
                    onClick={() => router.push(`/admin/katalog/siparisler/${o.id}`)}
                    className="rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                    <div className="flex items-start gap-4 flex-wrap">

                      {/* Sol — sipariş no + müşteri */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <code className="text-[13px] font-mono font-bold" style={{ color: '#F4821F' }}>
                            {o.orderNumber}
                          </code>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.5px]"
                            style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                          {pay && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.5px]"
                              style={{ background: pay.bg, color: pay.color }}>
                              {pay.label}
                            </span>
                          )}
                        </div>
                        <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {o.customerName}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1"><Phone size={10} /> {o.customerPhone}</span>
                          {o.city && <span>{o.city}</span>}
                          <span className="flex items-center gap-1"><Calendar size={10} /> {relativeTime(o.createdAt)}</span>
                        </div>

                        {/* Ürünler */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {o.items.slice(0, 3).map((it, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                              {it.productName} ×{it.tierQty}
                            </span>
                          ))}
                          {o.items.length > 3 && (
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              +{o.items.length - 3} daha
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sağ — toplam */}
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
                          Toplam
                        </p>
                        <p className="text-[20px] font-black tracking-[-0.5px]" style={{ color: '#F4821F' }}>
                          ₺{Number(o.totalTl).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-[10px] mt-1 flex items-center justify-end gap-1"
                          style={{ color: 'var(--text-muted)' }}>
                          Detay <ExternalLink size={9} />
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  )
}
