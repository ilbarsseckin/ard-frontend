'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

/* ─── Yelken Bayrak — SVG dalgalanma ─── */
function YelkenSVG() {
  const turbRef = useRef<SVGFETurbulenceElement>(null)
  useEffect(() => {
    let t = 0, raf: number
    const wave = () => {
      t += 0.011
      turbRef.current?.setAttribute('baseFrequency',
        `${(0.018 + Math.sin(t * 0.6) * 0.004).toFixed(4)} ${(0.06 + Math.sin(t * 1.1) * 0.018).toFixed(4)}`)
      raf = requestAnimationFrame(wave)
    }
    raf = requestAnimationFrame(wave)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="absolute z-10" style={{
      bottom: '-32px', left: '50%', transform: 'translateX(-50%)',
      width: '130px', height: '320px',
      filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.18))',
    }}>
      <svg viewBox="0 0 180 440" xmlns="http://www.w3.org/2000/svg" width="130" height="320">
        <defs>
          <linearGradient id="pg-y" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#999" /><stop offset="40%" stopColor="#eee" /><stop offset="100%" stopColor="#777" />
          </linearGradient>
          <filter id="wf-y" x="-8%" y="-2%" width="120%" height="104%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbRef} type="turbulence" baseFrequency="0.018 0.06" numOctaves={3} seed={4} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter="url(#wf-y)">
          <path d="M26,14 Q76,8 148,18 Q162,20 164,30 Q158,68 153,106 Q148,144 152,182 Q156,220 154,256 Q152,292 155,320 Q157,338 150,350 Q142,362 122,368 Q94,374 68,368 Q44,360 30,352 Q26,344 26,330 L26,14 Z"
            fill="white" stroke="#e0e0e0" strokeWidth="0.5" />
          <path d="M26,14 Q76,8 148,18 Q162,20 164,30 L164,50 Q120,42 76,46 Q46,48 26,50 Z" fill="#F4821F" opacity="0.13" />
          <path d="M26,318 L155,308 Q157,328 150,342 Q142,354 122,360 Q94,366 68,360 Q44,352 30,344 Q26,338 26,326 Z" fill="#F4821F" opacity="0.13" />
          <line x1="36" y1="56" x2="154" y2="54" stroke="#F4821F" strokeWidth="1" opacity="0.4" />
          <line x1="32" y1="314" x2="152" y2="304" stroke="#F4821F" strokeWidth="1" opacity="0.4" />
          <text x="90" y="188" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="800" fontSize="13" transform="rotate(-90,90,188)">
            <tspan fill="#1a1a1a">baski</tspan><tspan fill="#F4821F">urunleri.com</tspan>
          </text>
          <text x="108" y="188" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="7" fill="#aaa" letterSpacing="1.2" transform="rotate(-90,108,188)">&apos;yeni nesil matbaa&apos;</text>
        </g>
        <rect x="20" y="6" width="7" height="430" rx="3.5" fill="url(#pg-y)" />
        <circle cx="23.5" cy="6" r="5" fill="#ccc" />
        <ellipse cx="23.5" cy="432" rx="8" ry="4.5" fill="#999" opacity="0.5" />
      </svg>
    </div>
  )
}

/* ─── Gönder Bayrağı — GIF ─── */
function GonderGorsel() {
  return (
    <div className="absolute z-10" style={{
      bottom: '-24px', left: '50%', transform: 'translateX(-50%)',
      width: '180px', height: '280px',
      filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.2))',
    }}>
      <img
        src="/images/yelken-bayrak.gif"
        alt="Gönder Bayrağı"
        style={{
          position: 'absolute',
          top: '0', left: '22px',
          width: '158px', height: '240px',
          objectFit: 'cover',
          borderRadius: '6px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
        }}
      />
      <svg viewBox="0 0 180 280" xmlns="http://www.w3.org/2000/svg" width="180" height="280"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="pg-g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#999" /><stop offset="40%" stopColor="#eee" /><stop offset="100%" stopColor="#777" />
          </linearGradient>
        </defs>
        <rect x="10" y="0" width="8" height="278" rx="4" fill="url(#pg-g)" />
        <circle cx="14" cy="5" r="5" fill="#d0d0d0" />
        <ellipse cx="14" cy="274" rx="9" ry="4.5" fill="#aaa" opacity="0.5" />
      </svg>
    </div>
  )
}

/* ─── Kart ─── */
interface KartProps {
  href: string
  baslik: string
  aciklama: string
  gorsel: React.ReactNode
}

function BayrakKart({ href, baslik, aciklama, gorsel }: KartProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col sm:grid sm:grid-cols-[1.1fr_0.9fr] rounded-3xl relative transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        overflow: 'visible',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* Görsel alanı */}
      <div
        className="relative min-h-[240px] sm:min-h-[340px]"
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '24px 24px 0 0',
        }}
      >
        {/* sm'de sol-alt köşe yuvarlaması */}
        <div className="hidden sm:block absolute inset-0"
          style={{ borderRadius: '24px 0 0 24px', background: 'var(--bg-secondary)' }} />
        {gorsel}
      </div>

      {/* İçerik */}
      <div
        className="flex flex-col justify-center p-5 sm:p-6 md:p-8 relative z-10"
        style={{ borderRadius: '0 0 24px 24px' }}
      >
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[2px] text-[#F4821F] mb-2">
          Outdoor Reklam
        </p>
        <h2
          className="text-[20px] sm:text-[24px] md:text-[30px] font-black leading-tight tracking-[-1px] mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {baslik}
        </h2>
        <p className="text-[12px] leading-6 mb-4" style={{ color: 'var(--text-secondary)' }}>
          {aciklama}
        </p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[22px] sm:text-[26px] font-black text-[#F4821F]">₺990</span>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>başlayan fiyatlarla</span>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F4821F] px-4 py-2 text-[12px] font-bold text-white group-hover:bg-[#e07010] transition-colors">
          Ürünü incele <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  )
}

export default function YelkenBayrakSection() {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <BayrakKart
          href="/urun/yelken-bayrak-urun"
          baslik="Yelken Bayrak"
          aciklama="Etkinlik, mağaza önü ve kampanyalar için dikkat çekici, taşınabilir ve şık yelken bayrak çözümleri."
          gorsel={<YelkenSVG />}
        />
        <BayrakKart
          href="/urun/gonder-bayragi"
          baslik="Gönder Bayrağı"
          aciklama="Kurumsal, resmi ve dekoratif kullanımlar için yüksek kaliteli, dayanıklı gönder bayrağı çözümleri."
          gorsel={<GonderGorsel />}
        />
      </div>
    </section>
  )
}