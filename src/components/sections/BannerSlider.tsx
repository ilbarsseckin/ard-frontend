'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'

const banners = [
  {
    id: 1,
    image:
      'https://s.alicdn.com/@sc04/kf/HTB116pVnlfH8KJjy1Xbq6zLdXXaD.jpg?avif=close&webp=close',
    eyebrow: 'Vinil · Branda · Mesh · One Way Vision',
    title: 'BÜYÜK FORMAT DİJİTAL BASKI',
    subtitle: 'Markanı sokakta büyüt!',
    desc:
      'Açık hava reklam çözümleri, yüksek çözünürlüklü baskı, UV dayanıklı malzemeler ve hızlı üretim avantajı.',
    cta: 'Fiyat Hesapla',
    href: '/siparis?urun=buyuk-format-baski',
    accent: '#F4821F',
  },

  {
    id: 2,
    image:
      'https://www.befunky.com/images/wp/wp-2023-02-how-to-print-business-cards-featured.jpg?auto=avif,webp&format=jpg&width=1150&crop=16:9',
    eyebrow: '350gr · Mat · Parlak · Kabartma Lak',
    title: 'KARTVİZİT & KURUMSAL BASKI',
    subtitle: 'İlk izlenim her şeyi değiştirir!',
    desc:
      'Premium kartvizit, antetli kağıt, zarf ve kurumsal kimlik baskılarında profesyonel çözümler.',
    cta: 'Ürünleri İncele',
    href: '/urunler/kartvizit',
    accent: '#3B82F6',
  },

  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1600&q=85',
    eyebrow: 'Sticker · Etiket · Şeffaf · Özel Kesim',
    title: 'STICKER & ETİKET BASKI',
    subtitle: 'Markanı her yerde göster!',
    desc:
      'Az adetli veya toplu üretim seçenekleriyle dayanıklı, canlı renkli özel etiket çözümleri.',
    cta: 'Hemen İncele',
    href: '/urunler/sticker-etiket',
    accent: '#10B981',
  },

  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=85',
    eyebrow: 'Broşür · El İlanı · Katalog · Menü',
    title: 'EL BROŞÜRÜ & MATBAA ÜRÜNLERİ',
    subtitle: 'Dağıtım için etkili reklam çözümleri!',
    desc:
      'Ekonomik fiyatlarla broşür, katalog, afiş ve promosyon baskılarında hızlı teslimat.',
    cta: 'Teklif Al',
    href: '/urunler/brosur',
    accent: '#EF4444',
  },

  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=85',
    eyebrow: 'Kupa · Kalem · Tişört · Promosyon',
    title: 'PROMOSYON ÜRÜNLERİ',
    subtitle: 'Markanı müşterinin eline bırak!',
    desc:
      'Kurumsal etkinlikler ve reklam kampanyaları için özel baskılı promosyon ürünleri.',
    cta: 'Koleksiyonu Gör',
    href: '/urunler/promosyon',
    accent: '#8B5CF6',
  },

  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=85',
    eyebrow: 'Fotoğraf Baskı · Kanvas · Çerçeve',
    title: 'FOTOĞRAF & KANVAS BASKI',
    subtitle: 'Anılarını profesyonel kaliteyle yaşat!',
    desc:
      'Yüksek çözünürlüklü fotoğraf baskıları, tablo kanvas ve dekoratif duvar çözümleri.',
    cta: 'Sipariş Ver',
    href: '/urunler/fotograf-baski',
    accent: '#EC4899',
  },

  {
    id: 7,
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1600&q=85',
    eyebrow: 'Otomatik · Cep Kaşe · Renkli Kaşe',
    title: 'KAŞE & OFİS ÜRÜNLERİ',
    subtitle: 'İşinizi hızlandıran detaylar!',
    desc:
      'Şirketlere özel otomatik kaşe, mühür ve ofis baskı ürünlerinde aynı gün üretim imkanı.',
    cta: 'Hemen Oluştur',
    href: '/urunler/kase',
    accent: '#F59E0B',
  },
]

