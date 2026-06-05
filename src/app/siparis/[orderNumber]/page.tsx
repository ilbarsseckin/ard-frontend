'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import {
  CheckCircle, Clock, Printer, Truck, Package,
  MapPin, Phone, ChevronLeft, Loader2, ExternalLink,
  AlertCircle, Copy, Check,
} from 'lucide-react'

interface OrderItem {
  productName: string
  tierQty: number
  priceTl: number
  attributesSnapshot?: string
}

interface TrackingOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  city?: string
  district?: string
  status: string
  paymentStatus: string
  totalTl: number
  trackingNumber?: string
  cargoCompany?: string
  createdAt: string
  updatedAt?: string
  items: OrderItem[]
}

// Kargo firmalarına göre takip linkleri
const KARGO_TAKIP: Record<string, (no: string) => string> = {
  'Yurtiçi Kargo':    (no) => `https://www.yurticikargo.com/tr/online-islemler/gonderi-sorgula?code=${no}`,
  'Aras Kargo':       (no) => `https://www.araskargo.com.tr/pages/kargo-takip.aspx?trackingNo=${no}`,
  'MNG Kargo':        (no) => `https://www.mngkargo.com.tr/gonderi-sorgula?trackingNumber=${no}`,
  'PTT Kargo':        (no) => `https://www.ptt.gov.tr/tr/kargo/kargo-takip?barkod=${no}`,
  'Sürat Kargo':      (no) => `https://www.suratkargo.com.tr/KargoTakip/Index?barkodNo=${no}`,
  'Trendyol Express': (no) => `https://www.trendyol.com/kargo-takip?barcode=${no}`,
  'Sendeo':           (no) => `https://www.sendeo.com.tr/kargo-takip?barcode=${no}`,
}

