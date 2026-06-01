'use client'
import { useEffect } from 'react'

const STORAGE_KEY = 'baski-recent-views'
const MAX_RECENT = 20

/**
 * Bir ürün sayfası açıldığında çağrılır — localStorage'a ekler.
 *
 * Kullanım (ürün detay sayfasında):
 *   useRecentView(product.id)
 */
export function useRecentView(productId?: string | null) {
  useEffect(() => {
    if (!productId || typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const current: string[] = raw ? JSON.parse(raw) : []
      // Varsa kaldır + en başa ekle (en son baktığı tepede olsun)
      const filtered = current.filter(id => id !== productId)
      filtered.unshift(productId)
      const next = filtered.slice(0, MAX_RECENT)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [productId])
}

/** Son baktıkların listesini okumak için */
export function getRecentViews(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
