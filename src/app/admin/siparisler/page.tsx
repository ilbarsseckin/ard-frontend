'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Check, X, Printer, Truck, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

const statuses = [
  { val: '', label: 'Tümü' },
  { val: 'PAID', label: 'Ödendi' },
  { val: 'REVIEWING', label: 'İncelemede' },
  { val: 'PRINTING', label: 'Baskıda' },
  { val: 'SHIPPED', label: 'Kargoda' },
  { val: 'COMPLETED', label: 'Tamamlandı' },
  { val: 'CANCELLED', label: 'İptal' },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Ödeme Bekleniyor', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-white/[0.06]' },
  PAID: { label: 'Ödendi', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  REVIEWING: { label: 'İncelemede', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  PRINTING: { label: 'Baskıda', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  SHIPPED: { label: 'Kargoda', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  COMPLETED: { label: 'Tamamlandı', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  CANCELLED: { label: 'İptal', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
}

function SiparislerContent() {
  const params = useSearchParams()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState(params.get('status') || '')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadOrders = () => {
    setLoading(true)
    const url = filterStatus ? `/api/operator/orders?status=${filterStatus}` : '/api/operator/orders'
    api.get(url).then(r => setOrders(r.data.data || [])).finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [filterStatus])

  const updateStatus = async (orderId: string, endpoint: string, successMsg: string) => {
    setActionLoading(orderId)
    try {
      await api.post(`/api/operator/orders/${orderId}/${endpoint}`)
      toast.success(successMsg)
      loadOrders()
    } catch { toast.error('İşlem başarısız') }
    finally { setActionLoading(null) }
  }

  return (
       <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Sipariş yönetimi</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">{orders.length} sipariş</p>
            </div>
          </div>

          {/* Filtreler */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {statuses.map(s => (
              <button key={s.val} onClick={() => setFilterStatus(s.val)}
                className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${filterStatus === s.val ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent' : 'border-black/[0.08] dark:border-white/[0.08] text-gray-500 hover:bg-gray-50 dark:hover:bg-white/[0.04]'}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 animate-pulse h-20" />
              ))
            ) : orders.length === 0 ? (
              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-10 text-center">
                <p className="text-[14px] text-gray-400">Sipariş bulunamadı</p>
              </div>
            ) : orders.map((o: any) => {
              const s = statusMap[o.status] || { label: o.status, color: 'text-gray-500', bg: 'bg-gray-100' }
              const isExpanded = expandedId === o.id
              const hasWarning = o.pageWarning

              return (
                <div key={o.id} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden">
                  {/* Sipariş başlık satırı */}
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                          #{o.id.substring(0, 8).toUpperCase()}
                        </p>
                        {hasWarning && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded">
                            <AlertTriangle size={10} /> PDF uyarısı
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {o.customerName} · {o.customerEmail} · {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>

                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${s.bg} ${s.color}`}>
                      {s.label}
                    </span>

                    <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100 w-24 text-right">
                      ₺{o.totalPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </p>

                    {/* Aksiyon butonları */}
                    <div className="flex items-center gap-2">
                      {o.status === 'PAID' && (
                        <>
                          <button onClick={() => updateStatus(o.id, 'approve', 'Onaylandı')}
                            disabled={actionLoading === o.id}
                            className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50">
                            <Check size={12} /> Onayla
                          </button>
                          <button onClick={() => updateStatus(o.id, 'reject', 'Reddedildi')}
                            disabled={actionLoading === o.id}
                            className="flex items-center gap-1 text-[11px] font-medium text-red-500 bg-red-50 dark:bg-red-500/10 px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50">
                            <X size={12} /> Reddet
                          </button>
                        </>
                      )}
                      {o.status === 'REVIEWING' && (
                        <button onClick={() => updateStatus(o.id, 'print', 'Baskıya gönderildi')}
                          disabled={actionLoading === o.id}
                          className="flex items-center gap-1 text-[11px] font-medium text-purple-600 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50">
                          <Printer size={12} /> Baskıya gönder
                        </button>
                      )}
                      {o.status === 'PRINTING' && (
                        <button onClick={() => updateStatus(o.id, 'ship', 'Kargoya verildi')}
                          disabled={actionLoading === o.id}
                          className="flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50">
                          <Truck size={12} /> Kargoya ver
                        </button>
                      )}
                      {o.status === 'SHIPPED' && (
                        <button onClick={() => updateStatus(o.id, 'complete', 'Tamamlandı')}
                          disabled={actionLoading === o.id}
                          className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50">
                          <CheckCircle size={12} /> Tamamla
                        </button>
                      )}

                      <button onClick={() => setExpandedId(isExpanded ? null : o.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Genişletilmiş detay */}
                  {isExpanded && (
                    <div className="border-t border-black/[0.07] dark:border-white/[0.07] p-4 bg-gray-50 dark:bg-white/[0.02]">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[11px] text-gray-400 mb-1">Müşteri bilgisi</p>
                          <p className="text-[12px] text-gray-900 dark:text-gray-100">{o.customerName}</p>
                          <p className="text-[12px] text-gray-500">{o.customerEmail}</p>
                          <p className="text-[12px] text-gray-500">{o.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 mb-1">Teslimat adresi</p>
                          <p className="text-[12px] text-gray-900 dark:text-gray-100">{o.shippingAddress}</p>
                        </div>
                      </div>

                      {o.items && o.items.length > 0 && (
                        <div>
                          <p className="text-[11px] text-gray-400 mb-2">Sipariş kalemleri</p>
                          <div className="space-y-2">
                            {o.items.map((item: any, i: number) => (
                              <div key={i} className="bg-white dark:bg-[#141414] rounded-lg p-3 border border-black/[0.05] dark:border-white/[0.05]">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{item.productType}</p>
                                    {item.widthCm && <p className="text-[11px] text-gray-400">{item.widthCm}×{item.heightCm} cm · {item.quantity} adet</p>}
                                    {item.fileOriginalName && (
                                      <p className="text-[11px] text-emerald-600 mt-0.5">📎 {item.fileOriginalName}
                                        {item.filePageCount > 1 && <span className="ml-1 text-amber-500">({item.filePageCount} sayfa)</span>}
                                      </p>
                                    )}
                                  </div>
                                  <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                                    ₺{item.totalPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </AdminGuard>
  )
}

export default function AdminSiparislerPage() {
  return <Suspense><SiparislerContent /></Suspense>
}
