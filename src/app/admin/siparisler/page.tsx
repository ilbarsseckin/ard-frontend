'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Package, Loader2, RefreshCw, Search, ExternalLink,
  Phone, Calendar, ChevronDown,
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
  const [filterOpen, setFilterOpen] = useState(false)
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

  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    inProduction: orders.filter(o => o.status === 'IN_PRODUCTION').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    paid: orders.filter(o => o.paymentStatus === 'PAID').length,
  }

  const activeFilterLabel = filter ? STATUS_LABELS[filter]?.label : 'Tümü'

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Package size={16} className="text-[#F4821F]" />
                <h1 className="text-[18px] sm:text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                  Katalog Siparişleri
                </h1>
              </div>
              <p className="text-[11px] sm:text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {counts.total} sipariş · {counts.pending} bekleyen · {counts.paid} ödendi
              </p>
            </div>
            <button onClick={load}
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Stat kartları */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
            {[
              { label: 'Toplam',    value: counts.total,        color: '#F4821F' },
              { label: 'Bekleyen', value: counts.pending,      color: '#D97706' },
              { label: 'Üretimde', value: counts.inProduction, color: '#7C3AED' },
              { label: 'Kargoda',  value: counts.shipped,      color: '#059669' },
              { label: 'Ödendi',   value: counts.paid,         color: '#16A34A' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-2.5 sm:p-3"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
                  {s.label}
                </p>
                <p className="text-[20px] sm:text-[24px] font-black tracking-[-1px] mt-0.5" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Arama + Filtre */}
          <div className="flex gap-2 mb-4">
            {/* Arama */}
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Sipariş no, ad, telefon..."
                className="w-full pl-8 pr-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>

            {/* Mobil filtre dropdown */}
            <div className="relative sm:hidden">
              <button onClick={() => setFilterOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium rounded-lg whitespace-nowrap"
                style={{ background: filter ? '#F4821F' : 'var(--bg-card)', color: filter ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {activeFilterLabel}
                <ChevronDown size={12} className={filterOpen ? 'rotate-180' : ''} />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl z-20 overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <button onClick={() => { setFilter(''); setFilterOpen(false) }}
                    className="w-full text-left px-3 py-2.5 text-[12px] font-medium"
                    style={{ color: !filter ? '#F4821F' : 'var(--text-secondary)', background: !filter ? 'rgba(244,130,31,0.08)' : 'transparent' }}>
                    Tümü
                  </button>
                  {Object.entries(STATUS_LABELS).map(([key, info]) => (
                    <button key={key} onClick={() => { setFilter(key); setFilterOpen(false) }}
                      className="w-full text-left px-3 py-2.5 text-[12px] font-medium border-t"
                      style={{ color: filter === key ? info.color : 'var(--text-secondary)', background: filter === key ? info.bg : 'transparent', borderColor: 'var(--border)' }}>
                      {info.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Masaüstü filtre butonları */}
          <div className="hidden sm:flex gap-1 flex-wrap mb-4">
            <button onClick={() => setFilter('')}
              className="px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors"
              style={{ background: !filter ? '#F4821F' : 'var(--bg-card)', color: !filter ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              Hepsi
            </button>
            {Object.entries(STATUS_LABELS).map(([key, info]) => (
              <button key={key} onClick={() => setFilter(key)}
                className="px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors"
                style={{ background: filter === key ? info.color : 'var(--bg-card)', color: filter === key ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {info.label}
              </button>
            ))}
          </div>

          {/* Liste */}
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
                    className="rounded-xl p-3 sm:p-4 cursor-pointer transition-all active:scale-[0.99]"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Sipariş no + durum */}
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <code className="text-[12px] sm:text-[13px] font-mono font-bold" style={{ color: '#F4821F' }}>
                            {o.orderNumber}
                          </code>
                          <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase"
                            style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                          {pay && (
                            <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase"
                              style={{ background: pay.bg, color: pay.color }}>
                              {pay.label}
                            </span>
                          )}
                        </div>

                        {/* Müşteri adı */}
                        <p className="text-[13px] sm:text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {o.customerName}
                        </p>

                        {/* İletişim + tarih */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1"><Phone size={9} /> {o.customerPhone}</span>
                          {o.city && <span>{o.city}</span>}
                          <span className="flex items-center gap-1"><Calendar size={9} /> {relativeTime(o.createdAt)}</span>
                        </div>

                        {/* Ürünler */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {o.items.slice(0, 2).map((it, i) => (
                            <span key={i} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                              {it.productName} ×{it.tierQty}
                            </span>
                          ))}
                          {o.items.length > 2 && (
                            <span className="text-[9px] sm:text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              +{o.items.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sağ — fiyat */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-[18px] sm:text-[20px] font-black tracking-[-0.5px]" style={{ color: '#F4821F' }}>
                          ₺{Number(o.totalTl).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-[9px] sm:text-[10px] mt-0.5 flex items-center justify-end gap-1"
                          style={{ color: 'var(--text-muted)' }}>
                          Detay <ExternalLink size={8} />
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