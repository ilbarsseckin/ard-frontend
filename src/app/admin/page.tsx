'use client'
import { useState, useEffect } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api, { orderApi, productApi } from '@/lib/api'
import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Ödeme Bekleniyor', color: 'text-gray-500' },
  PAID: { label: 'Ödendi', color: 'text-blue-600' },
  REVIEWING: { label: 'İncelemede', color: 'text-amber-600' },
  PRINTING: { label: 'Baskıda', color: 'text-purple-600' },
  SHIPPED: { label: 'Kargoda', color: 'text-blue-600' },
  COMPLETED: { label: 'Tamamlandı', color: 'text-emerald-600' },
  CANCELLED: { label: 'İptal', color: 'text-red-500' },
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/operator/orders'),
      productApi.list(),
    ]).then(([o, p]) => {
      setOrders(o.data.data || [])
      setProducts(p.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const pending = orders.filter(o => o.status === 'PENDING' || o.status === 'PAID').length
  const today = orders.filter(o => {
    const d = new Date(o.createdAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + (o.totalPrice || 0), 0)

  const metrics = [
    { label: 'Toplam sipariş', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Bekleyen sipariş', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Bugün', value: today, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Toplam ciro', value: `₺${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`, icon: Package, color: 'text-[#F4821F]', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  ]

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-[24px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Dashboard</h1>
            <p className="text-[13px] text-gray-400 mt-1">Genel bakış</p>
          </div>

          {/* Metrikler */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {metrics.map((m, i) => (
              <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5">
                <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center mb-3`}>
                  <m.icon size={18} className={m.color} />
                </div>
                <p className="text-[22px] font-medium text-gray-900 dark:text-gray-100 tracking-[-0.4px]">
                  {loading ? '—' : m.value}
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Son siparişler */}
            <div className="col-span-2 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl">
              <div className="flex items-center justify-between p-5 border-b border-black/[0.07] dark:border-white/[0.07]">
                <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">Son siparişler</p>
                <Link href="/admin/siparisler" className="text-[12px] text-[#F4821F]">Tümünü gör →</Link>
              </div>
              <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 animate-pulse">
                      <div className="h-3 bg-gray-100 dark:bg-white/[0.05] rounded w-3/4" />
                    </div>
                  ))
                ) : orders.slice(0, 6).map((o: any) => {
                  const s = statusMap[o.status] || { label: o.status, color: 'text-gray-500' }
                  return (
                    <Link key={o.id} href={`/admin/siparisler`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                          #{o.id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[11px] font-medium ${s.color}`}>{s.label}</span>
                        <span className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                          ₺{o.totalPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Hızlı erişim */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5">
                <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 mb-3">Hızlı erişim</p>
                <div className="space-y-2">
                  <Link href="/admin/siparisler?status=PAID"
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:opacity-80 transition-opacity">
                    <span className="text-[12px] font-medium text-amber-700 dark:text-amber-400">Onay bekleyenler</span>
                    <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">{pending}</span>
                  </Link>
                  <Link href="/admin/urunler"
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 hover:opacity-80 transition-opacity">
                    <span className="text-[12px] font-medium text-blue-700 dark:text-blue-400">Aktif ürünler</span>
                    <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">{products.length}</span>
                  </Link>
                  <Link href="/admin/urunler?tab=import"
                    className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:opacity-80 transition-opacity">
                    <span className="text-[12px] font-medium text-emerald-700 dark:text-emerald-400">Ürün yükle (CSV)</span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">→</span>
                  </Link>
                </div>
              </div>

              <div className="bg-[#F4821F] rounded-xl p-5">
                <p className="text-[13px] font-medium text-white mb-1">Aktif ürün sayısı</p>
                <p className="text-[32px] font-medium text-white tracking-[-0.8px]">{products.length}</p>
                <Link href="/admin/urunler" className="text-[11px] text-white/70 hover:text-white transition-colors">
                  Yönet →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminGuard>
  )
}
