'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { XCircle } from 'lucide-react'

function FailedContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get('siparisId')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">

          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <XCircle size={36} className="text-red-500" />
          </div>

          <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100 mb-2">
            Ödeme başarısız
          </h1>
          <p className="text-[14px] text-gray-400 mb-8">
            Ödeme işlemi tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
          </p>

          <div className="space-y-3">
            {orderId && (
              <button
                onClick={() => router.push(`/odeme?siparisId=${orderId}`)}
                className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Tekrar dene
              </button>
            )}
            <button
              onClick={() => router.push('/sepet')}
              className="w-full text-[13px] text-gray-500 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
            >
              Sepete dön
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mt-6">
            Sorun devam ederse destek hattımızla iletişime geçin.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderFailedPage() {
  return <Suspense><FailedContent /></Suspense>
}