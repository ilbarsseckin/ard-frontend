'use client'
import { useEffect, useRef, useCallback } from 'react'
import api from '@/lib/api'

const STORAGE_KEY = 'admin-last-order-check'
const CUSTOM_SOUND_KEY = 'admin-notification-sound'
const DEFAULT_SOUND = '/sounds/new-order.mp3'

/**
 * Admin paneli yeni sipariş ses bildirimi hook'u.
 * Her `intervalMs` ms'de bir /api/admin/catalog/orders endpoint'ini sorgular.
 * Son kontrol tarihinden sonra yeni sipariş geldiyse ses çalar.
 */
export function useNewOrderAlert(intervalMs = 30000) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastCountRef = useRef<number>(-1)
  const lastCheckRef = useRef<string>(
    localStorage.getItem(STORAGE_KEY) || new Date().toISOString()
  )

  const getSound = useCallback((): string => {
    try {
      const custom = localStorage.getItem(CUSTOM_SOUND_KEY)
      return custom || DEFAULT_SOUND
    } catch {
      return DEFAULT_SOUND
    }
  }, [])

  const playSound = useCallback(() => {
    try {
      const src = getSound()
      if (!audioRef.current || audioRef.current.src !== window.location.origin + src) {
        audioRef.current = new Audio(src)
        audioRef.current.volume = 0.8
      }
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => {
        // Tarayıcı otomatik oynatmayı engelleyebilir — kullanıcı etkileşimi gerekebilir
        console.warn('Ses çalınamadı:', e.message)
      })
    } catch (e) {
      console.warn('Ses hatası:', e)
    }
  }, [getSound])

  const check = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/catalog/orders')
      const orders: any[] = res.data.data || []
      const newCount = orders.length

      // İlk yüklemede sadece sayıyı kaydet, ses çalma
      if (lastCountRef.current === -1) {
        lastCountRef.current = newCount
        return
      }

      // Yeni sipariş geldi mi?
      if (newCount > lastCountRef.current) {
        const diff = newCount - lastCountRef.current
        playSound()
        // Toast benzeri bildirim — window.dispatchEvent ile global event
        window.dispatchEvent(new CustomEvent('new-orders', { detail: { count: diff } }))
        lastCountRef.current = newCount
        localStorage.setItem(STORAGE_KEY, new Date().toISOString())
      } else {
        lastCountRef.current = newCount
      }
    } catch {
      // Sessizce geç
    }
  }, [playSound])

  useEffect(() => {
    // Sayfa odaklanınca hemen kontrol et
    check()
    const interval = setInterval(check, intervalMs)
    const onFocus = () => check()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [check, intervalMs])
}

/** Özel ses URL'ini kaydet */
export function setCustomSound(dataUrl: string) {
  localStorage.setItem(CUSTOM_SOUND_KEY, dataUrl)
}

/** Özel sesi sil, varsayılana dön */
export function resetSound() {
  localStorage.removeItem(CUSTOM_SOUND_KEY)
}

/** Sesi test et */
export function testSound() {
  const src = localStorage.getItem(CUSTOM_SOUND_KEY) || DEFAULT_SOUND
  const audio = new Audio(src)
  audio.volume = 0.8
  audio.play().catch(() => {})
}
