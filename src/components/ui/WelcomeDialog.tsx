'use client'

import { useEffect, useState } from 'react'
import { X, Gift, Copy, Check, Sparkles } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface WelcomeCoupon {
  code: string
  name: string
  description?: string
  type: string
  discountAmount?: number
  discountPercent?: number
  giftAmount?: number
  minOrderAmount?: number
}

const STORAGE_KEY = 'baski-welcome-shown'
const COUPON_STORAGE_KEY = 'baski-welcome-coupon'

export default function WelcomeDialog() {
  const [open, setOpen] = useState(false)
  const [coupon, setCoupon] = useState<WelcomeCoupon | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Daha önce gösterildiyse açma
    if (typeof window === 'undefined') return
    const shown = localStorage.getItem(STORAGE_KEY)
    if (shown) return

    // Login durumunu kontrol et (login olmuşsa gösterme)
    const auth = localStorage.getItem('baski-auth')
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed?.state?.token || parsed?.state?.user) {
          localStorage.setItem(STORAGE_KEY, '1')
          return
        }
      } catch (e) { /* ignore */ }
    }

    // 2 saniye gecikme — sayfa yüklenince hemen patlamasın
    const timer = setTimeout(() => {
      api.get('/api/coupons/welcome')
        .then(res => {
          const c = res.data?.data
          if (c && c.code) {
            setCoupon(c)
            setOpen(true)
          } else {
            // Welcome kupon yoksa flag'ı yine de sakla (tekrar denemesin)
            localStorage.setItem(STORAGE_KEY, '1')
          }
        })
        .catch(() => {
          localStorage.setItem(STORAGE_KEY, '1')
        })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  const handleClaim = () => {
    if (!coupon) return
    // Kuponu localStorage'a kaydet — checkout'ta otomatik uygulanır
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon))
    localStorage.setItem(STORAGE_KEY, '1')
    toast.success('Kupon sepetinize tanımlandı!')
    setOpen(false)
  }

  const handleCopy = () => {
    if (!coupon) return
    navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    toast.success('Kupon kodu kopyalandı')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!open || !coupon) return null

  const discountStr = coupon.type === 'PERCENT'
    ? `%${coupon.discountPercent}`
    : `₺${(coupon.discountAmount || coupon.giftAmount || 0).toLocaleString('tr-TR')}`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}>

      <div className="relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-slideUp"
        style={{ background: 'var(--bg-card)' }}
        onClick={(e) => e.stopPropagation()}>

        {/* Kapatma */}
        <button onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.85)', color: '#666' }}>
          <X size={16} />
        </button>

        {/* Üst — turuncu gradient header */}
        <div className="relative px-6 pt-8 pb-6 text-center"
          style={{ background: 'linear-gradient(135deg, #F4821F, #FF6B35)' }}>
          <div className="absolute top-0 left-0 right-0 h-full opacity-10">
            <div className="absolute top-4 left-6"><Sparkles size={24} className="text-white" /></div>
            <div className="absolute top-12 right-10"><Sparkles size={16} className="text-white" /></div>
            <div className="absolute bottom-6 left-12"><Sparkles size={20} className="text-white" /></div>
          </div>

          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Gift size={32} className="text-white" />
            </div>

            <h2 className="text-[24px] font-black text-white tracking-[-0.5px]">
              Hoş Geldiniz!
            </h2>
            <p className="text-[13px] text-white/90 mt-1 font-medium">
              Size özel bir hediyemiz var
            </p>
          </div>
        </div>

        {/* Orta — kupon */}
        <div className="px-6 py-6">

          <div className="text-center mb-5">
            <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {coupon.name}
            </p>
            <p className="text-[44px] font-black tracking-[-1px] leading-none"
              style={{ color: '#F4821F' }}>
              {discountStr}
            </p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {coupon.type === 'PERCENT' ? 'İndirim' : 'Hediye'}
            </p>
          </div>

          {/* Kupon kodu kutusu — dashed border */}
          <div className="relative p-3 rounded-xl mb-4"
            style={{
              border: '2px dashed #F4821F',
              background: 'rgba(244,130,31,0.05)',
            }}>
            <p className="text-[10px] font-bold uppercase tracking-[2px] mb-1"
              style={{ color: 'var(--text-muted)' }}>
              Kupon Kodu
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[20px] font-black tracking-[2px]"
                style={{ color: '#F4821F' }}>
                {coupon.code}
              </p>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                style={{
                  background: copied ? '#10B981' : 'var(--bg-secondary)',
                  color: copied ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>
          </div>

          {/* Açıklama */}
          {coupon.description && (
            <p className="text-[12px] leading-relaxed text-center mb-4"
              style={{ color: 'var(--text-secondary)' }}>
              {coupon.description}
            </p>
          )}

          {coupon.minOrderAmount && (
            <p className="text-[11px] text-center mb-4 font-medium"
              style={{ color: 'var(--text-muted)' }}>
              ℹ️ Minimum sepet tutarı: ₺{coupon.minOrderAmount.toLocaleString('tr-TR')}
            </p>
          )}

          {/* CTA Butonları */}
          <div className="space-y-2">
            <button onClick={handleClaim}
              className="w-full py-3 text-[14px] font-black text-white rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #F4821F, #e07010)',
                boxShadow: '0 6px 14px rgba(244,130,31,0.35)',
              }}>
              Kuponu Sepetime Ekle
            </button>
            <button onClick={handleClose}
              className="w-full py-2 text-[12px] font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              Belki sonra
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  )
}
