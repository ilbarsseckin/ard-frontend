'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  CreditCard, Lock, Loader2, ChevronLeft, Package,
  FileText, Image as ImageIcon, Paperclip, Check, Tag, X, Gift,
} from 'lucide-react'

interface CatalogOrderDetail {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  subtotalTl?: number
  discountAmountTl?: number
  couponCode?: string
  totalTl: number
  status: string
  paymentStatus: string
  notes?: string
  items: Array<{
    productName: string
    tierQty: number
    priceTl: number
    attributesSnapshot?: string
  }>
}

interface PreOrderFile {
  id: string
  originalName: string
  fileSize: number
  mimeType?: string
  downloadUrl: string
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function isImage(mime?: string, name?: string): boolean {
  if (mime && mime.startsWith('image/')) return true
  if (!name) return false
  const ext = name.toLowerCase()
  return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp')
}

function fmtTL(v: number | undefined | null) {
  return Number(v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

function OdemeKatalogContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderNumber = params.get('siparisNo')
  const errorParam = params.get('hata')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [order, setOrder] = useState<CatalogOrderDetail | null>(null)
  const [orderLoading, setOrderLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [files, setFiles] = useState<PreOrderFile[]>([])

  // ✨ Kupon state
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [welcomeCoupon, setWelcomeCoupon] = useState<string | null>(null)

  const [card, setCard] = useState({
    holderName: '', number: '', expireMonth: '', expireYear: '', cvc: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!errorParam) return
    const msgs: Record<string, string> = {
      'odeme-basarisiz': 'Ödeme tamamlanamadı. Lütfen tekrar deneyin.',
      '3ds-iptal': '3D Secure doğrulama iptal edildi.',
      'eksik-param': 'Ödeme bilgileri eksik geldi.',
    }
    toast.error(msgs[errorParam] || 'Ödeme başlatılamadı')
  }, [errorParam])

  useEffect(() => {
    if (!orderNumber) { router.push('/sepet'); return }

    api.get(`/api/catalog/orders/track/${orderNumber}`)
      .then(orderRes => {
        const o: CatalogOrderDetail = orderRes.data.data
        setOrder(o)
        if (o.paymentStatus === 'PAID') {
          router.push(`/siparis-tamamlandi?n=${orderNumber}`)
          return
        }
        return api.get(`/api/catalog/pre-order-files/by-order/${o.id}`)
          .then(filesRes => setFiles(filesRes.data.data || []))
          .catch(() => {})
      })
      .catch(() => {
        toast.error('Sipariş bulunamadı')
        router.push('/sepet')
      })
      .finally(() => setOrderLoading(false))
  }, [orderNumber])

  // ✨ Hoş geldin kuponu hint (localStorage'dan)
  useEffect(() => {
    if (!order || order.couponCode) return
    const w = localStorage.getItem('baski-welcome-coupon')
    if (w) setWelcomeCoupon(w)
  }, [order])

  useEffect(() => {
    if (!htmlContent || !iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (doc) { doc.open(); doc.write(htmlContent); doc.close() }
  }, [htmlContent])

  // ✨ Kupon uygula
  const applyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim()
    if (!code || !orderNumber) return

    // Welcome kuponu mu kontrol et
    const welcomeLS = localStorage.getItem('baski-welcome-coupon')
    const isWelcome = welcomeLS && code.toUpperCase() === welcomeLS.toUpperCase()

    setCouponLoading(true)
    try {
      const res = await api.post(
        `/api/catalog/orders/track/${orderNumber}/apply-coupon`,
        { code }
      )
      setOrder(res.data.data)
      setCouponInput('')
      // Welcome kuponu uygulandıysa localStorage'dan kaldır
      if (isWelcome) localStorage.removeItem('baski-welcome-coupon')
      setWelcomeCoupon(null)
      toast.success(`Kupon uygulandı: ${res.data.data.couponCode}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kupon uygulanamadı')
    } finally {
      setCouponLoading(false)
    }
  }

  // ✨ Kupon kaldır
  const removeCoupon = async () => {
    if (!orderNumber) return
    setCouponLoading(true)
    try {
      const res = await api.delete(`/api/catalog/orders/track/${orderNumber}/coupon`)
      setOrder(res.data.data)
      toast.success('Kupon kaldırıldı')
      const w = localStorage.getItem('baski-welcome-coupon')
      if (w) setWelcomeCoupon(w)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kaldırılamadı')
    } finally {
      setCouponLoading(false)
    }
  }

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!card.holderName.trim()) e.holderName = 'Kart sahibi adı zorunlu'
    if (card.number.replace(/\s/g, '').length !== 16) e.number = 'Geçerli kart numarası girin'
    if (!card.expireMonth || +card.expireMonth < 1 || +card.expireMonth > 12) e.expireMonth = 'Geçersiz ay'
    if (!card.expireYear || card.expireYear.length !== 2) e.expireYear = 'YY formatında'
    if (card.cvc.length < 3) e.cvc = 'Geçersiz CVV'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || !orderNumber || !order) return

    setPaymentLoading(true)
    try {
      const callbackUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/webhook/catalog-payment/callback`
      const res = await api.post('/api/catalog/payment/initiate', {
        orderNumber,
        cardHolderName: card.holderName,
        cardNumber: card.number.replace(/\s/g, ''),
        expireMonth: card.expireMonth.padStart(2, '0'),
        expireYear: card.expireYear,
        cvc: card.cvc,
        callbackUrl,
      })
      const data = res.data.data

      if (!data?.success || !data?.htmlContent) {
        toast.error(data?.errorMessage || '3D Secure başlatılamadı')
        return
      }

      let html = data.htmlContent
      try {
        const decoded = atob(html)
        if (decoded.includes('<')) html = decoded
      } catch {}

      setHtmlContent(html)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ödeme başlatılamadı')
    } finally {
      setPaymentLoading(false)
    }
  }

  if (orderLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-[#F4821F]" />
        </main>
      </>
    )
  }

  if (htmlContent) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center py-12 px-4">
          <div className="w-full max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={14} className="text-emerald-500" />
              <p className="text-[13px] text-gray-500">Bankanızın 3D Secure doğrulama sayfası</p>
            </div>
            <iframe ref={iframeRef}
              className="w-full rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white"
              style={{ height: '480px' }} title="3D Secure" />
            <p className="text-[11px] text-gray-400 text-center mt-3">
              Bu sayfa bankanız tarafından sağlanır. Sayfayı yenilemeyin.
            </p>
          </div>
        </main>
      </>
    )
  }

  const hasDesignSupport = order?.notes?.includes('Tasarım Desteği') ?? false
  const hasDiscount = (order?.discountAmountTl ?? 0) > 0
  const subtotal = order?.subtotalTl ?? order?.totalTl ?? 0
  const discount = order?.discountAmountTl ?? 0
  const total = order?.totalTl ?? 0

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12">
        <div className="max-w-lg mx-auto px-6">

          <button onClick={() => router.push('/sepet')}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors mb-6">
            <ChevronLeft size={15} /> Sepete dön
          </button>

          <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100 mb-1">
            Ödeme
          </h1>
          <p className="text-[13px] text-gray-400 mb-8">
            Tasarımlarınız siparişe eklendi. Kart bilgilerinizi girerek ödemeyi tamamlayın.
          </p>

          {/* Sipariş özeti */}
          {order && (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 mb-5">
              <p className="text-[12px] text-gray-400 mb-3">Sipariş #{order.orderNumber}</p>

              <div className="space-y-1.5 mb-3">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <Package size={11} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 dark:text-gray-300 truncate">
                        {it.productName} <span className="text-gray-400">×{it.tierQty}</span>
                      </p>
                      {it.attributesSnapshot && (
                        <p className="text-gray-400 text-[10px]">{it.attributesSnapshot}</p>
                      )}
                    </div>
                    <p className="text-gray-500 flex-shrink-0">₺{fmtTL(it.priceTl)}</p>
                  </div>
                ))}
              </div>

