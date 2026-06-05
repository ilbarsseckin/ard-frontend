'use client'

import { useEffect, useMemo, useState } from 'react'
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
    let mounted = true

    api
      .get('/api/hero-slides')
      .then((res) => {
        if (mounted) setSlides(res.data?.data || [])
      })
      .catch(() => {
        if (mounted) setSlides([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (paused || slides.length < 2) return

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, AUTO_ROTATE_MS)

    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  const slide = slides[current]

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const showControls = slides.length > 1

  if (loading) {
    return <HeroSkeleton />
  }

  if (!slide) return null

  return (
    <section
      className="relative w-full overflow-hidden rounded-[28px] bg-[var(--bg-secondary)] shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroSlideView slide={slide} />

      {showControls && (
        <>
          <CarouselButton direction="prev" onClick={goPrev} />
          <CarouselButton direction="next" onClick={goNext} />

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                aria-label={`${index + 1}. slayta git`}
                onClick={() => setCurrent(index)}
                className={[
                  'h-2 rounded-full transition-all duration-300',
                  index === current
                    ? 'w-9 bg-[#F4821F]'
                    : 'w-2.5 bg-white/70 hover:bg-white',
                ].join(' ')}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function HeroSlideView({ slide }: { slide: HeroSlide }) {
  if (slide.layout === 'IMAGE_ONLY') {
    return <ImageOnlySlide slide={slide} />
  }

  if (slide.layout === 'OVERLAY') {
    return <OverlaySlide slide={slide} />
  }

  return (
    <SplitSlide
      slide={slide}
      reverse={slide.layout === 'SPLIT_RIGHT'}
    />
  )
}

function SplitSlide({
  slide,
  reverse,
}: {
  slide: HeroSlide
  reverse: boolean
}) {
  const background = slide.backgroundColor || 'var(--bg-secondary)'

  return (
    <div
      className="grid min-h-[360px] grid-cols-1 md:min-h-[430px] md:grid-cols-2"
      style={{ background }}
    >
      <div
        className={[
          'flex flex-col justify-center px-5 py-7 md:px-12 lg:px-16',
          reverse ? 'md:order-2' : '',
        ].join(' ')}
      >
        <SlideText slide={slide} dark={false} />
      </div>

      <div
        className={[
          'relative min-h-[220px] overflow-hidden md:min-h-full',
          reverse ? 'md:order-1' : '',
        ].join(' ')}
      >
        <SlideImage slide={slide} fill />
      </div>
    </div>
  )
}

function OverlaySlide({ slide }: { slide: HeroSlide }) {
  return (
    <div className="relative min-h-[360px] md:min-h-[430px]">
      <SlideImage slide={slide} fill />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

      <div className="absolute inset-0 z-10 flex max-w-3xl flex-col justify-end px-5 py-8 md:px-12 md:py-12 lg:px-16">
        <SlideText slide={slide} dark />
      </div>
    </div>
  )
}

function ImageOnlySlide({ slide }: { slide: HeroSlide }) {
  const content = (
    <div className="relative">
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={slide.mobileImageUrl || slide.imageUrl}
        />
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="block w-full object-cover"
        />
      </picture>
    </div>
  )

  if (!slide.ctaLink) return content

  return (
    <Link href={slide.ctaLink} aria-label={slide.title}>
      {content}
    </Link>
  )
}

function SlideText({
  slide,
  dark,
}: {
  slide: HeroSlide
  dark: boolean
}) {
  const textColor = dark ? 'text-white' : 'text-[var(--text-primary)]'
  const mutedColor = dark ? 'text-white/80' : 'text-black/60'

  return (
    <div className="max-w-xl">
      {slide.label && (
        <p className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${mutedColor}`}>
          {slide.label}
        </p>
      )}

      <h2 className={`text-3xl font-black leading-[1.05] tracking-[-0.04em] md:text-5xl ${textColor}`}>
        {slide.title}
      </h2>

      {slide.description && (
        <p className={`mt-4 line-clamp-3 text-sm leading-6 md:text-base ${mutedColor}`}>
          {slide.description}
        </p>
      )}

      {slide.ctaText && slide.ctaLink && (
        <Link
          href={slide.ctaLink}
          className="mt-7 inline-flex rounded-full bg-[#F4821F] px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#e07010]"
        >
          {slide.ctaText}
        </Link>
      )}
    </div>
  )
}

function SlideImage({
  slide,
  fill = false,
}: {
  slide: HeroSlide
  fill?: boolean
}) {
  return (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet={slide.mobileImageUrl || slide.imageUrl}
      />
      <img
        src={slide.imageUrl}
        alt={slide.title}
        className={
          fill
            ? 'absolute inset-0 h-full w-full object-cover'
            : 'block h-auto w-full object-cover'
        }
      />
    </picture>
  )
}

function CarouselButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  const isPrev = direction === 'prev'

  return (
    <button
      type="button"
      aria-label={isPrev ? 'Önceki slayt' : 'Sonraki slayt'}
      onClick={onClick}
      className={[
        'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white md:flex',
        isPrev ? 'left-4' : 'right-4',
      ].join(' ')}
    >
      {isPrev ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  )
}

function HeroSkeleton() {
  return (
    <div className="h-[260px] w-full animate-pulse rounded-[28px] bg-[var(--bg-secondary)] md:h-[430px]" />
  )
}