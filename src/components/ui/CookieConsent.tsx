'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_KEY = 'cookie-consent'

export type ConsentState = 'accepted' | 'rejected' | null

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(COOKIE_KEY) as ConsentState
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setVisible(false)
    window.dispatchEvent(new Event('cookie-accepted'))
  }

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100]"
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
      }}>
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-xl flex-shrink-0">🍪</span>
        <p className="flex-1 text-[13px] leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
          Deneyiminizi iyileştirmek için çerezler kullanıyoruz.{' '}
          <Link href="/gizlilik" className="underline hover:text-[#F4821F]">
            Gizlilik Politikası
          </Link>
        </p>
        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
          <button onClick={reject}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-[12px] font-bold"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            Reddet
          </button>
          <button onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-[12px] font-bold text-white"
            style={{ background: '#F4821F' }}>
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  )
}