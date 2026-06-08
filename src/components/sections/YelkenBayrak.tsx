'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

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
    <div className="absolute bottom-[-12px] left-1/2 z-10 h-[220px] w-[95px] -translate-x-1/2 rotate-[-1.5deg] drop-shadow-[0_12px_18px_rgba(0,0,0,0.22)] md:bottom-[-30px] md:h-[340px] md:w-[150px]">
      <svg viewBox="0 0 210 470" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
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

          <path d="M31 42 C43 48 51 58 53 72 L53 398 C47 407 39 414 31 418 Z" fill="#000" opacity="0.045" />

          <path d="M78 38 C100 145 96 310 78 424" stroke="#000" strokeWidth="16" opacity="0.035" fill="none" />

          <path d="M139 42 C122 150 128 310 145 420" stroke="#000" strokeWidth="12" opacity="0.026" fill="none" />

          <rect x="66" y="50" width="22" height="360" fill="url(#shine-y)" opacity="0.35" />

          <path d="M43 88 C92 76 139 78 173 90" fill="none" stroke="#F4821F" strokeWidth="5" strokeLinecap="round" />
          <path d="M45 101 C93 91 137 91 170 102" fill="none" stroke="#F4821F" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
          <path d="M41 371 C90 383 133 385 156 374" fill="none" stroke="#F4821F" strokeWidth="5" strokeLinecap="round" />
          <path d="M43 360 C91 372 132 373 154 363" fill="none" stroke="#F4821F" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
        </g>

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

function GonderGorsel() {
  return (
    <div className="absolute bottom-[-10px] left-1/2 z-10 h-[180px] w-[110px] -translate-x-1/2 drop-shadow-[0_12px_18px_rgba(0,0,0,0.22)] md:bottom-[-24px] md:h-[280px] md:w-[180px]">
      <img
        src="/images/yelken-bayrak.gif"
        alt="Gönder Bayrağı"
        className="absolute left-[14px] top-0 h-[150px] w-[95px] rounded-md object-cover shadow-[0_6px_18px_rgba(0,0,0,0.15)] md:left-[22px] md:h-[240px] md:w-[158px]"
      />

      <svg viewBox="0 0 180 280" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="pointer-events-none absolute inset-0">
        <defs>
          <linearGradient id="pg-g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#999" />
            <stop offset="40%" stopColor="#eee" />
            <stop offset="100%" stopColor="#777" />
          </linearGradient>
        </defs>

        <rect x="10" y="0" width="8" height="278" rx="4" fill="url(#pg-g)" />
        <circle cx="14" cy="5" r="5" fill="#d0d0d0" />
        <ellipse cx="14" cy="274" rx="9" ry="4.5" fill="#aaa" opacity="0.5" />
      </svg>
    </div>
  )
}

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
      className="group relative flex flex-col overflow-hidden rounded-[22px] transition-all duration-300 hover:-translate-y-1 md:rounded-3xl"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="relative min-h-[170px] md:min-h-[340px]"
        style={{
          background: 'var(--bg-secondary)',
        }}
      >
        {gorsel}
      </div>

      <div className="relative z-10 flex flex-col justify-center p-3 md:p-8">
        <p className="mb-1 text-[9px] font-black uppercase tracking-[1.5px] text-[#F4821F] md:mb-2 md:text-[11px] md:tracking-[2px]">
          Outdoor Reklam
        </p>

        <h2
          className="mb-1 text-[15px] font-black leading-tight tracking-[-0.5px] md:mb-2 md:text-[30px] md:tracking-[-1px]"
          style={{ color: 'var(--text-primary)' }}
        >
          {baslik}
        </h2>

        <p
          className="mb-3 text-[10px] leading-5 md:mb-4 md:text-[12px] md:leading-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          {aciklama}
        </p>

        <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 md:mb-4">
          <span className="text-[17px] font-black text-[#F4821F] md:text-[26px]">₺990</span>
          <span className="text-[9px] md:text-[11px]" style={{ color: 'var(--text-muted)' }}>
            başlayan fiyatlarla
          </span>
        </div>

        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F4821F] px-3 py-2 text-[10px] font-bold text-white transition-colors group-hover:bg-[#e07010] md:gap-2 md:px-4 md:text-[12px]">
          Ürünü incele <ArrowRight size={11} />
        </div>
      </div>
    </Link>
  )
}

export default function YelkenBayrakSection() {
  return (
    <section className="px-3 py-8 md:px-6 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:gap-6">
        <BayrakKart
          href="/urun/yelken-bayrak-urun"
          baslik="Yelken Bayrak"
          aciklama="Etkinlik ve mağaza önü için dikkat çekici bayrak çözümleri."
          gorsel={<YelkenSVG />}
        />

        <BayrakKart
          href="/urun/gonder-bayragi"
          baslik="Gönder Bayrağı"
          aciklama="Kurumsal ve resmi alanlar için kaliteli gönder bayrakları."
          gorsel={<GonderGorsel />}
        />
      </div>
    </section>
  )
}