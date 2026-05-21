'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { paymentApi, orderApi } from '@/lib/api'
import { useCartStore } from '@/lib/store/cart'
import toast from 'react-hot-toast'
import { CreditCard, Lock, AlertCircle, Loader2, ChevronLeft } from 'lucide-react'

interface OrderDetail {
  id: string
  totalPrice: number
  status: string
}

function OdemeContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get('siparisId')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [orderLoading, setOrderLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState<string | null>(null)

  // Kart formu state
  const [card, setCard] = useState({
    holderName: '',
    number: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clear = useCartStore(s => s.clear)

  useEffect(() => {
    if (!orderId) { router.push('/sepet'); return }
    orderApi.get(orderId)
      .then(r => setOrder(r.data.data))
      .catch(() => { toast.error('Sipariş bulunamadı'); router.push('/sepet') })
      .finally(() => setOrderLoading(false))
  }, [orderId])

  // 3DS HTML geldiğinde iframe'e yaz
  useEffect(() => {
    if (!htmlContent || !iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (doc) {
      doc.open()
      doc.write(htmlContent)
      doc.close()
    }
  }, [htmlContent])

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!card.holderName.trim()) e.holderName = 'Kart sahibi adı zorunlu'
    if (card.number.replace(/\s/g, '').length !== 16) e.number = 'Geçerli bir kart numarası girin'
    if (!card.expireMonth || +card.expireMonth < 1 || +card.expireMonth > 12) e.expireMonth = 'Geçersiz ay'
    if (!card.expireYear || card.expireYear.length !== 2) e.expireYear = 'YY formatında girin'
    if (card.cvc.length < 3) e.cvc = 'Geçersiz CVV'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || !orderId || !order) return
    setPaymentLoading(true)
    try {
      const callbackUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/webhook/payment/callback`
      const res = await paymentApi.initiate({
        orderId,
        cardHolderName: card.holderName,
        cardNumber: card.number.replace(/\s/g, ''),
        expireMonth: card.expireMonth.padStart(2, '0'),
        expireYear: card.expireYear,
        cvc: card.cvc,
        callbackUrl,
      })
      const data = res.data.data
      if (data.htmlContent) {
        // 3D Secure sayfasını göster
        setHtmlContent(atob(data.htmlContent))
        // Sepeti temizle — sipariş oluşturuldu
        await clear()
      } else {
        toast.error('3D Secure başlatılamadı')
      }
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

  // 3DS iframe göster
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
            <iframe
              ref={iframeRef}
              className="w-full rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white"
              style={{ height: '480px' }}
              title="3D Secure Doğrulama"
            />
            <p className="text-[11px] text-gray-400 text-center mt-3">
              Bu sayfa bankanız tarafından sağlanmaktadır. Lütfen bekleyin veya sayfayı yenilemeyin.
            </p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12">
        <div className="max-w-lg mx-auto px-6">

          {/* Geri */}
          <button
            onClick={() => router.push('/sepet')}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-6"
          >
            <ChevronLeft size={15} /> Sepete dön
          </button>

          <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100 mb-1">
            Ödeme
          </h1>
          <p className="text-[13px] text-gray-400 mb-8">
            Kart bilgileriniz 3D Secure ile güvende
          </p>

          {/* Sipariş özeti */}
          {order && (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[12px] text-gray-400">Sipariş #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                    Toplam ödenecek tutar
                  </p>
                </div>
                <p className="text-[22px] font-medium text-[#F4821F]">
                  ₺{Number(order.totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          {/* Kart formu */}
          <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6 space-y-4">

            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-gray-400" />
              <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">Kart bilgileri</p>
            </div>

            {/* Kart sahibi */}
            <div>
              <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Kart üzerindeki ad soyad
              </label>
              <input
                type="text"
                placeholder="AD SOYAD"
                value={card.holderName}
                onChange={e => setCard(c => ({ ...c, holderName: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors"
              />
              {errors.holderName && <p className="text-[11px] text-red-500 mt-1">{errors.holderName}</p>}
            </div>

            {/* Kart numarası */}
            <div>
              <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Kart numarası
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors tracking-widest font-mono"
              />
              {errors.number && <p className="text-[11px] text-red-500 mt-1">{errors.number}</p>}
            </div>

            {/* Son kullanma + CVV */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Ay</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  maxLength={2}
                  value={card.expireMonth}
                  onChange={e => setCard(c => ({ ...c, expireMonth: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors text-center"
                />
                {errors.expireMonth && <p className="text-[11px] text-red-500 mt-1">{errors.expireMonth}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Yıl</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="YY"
                  maxLength={2}
                  value={card.expireYear}
                  onChange={e => setCard(c => ({ ...c, expireYear: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors text-center"
                />
                {errors.expireYear && <p className="text-[11px] text-red-500 mt-1">{errors.expireYear}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">CVV</label>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={card.cvc}
                  onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors text-center"
                />
                {errors.cvc && <p className="text-[11px] text-red-500 mt-1">{errors.cvc}</p>}
              </div>
            </div>

            {/* Güvenlik notu */}
            <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-white/[0.03] rounded-lg">
              <Lock size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Kart bilgileriniz iyzico altyapısı üzerinden 256-bit SSL ile şifrelenerek iletilir.
                Sistemimizde saklanmaz.
              </p>
            </div>

            {/* Ödeme butonu */}
            <button
              onClick={handleSubmit}
              disabled={paymentLoading}
              className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {paymentLoading
                ? <><Loader2 size={16} className="animate-spin" /> Ödeme başlatılıyor...</>
                : order
                  ? `₺${Number(order.totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} öde →`
                  : 'Öde →'
              }
            </button>
          </div>

          {/* iyzico logo */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <Lock size={11} className="text-gray-300" />
            <p className="text-[11px] text-gray-300">iyzico ile güvenli ödeme</p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function OdemePage() {
  return <Suspense><OdemeContent /></Suspense>
}