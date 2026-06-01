'use client'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  productId: string
  productName?: string
  /** Boyut: 'sm' (28px) | 'md' (36px) | 'lg' (44px) */
  size?: 'sm' | 'md' | 'lg'
  /** Konumlandırma — kart üstüne mutlak yerleşim için */
  absolute?: boolean
  className?: string
}

const SIZES = {
  sm: { box: 28, icon: 13 },
  md: { box: 36, icon: 16 },
  lg: { box: 44, icon: 20 },
}

export default function FavoriteButton({
  productId, productName, size = 'md', absolute = false, className = '',
}: Props) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(productId)
  const s = SIZES[size]

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()   // Link içindeyse navigate olmasın
    e.stopPropagation()
    toggle(productId)
    if (!fav) {
      toast.success(productName ? `${productName} favorilere eklendi` : 'Favorilere eklendi')
    } else {
      toast(productName ? `${productName} favorilerden çıkarıldı` : 'Favorilerden çıkarıldı', { icon: '💔' })
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className={`${absolute ? 'absolute top-2 right-2 z-10' : ''} rounded-full flex items-center justify-center transition-all hover:scale-110 ${className}`}
      style={{
        width: s.box,
        height: s.box,
        background: fav ? '#F4821F' : 'rgba(255,255,255,0.95)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        color: fav ? 'white' : '#1a1a1a',
      }}>
      <Heart size={s.icon}
        fill={fav ? 'currentColor' : 'none'}
        strokeWidth={2.2} />
    </button>
  )
}