              {/* ✨ Fiyat detayı: Subtotal + Indirim + Total */}
              <div className="border-t border-black/[0.07] dark:border-white/[0.07] pt-3 space-y-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="text-gray-500">Ara Toplam</span>
                  <span className="text-gray-700 dark:text-gray-300">₺{fmtTL(subtotal)}</span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Tag size={11} /> İndirim ({order?.couponCode})
                    </span>
                    <span className="text-emerald-600 font-medium">−₺{fmtTL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-black/[0.05]">
                  <span className="text-[14px] font-medium">Toplam</span>
                  <span className="text-[22px] font-medium text-[#F4821F]">
                    ₺{fmtTL(total)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 text-right">KDV Dahil</p>
              </div>
            </div>
          )}

          {/* ✨ KUPON BÖLÜMÜ */}
          {order && order.paymentStatus !== 'PAID' && (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-[#F4821F]" />
                <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                  İndirim Kuponu
                </p>
              </div>

              {order.couponCode ? (
                <div className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <Check size={14} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">
                      {order.couponCode}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500">
                      ₺{fmtTL(discount)} indirim uygulandı
                    </p>
                  </div>
                  <button onClick={removeCoupon} disabled={couponLoading}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
                    title="Kuponu kaldır">
                    {couponLoading ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                  </button>
                </div>
              ) : (
                <>
                  {welcomeCoupon && (
                    <button onClick={() => applyCoupon(welcomeCoupon)} disabled={couponLoading}
                      className="w-full flex items-center gap-2 p-3 mb-2 rounded-lg transition-all hover:scale-[1.01] disabled:opacity-50"
                      style={{ background: 'rgba(244,130,31,0.08)', border: '1px dashed rgba(244,130,31,0.4)' }}>
                      <Gift size={16} className="text-[#F4821F] flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[#F4821F]">
                          Hoş geldin kuponunuz var!
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {welcomeCoupon} kodunu uygulamak için tıkla
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-[#F4821F]">
                        Uygula →
                      </span>
                    </button>
                  )}

                  <div className="flex gap-2">
                    <input type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="Kupon kodu girin"
                      className="flex-1 px-3.5 py-2.5 text-[13px] rounded-lg outline-none uppercase tracking-wider font-mono"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <button onClick={() => applyCoupon()}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-5 py-2.5 text-[12px] font-bold rounded-lg bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors disabled:opacity-40">
                      {couponLoading ? <Loader2 size={13} className="animate-spin" /> : 'Uygula'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tasarım dosyaları */}
          {files.length > 0 && (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip size={15} className="text-[#F4821F]" />
                <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
                  Yüklenen Tasarım Dosyaları
                  <span className="text-gray-400 text-[12px] font-normal ml-1">({files.length})</span>
                </p>
              </div>
              <div className="space-y-2">
                {files.map(f => (
                  <div key={f.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--bg-card)' }}>
                      {isImage(f.mimeType, f.originalName)
                        ? <ImageIcon size={15} className="text-blue-500" />
                        : <FileText size={15} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}>
                        {f.originalName}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {formatBytes(f.fileSize)}
                      </p>
                    </div>
                    <Check size={14} className="text-emerald-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasDesignSupport && (
            <div className="rounded-2xl p-4 mb-5"
              style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.2)' }}>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[16px]"
                  style={{ background: 'rgba(244,130,31,0.15)' }}>
                  🎨
                </div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                    Tasarım Desteği Talebi Alındı
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Ödeme sonrası tasarım ekibimiz sizinle iletişime geçecek.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* KART BİLGİLERİ */}
          <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-gray-400" />
              <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">Kart bilgileri</p>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Kart üzerindeki ad soyad
              </label>
              <input type="text" placeholder="AD SOYAD"
                value={card.holderName}
                onChange={e => setCard(c => ({ ...c, holderName: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors" />
              {errors.holderName && <p className="text-[11px] text-red-500 mt-1">{errors.holderName}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Kart numarası
              </label>
              <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors tracking-widest font-mono" />
              {errors.number && <p className="text-[11px] text-red-500 mt-1">{errors.number}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Ay</label>
                <input type="text" inputMode="numeric" placeholder="MM" maxLength={2}
                  value={card.expireMonth}
                  onChange={e => setCard(c => ({ ...c, expireMonth: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors text-center" />
                {errors.expireMonth && <p className="text-[11px] text-red-500 mt-1">{errors.expireMonth}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Yıl</label>
                <input type="text" inputMode="numeric" placeholder="YY" maxLength={2}
                  value={card.expireYear}
                  onChange={e => setCard(c => ({ ...c, expireYear: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors text-center" />
                {errors.expireYear && <p className="text-[11px] text-red-500 mt-1">{errors.expireYear}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">CVV</label>
                <input type="password" inputMode="numeric" placeholder="•••" maxLength={4}
                  value={card.cvc}
                  onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors text-center" />
                {errors.cvc && <p className="text-[11px] text-red-500 mt-1">{errors.cvc}</p>}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-white/[0.03] rounded-lg">
              <Lock size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Kart bilgileriniz iyzico altyapısı üzerinden 256-bit SSL ile şifrelenerek iletilir. Sistemimizde saklanmaz.
              </p>
            </div>

            <button onClick={handleSubmit} disabled={paymentLoading}
              className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {paymentLoading
                ? <><Loader2 size={16} className="animate-spin" /> Ödeme başlatılıyor...</>
                : order ? `₺${fmtTL(total)} öde →` : 'Öde →'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            <Lock size={11} className="text-gray-300" />
            <p className="text-[11px] text-gray-300">iyzico ile güvenli ödeme</p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function OdemeKatalogPage() {
  return <Suspense><OdemeKatalogContent /></Suspense>
}