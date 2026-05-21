'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Printer, Sun, Moon, Search, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useTheme } from './ThemeProvider'
import { useState, useRef, useEffect } from 'react'
import { productApi } from '@/lib/api'

const KATEGORILER = [
  { slug: 'kartvizit',    label: 'Kartvizit',      icon: '🪪' },
  { slug: 'buyuk-format', label: 'Büyük Format',   icon: '🖼️' },
  { slug: 'sticker',      label: 'Sticker',         icon: '🏷️' },
  { slug: 'tabela',       label: 'Tabela',          icon: '🪧' },
  { slug: 'brosur',       label: 'El İlanı - Broşür', icon: '📄' },
  { slug: 'promosyon',    label: 'Promosyon',       icon: '🎁' },
]

const kurumsal = [
  { href: '/hakkimizda',       label: 'Hakkımızda' },
  { href: '/tarihce',          label: 'Tarihçe' },
  { href: '/insan-kaynaklari', label: 'İnsan Kaynakları' },
  { href: '/bayilik', label: 'Bayimiz Olun' },
  { href: '/blog',             label: 'Blog' },
  { href: '/iletisim',         label: 'İletişim' },
]

function kategoriFromSlug(slug: string) {
  for (const k of KATEGORILER) {
    if (slug.startsWith(k.slug)) return k.slug
  }
  return null
}

export default function Navbar() {
  const itemCount = useCartStore(s => s.items.length)
  const { theme, toggle } = useTheme()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [kurumsalOpen, setKurumsalOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const kurumsalRef = useRef<HTMLDivElement>(null)
  const megaRef = useRef<HTMLDivElement>(null)
  const megaTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    productApi.list().then(r => setProducts(r.data.data || [])).catch(() => {})
  }, [])

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

  const openMega = (slug: string) => {
    clearTimeout(megaTimer.current)
    setMegaOpen(slug)
  }

  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(null), 150)
  }

  const keepMega = () => clearTimeout(megaTimer.current)

  // Seçili kategorinin ürünleri
  const megaProducts = megaOpen
    ? products.filter(p => kategoriFromSlug(p.slug) === megaOpen)
    : []

  const activeKat = KATEGORILER.find(k => k.slug === megaOpen)

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ background: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)' }}
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

          {/* Arama */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[380px]">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ne bastırmak istiyorsunuz?"
                className="w-full pl-9 pr-4 py-2.5 text-[13px] rounded-xl outline-none transition-all"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              />
              {searchOpen && search.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden shadow-lg z-50"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-[1px]"
                      style={{ color: 'var(--text-muted)' }}>Popüler kategoriler</p>
                  </div>
                  {KATEGORILER.map(k => (
                    <Link key={k.slug} href={`/urunler`}
                      className="flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-[#F4821F]/5"
                      onMouseDown={e => e.preventDefault()}>
                      <span className="text-[14px]">{k.icon}</span>
                      <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{k.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Kategori linkleri — mega menü */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {KATEGORILER.map(k => (
              <div key={k.slug}
                onMouseEnter={() => openMega(k.slug)}
                onMouseLeave={closeMega}
                className="relative">
                <button
                  className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                  style={{
                    color: megaOpen === k.slug ? '#F4821F' : 'var(--text-secondary)',
                    background: megaOpen === k.slug ? 'rgba(244,130,31,0.08)' : 'transparent'
                  }}>
                  {k.label}
                  <ChevronDown size={11} className={`transition-transform duration-200 ${megaOpen === k.slug ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}

            {/* Kurumsal */}
            <div ref={kurumsalRef} className="relative">
              <button
                onClick={() => setKurumsalOpen(o => !o)}
                className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}>
                Kurumsal
                <ChevronDown size={11} className={`transition-transform duration-200 ${kurumsalOpen ? 'rotate-180' : ''}`} />
              </button>
              {kurumsalOpen && (
                <div className="absolute top-full left-0 mt-2 w-[180px] rounded-xl overflow-hidden shadow-lg z-50"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {kurumsal.map(l => (
                    <Link key={l.href} href={l.href}
                      onClick={() => setKurumsalOpen(false)}
                      className="block px-4 py-2.5 text-[13px] transition-colors hover:text-[#F4821F]"
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
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
              {theme === 'dark' ? <Sun size={13} className="text-[#F4821F]" /> : <Moon size={13} />}
            </button>
            <Link href="/hesabim"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
              <User size={13} />
            </Link>
            <Link href="/sepet"
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
              <ShoppingCart size={13} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4821F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link href="/giris"
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg ml-1 transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
              Giriş
            </Link>
            <Link href="/siparis"
              className="text-[12px] font-bold bg-[#F4821F] text-white px-4 py-1.5 rounded-lg hover:bg-[#e07010] transition-colors">
              Sipariş ver
            </Link>
          </div>
        </div>
      </nav>

      {/* MEGA MENÜ — navbar dışında tam genişlik */}
      {megaOpen && (
        <div
          className="fixed left-0 right-0 z-40 shadow-xl"
          style={{
            top: 62,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
          }}
          onMouseEnter={keepMega}
          onMouseLeave={closeMega}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex gap-8">

            {/* Sol — kategori listesi */}
            <div className="w-[220px] flex-shrink-0" style={{ borderRight: '1px solid var(--border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] mb-3"
                style={{ color: 'var(--text-muted)' }}>
                {activeKat?.icon} {activeKat?.label}
              </p>
              <div className="space-y-0.5 pr-4">
                {megaProducts.map(p => (
                  <Link key={p.id}
                    href={`/siparis?urun=${p.slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors hover:bg-[#F4821F]/8 hover:text-[#F4821F] group"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setMegaOpen(null)}
                  >
                    <span>{p.name}</span>
                  </Link>
                ))}
                <Link href="/urunler"
                  className="flex items-center px-3 py-2 text-[12px] font-semibold text-[#F4821F] hover:underline mt-2"
                  onClick={() => setMegaOpen(null)}>
                  Tüm ürünler →
                </Link>
              </div>
            </div>

            {/* Sağ — ürün grid kartlar */}
            <div className="flex-1">
              <div className="grid grid-cols-4 gap-3">
                {megaProducts.slice(0, 8).map(p => (
                  <Link key={p.id}
                    href={`/siparis?urun=${p.slug}`}
                    className="group flex flex-col items-center text-center p-3 rounded-xl transition-all hover:shadow-md"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
                    onClick={() => setMegaOpen(null)}
                  >
                    {/* Ürün ikonu */}
                   <div className="w-16 h-16 rounded-lg overflow-hidden mb-2 flex items-center justify-center"
  style={{ background: 'var(--bg-card)' }}>
  {p.imageUrl
    ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
    : <span className="text-[32px]">{activeKat?.icon}</span>
  }
</div>
                    <p className="text-[12px] font-medium leading-tight"
                      style={{ color: 'var(--text-primary)' }}>
                      {p.name}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Min. {p.minOrder} {p.unit}
                    </p>
                    <span className="mt-2 text-[10px] font-semibold text-[#F4821F] opacity-0 group-hover:opacity-100 transition-opacity">
                      Sipariş ver →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}