const STEPS = [
  { key: 'PENDING',       label: 'Sipariş Alındı',    icon: Package,     desc: 'Siparişiniz sisteme alındı' },
  { key: 'CONFIRMED',     label: 'Onaylandı',          icon: CheckCircle, desc: 'Siparişiniz incelendi ve onaylandı' },
  { key: 'IN_PRODUCTION', label: 'Üretimde',           icon: Printer,     desc: 'Siparişiniz baskı sürecinde' },
  { key: 'READY',         label: 'Hazır',              icon: Package,     desc: 'Ürünleriniz kargoya hazır' },
  { key: 'SHIPPED',       label: 'Kargoda',            icon: Truck,       desc: 'Siparişiniz yola çıktı' },
  { key: 'DELIVERED',     label: 'Teslim Edildi',      icon: CheckCircle, desc: 'Siparişiniz teslim edildi' },
]

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED']

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatTl(n: number) {
  return '₺' + Number(n).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

export default function SiparisTakipPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const [order, setOrder] = useState<TrackingOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderNumber) return
    api.get(`/api/catalog/orders/track/${orderNumber}`)
      .then(r => setOrder(r.data.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [orderNumber])

  const copyTracking = () => {
    if (!order?.trackingNumber) return
    navigator.clipboard.writeText(order.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <Loader2 size={28} className="animate-spin text-[#F4821F]" />
      </main>
    </>
  )

  if (notFound || !order) return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <h1 className="text-[22px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Sipariş bulunamadı</h1>
          <p className="text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
            "{orderNumber}" numaralı sipariş bulunamadı.
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-xl"
            style={{ background: '#F4821F' }}>
            <ChevronLeft size={14} /> Ana sayfaya dön
          </Link>
        </div>
      </main>
    </>
  )

  const currentIdx = STATUS_ORDER.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'
  const isPaid = order.paymentStatus === 'PAID'
  const trackingUrl = order.trackingNumber && order.cargoCompany
    ? KARGO_TAKIP[order.cargoCompany]?.(order.trackingNumber)
    : null

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">

          {/* Başlık */}
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[12px] mb-6"
            style={{ color: 'var(--text-muted)' }}>
            <ChevronLeft size={14} /> Ana Sayfa
          </Link>

          <div className="mb-6">
            <h1 className="text-[24px] font-black tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
              Sipariş Takibi
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-[15px] font-mono font-bold" style={{ color: '#F4821F' }}>
                {order.orderNumber}
              </code>
              <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                · {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          {/* İptal durumu */}
          {isCancelled && (
            <div className="rounded-2xl p-5 mb-5 flex items-center gap-3"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-[14px] font-bold text-red-600">Sipariş İptal Edildi</p>
                <p className="text-[12px] text-red-500">Ödeme yaptıysanız iade 3-5 iş günü içinde gerçekleşir.</p>
              </div>
            </div>
          )}

          {/* Ödeme bekliyor uyarısı */}
          {!isPaid && !isCancelled && (
            <div className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <p className="text-[13px] font-bold" style={{ color: '#D97706' }}>⏳ Ödeme Bekleniyor</p>
              <p className="text-[12px] mt-1" style={{ color: '#92400E' }}>
                Siparişinizin işleme alınması için ödemenizi tamamlamanız gerekiyor.
              </p>
              <Link
                href={`/odeme-katalog?siparisNo=${order.orderNumber}`}
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 text-[12px] font-bold text-white rounded-lg"
                style={{ background: '#D97706' }}>
                Ödemeyi Tamamla →
              </Link>
            </div>
          )}

          {/* Kargo takip kutusu */}
          {order.trackingNumber && (
            <div className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(5,150,105,0.06)', border: '1.5px solid rgba(5,150,105,0.25)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Truck size={16} className="text-emerald-600" />
                <p className="text-[12px] font-bold uppercase tracking-[1px] text-emerald-700">Kargo Bilgisi</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  {order.cargoCompany && (
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {order.cargoCompany}
                    </p>
                  )}
                  <p className="text-[20px] font-black font-mono tracking-wide text-emerald-700">
                    {order.trackingNumber}
                  </p>
                </div>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={copyTracking}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                  {trackingUrl && (
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold rounded-lg text-white"
                      style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                      <ExternalLink size={12} /> Kargoda Takip Et
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Durum zaman çizelgesi */}
          {!isCancelled && (
            <div className="rounded-2xl p-5 mb-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-5"
                style={{ color: 'var(--text-muted)' }}>Sipariş Durumu</p>

              <div className="space-y-0">
                {STEPS.map((step, i) => {
                  const Icon = step.icon
                  const isDone = currentIdx >= i
                  const isCurrent = currentIdx === i
                  const isLast = i === STEPS.length - 1

                  return (
                    <div key={step.key} className="flex gap-4">
                      {/* İkon + çizgi */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isDone ? 'text-white' : ''
                        }`}
                          style={{
                            background: isDone ? '#F4821F' : 'var(--bg-secondary)',
                            border: isCurrent ? '2px solid #F4821F' : isDone ? 'none' : '1.5px solid var(--border)',
                          }}>
                          <Icon size={14} style={{ color: isDone ? 'white' : 'var(--text-muted)' }} />
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-8 mt-1"
                            style={{ background: isDone && currentIdx > i ? '#F4821F' : 'var(--border)' }} />
                        )}
                      </div>

                      {/* Metin */}
                      <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                        <p className={`text-[14px] font-bold`}
                          style={{ color: isDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold"
                              style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}>
                              Şu an
                            </span>
                          )}
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sipariş özeti */}
          <div className="rounded-2xl p-5 mb-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4"
              style={{ color: 'var(--text-muted)' }}>Sipariş Özeti</p>

            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.productName}
                    </p>
                    {item.attributesSnapshot && (
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {item.attributesSnapshot}
                      </p>
                    )}
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {item.tierQty.toLocaleString('tr-TR')} adet
                    </p>
                  </div>
                  <p className="text-[14px] font-bold flex-shrink-0" style={{ color: '#F4821F' }}>
                    {formatTl(item.priceTl)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3"
              style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-[13px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                Toplam (KDV Dahil)
              </p>
              <p className="text-[20px] font-black" style={{ color: '#F4821F' }}>
                {formatTl(order.totalTl)}
              </p>
            </div>
          </div>

          {/* Teslimat adresi */}
          <div className="rounded-2xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-[#F4821F]" />
              <p className="text-[11px] font-bold uppercase tracking-[1.5px]"
                style={{ color: 'var(--text-muted)' }}>Teslimat Bilgileri</p>
            </div>
            <p className="text-[14px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {order.customerName}
            </p>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              {order.customerAddress}
              {order.district && `, ${order.district}`}
              {order.city && `, ${order.city}`}
            </p>
            <a href={`tel:${order.customerPhone}`}
              className="inline-flex items-center gap-1.5 mt-2 text-[12px]"
              style={{ color: 'var(--text-muted)' }}>
              <Phone size={11} /> {order.customerPhone}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
