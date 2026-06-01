'use client'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

// Görseldeki tıklanabilir alanlar (yüzde olarak konumlar)
// Görsel ölçeklendiğinde otomatik uyum sağlar
const HOTSPOTS = [
  // Köşe callout'lar
  { top:  '18%', left:  '2%',  w: '17%', h: '14%', href: '/urunler?q=bayrak',    label: 'Yelken Bayrak' },
  { top:  '18%', left: '80%',  w: '17%', h: '14%', href: '/urunler?q=afis',      label: 'Avrupa Vinil Afiş' },
  { top:  '54%', left:  '2%',  w: '17%', h: '14%', href: '/urunler?q=brosur',    label: 'Broşür' },
  { top:  '52%', left: '80%',  w: '17%', h: '23%', href: '/urunler?q=promosyon', label: 'Promosyon' },

  // Alt kategori bar — 7 ikon
  { top: '85%', left: '15%', w: '8%', h: '12%', href: '/urunler?q=afis',     label: 'Afiş' },
  { top: '85%', left: '23%', w: '8%', h: '12%', href: '/urunler?q=kartvizit',label: 'Kartvizit' },
  { top: '85%', left: '31%', w: '8%', h: '12%', href: '/urunler?q=brosur',   label: 'Broşür' },
  { top: '85%', left: '40%', w: '8%', h: '12%', href: '/urunler?q=katalog',  label: 'Katalog' },
  { top: '85%', left: '48%', w: '8%', h: '12%', href: '/urunler?q=davetiye', label: 'Davetiye' },
  { top: '85%', left: '57%', w: '8%', h: '12%', href: '/urunler?q=roll',     label: 'Roll Up' },
  { top: '85%', left: '65%', w: '8%', h: '12%', href: '/urunler?q=promosyon',label: 'Promosyon' },
]

export default function BaskiCozumleri() {
  return (
    <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
            <span className="text-[11px] font-bold uppercase tracking-[2px]">
              Baskı Ürünleri Dünyası
            </span>
          </div>
          <h2 className="text-[28px] md:text-[40px] font-black tracking-[-1.5px] mb-2"
            style={{ color: 'var(--text-primary)' }}>
            Tüm Baskı Çözümleri Bir Arada
          </h2>
          <p className="text-[13px] md:text-[15px]" style={{ color: 'var(--text-muted)' }}>
            Profesyonel kalitede, hızlı teslimat · Görseldeki ürünlere tıklayarak inceleyebilirsiniz
          </p>
        </div>

        {/* Görsel + Hotspot'lar */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img src="/baskiurunleri-showcase.png"
            alt="baskıurunleri.com — Dijital Baskıda Kaliteyi Keşfet"
            className="w-full h-auto block" />

          {/* Tıklanabilir alanlar */}
          {HOTSPOTS.map((h, i) => (
            <Link key={i} href={h.href} title={h.label}
              className="absolute group cursor-pointer"
              style={{ top: h.top, left: h.left, width: h.w, height: h.h }}>
              <div className="absolute inset-0 rounded-lg transition-all duration-200 
                group-hover:bg-[#F4821F]/15 group-hover:ring-2 group-hover:ring-[#F4821F] 
                group-hover:scale-105" />
              {/* Hover tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-bold text-white bg-[#F4821F]
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {h.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/urunler"
            className="flex items-center gap-1.5 px-6 py-3 text-[13px] font-bold rounded-xl bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors shadow-md">
            Tüm Ürünleri İncele
            <ArrowRight size={13} />
          </Link>
          <Link href="/iletisim"
            className="flex items-center gap-1.5 px-6 py-3 text-[13px] font-bold rounded-xl transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
            <Phone size={13} />
            İletişim
          </Link>
        </div>
      </div>
    </section>
  )
}