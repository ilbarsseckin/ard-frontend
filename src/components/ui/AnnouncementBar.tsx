'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { X, Copy, Check, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface AnnouncementBar {
  id: string
  message: string
  subMessage?: string
  couponCode?: string
  bgColor: string
  textColor: string
  endsAt?: string
}

const COUPON_KEY = 'baski-welcome-coupon'

function CountdownTimer({ endsAt, textColor }: { endsAt: string; textColor: string }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) return setTime({ h: 0, m: 0, s: 0 })
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [endsAt])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1">
      <Clock size={11} style={{ color: textColor, opacity: 0.8 }} />
      {[
        { v: time.h, l: 'SA' },
        { v: time.m, l: 'DK' },
        { v: time.s, l: 'SN' },
      ].map(({ v, l }, i) => (
        <div key={l} className="flex items-center gap-0.5">
          {i > 0 && <span style={{ color: textColor, opacity: 0.7 }}>:</span>}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded flex items-center justify-center text-[13px] font-black"
              style={{ background: 'rgba(0,0,0,0.2)', color: textColor }}>
              {pad(v)}
            </div>
            <span className="text-[7px] font-bold mt-0.5" style={{ color: textColor, opacity: 0.7 }}>{l}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnnouncementBarComponent() {
  const [bars, setBars] = useState<AnnouncementBar[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [closed, setClosed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const isClosed = sessionStorage.getItem('announcement-closed')
    if (isClosed) { setClosed(true); return }
    api.get('/api/announcement-bars')
      .then(r => setBars(r.data?.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (bars.length <= 1) return
    const t = setInterval(() => setCurrentIdx(i => (i + 1) % bars.length), 4000)
    return () => clearInterval(t)
  }, [bars.length])

  const handleClose = () => {
    sessionStorage.setItem('announcement-closed', '1')
    setClosed(true)
  }

  const handleCopy = (code: string) => {
    // Kopyala
    navigator.clipboard.writeText(code).catch(() => {})
    // localStorage'a kaydet — ödeme sayfasında otomatik çıksın
    localStorage.setItem(COUPON_KEY, code)
    setCopied(true)
    toast.success(`"${code}" kopyalandı — ödeme sayfasında otomatik uygulanacak!`, { duration: 3000 })
    setTimeout(() => setCopied(false), 2500)
  }

  if (closed || bars.length === 0) return null

  const bar = bars[currentIdx]

  return (
    <div className="w-full relative z-50 flex items-center justify-center px-8 sm:px-12 py-2 text-center"
      style={{ background: bar.bgColor, minHeight: '44px' }}>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <p className="text-[12px] sm:text-[13px] font-bold" style={{ color: bar.textColor }}>
            {bar.message}
          </p>
          {bar.subMessage && (
            <p className="text-[11px] sm:text-[12px] font-medium hidden sm:block"
              style={{ color: bar.textColor, opacity: 0.85 }}>
              {bar.subMessage}
            </p>
          )}
        </div>

        {bar.endsAt && <CountdownTimer endsAt={bar.endsAt} textColor={bar.textColor} />}

        {bar.couponCode && (
          <button onClick={() => handleCopy(bar.couponCode!)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.2)', color: bar.textColor, border: '1px solid rgba(255,255,255,0.3)' }}>
            <span className="font-mono tracking-wider">{bar.couponCode}</span>
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        )}
      </div>

      {bars.length > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 flex gap-1">
          {bars.map((_, i) => (
            <button key={i} onClick={() => setCurrentIdx(i)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ background: bar.textColor, opacity: i === currentIdx ? 1 : 0.4 }} />
          ))}
        </div>
      )}

      <button onClick={handleClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.15)', color: bar.textColor }}>
        <X size={12} />
      </button>
    </div>
  )
}