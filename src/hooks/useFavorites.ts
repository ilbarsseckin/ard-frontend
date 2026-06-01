'use client'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'baski-favorites'
const MAX_FAVORITES = 50

function readStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function writeStorage(ids: string[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) }
  catch {}
}

/** Custom event — favoriler değişince tüm component'ler dinler */
const EVENT = 'baski-favorites-changed'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(readStorage())
    const handler = () => setFavorites(readStorage())
    window.addEventListener(EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const add = useCallback((productId: string) => {
    const current = readStorage()
    if (current.includes(productId)) return
    const next = [productId, ...current].slice(0, MAX_FAVORITES)
    writeStorage(next)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  const remove = useCallback((productId: string) => {
    const current = readStorage()
    const next = current.filter(id => id !== productId)
    writeStorage(next)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  const toggle = useCallback((productId: string) => {
    const current = readStorage()
    if (current.includes(productId)) {
      writeStorage(current.filter(id => id !== productId))
    } else {
      writeStorage([productId, ...current].slice(0, MAX_FAVORITES))
    }
    window.dispatchEvent(new Event(EVENT))
  }, [])

  const isFavorite = useCallback((productId: string) =>
    favorites.includes(productId), [favorites])

  return { favorites, add, remove, toggle, isFavorite }
}
