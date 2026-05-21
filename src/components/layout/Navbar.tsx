'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Printer, Sun, Moon, Search, ChevronDown, X } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useTheme } from './ThemeProvider'
import { useState, useRef, useEffect } from 'react'

const kurumsal = [
  { href: '/hakkimizda',       label: 'Hakkımızda' },
  { href: '/tarihce',          label: 'Tarihçe' },
  { href: '/insan-kaynaklari', label: 'İnsan Kaynakları' },
  { href: '/blog',             label: 'Blog' },
  { href: '/iletisim',         label: 'İletişim' },
]

const urunOneriler = [
  { label: 'Büyük format baskı', slug: 'buyuk-format-vinil' },
  { label: 'Kartvizit',          slug: 'kartvizit-350g' },
  { label: 'Sticker & etiket',   slug: 'sticker-genel' },
  { label: 'Tabela & levha',     slug: 'tabela-forex' },
  { label: 'Broşür & flyer',     slug: 'brosur-a5' },
  { label: 'Promosyon ürünleri', slug: 'promosyon-kupa' },
]

export default function Navbar() {
  const itemCount = useCartStore(s => s.items.length)
  const { theme, toggle } = useTheme()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [kurumsalOpen, setKurumsalOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const kurumsalRef = useRef<HTMLDivElement>(null)

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (kurumsalRef.current && !kurumsalRef.current.contains(e.target as Node)) {
        setKurumsalOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`/urunler?q=${encodeURIComponent(search.trim())}`)
    setSearch('')
    setSearchOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md"
      style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ background: 'color-mix(in srgb, var(--bg-primary) 92%, transparent)' }}
        className="absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-6 h-[62px] flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-[10px] bg-[#F4821F] flex items-center justify-center shadow-sm">
            <Printer size={15} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-[-0.5px]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
            Baskı<span className="text-[#F4821F]">Pro</span>
          </span>
        </Link>

        {/* Arama kutusu */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[420px]">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ne bastırmak istiyorsunuz?"
              className="w-full pl-9 pr-4 py-2.5 text-[13px] rounded-xl outline-none transition-all"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            />
            {/* Arama önerileri */}
            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden shadow-lg z-50"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-[1px]"
                    style={{ color: 'var(--text-muted)' }}>Popüler ürünler</p>
                </div>
                {urunOneriler.map(u => (
                  <Link key={u.slug} href={`/siparis?urun=${u.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-[#F4821F]/5"
                    onMouseDown={e => e.preventDefault()}>
                    <Search size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{u.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Nav linkleri */}
        <div className="hidden md:flex items-center gap-5 flex-shrink-0">
          <Link href="/urunler"
            className="text-[13px] font-medium transition-colors hover:text-[#F4821F]"
            style={{ color: 'var(--text-secondary)' }}>
            Ürünler
          </Link>

          <Link href="/#referanslar"
            className="text-[13px] font-medium transition-colors hover:text-[#F4821F]"
            style={{ color: 'var(--text-secondary)' }}>
            Referanslar
          </Link>

          {/* Kurumsal dropdown */}
          <div ref={kurumsalRef} className="relative">
            <button
              onClick={() => setKurumsalOpen(o => !o)}
              className="flex items-center gap-1 text-[13px] font-medium transition-colors hover:text-[#F4821F]"
              style={{ color: 'var(--text-secondary)' }}>
              Kurumsal
              <ChevronDown size={13} className={`transition-transform duration-200 ${kurumsalOpen ? 'rotate-180' : ''}`} />
            </button>

            {kurumsalOpen && (
              <div className="absolute top-full left-0 mt-2 w-[180px] rounded-xl overflow-hidden shadow-lg z-50"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {kurumsal.map(l => (
                  <Link key={l.href} href={l.href}
                    onClick={() => setKurumsalOpen(false)}
                    className="block px-4 py-2.5 text-[13px] transition-colors hover:bg-[#F4821F]/8 hover:text-[#F4821F]"
                    style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ aksiyonlar */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <button onClick={toggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}
            aria-label="Tema değiştir">
            {theme === 'dark' ? <Sun size={14} className="text-[#F4821F]" /> : <Moon size={14} />}
          </button>

          <Link href="/hesabim"
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
            <User size={14} />
          </Link>

          <Link href="/sepet"
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
            <ShoppingCart size={14} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4821F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <Link href="/giris"
            className="text-[12px] font-medium px-4 py-2 rounded-lg ml-1 transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
            Giriş yap
          </Link>

          <Link href="/siparis"
            className="text-[12px] font-bold bg-[#F4821F] text-white px-5 py-2 rounded-lg ml-1 hover:bg-[#e07010] transition-colors shadow-sm">
            Sipariş ver
          </Link>
        </div>
      </div>
    </nav>
  )
}