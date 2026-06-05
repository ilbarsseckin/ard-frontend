'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Loader2, RefreshCw, FileText, Image as ImageIcon, Download,
  User, Phone, Mail, MapPin, Calendar, CreditCard, Package,
  AlertTriangle, MessageCircle, Truck,
} from 'lucide-react'

interface OrderItem {
  id: string
  productName: string
  productSlug?: string
  mainImageUrl?: string
  tierQty: number
  unitPriceUsd?: number
  priceTl: number
  attributesSnapshot?: Record<string, string>
}

interface OrderDetail {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  address?: string
  city?: string
  district?: string
  notes?: string
  status: string
  paymentStatus?: string
  iyzicoPaymentId?: string
  subtotalUsd?: number
  totalTl: number
  usdKurAtOrder?: number
  items: OrderItem[]
  createdAt: string
  updatedAt?: string
  trackingNumber?: string
  cargoCompany?: string
}

interface OrderFile {
  id: string
  originalName: string
  fileSize: number
  mimeType: string
  pageCount?: number
  pageWarning: boolean
  createdAt: string
  downloadUrl?: string
}

const STATUS_OPTIONS = [
  { value: 'PENDING',       label: 'Beklemede',     color: '#D97706', bg: 'rgba(245,158,11,0.1)' },
  { value: 'CONFIRMED',     label: 'Onaylandı',     color: '#2563EB', bg: 'rgba(59,130,246,0.1)' },
  { value: 'IN_PRODUCTION', label: 'Üretimde',      color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  { value: 'READY',         label: 'Hazır',         color: '#0891B2', bg: 'rgba(8,145,178,0.1)' },
  { value: 'SHIPPED',       label: 'Kargoda',       color: '#059669', bg: 'rgba(16,185,129,0.1)' },
  { value: 'DELIVERED',     label: 'Teslim Edildi', color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
  { value: 'CANCELLED',     label: 'İptal',         color: '#DC2626', bg: 'rgba(239,68,68,0.1)' },
]

const PAYMENT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:    { label: 'Ödeme Beklemede', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  PROCESSING: { label: '3DS Bekliyor',    color: '#D97706', bg: 'rgba(245,158,11,0.1)' },
  PAID:       { label: 'Ödendi',          color: '#16A34A', bg: 'rgba(22,163,74,0.15)' },
  FAILED:     { label: 'Başarısız',       color: '#DC2626', bg: 'rgba(239,68,68,0.1)' },
  REFUNDED:   { label: 'İade Edildi',     color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function fullDate(iso: string): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminCatalogOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [files, setFiles] = useState<OrderFile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // Kargo modal state
  const [shipModalOpen, setShipModalOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [cargoCompany, setCargoCompany] = useState('')
  const [shipping, setShipping] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get(`/api/admin/catalog/orders/${orderId}`),
      api.get(`/api/admin/catalog/orders/${orderId}/files`).catch(() => ({ data: { data: [] } })),
    ])
      .then(([orderRes, filesRes]) => {
        setOrder(orderRes.data.data)
        setFiles(filesRes.data.data || [])
      })
      .catch(() => toast.error('Sipariş yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (orderId) load() }, [orderId])

  const handleStatusChange = async (newStatus: string) => {
    if (!order || newStatus === order.status) return
    setUpdatingStatus(true)
    try {
      await api.patch(`/api/admin/catalog/orders/${order.id}/status`, { status: newStatus })
      toast.success(`Durum: ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Durum değiştirilemedi')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleShip = async () => {
    if (!order || !trackingNumber.trim()) return
    setShipping(true)
    try {
      await api.patch(`/api/admin/catalog/orders/${order.id}/ship`, {
        trackingNumber: trackingNumber.trim(),
        cargoCompany: cargoCompany.trim() || 'Kargo',
      })
      toast.success('Kargo bilgisi kaydedildi, müşteriye email gönderildi ✉️')
      setShipModalOpen(false)
      setTrackingNumber('')
      setCargoCompany('')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kargo bilgisi kaydedilemedi')
    } finally {
      setShipping(false)
    }
  }

  const handleDownload = async (file: OrderFile) => {
    setDownloadingId(file.id)
    try {
      const res = await api.get(`/api/admin/catalog/orders/files/${file.id}/download`, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.originalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      toast.error('İndirilemedi')
    } finally {
      setDownloadingId(null)
    }
  }

  const handlePreview = (file: OrderFile) => {
    if (!file.downloadUrl) {
      toast.error('Önizleme yok')
      return
    }
    window.open(file.downloadUrl, '_blank')
  }

  const handleWhatsApp = () => {
    if (!order) return
    const phone = order.customerPhone.replace(/\D/g, '')
    const msg = `Merhaba ${order.customerName}, ${order.orderNumber} numaralı siparişiniz hakkında...`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminNavbar />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <Loader2 size={28} className="animate-spin text-[#F4821F]" />
        </main>
      </AdminGuard>
    )
  }

  if (!order) {
    return (
      <AdminGuard>
        <AdminNavbar />
        <main className="min-h-screen p-8" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto text-center py-16">
            <AlertTriangle size={32} className="mx-auto mb-3 opacity-30 text-red-500" />
            <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Sipariş bulunamadı</p>
            <Link href="/admin/katalog/siparisler"
              className="inline-block mt-4 text-[12px] font-bold text-[#F4821F] hover:underline">
              ← Sipariş listesine dön
            </Link>
          </div>
        </main>
      </AdminGuard>
    )
  }

  const st = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0]
  const pay = order.paymentStatus ? PAYMENT_LABELS[order.paymentStatus] : null

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Üst — geri + sipariş no */}
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/admin/katalog/siparisler')}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <ArrowLeft size={14} />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-[16px] font-mono font-bold" style={{ color: '#F4821F' }}>
                    {order.orderNumber}
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
                <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={10} /> {fullDate(order.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg"
                style={{ background: '#25D366', color: 'white' }}>
                <MessageCircle size={13} /> WhatsApp
              </button>
              <button onClick={load}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Status değiştir bar */}
          <div className="rounded-xl p-4 mb-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] mb-2" style={{ color: 'var(--text-muted)' }}>
              Sipariş Durumu
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_OPTIONS.map(s => (
                <button key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  disabled={updatingStatus || s.value === order.status}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all disabled:cursor-default"
                  style={{
                    background: s.value === order.status ? s.color : 'var(--bg-secondary)',
                    color: s.value === order.status ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${s.value === order.status ? s.color : 'var(--border)'}`,
                    opacity: updatingStatus && s.value !== order.status ? 0.5 : 1,
                  }}>
                  {s.label}
                </button>
              ))}
              {updatingStatus && <Loader2 size={14} className="animate-spin text-[#F4821F]" />}
            </div>
          </div>

          {/* Kargo bilgisi kutusu */}
          {order.trackingNumber ? (
            <div className="rounded-xl p-4 mb-5 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[1px] text-emerald-700">Kargo Bilgisi</p>
                  <p className="text-[15px] font-bold font-mono text-emerald-800">{order.trackingNumber}</p>
                  {order.cargoCompany && (
                    <p className="text-[12px] text-emerald-600">{order.cargoCompany}</p>
                  )}
                </div>
              </div>
              <button onClick={() => {
                  setTrackingNumber(order.trackingNumber || '')
                  setCargoCompany(order.cargoCompany || '')
                  setShipModalOpen(true)
                }}
                className="px-3 py-1.5 text-[11px] font-medium rounded-lg"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                Güncelle
              </button>
            </div>
          ) : (
            <div className="mb-5">
              <button onClick={() => setShipModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold rounded-xl text-white w-full justify-center"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                <Truck size={15} /> Kargo Bilgisi Gir &amp; Müşteriye Bildir
              </button>
            </div>
          )}

          {/* Grid — müşteri | toplam */}
          <div className="grid md:grid-cols-2 gap-3 mb-5">

            {/* Müşteri kartı */}
            <div className="rounded-xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <User size={14} className="text-[#F4821F]" />
                <h3 className="text-[13px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                  Müşteri Bilgileri
                </h3>
              </div>
              <div className="space-y-2 text-[13px]">
                <p style={{ color: 'var(--text-primary)' }}>
                  <span className="font-semibold">{order.customerName}</span>
                </p>
                <p className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <Phone size={12} className="opacity-60" />
                  <a href={`tel:${order.customerPhone}`} className="hover:text-[#F4821F]">{order.customerPhone}</a>
                </p>
                {order.customerEmail && (
                  <p className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={12} className="opacity-60" />
                    <a href={`mailto:${order.customerEmail}`} className="hover:text-[#F4821F]">{order.customerEmail}</a>
                  </p>
                )}
                {(order.address || order.city) && (
                  <p className="flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={12} className="opacity-60 flex-shrink-0 mt-0.5" />
                    <span>
                      {order.address}
                      {order.address && (order.district || order.city) && ', '}
                      {[order.district, order.city].filter(Boolean).join(' / ')}
                    </span>
                  </p>
                )}
                {order.notes && (
                  <div className="mt-3 p-2 rounded-lg text-[12px]"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-[1px] mb-1 opacity-60">Not</p>
                    {order.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Toplam kartı */}
            <div className="rounded-xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} className="text-[#F4821F]" />
                <h3 className="text-[13px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                  Ödeme
                </h3>
              </div>
              <div className="space-y-2 text-[13px]">
                {order.subtotalUsd != null && (
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>USD Ara Toplam</span>
                    <span>${Number(order.subtotalUsd).toFixed(2)}</span>
                  </div>
                )}
                {order.usdKurAtOrder != null && (
                  <div className="flex justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Kur (sipariş anı)</span>
                    <span>1 USD = ₺{Number(order.usdKurAtOrder).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Toplam</span>
                  <span className="text-[20px] font-black tracking-[-0.5px]" style={{ color: '#F4821F' }}>
                    ₺{Number(order.totalTl).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                {order.iyzicoPaymentId && (
                  <p className="text-[10px] mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                    Iyzico: {order.iyzicoPaymentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sipariş kalemleri */}
          <div className="rounded-xl p-4 mb-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Package size={14} className="text-[#F4821F]" />
              <h3 className="text-[13px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                Sipariş Kalemleri ({order.items.length})
              </h3>
            </div>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    {item.mainImageUrl ? (
                      <img src={item.mainImageUrl} alt={item.productName}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.productName}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Adet: <strong>{item.tierQty}</strong>
                      {item.unitPriceUsd != null && (
                        <> · Birim: ${Number(item.unitPriceUsd).toFixed(2)}</>
                      )}
                    </p>
                    {item.attributesSnapshot && Object.keys(item.attributesSnapshot).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {Object.entries(item.attributesSnapshot).map(([k, v]) => (
                          <span key={k} className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                            {k}: <strong>{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-black" style={{ color: '#F4821F' }}>
                      ₺{Number(item.priceTl).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasarım dosyaları */}
          <div className="rounded-xl p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-[#F4821F]" />
              <h3 className="text-[13px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-primary)' }}>
                Tasarım Dosyaları ({files.length})
              </h3>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-8 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border)' }}>
                <FileText size={24} className="mx-auto mb-2 opacity-30" style={{ color: 'var(--text-muted)' }} />
                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  Müşteri henüz tasarım yüklemedi
                </p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  WhatsApp'tan iletmesini isteyebilirsin
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map(f => {
                  const isImage = f.mimeType.startsWith('image/')
                  const isPdf = f.mimeType === 'application/pdf'
                  return (
                    <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      {/* İkon veya preview */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        {isImage && f.downloadUrl ? (
                          <img src={f.downloadUrl} alt={f.originalName}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handlePreview(f)} />
                        ) : isPdf ? (
                          <FileText size={22} className="text-red-500" />
                        ) : (
                          <ImageIcon size={22} className="text-blue-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {f.originalName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <span>{formatBytes(f.fileSize)}</span>
                          <span>·</span>
                          <span className="uppercase">{f.mimeType.split('/')[1]}</span>
                          {f.pageCount != null && (
                            <>
                              <span>·</span>
                              <span className={f.pageWarning ? 'text-orange-500 font-bold' : ''}>
                                {f.pageCount} sayfa
                                {f.pageWarning && ' ⚠'}
                              </span>
                            </>
                          )}
                        </div>
                        {f.pageWarning && (
                          <p className="text-[10px] mt-1 text-orange-500 flex items-center gap-1">
                            <AlertTriangle size={10} /> Birden fazla sayfa içeriyor, müşteri ile teyit et
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1.5 flex-shrink-0">
                        {(isImage || isPdf) && (
                          <button onClick={() => handlePreview(f)}
                            title="Önizle"
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-[#F4821F]"
                            style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                            <ImageIcon size={12} />
                          </button>
                        )}
                        <button onClick={() => handleDownload(f)} disabled={downloadingId === f.id}
                          title="İndir"
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-[#F4821F]"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                          {downloadingId === f.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Kargo Bilgisi Modal */}
      {shipModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShipModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(5,150,105,0.1)' }}>
                <Truck size={18} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Kargo Bilgisi Gir
                </h2>
                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  Müşteriye otomatik email gönderilecek
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                  style={{ color: 'var(--text-secondary)' }}>
                  Kargo Takip Numarası *
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="örn: 12345678901"
                  className="w-full px-3 py-2.5 text-[14px] rounded-lg outline-none font-mono"
                  style={{
                    background: 'var(--bg-card)',
                    border: trackingNumber ? '1.5px solid #059669' : '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                  style={{ color: 'var(--text-secondary)' }}>
                  Kargo Firması
                </label>
                <select
                  value={cargoCompany}
                  onChange={e => setCargoCompany(e.target.value)}
                  className="w-full px-3 py-2.5 text-[14px] rounded-lg outline-none"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="">Seçiniz</option>
                  <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                  <option value="Aras Kargo">Aras Kargo</option>
                  <option value="MNG Kargo">MNG Kargo</option>
                  <option value="PTT Kargo">PTT Kargo</option>
                  <option value="Sürat Kargo">Sürat Kargo</option>
                  <option value="Trendyol Express">Trendyol Express</option>
                  <option value="Sendeo">Sendeo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShipModalOpen(false)}
                className="flex-1 py-2.5 text-[13px] font-medium rounded-xl"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                İptal
              </button>
              <button
                onClick={handleShip}
                disabled={!trackingNumber.trim() || shipping}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold rounded-xl text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
              >
                {shipping ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Truck size={14} />
                )}
                Kaydet &amp; Bildir
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
