'use client'

import Link from 'next/link'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'

const HOTSPOTS = [
  { top: '18%', left: '2%', w: '17%', h: '14%', href: '/urunler?q=bayrak', label: 'Yelken Bayrak', color: '#F4821F' },
  { top: '18%', left: '80%', w: '17%', h: '14%', href: '/urunler?q=afis', label: 'Avrupa Vinil Afiş', color: '#F4821F' },
  { top: '54%', left: '2%', w: '17%', h: '14%', href: '/urunler?q=brosur', label: 'Broşür', color: '#F4821F' },
  { top: '52%', left: '80%', w: '17%', h: '23%', href: '/urunler?q=promosyon', label: 'Promosyon', color: '#F4821F' },
  { top: '85%', left: '15%', w: '8%', h: '12%', href: '/urunler?q=afis', label: 'Afiş', color: '#6366F1' },
  { top: '85%', left: '23%', w: '8%', h: '12%', href: '/urunler?q=kartvizit', label: 'Kartvizit', color: '#6366F1' },
  { top: '85%', left: '31%', w: '8%', h: '12%', href: '/urunler?q=brosur', label: 'Broşür', color: '#6366F1' },
  { top: '85%', left: '40%', w: '8%', h: '12%', href: '/urunler?q=katalog', label: 'Katalog', color: '#6366F1' },
  { top: '85%', left: '48%', w: '8%', h: '12%', href: '/urunler?q=davetiye', label: 'Davetiye', color: '#6366F1' },
  { top: '85%', left: '57%', w: '8%', h: '12%', href: '/urunler?q=roll', label: 'Roll Up', color: '#6366F1' },
  { top: '85%', left: '65%', w: '8%', h: '12%', href: '/urunler?q=promosyon', label: 'Promosyon', color: '#6366F1' },
]

export default function BaskiCozumleri() {
  return (
    <section className="px-4 py-14 md:py-20" style={{ background: 'var(--bg-secondary)' }}>
      <style>{`
        @keyframes hotspot-ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes hotspot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .hotspot-dot {
          animation: hotspot-pulse 2s ease-in-out infinite;
        }
        .hotspot-ring {
          animation: hotspot-ping 2s ease-out infinite;
        }
        .hotspot-link:hover .hotspot-dot {
          animation: none;
          transform: scale(1.3);
          background: #F4821F !important;
        }
        .hotspot-label {
          opacity: 0;
          transform: translateY(4px) translateX(-50%);
          transition: all 0.2s ease;
          pointer-events: none;
        }
        .hotspot-link:hover .hotspot-label,
        .hotspot-link:focus .hotspot-label {
          opacity: 1;
          transform: translateY(0) translateX(-50%);
        }
        .hotspot-overlay {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .hotspot-link:hover .hotspot-overlay {
          opacity: 1;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[1.6px]"
            style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}>
            <Sparkles size={14} />
            Baskı Ürünleri Dünyası
          </div>
          <h2 className="text-balance text-[30px] font-black leading-tight md:text-[44px]"
            style={{ color: 'var(--text-primary)' }}>
            Tüm Baskı Çözümleri Bir Arada
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-6 md:text-[16px]"
            style={{ color: 'var(--text-muted)' }}>
            Profesyonel kalite, hızlı teslimat ve ihtiyacınıza uygun baskı ürünleri.
            Görseldeki ürünlere tıklayarak doğrudan inceleyebilirsiniz.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl ring-1"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <img
            src="/baskiurunleri-showcase.png"
            alt="Baskı ürünleri vitrini"
            className="block h-auto w-full select-none"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.04) 100%)' }} />

          {HOTSPOTS.map((hotspot, idx) => (
            <Link
              key={`${hotspot.href}-${idx}`}
              href={hotspot.href}
              aria-label={`${hotspot.label} ürünlerini incele`}
              className="hotspot-link absolute outline-none"
              style={{ top: hotspot.top, left: hotspot.left, width: hotspot.w, height: hotspot.h }}>

              {/* Hover overlay */}
              <span className="hotspot-overlay absolute inset-0 rounded-xl"
                style={{ background: `${hotspot.color}18`, border: `2px solid ${hotspot.color}60` }} />

              {/* Animasyonlu nokta — merkez */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* Dış halka ping */}
                <span className="hotspot-ring absolute -inset-2 rounded-full"
                  style={{ background: `${hotspot.color}40` }} />
                {/* İç nokta */}
                <span className="hotspot-dot relative flex h-4 w-4 items-center justify-center rounded-full shadow-lg"
                  style={{ background: hotspot.color }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </span>

              {/* Etiket */}
              <span className="hotspot-label absolute left-1/2 top-full mt-2 z-20 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xl"
                style={{ background: hotspot.color }}>
                {hotspot.label}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                  style={{ background: hotspot.color }} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/urunler"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F4821F] px-6 py-3 text-[13px] font-extrabold text-white shadow-lg transition hover:bg-[#df7117] hover:scale-105">
            Tüm Ürünleri İncele
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-[13px] font-extrabold transition hover:scale-105"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
            <Phone size={16} />
            İletişim
          </Link>
        </div>
      </div>
    </section>
  )
}