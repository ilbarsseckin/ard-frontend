'use client'
import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageItem {
  id: string
  url: string
  altText?: string
}

interface Props {
  images: ImageItem[]
  startIdx: number
  onClose: () => void
}

export default function ImageLightbox({ images, startIdx, onClose }: Props) {
  const [idx, setIdx] = useState(startIdx)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') setIdx(i => Math.max(0, i - 1))
      else if (e.key === 'ArrowRight') setIdx(i => Math.min(images.length - 1, i + 1))
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  const current = images[idx]
  if (!current) return null

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(images.length - 1, i + 1))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 text-white">
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={prev} disabled={idx === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed">
            <ChevronLeft size={28} />
          </button>
          <button onClick={next} disabled={idx === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed">
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <img src={current.url} alt={current.altText || 'Ürün resmi'}
        className="max-w-[92vw] max-h-[88vh] object-contain"
        onClick={e => e.stopPropagation()} />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-white text-[12px] font-medium px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            {idx + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  )
}
