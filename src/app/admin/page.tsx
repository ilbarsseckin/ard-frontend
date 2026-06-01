'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import {
  TrendingUp, ShoppingBag, Users, Package, Clock, ArrowUpRight,
  Loader2, AlertCircle, CheckCircle2, Printer, Truck
} from 'lucide-react'

interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  weekOrders: number
  weekRevenue: number
  monthOrders: number
  monthRevenue: number
  totalCustomers: number
  totalProducts: number
  activeProducts: number
  pendingActionsCount: number
  statusBreakdown: Record<string, number>
  last7Days: { date: string; orders: number; revenue: number }[]
  recentOrders: { id: string; customerName: string; status: string; totalPrice: number; createdAt: string }[]
  topProducts: { slug: string; orderCount: number; revenue: number }[]
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Bekliyor',     color: '#F59E0B' },
  PAID:       { label: 'Ödendi',       color: '#3B82F6' },
  REVIEWING:  { label: 'İncelemede',   color: '#8B5CF6' },
  PRINTING:   { label: 'Baskıda',      color: '#F4821F' },
  SHIPPED:    { label: 'Kargoda',      color: '#06B6D4' },
  COMPLETED:  { label: 'Tamamlandı',   color: '#10B981' },
  CANCELLED:  { label: 'İptal',        color: '#EF4444' },
}

function tl(n: number) {
  return '₺' + (n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatDayLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { weekday: 'short', day: '2-digit' })
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/api/admin/dashboard/stats')
      .then(r => setStats(r.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
              Dashboard
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Genel bakış · {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#F4821F]" />
            </div>
          ) : error || !stats ? (
            <div className="text-center py-20 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <AlertCircle size={32} className="mx-auto mb-3 text-red-500" />
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>İstatistikler yüklenemedi</p>
            </div>
          ) : (
            <>
              {/* ─── KPI cards ─── */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <KpiCard
                  label="Bugünkü Ciro"
                  value={tl(stats.todayRevenue)}
                  sub={`${stats.todayOrders} sipariş`}
                  icon={TrendingUp}
                  color="#10B981" />
                <KpiCard
                  label="Bu Ay"
                  value={tl(stats.monthRevenue)}
                  sub={`${stats.monthOrders} sipariş`}
                  icon={ShoppingBag}
                  color="#F4821F" />
                <KpiCard
                  label="Bekleyen İşlem"
                  value={stats.pendingActionsCount.toString()}
                  sub="hazırlanacak / kargolanacak"
                  icon={Clock}
                  color="#F59E0B"
                  href="/admin/siparisler" />
                <KpiCard
                  label="Toplam Müşteri"
                  value={stats.totalCustomers.toString()}
                  sub={`${stats.activeProducts}/${stats.totalProducts} aktif ürün`}
                  icon={Users}
                  color="#3B82F6" />
              </div>

              {/* ─── Grafik + durum dağılımı ─── */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* 7 günlük satış grafiği */}
                <div className="col-span-2 rounded-2xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                        Son 7 Gün
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        Günlük ciro ve sipariş sayısı
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-bold" style={{ color: 'var(--text-primary)' }}>
                        {tl(stats.weekRevenue)}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {stats.weekOrders} sipariş
                      </p>
                    </div>
                  </div>
                  <Last7DaysChart data={stats.last7Days} />
                </div>

                {/* Durum dağılımı */}
                <div className="rounded-2xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-[13px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Sipariş Durumları
                  </p>
                  <div className="space-y-2.5">
                    {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                      const cfg = STATUS_LABELS[status] || { label: status, color: '#888' }
                      const total = Object.values(stats.statusBreakdown).reduce((a, b) => a + b, 0) || 1
                      const pct = (count / total) * 100
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                              {cfg.label}
                            </span>
                            <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                              {count}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden"
                            style={{ background: 'var(--bg-secondary)' }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: cfg.color }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ─── Son siparişler + en çok satılan ─── */}
              <div className="grid grid-cols-3 gap-4">
                {/* Son siparişler */}
                <div className="col-span-2 rounded-2xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      Son Siparişler
                    </p>
                    <Link href="/admin/siparisler"
                      className="text-[11px] font-bold flex items-center gap-1 hover:underline"
                      style={{ color: '#F4821F' }}>
                      Tümü <ArrowUpRight size={11} />
                    </Link>
                  </div>
                  {stats.recentOrders.length === 0 ? (
                    <p className="text-[12px] py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      Henüz sipariş yok
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {stats.recentOrders.map(o => {
                        const cfg = STATUS_LABELS[o.status] || { label: o.status, color: '#888' }
                        return (
                          <div key={o.id}
                            className="flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                            style={{ background: 'var(--bg-secondary)' }}>
                            <div>
                              <p className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
                                {o.customerName}
                              </p>
                              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                #{o.id.slice(0, 8).toUpperCase()} · {formatDate(o.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                style={{
                                  background: cfg.color + '20',
                                  color: cfg.color,
                                  border: `1px solid ${cfg.color}40`
                                }}>
                                {cfg.label}
                              </span>
                              <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                                {tl(o.totalPrice)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* En çok satılan */}
                <div className="rounded-2xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-[13px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    En Çok Satılan
                  </p>
                  {stats.topProducts.length === 0 ? (
                    <p className="text-[12px] py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      Henüz veri yok
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {stats.topProducts.map((p, i) => (
                        <div key={p.slug} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
                            style={{
                              background: i === 0 ? '#F4821F' : 'var(--bg-secondary)',
                              color: i === 0 ? 'white' : 'var(--text-muted)',
                              border: '1px solid var(--border)'
                            }}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                              {p.slug}
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {p.orderCount} adet · {tl(p.revenue)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </AdminGuard>
  )
}

function KpiCard({ label, value, sub, icon: Icon, color, href }: {
  label: string; value: string; sub: string; icon: any; color: string; href?: string
}) {
  const inner = (
    <div className="rounded-2xl p-5 transition-all hover:translate-y-[-2px]"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: color + '15' }}>
          <Icon size={16} style={{ color }} />
        </div>
        {href && <ArrowUpRight size={13} style={{ color: 'var(--text-muted)' }} />}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="text-[20px] font-black tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
      <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

function Last7DaysChart({ data }: { data: { date: string; orders: number; revenue: number }[] }) {
  const maxRev = Math.max(...data.map(d => d.revenue), 1)
  return (
    <div className="flex items-end gap-2 h-[160px]">
      {data.map((d, i) => {
        const h = (d.revenue / maxRev) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex-1 flex flex-col justify-end relative group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-1 rounded whitespace-nowrap z-10"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                {d.orders} sipariş · ₺{d.revenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
              </div>
              <div className="w-full rounded-t-md transition-all"
                style={{
                  height: `${Math.max(h, 4)}%`,
                  background: d.revenue > 0
                    ? 'linear-gradient(180deg, #F4821F 0%, #F4821F80 100%)'
                    : 'var(--bg-secondary)',
                }} />
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {formatDayLabel(d.date)}
            </span>
          </div>
        )
      })}
    </div>
  )
}