export default function BannerSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const go = useCallback(
    (idx: number) => {
      if (animating) return

      setAnimating(true)
      setCurrent(idx)

      setTimeout(() => {
        setAnimating(false)
      }, 500)
    },
    [animating]
  )

  const prev = () =>
    go((current - 1 + banners.length) % banners.length)

  const next = useCallback(() => {
    go((current + 1) % banners.length)
  }, [current, go])

  useEffect(() => {
    const t = setInterval(next, 5500)
    return () => clearInterval(t)
  }, [next])

  const b = banners[current]

  return (
    <div className="w-full">

      {/* MAIN BANNER */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 620,
          background: '#000',
        }}
      >

        {/* IMAGE */}
        <img
          key={b.id}
          src={b.image}
          alt={b.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: animating ? 0.92 : 1,
            transition: 'all .7s ease',
            transform: animating
              ? 'scale(1.03)'
              : 'scale(1)',
            filter:
              'contrast(1.08) saturate(1.08) brightness(1.02)',
          }}
        />

        {/* PREMIUM OVERLAY */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.32) 38%, rgba(0,0,0,0.08) 68%, rgba(0,0,0,0) 100%)',
            backdropFilter: 'blur(1px)',
          }}
        />

        {/* BOTTOM SHADOW */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 30%)',
          }}
        />

        {/* ACCENT LINE */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: b.accent,
            transition: 'background .5s ease',
          }}
        />

        {/* CONTENT */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-12 flex items-center">

          <div className="max-w-[620px]">

            {/* EYEBROW */}
            <div className="flex items-center gap-3 mb-6">

              <div
                className="w-8 h-px"
                style={{
                  background: b.accent,
                }}
              />

              <p className="text-[11px] font-bold tracking-[3px] uppercase text-white/70">
                {b.eyebrow}
              </p>
            </div>

            {/* TITLE */}
            <h2
              className="text-[68px] leading-[0.95] tracking-[-3px] font-black text-white mb-3"
              style={{
                opacity: animating ? 0 : 1,
                transition: 'opacity .3s ease',
              }}
            >
              {b.title}
            </h2>

            {/* SUBTITLE */}
            <h3
              className="text-[28px] font-bold mb-5"
              style={{
                color: b.accent,
                opacity: animating ? 0 : 1,
                transition: 'opacity .3s ease',
              }}
            >
              {b.subtitle}
            </h3>

            {/* DESCRIPTION */}
            <p
              className="text-[15px] leading-[1.8] text-white/75 mb-10 max-w-[520px]"
              style={{
                opacity: animating ? 0 : 1,
                transition: 'opacity .3s ease',
              }}
            >
              {b.desc}
            </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-4">

              <Link
                href={b.href}
                className="inline-flex items-center gap-2.5 text-white font-bold text-[14px] px-9 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: b.accent,
                  boxShadow: `0 10px 35px ${b.accent}55`,
                }}
              >
                {b.cta}
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 text-white/85 font-semibold text-[14px] px-7 py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
                style={{
                  backdropFilter: 'blur(12px)',
                }}
              >
                Tüm Ürünler
              </Link>
            </div>
          </div>
        </div>

        {/* LEFT BUTTON */}
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <ChevronLeft size={21} />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <ChevronRight size={21} />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-8 left-12 z-20 flex items-center gap-3">

          {banners.map((ban, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="relative h-[4px] rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: i === current ? 52 : 16,
                background: 'rgba(255,255,255,0.25)',
              }}
            >
              {i === current && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: ban.accent,
                    animation:
                      'progress 5.5s linear',
                  }}
                />
              )}
            </button>
          ))}

          <span className="text-[11px] text-white/45 ml-2">
            {current + 1} / {banners.length}
          </span>
        </div>

        {/* RIGHT BOTTOM */}
        <div className="absolute bottom-8 right-12 z-20 text-right">

          <p className="text-[10px] uppercase tracking-[2px] text-white/30">
            Premium Print Solutions
          </p>

          <p className="text-[12px] text-white/55 font-medium mt-1">
            {b.title}
          </p>
        </div>
      </div>

      {/* BOTTOM INFO BAR */}
      <div
        className="grid grid-cols-5 divide-x"
        style={{
          background: '#0F1117',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {[
          {
            icon: '🚚',
            text: '500₺ Üzeri Ücretsiz Kargo',
          },
          {
            icon: '💳',
            text: 'Kredi Kartına 6 Taksit',
          },
          {
            icon: '⚡',
            text: '48 Saat Hızlı Teslimat',
          },
          {
            icon: '🛡️',
            text: 'Premium Baskı Kalitesi',
          },
          {
            icon: '🔒',
            text: 'Güvenli Ödeme Sistemi',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-3 py-4 px-5"
            style={{
              borderColor:
                'rgba(255,255,255,0.05)',
            }}
          >
            <span className="text-[17px]">
              {item.icon}
            </span>

            <span className="text-[12px] font-medium text-white/70">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }

          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      `}</style>
    </div>
  )
}