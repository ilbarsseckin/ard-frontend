'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { orderApi } from '@/lib/api'
import { Check, Clock, Package, Printer, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const steps = [
  { key: 'PAID', label: 'Ödeme alındı', icon: Check },
  { key: 'REVIEWING', label: 'İncelemede', icon: Clock },
  { key: 'PRINTING', label: 'Baskıda', icon: Printer },
  { key: 'SHIPPED', label: 'Kargoda', icon: Truck },
  { key: 'COMPLETED', label: 'Teslim edildi', icon: CheckCircle },
]

export default function SiparisDetayPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderApi.get(id as string),
      orderApi.history(id as string),
    ]).then(([o, h]) => {
      setOrder(o.data.data)
      setHistory(h.data.data || [])
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[13px] text-gray-400">Yükleniyor...</div>
      </div>
    </>
  )

  if (!order) return null

  const currentStepIdx = steps.findIndex(s => s.key === order.status)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/hesabim" className="text-[13px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">← Siparişlerim</Link>
          </div>

          <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6 mb-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[18px] font-medium text-gray-900 dark:text-gray-100">
                  #{order.id.substring(0, 8).toUpperCase()}
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[22px] font-medium text-[#F4821F]">
                  ₺{order.totalPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Durum çizelgesi */}
            <div className="flex items-center gap-0 mb-6">
              {steps.map((s, i) => {
                const done = i <= currentStepIdx
                const current = i === currentStepIdx
                return (
                  <div key={s.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${done ? 'bg-[#F4821F]' : 'bg-black/[0.06] dark:bg-white/[0.06]'}`}>
                        <s.icon size={14} className={done ? 'text-white' : 'text-gray-400'} />
                      </div>
                      <p className={`text-[10px] mt-1.5 text-center leading-tight ${current ? 'text-[#F4821F] font-medium' : done ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}`}>
                        {s.label}
                      </p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-px mb-4 mx-1 ${i < currentStepIdx ? 'bg-[#F4821F]' : 'bg-black/[0.06] dark:bg-white/[0.06]'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Teslimat adresi */}
            <div className="border-t border-black/[0.07] dark:border-white/[0.07] pt-4">
              <p className="text-[11px] text-gray-400 mb-1">Teslimat adresi</p>
              <p className="text-[13px] text-gray-700 dark:text-gray-300">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Durum geçmişi */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6">
              <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-4">Durum geçmişi</p>
              <div className="space-y-3">
                {history.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#F4821F] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-[13px] text-gray-900 dark:text-gray-100">{h.note || h.status}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(h.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
