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
import InstallmentSelector from '@/components/ui/InstallmentSelector'

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

  // Kart state — BIN'den önce tanımlanmalı
  const [card, setCard] = useState({
    holderName: '', number: '', expireMonth: '', expireYear: '', cvc: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Taksit state
  const [installmentCount, setInstallmentCount] = useState(1)
  const [installmentTotal, setInstallmentTotal] = useState(0)
  const binNumber = card.number.replace(/\s/g, '').slice(0, 6)

  // Kupon state
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [welcomeCoupon, setWelcomeCoupon] = useState<string | null>(null)

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

  const applyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim()
    if (!code || !orderNumber) return
    const welcomeLS = localStorage.getItem('baski-welcome-coupon')
    const isWelcome = welcomeLS && code.toUpperCase() === welcomeLS.toUpperCase()
    setCouponLoading(true)
    try {
      const res = await api.post(`/api/catalog/orders/track/${orderNumber}/apply-coupon`, { code })
      setOrder(res.data.data)
      setCouponInput('')
      if (isWelcome) localStorage.removeItem('baski-welcome-coupon')
      setWelcomeCoupon(null)
      toast.success(`Kupon uygulandı: ${res.data.data.couponCode}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kupon uygulanamadı')
    } finally {
      setCouponLoading(false)
    }
  }

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
        installment: installmentCount,
        callbackUrl,
      })
      const data = res.data.data
      if (!data?.success || !data?.htmlContent) {
        toast.error(data?.errorMessage || '3D Secure başlatılamadı')
        return
      }
      let html = data.htmlContent
      try { const decoded = atob(html); if (decoded.includes('<')) html = decoded } catch {}
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
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <Loader2 size={28} className="animate-spin text-[#F4821F]" />
        </main>
      </>
    )
  }

  if (htmlContent) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="w-full max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={14} className="text-emerald-500" />
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Bankanızın 3D Secure doğrulama sayfası</p>
            </div>
            <iframe ref={iframeRef}
              className="w-full rounded-2xl bg-white"
              style={{ height: '480px', border: '1px solid var(--border)' }}
              title="3D Secure" />
            <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>
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
  // Taksit seçiliyse taksitli toplam, değilse normal toplam göster
  const displayTotal = installmentCount > 1 && installmentTotal > 0 ? installmentTotal : total

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-12" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">

          <button onClick={() => router.push('/sepet')}
            className="flex items-center gap-1.5 text-[13px] mb-6 transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}>
            <ChevronLeft size={15} /> Sepete dön
          </button>

          <h1 className="text-[22px] font-black tracking-[-0.5px] mb-1" style={{ color: 'var(--text-primary)' }}>
            Ödeme
          </h1>
          <p className="text-[13px] mb-6" style={{ color: 'var(--text-muted)' }}>
            Kart bilgilerinizi girerek ödemeyi tamamlayın
          </p>

          {/* Sipariş özeti */}
          {order && (
            <div className="rounded-2xl p-4 mb-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: 'var(--text-muted)' }}>
                Sipariş #{order.orderNumber}
              </p>
              <div className="space-y-1.5 mb-3">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <Package size={11} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ color: 'var(--text-secondary)' }}>
                        {it.productName} <span style={{ color: 'var(--text-muted)' }}>×{it.tierQty}</span>
                      </p>
                      {it.attributesSnapshot && (
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{it.attributesSnapshot}</p>
                      )}
                    </div>
                    <p className="flex-shrink-0" style={{ color: 'var(--text-muted)' }}>₺{fmtTL(it.priceTl)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: 'var(--text-muted)' }}>Ara Toplam</span>
                  <span style={{ color: 'var(--text-secondary)' }}>₺{fmtTL(subtotal)}</span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Tag size={11} /> İndirim ({order?.couponCode})
                    </span>
                    <span className="text-emerald-600 font-medium">−₺{fmtTL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <div>
                    <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Toplam</span>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>KDV Dahil</p>
                  </div>
                  <span className="text-[24px] font-black text-[#F4821F]">₺{fmtTL(displayTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Kupon */}
          {order && order.paymentStatus !== 'PAID' && (
            <div className="rounded-2xl p-4 mb-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} style={{ color: '#F4821F' }} />
                <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>İndirim Kuponu</p>
              </div>

              {order.couponCode ? (
                <div className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <Check size={14} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-emerald-700">{order.couponCode}</p>
                    <p className="text-[10px] text-emerald-600">₺{fmtTL(discount)} indirim uygulandı</p>
                  </div>
                  <button onClick={removeCoupon} disabled={couponLoading}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 hover:opacity-70 transition-colors disabled:opacity-40">
                    {couponLoading ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                  </button>
                </div>
              ) : (
                <>
                  {welcomeCoupon && (
                    <button onClick={() => applyCoupon(welcomeCoupon)} disabled={couponLoading}
                      className="w-full flex items-center gap-2 p-3 mb-2 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50"
                      style={{ background: 'rgba(244,130,31,0.08)', border: '1px dashed rgba(244,130,31,0.4)' }}>
                      <Gift size={16} className="text-[#F4821F] flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[#F4821F]">Hoş geldin kuponunuz var!</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {welcomeCoupon} — uygulamak için tıkla
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-[#F4821F]">Uygula →</span>
                    </button>
                  )}
                  <div className="flex gap-2">
                    <input type="text" value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="Kupon kodu girin"
                      className="flex-1 px-3.5 py-2.5 text-[13px] rounded-xl outline-none uppercase tracking-wider font-mono"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <button onClick={() => applyCoupon()} disabled={couponLoading || !couponInput.trim()}
                      className="px-5 py-2.5 text-[12px] font-bold rounded-xl bg-[#F4821F] text-white hover:opacity-90 transition-all disabled:opacity-40">
                      {couponLoading ? <Loader2 size={13} className="animate-spin" /> : 'Uygula'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tasarım dosyaları */}
          {files.length > 0 && (
            <div className="rounded-2xl p-4 mb-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Paperclip size={14} style={{ color: '#F4821F' }} />
                <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Tasarım Dosyaları <span className="font-normal text-[11px]" style={{ color: 'var(--text-muted)' }}>({files.length})</span>
                </p>
              </div>
              <div className="space-y-2">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--bg-card)' }}>
                      {isImage(f.mimeType, f.originalName)
                        ? <ImageIcon size={13} className="text-blue-500" />
                        : <FileText size={13} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {f.originalName}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatBytes(f.fileSize)}</p>
                    </div>
                    <Check size={13} className="text-emerald-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasDesignSupport && (
            <div className="rounded-2xl p-4 mb-4"
              style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.2)' }}>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[16px]"
                  style={{ background: 'rgba(244,130,31,0.15)' }}>🎨</div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Tasarım Desteği Talebi Alındı</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Ödeme sonrası tasarım ekibimiz sizinle iletişime geçecek.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Kart bilgileri */}
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <CreditCard size={16} style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Kart Bilgileri</p>
            </div>

            {/* Kart sahibi */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                style={{ color: 'var(--text-muted)' }}>
                Kart Sahibi
              </label>
              <input type="text" placeholder="AD SOYAD"
                value={card.holderName}
                onChange={e => setCard(c => ({ ...c, holderName: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none transition-colors"
                style={{ background: 'var(--bg-secondary)', border: errors.holderName ? '1px solid #EF4444' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
              {errors.holderName && <p className="text-[11px] text-red-500 mt-1">{errors.holderName}</p>}
            </div>

            {/* Kart numarası */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                style={{ color: 'var(--text-muted)' }}>
                Kart Numarası
              </label>
              <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none transition-colors tracking-widest font-mono"
                style={{ background: 'var(--bg-secondary)', border: errors.number ? '1px solid #EF4444' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
              {errors.number && <p className="text-[11px] text-red-500 mt-1">{errors.number}</p>}
            </div>

            {/* Son kullanma + CVV */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                  style={{ color: 'var(--text-muted)' }}>Ay</label>
                <input type="text" inputMode="numeric" placeholder="MM" maxLength={2}
                  value={card.expireMonth}
                  onChange={e => setCard(c => ({ ...c, expireMonth: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none text-center"
                  style={{ background: 'var(--bg-secondary)', border: errors.expireMonth ? '1px solid #EF4444' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
                {errors.expireMonth && <p className="text-[10px] text-red-500 mt-1">{errors.expireMonth}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                  style={{ color: 'var(--text-muted)' }}>Yıl</label>
                <input type="text" inputMode="numeric" placeholder="YY" maxLength={2}
                  value={card.expireYear}
                  onChange={e => setCard(c => ({ ...c, expireYear: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none text-center"
                  style={{ background: 'var(--bg-secondary)', border: errors.expireYear ? '1px solid #EF4444' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
                {errors.expireYear && <p className="text-[10px] text-red-500 mt-1">{errors.expireYear}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                  style={{ color: 'var(--text-muted)' }}>CVV</label>
                <input type="password" inputMode="numeric" placeholder="•••" maxLength={4}
                  value={card.cvc}
                  onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none text-center"
                  style={{ background: 'var(--bg-secondary)', border: errors.cvc ? '1px solid #EF4444' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
                {errors.cvc && <p className="text-[10px] text-red-500 mt-1">{errors.cvc}</p>}
              </div>
            </div>

            {/* Taksit seçici — kart numarası 6 haneli olunca görünür */}
            <InstallmentSelector
              binNumber={binNumber}
              totalTl={total}
              selected={installmentCount}
              onChange={(count, totalPrice) => {
                setInstallmentCount(count)
                setInstallmentTotal(totalPrice)
              }}
            />

            {/* Güvenlik notu */}
            <div className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <Lock size={12} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Kart bilgileriniz iyzico altyapısı üzerinden 256-bit SSL ile şifrelenerek iletilir. Sistemimizde saklanmaz.
              </p>
            </div>

            {/* Ödeme butonu */}
            <button onClick={handleSubmit} disabled={paymentLoading}
              className="w-full flex items-center justify-center gap-2 py-4 text-[14px] font-black text-white rounded-xl transition-all disabled:opacity-50 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F4821F, #e07010)', boxShadow: '0 6px 14px rgba(244,130,31,0.3)' }}>
              {paymentLoading
                ? <><Loader2 size={16} className="animate-spin" /> Ödeme başlatılıyor...</>
                : <>
                    <Lock size={14} />
                    ₺{fmtTL(displayTotal)} Güvenli Öde
                    {installmentCount > 1 && (
                      <span className="text-[11px] opacity-75">({installmentCount} taksit)</span>
                    )}
                  </>}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            <Lock size={11} style={{ color: 'var(--text-muted)' }} />
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>iyzico ile güvenli ödeme</p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function OdemeKatalogPage() {
  return <Suspense><OdemeKatalogContent /></Suspense>
}