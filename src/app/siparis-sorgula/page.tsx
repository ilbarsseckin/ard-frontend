'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import { Package, Search, Loader2, ArrowRight } from 'lucide-react'

export default function SiparisSorgulaPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = orderNumber.trim().toUpperCase()
    if (!trimmed) return

    setLoading(true)
    setError('')

    try {
      await api.get(`/api/catalog/orders/track/${trimmed}`)
      router.push(`/siparis/${trimmed}`)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`"${trimmed}" numaralı sipariş bulunamadı. Sipariş numaranızı kontrol edin.`)
      } else {
        setError('Bir hata oluştu, lütfen tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 py-16"
        style={{ background: 'var(--bg-secondary)' }}>
        <div className="w-full max-w-md">

          {/* İkon + başlık */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(244,130,31,0.1)', border: '1px solid rgba(244,130,31,0.2)' }}>
              <Package size={28} style={{ color: '#F4821F' }} />
            </div>
            <h1 className="text-[26px] font-black tracking-[-0.5px]"
              style={{ color: 'var(--text-primary)' }}>
              Siparişimi Takip Et
            </h1>
            <p className="text-[14px] mt-2" style={{ color: 'var(--text-muted)' }}>
              Sipariş numaranızı girerek durumunu öğrenin.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit}>
              <label className="block text-[11px] font-bold uppercase tracking-[1.5px] mb-2"
                style={{ color: 'var(--text-muted)' }}>
                Sipariş Numarası
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={e => {
                    setOrderNumber(e.target.value)
                    setError('')
                  }}
                  placeholder="CAT-XXXXXXXX"
                  className="w-full px-4 py-3 text-[15px] font-mono rounded-xl outline-none pr-12"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: error
                      ? '1.5px solid #EF4444'
                      : orderNumber
                        ? '1.5px solid #F4821F'
                        : '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }} />
              </div>

              {error && (
                <p className="text-[12px] mt-2 text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={!orderNumber.trim() || loading}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-[14px] font-bold text-white rounded-xl disabled:opacity-50 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #F4821F, #e07010)' }}>
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <><Search size={15} /> Sorgula <ArrowRight size={14} /></>
                }
              </button>
            </form>

            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-[12px] text-center" style={{ color: 'var(--text-muted)' }}>
                Sipariş numaranız onay emailinde bulunur.
                <br />
                <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                  Örnek: CAT-20240603-ABCD
                </span>
              </p>
            </div>
          </div>

          {/* Üye girişi önerisi */}
          <p className="text-center text-[12px] mt-5" style={{ color: 'var(--text-muted)' }}>
            Üye iseniz{' '}
            <a href="/hesabim" className="font-bold" style={{ color: '#F4821F' }}>
              hesabınızdan
            </a>
            {' '}tüm siparişlerinizi görebilirsiniz.
          </p>

        </div>
      </main>
      <Footer />
    </>
  )
}
