'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Clock, ChevronRight, Package } from 'lucide-react'
import api from '@/lib/api'

interface Category {
  id: string
  slug: string
  name: string
  icon?: string
}

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categorySlug: string
  categoryName: string
  mainImageUrl?: string
  tiers?: Array<{ priceUsd: number }>
}

interface Props {
  open: boolean
  onClose: () => void
  categories: Category[]
  allProducts: Product[]
}

const HISTORY_KEY = 'baski-search-history'

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

function saveHistory(q: string) {
  const prev = getHistory().filter(h => h !== q)
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...prev].slice(0, 6)))
}

function removeHistory(q: string) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(h => h !== q)))
}

export default function SearchOverlay({ open, onClose, categories, allProducts }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>([])

  // Ürün sonuçları
  const results = query.trim().length >= 2
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  // Kategori sonuçları
  const catResults = query.trim().length >= 2
    ? categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : categories.slice(0, 7)

  useEffect(() => {
    if (open) {
      setHistory(getHistory())
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      setQuery('')
    }
  }, [open])

  // ESC ile kapat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Scroll kilitle
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSearch = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    saveHistory(trimmed)
    router.push(`/urunler?q=${encodeURIComponent(trimmed)}`)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>

      <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-10 mx-4 rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', maxHeight: 'calc(100vh - 80px)' }}
        onClick={e => e.stopPropagation()}>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <Search size={18} style={{ color: '#F4821F', flexShrink: 0 }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Ara..."
            className="flex-1 text-[15px] outline-none bg-transparent"
            style={{ color: 'var(--text-primary)' }} />
          {query && (
            <button type="button" onClick={() => setQuery('')}
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
              <X size={12} />
            </button>
          )}
          <button type="button" onClick={onClose}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ESC
          </button>
        </form>

        {/* Geçmiş aramalar */}
        {!query && history.length > 0 && (
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {history.map(h => (
                <button key={h} onClick={() => handleSearch(h)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium transition-all hover:opacity-80"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                  <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                  {h}
                  <span onClick={e => { e.stopPropagation(); removeHistory(h); setHistory(getHistory()) }}
                    className="ml-1 opacity-50 hover:opacity-100">
                    <X size={10} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* İçerik — scrollable */}
        <div className="overflow-y-auto flex-1 pb-4">

          {/* Kategoriler */}
          <div className="px-4 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-2 flex items-center gap-1.5"
              style={{ color: 'var(--text-muted)' }}>
              <span>☰</span> Kategoriler
            </p>
            <div className="space-y-0.5">
              {catResults.map(cat => (
                <Link key={cat.slug} href={`/katalog/${cat.slug}`} onClick={onClose}
                  className="flex items-center justify-between px-2 py-2 rounded-xl text-[13px] font-medium transition-all hover:bg-orange-500/8 group"
                  style={{ color: query ? '#F4821F' : 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-2">
                    {cat.icon && <span className="text-[14px]">{cat.icon}</span>}
                    {cat.name}
                  </span>
                  <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#F4821F' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Ürün sonuçları */}
          {results.length > 0 && (
            <div className="px-4 mt-5">
              <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3"
                style={{ color: 'var(--text-muted)' }}>
                En çok satanlar
              </p>
              <div className="space-y-2">
                {results.map(p => (
                  <Link key={p.slug} href={`/urun/${p.slug}`} onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-orange-500/5 group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      {p.mainImageUrl
                        ? <img src={p.mainImageUrl} alt={p.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <Package size={18} style={{ color: 'var(--text-muted)' }} />
                          </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate group-hover:text-[#F4821F] transition-colors"
                        style={{ color: 'var(--text-primary)' }}>
                        {p.name}
                      </p>
                      {p.shortDesc && (
                        <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {p.shortDesc}
                        </p>
                      )}
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Kategori <span style={{ color: '#F4821F' }}>{p.categoryName}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {results.length >= 8 && (
                <button onClick={() => handleSearch(query)}
                  className="mt-3 w-full py-2 text-[12px] font-bold rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                  Tüm sonuçları gör →
                </button>
              )}
            </div>
          )}

          {/* Sonuç yok */}
          {query.trim().length >= 2 && results.length === 0 && (
            <div className="px-4 mt-6 text-center py-6">
              <Package size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                "<span style={{ color: 'var(--text-primary)' }}>{query}</span>" için sonuç bulunamadı
              </p>
              <button onClick={() => handleSearch(query)}
                className="mt-3 text-[12px] font-bold text-[#F4821F] hover:underline">
                Yine de ara →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
