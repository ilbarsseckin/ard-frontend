'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroSlide {
  id: string
  label?: string
  title: string
  description?: string
  ctaText?: string
  ctaLink?: string
  imageUrl: string
  mobileImageUrl?: string
  backgroundColor?: string
  layout: 'SPLIT_LEFT' | 'SPLIT_RIGHT' | 'OVERLAY' | 'IMAGE_ONLY'
}

const AUTO_ROTATE_MS = 6000

export default function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    api.get('/api/hero-slides')
      .then(r => setSlides(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const t = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, AUTO_ROTATE_MS)
    return () => clearInterval(t)
  }, [slides.length, paused])

  const next = () => setCurrent(c => (c + 1) % slides.length)
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)

  if (loading) {
    return (
      <div className="w-full aspect-[24/5] rounded-2xl animate-pulse"
        style={{ background: 'var(--bg-secondary)' }} />
    )
  }

  if (slides.length === 0) return null

  const slide = slides[current]
  const bg = slide.backgroundColor || 'var(--bg-secondary)'

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slide.layout === 'IMAGE_ONLY' && (
        <SlideImageOnly slide={slide} />
      )}

      {slide.layout === 'OVERLAY' && (
        <SlideOverlay slide={slide} />
      )}

      {(slide.layout === 'SPLIT_LEFT' || slide.layout === 'SPLIT_RIGHT') && (
        <SlideSplit slide={slide} bg={bg} reverse={slide.layout === 'SPLIT_RIGHT'} />
      )}

      {slides.length > 1 && (
        <>
          <button onClick={prev}
            aria-label="Önceki"
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white items-center justify-center shadow-lg transition-all hover:scale-110 z-10">
            <ChevronLeft size={18} className="text-gray-700" />
          </button>
          <button onClick={next}
            aria-label="Sonraki"
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white items-center justify-center shadow-lg transition-all hover:scale-110 z-10">
            <ChevronRight size={18} className="text-gray-700" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-8 bg-[#F4821F]' : 'w-2 bg-white/60 hover:bg-white/80'
              }`} />
          ))}
        </div>
      )}
    </div>
  )
}

// ──────────────── Layout: SPLIT ────────────────
function SlideSplit({ slide, bg, reverse }: { slide: HeroSlide; bg: string; reverse: boolean }) {
  return (
    <>
      <div className="hidden md:grid grid-cols-2 min-h-[400px]" style={{ background: bg }}>
        <div className={`flex flex-col justify-center p-12 ${reverse ? 'order-2' : ''}`}>
          {slide.label && (
            <p className="text-[13px] font-semibold tracking-wide mb-3" style={{ color: 'rgba(0,0,0,0.55)' }}>
              {slide.label}
            </p>
          )}
          <h2 className="text-[42px] font-black leading-tight tracking-[-1px]"
            style={{ color: 'var(--text-primary)' }}>
            {slide.title}
          </h2>
          {slide.description && (
            <p className="text-[15px] mt-3 leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
              {slide.description}
            </p>
          )}
          {slide.ctaText && slide.ctaLink && (
            <div className="mt-6">
              <Link href={slide.ctaLink}
                className="inline-flex items-center px-7 py-3 bg-[#F4821F] hover:bg-[#e07010] text-white font-bold text-[14px] rounded-full transition-colors shadow-lg">
                {slide.ctaText}
              </Link>
            </div>
          )}
        </div>
        <div className={`relative overflow-hidden ${reverse ? 'order-1' : ''}`}>
          <img src={slide.imageUrl} alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>

      <div className="md:hidden" style={{ background: bg }}>
        <img src={slide.mobileImageUrl || slide.imageUrl} alt={slide.title}
          className="w-full h-auto block" />
        <div className="p-4">
          {slide.label && (
            <p className="text-[11px] font-semibold mb-1" style={{ color: 'rgba(0,0,0,0.55)' }}>
              {slide.label}
            </p>
          )}
          <h2 className="text-[20px] font-black tracking-[-0.5px]"
            style={{ color: 'var(--text-primary)' }}>
            {slide.title}
          </h2>
          {slide.ctaText && slide.ctaLink && (
            <Link href={slide.ctaLink}
              className="inline-block mt-3 px-5 py-2 bg-[#F4821F] hover:bg-[#e07010] text-white font-bold text-[12px] rounded-full transition-colors">
              {slide.ctaText}
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

// ──────────────── Layout: OVERLAY ────────────────
function SlideOverlay({ slide }: { slide: HeroSlide }) {
  return (
    <div className="relative">
      <img src={slide.imageUrl} alt={slide.title}
        className="w-full h-auto block hidden md:block" />
      <img src={slide.mobileImageUrl || slide.imageUrl} alt={slide.title}
        className="w-full h-auto block md:hidden" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.15))' }} />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white max-w-2xl">
        {slide.label && (
          <p className="text-[12px] md:text-[13px] font-semibold tracking-wide mb-2 opacity-90">
            {slide.label}
          </p>
        )}
        <h2 className="text-[28px] md:text-[42px] font-black leading-tight tracking-[-1px]">
          {slide.title}
        </h2>
        {slide.description && (
          <p className="text-[13px] md:text-[15px] mt-2 opacity-90 line-clamp-2">
            {slide.description}
          </p>
        )}
        {slide.ctaText && slide.ctaLink && (
          <div className="mt-4">
            <Link href={slide.ctaLink}
              className="inline-flex items-center px-6 py-2.5 bg-[#F4821F] hover:bg-[#e07010] text-white font-bold text-[13px] md:text-[14px] rounded-full transition-colors shadow-lg">
              {slide.ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────── Layout: IMAGE_ONLY ────────────────
function SlideImageOnly({ slide }: { slide: HeroSlide }) {
  const content = (
    <>
      <img src={slide.imageUrl} alt={slide.title}
        className="w-full h-auto block hidden md:block" />
      <img src={slide.mobileImageUrl || slide.imageUrl} alt={slide.title}
        className="w-full h-auto block md:hidden" />
    </>
  )
  return slide.ctaLink ? (
    <Link href={slide.ctaLink} aria-label={slide.title}>{content}</Link>
  ) : (
    <div>{content}</div>
  )
}