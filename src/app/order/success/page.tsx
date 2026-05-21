'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle2 } from 'lucide-react'

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get('siparisId')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">

          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>

          <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100 mb-2">
            Ödeme başarılı
          </h1>
          <p className="text-[14px] text-gray-400 mb-1">
            Siparişiniz alındı ve işleme konuldu.
          </p>
          {orderId && (
            <p className="text-[12px] text-gray-400 mb-8">
              Sipariş no: <span className="font-mono text-gray-600 dark:text-gray-300">#{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}

          <div className="space-y-3">
            {orderId && (
              <button
                onClick={() => router.push(`/hesabim/siparisler/${orderId}`)}
                className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Siparişimi görüntüle
              </button>
            )}
            <button
              onClick={() => router.push('/urunler')}
              className="w-full text-[13px] text-gray-500 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
            >
              Alışverişe devam et
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mt-6">
            Onay e-postası kayıtlı adresinize gönderildi.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>
}