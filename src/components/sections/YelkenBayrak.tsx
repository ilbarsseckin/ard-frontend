'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

/* ─── Yelken Bayrak — SVG dalgalanma ─── */
/* ─── Yelken Bayrak — SVG dalgalanma ─── */
function YelkenSVG() {
  const turbRef = useRef<SVGFETurbulenceElement>(null)

  useEffect(() => {
    let t = 0
    let raf: number

    const wave = () => {
      t += 0.01

      turbRef.current?.setAttribute(
        'baseFrequency',
        `${(0.01 + Math.sin(t * 0.7) * 0.0025).toFixed(4)} ${(0.042 + Math.sin(t * 1.1) * 0.01).toFixed(4)}`
      )

      raf = requestAnimationFrame(wave)
    }

    raf = requestAnimationFrame(wave)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="absolute z-10"
      style={{
        bottom: '-30px',
        left: '50%',
        transform: 'translateX(-50%) rotate(-1.5deg)',
        width: '150px',
        height: '340px',
        filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.2))',
      }}
    >
      <svg viewBox="0 0 210 470" xmlns="http://www.w3.org/2000/svg" width="150" height="340">
        <defs>
          <linearGradient id="pole-y" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#777" />
            <stop offset="45%" stopColor="#f4f4f4" />
            <stop offset="100%" stopColor="#666" />
          </linearGradient>

          <linearGradient id="cloth-y" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#f1f2f4" />
            <stop offset="38%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e7e8eb" />
          </linearGradient>

          <linearGradient id="shine-y" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <filter id="wf-y" x="-18%" y="-10%" width="140%" height="124%" colorInterpolationFilters="sRGB">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.01 0.042"
              numOctaves={2}
              seed={8}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={11}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <ellipse cx="58" cy="456" rx="46" ry="8" fill="#000" opacity="0.11" />

        <g filter="url(#wf-y)">
          <path
            d="M31 42 C76 18 142 20 178 39 C196 126 194 294 153 426 C114 443 68 438 31 418 L31 42 Z"
            fill="url(#cloth-y)"
            stroke="#dedfe3"
            strokeWidth="0.7"
          />

          <path
            d="M31 42 C43 48 51 58 53 72 L53 398 C47 407 39 414 31 418 Z"
            fill="#000"
            opacity="0.045"
          />

          <path
            d="M78 38 C100 145 96 310 78 424"
            stroke="#000"
            strokeWidth="16"
            opacity="0.035"
            fill="none"
          />

          <path
            d="M139 42 C122 150 128 310 145 420"
            stroke="#000"
            strokeWidth="12"
            opacity="0.026"
            fill="none"
          />

          <rect x="66" y="50" width="22" height="360" fill="url(#shine-y)" opacity="0.35" />

          <path d="M43 88 C92 76 139 78 173 90" fill="none" stroke="#F4821F" strokeWidth="5" strokeLinecap="round" />
          <path d="M45 101 C93 91 137 91 170 102" fill="none" stroke="#F4821F" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />

          <path d="M41 371 C90 383 133 385 156 374" fill="none" stroke="#F4821F" strokeWidth="5" strokeLinecap="round" />
          <path d="M43 360 C91 372 132 373 154 363" fill="none" stroke="#F4821F" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
        </g>

        {/* Net okunabilir logo - filtre dışında */}
        <g>
          <text
            x="101"
            y="232"
            textAnchor="middle"
            fontFamily="system-ui, Segoe UI, sans-serif"
            fontWeight={900}
            fontSize={21}
            letterSpacing="-0.45"
            transform="rotate(-90 101 232)"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinejoin="round"
          >
            baskiurunleri.com
          </text>

          <text
            x="101"
            y="232"
            textAnchor="middle"
            fontFamily="system-ui, Segoe UI, sans-serif"
            fontWeight={900}
            fontSize={21}
            letterSpacing="-0.45"
            transform="rotate(-90 101 232)"
          >
            <tspan fill="#111111">baski</tspan>
            <tspan fill="#F4821F">urunleri.com</tspan>
          </text>

          <text
            x="126"
            y="232"
            textAnchor="middle"
            fontFamily="system-ui, Segoe UI, sans-serif"
            fontSize={8}
            fontWeight={700}
            fill="#737b84"
            letterSpacing="2"
            transform="rotate(-90 126 232)"
          >
            yeni nesil matbaa
          </text>
        </g>

        <rect x="22" y="8" width="8" height="445" rx="4" fill="url(#pole-y)" />
        <rect x="23.6" y="8" width="1.4" height="445" fill="#ffffff" opacity="0.55" />
        <circle cx="26" cy="8" r="5.5" fill="#d3d3d3" stroke="#b6b6b6" strokeWidth="0.5" />
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