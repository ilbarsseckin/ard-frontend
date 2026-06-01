'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from 'lucide-react'

interface Props {
  images: string[]
  productName: string
  onZoomClick?: () => void   // büyüteç tıklanınca lightbox açmak için
}

export default function ProductImageGallery({ images, productName, onZoomClick }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [dragX, setDragX] = useState(0)         // anlık drag offset
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Boş veya tek görsel
  const safeImages = images && images.length > 0 ? images : ['/placeholder-product.png']
  const total = safeImages.length

  // ────────── İLERİ / GERİ ──────────
  const goNext = useCallback(() => {
    setActiveIdx(i => (i + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setActiveIdx(i => (i - 1 + total) % total)
  }, [total])

  // ────────── KLAVYE OK TUŞLARI ──────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  // ────────── MOUSE / TOUCH SWIPE ──────────
  const handleStart = (clientX: number) => {
    startXRef.current = clientX
    setIsDragging(true)
    setDragX(0)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const delta = clientX - startXRef.current
    setDragX(delta)
  }

  const handleEnd = () => {
    if (!isDragging) return
    const threshold = 60   // 60px üstü ise foto değişsin
    if (dragX > threshold) {
      goPrev()
    } else if (dragX < -threshold) {
      goNext()
    }
    setDragX(0)
    setIsDragging(false)
  }

  // Mouse event handler'lar
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }
  const onMouseUp = () => handleEnd()
  const onMouseLeave = () => { if (isDragging) handleEnd() }

  // Touch event handler'lar
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }
  const onTouchEnd = () => handleEnd()

  return (
    <div className="flex flex-col gap-3">

      {/* ─── ANA FOTO ─── */}
      <div
        ref={containerRef}
        className="relative aspect-square overflow-hidden rounded-2xl select-none"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          cursor: total > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={total > 1 ? onMouseDown : undefined}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={total > 1 ? onTouchStart : undefined}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Sürüklenen şerit */}
        <div
          className="flex h-full transition-transform"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(calc(-${activeIdx * (100 / total)}% + ${dragX}px))`,
            transitionDuration: isDragging ? '0ms' : '320ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {safeImages.map((src, i) => (
            <div key={i} className="flex-shrink-0 h-full flex items-center justify-center"
              style={{ width: `${100 / total}%` }}>
              <img
                src={src}
                alt={`${productName} - ${i + 1}`}
                className="max-w-full max-h-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* ─── ÖNCEKİ / SONRAKİ OK BUTONLARI (sadece 2+ foto varsa) ─── */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                color: '#333',
              }}
              aria-label="Önceki foto"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                color: '#333',
              }}
              aria-label="Sonraki foto"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* ─── BÜYÜTEÇ BUTONU (sağ alt) ─── */}
        {onZoomClick && (
          <button
            onClick={(e) => { e.stopPropagation(); onZoomClick() }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all hover:bg-opacity-100"
            style={{
              background: 'rgba(0,0,0,0.65)',
              color: '#fff',
              backdropFilter: 'blur(4px)',
            }}
          >
            <ZoomIn size={14} />
            Yakınlaştır
          </button>
        )}

        {/* ─── FOTO SAYACI (sol alt) ─── */}
        {total > 1 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{
              background: 'rgba(0,0,0,0.65)',
              color: '#fff',
              backdropFilter: 'blur(4px)',
            }}>
            {activeIdx + 1} / {total}
          </div>
        )}
      </div>

      {/* ─── KÜÇÜK ÖNİZLEMELER (THUMBNAILS) ─── */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'thin' }}>
          {safeImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all"
              style={{
                border: i === activeIdx ? '2px solid #F4821F' : '2px solid var(--border)',
                opacity: i === activeIdx ? 1 : 0.65,
                background: 'var(--bg-secondary)',
              }}
            >
              <img
                src={src}
                alt={`${productName} thumb ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}