'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/lib/store/auth'
import { orderApi } from '@/lib/api'
import { Package, Clock, CheckCircle, Truck, User, LogOut } from 'lucide-react'
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

export default function HesabimPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/giris'); return }
    orderApi.list().then(r => setOrders(r.data.data || [])).finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => { logout(); router.push('/') }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[24px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Hesabım</h1>
              <p className="text-[13px] text-gray-400 mt-1">{user?.email}</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={14} /> Çıkış yap
            </button>
          </div>

          <h2 className="text-[16px] font-medium text-gray-900 dark:text-gray-100 mb-4">Siparişlerim</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 h-20 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-10 text-center">
              <Package size={32} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
              <p className="text-[14px] text-gray-500">Henüz sipariş yok</p>
              <Link href="/siparis" className="inline-block mt-3 text-[12px] text-[#F4821F] hover:underline">İlk siparişini ver →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o: any) => {
                const s = statusMap[o.status] || { label: o.status, color: 'text-gray-500' }
                return (
                  <Link key={o.id} href={`/hesabim/siparisler/${o.id}`}
                    className="block bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 hover:border-[#F4821F] transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                          #{o.id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[12px] font-medium ${s.color}`}>{s.label}</span>
                        <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                          ₺{o.totalPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
