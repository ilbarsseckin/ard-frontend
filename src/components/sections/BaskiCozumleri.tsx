'use client'

import Link from 'next/link'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'

const HOTSPOTS = [
  { top: '18%', left: '2%', w: '17%', h: '14%', href: '/urunler?q=bayrak', label: 'Yelken Bayrak' },
  { top: '18%', left: '80%', w: '17%', h: '14%', href: '/urunler?q=afis', label: 'Avrupa Vinil Afiş' },
  { top: '54%', left: '2%', w: '17%', h: '14%', href: '/urunler?q=brosur', label: 'Broşür' },
  { top: '52%', left: '80%', w: '17%', h: '23%', href: '/urunler?q=promosyon', label: 'Promosyon' },

  { top: '85%', left: '15%', w: '8%', h: '12%', href: '/urunler?q=afis', label: 'Afiş' },
  { top: '85%', left: '23%', w: '8%', h: '12%', href: '/urunler?q=kartvizit', label: 'Kartvizit' },
  { top: '85%', left: '31%', w: '8%', h: '12%', href: '/urunler?q=brosur', label: 'Broşür' },
  { top: '85%', left: '40%', w: '8%', h: '12%', href: '/urunler?q=katalog', label: 'Katalog' },
  { top: '85%', left: '48%', w: '8%', h: '12%', href: '/urunler?q=davetiye', label: 'Davetiye' },
  { top: '85%', left: '57%', w: '8%', h: '12%', href: '/urunler?q=roll', label: 'Roll Up' },
  { top: '85%', left: '65%', w: '8%', h: '12%', href: '/urunler?q=promosyon', label: 'Promosyon' },
]

export default function BaskiCozumleri() {
  return (
    <section className="px-4 py-14 md:py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[1.6px]"
            style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}
          >
            <Sparkles size={14} />
            Baskı Ürünleri Dünyası
          </div>

          <h2
            className="text-balance text-[30px] font-black leading-tight md:text-[44px]"
            style={{ color: 'var(--text-primary)' }}
          >
            Tüm Baskı Çözümleri Bir Arada
          </h2>

          <p
            className="mx-auto mt-3 max-w-2xl text-[14px] leading-6 md:text-[16px]"
            style={{ color: 'var(--text-muted)' }}
          >
            Profesyonel kalite, hızlı teslimat ve ihtiyacınıza uygun baskı ürünleri.
            Görseldeki ürünlere tıklayarak doğrudan inceleyebilirsiniz.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-lg shadow-[0_18px_55px_rgba(15,23,42,0.16)] ring-1"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <img
            src="/baskiurunleri-showcase.png"
            alt="Baskı ürünleri vitrini"
            className="block h-auto w-full select-none"
            loading="lazy"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/5" />

          {HOTSPOTS.map((hotspot) => (
            <Link
              key={`${hotspot.href}-${hotspot.label}`}
              href={hotspot.href}
              title={hotspot.label}
              aria-label={`${hotspot.label} ürünlerini incele`}
              className="group absolute outline-none"
              style={{
                top: hotspot.top,
                left: hotspot.left,
                width: hotspot.w,
                height: hotspot.h,
              }}
            >
              <span className="absolute inset-0 rounded-md transition duration-200 group-hover:bg-[#F4821F]/15 group-hover:ring-2 group-hover:ring-[#F4821F] group-focus-visible:bg-[#F4821F]/15 group-focus-visible:ring-2 group-focus-visible:ring-[#F4821F]" />

              <span className="absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#F4821F] px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-md transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                {hotspot.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/urunler"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#F4821F] px-6 py-3 text-[13px] font-extrabold text-white shadow-md transition hover:bg-[#df7117] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4821F] focus-visible:ring-offset-2"
          >
            Tüm Ürünleri İncele
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/iletisim"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-6 py-3 text-[13px] font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4821F] focus-visible:ring-offset-2"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              background: 'var(--bg-card)',
            }}
          >
            <Phone size={16} />
            İletişim
          </Link>
        </div>
      </div>
    </section>
  )
}