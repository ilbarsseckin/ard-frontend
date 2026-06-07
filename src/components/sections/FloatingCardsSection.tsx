'use client'
import { useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardData {
  id: number
  tag: string
  title: string
  titleSecondLine?: string
  price: string
  priceNote: string
  extra?: string
  animDuration: string
  animName: string
  style: React.CSSProperties
  bodyStyle: React.CSSProperties
  tagStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  priceStyle?: React.CSSProperties
  fontSize: { title: number; price: number }
}

// ─── Animation keyframes ──────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes fcFloat1 {
    0%, 100% { transform: translateY(0px)   rotate(-2deg); }
    50%       { transform: translateY(-15px) rotate(-2deg); }
  }
  @keyframes fcFloat2 {
    0%, 100% { transform: translateY(0px)   rotate(3deg); }
    50%       { transform: translateY(-10px) rotate(3deg); }
  }
  @keyframes fcFloat3 {
    0%, 100% { transform: translateY(0px)   rotate(5deg); }
    50%       { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes fcSectionFadeIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fcLeftFadeIn {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`

// ─── Kart verileri (şimdilik sabit) ──────────────────────────────────────────
// TODO: backend'e geçince bu array'i API response'u ile değiştir.

const CARDS: CardData[] = [
  {
    id: 1,
    tag: 'En Çok Tercih',
    title: 'Kurumsal',
    titleSecondLine: 'Kartvizit',
    price: '₺89',
    priceNote: "250 Adet'ten",
    extra: '⭐⭐⭐⭐⭐',
    animName: 'fcFloat1',
    animDuration: '4s',
    fontSize: { title: 26, price: 30 },
    style: {
      width: 300,
      height: 210,
      top: 40,
      right: 60,
      background: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
      border: '1px solid rgba(255,94,0,.35)',
    },
    bodyStyle: { color: '#fff' },
    tagStyle:   { color: 'rgba(255,255,255,.5)' },
    priceStyle: { color: '#FF5E00' },
  },
  {
    id: 2,
    tag: 'Kampanya',
    title: 'Dev Branda',
    titleSecondLine: 'Baskı',
    price: '₺299',
    priceNote: 'm² fiyatı',
    animName: 'fcFloat2',
    animDuration: '5s',
    fontSize: { title: 20, price: 24 },
    style: {
      width: 230,
      height: 165,
      bottom: 10,
      right: 10,
      background: '#FF5E00',
    },
    bodyStyle:  { color: '#000' },
    tagStyle:   { color: 'rgba(0,0,0,.55)' },
    titleStyle: { color: '#000' },
    priceStyle: { color: '#000' },
  },
  {
    id: 3,
    tag: 'Yeni',
    title: 'UV Dijital',
    titleSecondLine: 'Baskı',
    price: '₺199',
    priceNote: 'Premium Kalite',
    animName: 'fcFloat3',
    animDuration: '3.5s',
    fontSize: { title: 16, price: 18 },
    style: {
      width: 180,
      height: 125,
      top: 0,
      right: 0,
      background: 'linear-gradient(135deg,#1a1a1a,#333)',
      border: '1px solid rgba(255,255,255,.1)',
    },
    bodyStyle:  { color: '#fff' },
    tagStyle:   { color: 'rgba(255,255,255,.45)' },
    titleStyle: { color: '#FF5E00' },
    priceStyle: { color: '#FF5E00' },
  },
]

// ─── Tek kart ─────────────────────────────────────────────────────────────────

function HeroCard({ card }: { card: CardData }) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,.45)',
        animation: `${card.animName} ${card.animDuration} ease-in-out infinite`,
        ...card.style,
      }}
    >
      <div
        style={{
          padding: 20,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          ...card.bodyStyle,
        }}
      >
        {/* Üst: etiket + başlık */}
        <div>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              opacity: 0.7,
              ...card.tagStyle,
            }}
          >
            {card.tag}
          </span>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: card.fontSize.title,
              lineHeight: 1.1,
              marginTop: 4,
              ...card.titleStyle,
            }}
          >
            {card.title}
            {card.titleSecondLine && (
              <>
                <br />
                {card.titleSecondLine}
              </>
            )}
          </div>
        </div>

        {/* Alt: fiyat + extra */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: card.fontSize.price,
                ...card.priceStyle,
              }}
            >
              {card.price}
            </span>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                opacity: 0.45,
                marginTop: 2,
              }}
            >
              {card.priceNote}
            </div>
          </div>
          {card.extra && (
            <span style={{ fontSize: 11, color: '#FF5E00' }}>{card.extra}</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Ana section bileşeni ─────────────────────────────────────────────────────

export default function FloatingCardsSection() {
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    if (!document.getElementById('fc-keyframes')) {
      const el = document.createElement('style')
      el.id = 'fc-keyframes'
      el.textContent = KEYFRAMES
      document.head.appendChild(el)
      styleRef.current = el
    }
    return () => {
      styleRef.current?.remove()
    }
  }, [])

  return (
    <section className="py-10 md:py-20" style={{ overflow: 'hidden' }}>
      {/*
       * Gerekirse globals.css / layout.tsx'e ekle:
       * @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700&display=swap');
       */}
      <div
        className="max-w-7xl mx-auto px-6"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 48,
          flexWrap: 'wrap',
        }}
      >
        {/* ─── Sol: metin bloğu ─────────────────────────────── */}
        <div
          style={{
            flex: '1 1 320px',
            animation: 'fcLeftFadeIn .7s .2s both',
          }}
        >
          {/* Badge */}
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#FF5E00',
              background: 'rgba(255,94,0,.1)',
              border: '1px solid rgba(255,94,0,.25)',
              borderRadius: 6,
              padding: '4px 10px',
              marginBottom: 16,
            }}
          >
            Öne Çıkan Ürünler
          </span>

          {/* Başlık */}
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '1px',
              color: 'var(--text-primary, #111)',
              margin: 0,
            }}
          >
            Kaliteli Baskı
            <br />
            <span style={{ color: '#FF5E00' }}>Uygun Fiyat</span>
          </h2>

          {/* Alt yazı */}
          <p
            style={{
              marginTop: 16,
              fontSize: 15,
              lineHeight: 1.6,
              color: 'var(--text-muted, #666)',
              maxWidth: 380,
            }}
          >
            Kurumsal kartvizitlerden branda baskılara kadar tüm baskı ihtiyaçlarınızı
            hızlı teslimat ve garantili kalite ile karşılıyoruz.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <a
              href="/urunler"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '12px 28px',
                borderRadius: 10,
                background: '#FF5E00',
                color: '#fff',
                textDecoration: 'none',
                transition: 'opacity .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Tüm Ürünler
            </a>
            <a
              href="/iletisim"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '12px 28px',
                borderRadius: 10,
                background: 'transparent',
                color: 'var(--text-primary, #111)',
                border: '1px solid var(--border, #ddd)',
                textDecoration: 'none',
                transition: 'border-color .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF5E00')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border, #ddd)')}
            >
              Teklif Al
            </a>
          </div>
        </div>

        {/* ─── Sağ: yüzen kartlar ───────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            width: 440,
            height: 360,
            flexShrink: 0,
            animation: 'fcSectionFadeIn .8s .5s both',
          }}
        >
          {CARDS.map(card => (
            <HeroCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Kullanım ─────────────────────────────────────────────────────────────────
//
//  import FloatingCardsSection from '@/components/FloatingCardsSection'
//
//  // istediğin sayfada:
//  <FloatingCardsSection />
//
//  globals.css / layout.tsx'e font ekle:
//  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700&display=swap');
//
//  Backend'e geçince CARDS array'ini şöyle değiştir:
//
//  const [cards, setCards] = useState<CardData[]>(CARDS)   // fallback: sabit veri
//  useEffect(() => {
//    api.get('/api/catalog/featured-cards')
//      .then(r => setCards(r.data.data || CARDS))
//      .catch(() => {})                                      // hata → sabit veri
//  }, [])