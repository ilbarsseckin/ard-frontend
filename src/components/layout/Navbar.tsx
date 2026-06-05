'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart, User, Sun, Moon, Search, ChevronDown, Heart,
  ArrowRight, Package, Sparkles, HelpCircle, Phone,
  FileText, Upload, BookOpen, Menu, X,
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useTheme } from './ThemeProvider'
import { useState, useRef, useEffect } from 'react'
import api from '@/lib/api'
import Logo from '@/components/ui/Logo'
import { useFavorites } from '@/hooks/useFavorites'

interface Category {
  id: string
  slug: string
  name: string
  icon?: string
  parentId?: string | null
  sortOrder?: number
  children?: Category[]
}

interface Product {
  id: string
  slug: string
  name: string
  shortDesc?: string
  categorySlug: string
  categoryName: string
  mainImageUrl?: string
  featured?: boolean
}

const topUtility = [
  { href: '/kampanyalar',                label: 'Kampanyalar',                  icon: Sparkles  },
  { href: '/nasil-siparis',              label: 'Nasıl Sipariş Verebilirim?',   icon: FileText  },
  { href: '/tasarim-yukleme',            label: 'Tasarım Yükleme ve Onay',      icon: Upload    },
  { href: '/tasarim-destegi',            label: 'Ücretsiz Tasarım Desteği',     icon: Sparkles  },
  { href: '/blog',                       label: 'Blog',                         icon: BookOpen  },
  { href: '/yardim',                     label: 'Yardım Merkezi',               icon: HelpCircle },
  { href: '/iletisim',                   label: 'İletişim',                     icon: Phone     },
]

const kurumsal = [
  { href: '/hakkimizda',       label: 'Hakkımızda' },
  { href: '/tarihce',          label: 'Tarihçe' },
  { href: '/insan-kaynaklari', label: 'İnsan Kaynakları' },
  { href: '/bayilik',          label: 'Bayimiz Olun' },
]

function getBadge(slug: string): { label: string; bg: string; color: string } | null {
  if (slug.startsWith('hizli-') || slug === 'acil-baski') {
    return { label: 'Acil', bg: '#DC2626', color: '#fff' }
  }
  if (slug.startsWith('yaldizli-') || slug.includes('yaldiz')) {
    return { label: 'Yaldızlı', bg: '#F59E0B', color: '#fff' }
  }
  return null
}

export default function Navbar() {
  const itemCount = useCartStore(s => s.items.length)
  const { favorites } = useFavorites()
  const favCount = favorites.length
  const { theme, toggle } = useTheme()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [search, setSearch] = useState('')
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [kurumsalOpen, setKurumsalOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const kurumsalRef = useRef<HTMLDivElement>(null)
  const megaTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    Promise.all([
      api.get('/api/catalog/categories/tree'),
      api.get('/api/catalog/products'),
    ]).then(([catRes, prodRes]) => {
      const raw: Category[] = catRes.data.data || []

      // Tree veya flat — her ikisini de düzleştir
      const flat: Category[] = []
      raw.forEach((cat) => {
        flat.push({ ...cat, parentId: cat.parentId ?? null })
        if (cat.children && cat.children.length > 0) {
          cat.children.forEach((child) => {
            flat.push({ ...child, parentId: cat.id })
          })
        }
      })

      const mainCats = flat.filter((c) => !c.parentId)
      setCategories(mainCats)
      setAllCategories(flat)
      setProducts(prodRes.data.data || [])

      // Debug — kaç adet ana + alt kategori var
      console.log('[Navbar] Ana kategori:', mainCats.length, '| Toplam:', flat.length)
    }).catch(err => console.error('Navbar veri yüklenemedi:', err))
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
  }

  const openMega = (slug: string) => {
    clearTimeout(megaTimer.current)
    setMegaOpen(slug)
  }

  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(null), 150)
  }

  const keepMega = () => clearTimeout(megaTimer.current)

  const activeKat = categories.find(k => k.slug === megaOpen)

  const subCats = activeKat
    ? allCategories
        .filter(c => c.parentId === activeKat.id)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  const subSlugs = subCats.map(c => c.slug)
  const megaProducts = megaOpen
    ? products.filter(p => p.categorySlug === megaOpen || subSlugs.includes(p.categorySlug))
    : []

  const featuredCards = megaProducts.filter(p => p.featured).slice(0, 8)
  const cardsList = featuredCards.length >= 4 ? featuredCards : megaProducts.slice(0, 8)

  // ÖNEMLİ: mega menü hover olduğunda her zaman açılsın — boş bile olsa
  const showMega = !!megaOpen

  return (
    <>
      <header className="sticky top-0 z-50">

        {/* ROW 1 */}
        <div className="hidden md:block"
          style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5 flex-wrap">
              {topUtility.map(l => (
                <Link key={l.href} href={l.href}
                  className="flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-[#F4821F] whitespace-nowrap"
                  style={{ color: 'var(--text-secondary)' }}>
                  <l.icon size={11} />
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={toggle}
                title={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}
                className="flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-orange-500/10"
                style={{ color: 'var(--text-muted)' }}>
                {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-[60px] md:h-[72px] flex items-center gap-3 md:gap-6">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Logo className="h-7 md:h-9" />
            </Link>
            {/* Arama — masaüstünde form, mobilde sadece ikon */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[640px]">
              <div className="relative">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Ne bastırmak istiyorsunuz?"
                  className="w-full pl-4 pr-12 py-3 text-[13px] rounded-xl outline-none transition-all"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
                <button type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: '#F4821F', color: 'white' }}>
                  <Search size={14} />
                </button>
              </div>
            </form>
            {/* Mobil arama ikonu — mobil menüde arama var */}
            <div className="md:hidden flex items-center gap-2 ml-auto">
              <Link href="/sepet" className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ border: '1px solid var(--border)' }}>
                <ShoppingCart size={15} style={{ color: 'var(--text-secondary)' }} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#F4821F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setMobileMenu(o => !o)}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ border: '1px solid var(--border)' }}>
                {mobileMenu ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Link href="/hesabim"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <User size={15} style={{ color: 'var(--text-secondary)' }} />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Üye Giriş</span>
                  <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>veya Üye Ol</span>
                </div>
              </Link>
              <Link href="/favorilerim"
                title={`${favCount} favori ürün`}
                className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <Heart size={15} fill={favCount > 0 ? '#F4821F' : 'none'}
                  style={{ color: favCount > 0 ? '#F4821F' : 'var(--text-secondary)' }} />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#F4821F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>
              <Link href="/sepet"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div className="relative">
                  <ShoppingCart size={15} style={{ color: 'var(--text-secondary)' }} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] px-1 bg-[#F4821F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Sepetim</span>
              </Link>
              <button onClick={() => setMobileMenu(o => !o)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ border: '1px solid var(--border)' }}>
                {mobileMenu ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* ROW 3 — KATEGORİ BAR */}
        <div className="hidden lg:block relative"
          style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-0.5">
            {categories.map((k, idx) => {
              const isActive = megaOpen === k.slug
              return (
                <div key={k.slug}
                  onMouseEnter={() => openMega(k.slug)}
                  onMouseLeave={closeMega}
                  className="relative h-full flex items-center">
                  {idx > 0 && !isActive && (
                    <div className="w-px h-4 mx-0.5" style={{ background: 'var(--border)' }} />
                  )}
                  <Link href={`/katalog/${k.slug}`}
                    className="relative flex items-center gap-1 text-[11.5px] font-bold px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
                    style={{
                      color: isActive ? '#fff' : 'var(--text-primary)',
                      background: isActive ? '#F4821F' : 'transparent',
                      boxShadow: isActive ? '0 2px 6px rgba(244,130,31,0.35)' : 'none',
                    }}>
                    <span className="text-[13px]">{k.icon}</span>
                    {k.name}
                    {isActive && (
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0"
                        style={{
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: '6px solid #F4821F',
                        }} />
                    )}
                  </Link>
                </div>
              )
            })}
            <div className="flex-1" />
            <div ref={kurumsalRef} className="relative flex-shrink-0">
              <button onClick={() => setKurumsalOpen(o => !o)}
                className="flex items-center gap-1 text-[11.5px] font-medium px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                style={{ color: 'var(--text-secondary)' }}>
                Kurumsal
                <ChevronDown size={11} className={`transition-transform duration-200 ${kurumsalOpen ? 'rotate-180' : ''}`} />
              </button>
              {kurumsalOpen && (
                <div className="absolute top-full right-0 mt-1 w-[180px] rounded-xl overflow-hidden shadow-lg z-50"
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
        </div>

        {/* MOBİL MENÜ */}
        {mobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 shadow-lg z-50"
            style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
            <div className="p-4 space-y-3">
              <Link href="/hesabim" onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: 'var(--bg-secondary)' }}>
                <User size={14} />
                <span className="text-[13px] font-bold">Üye Giriş / Üye Ol</span>
              </Link>
              <Link href="/sepet" onClick={() => setMobileMenu(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: 'var(--bg-secondary)' }}>
                <span className="flex items-center gap-2">
                  <ShoppingCart size={14} /> <span className="text-[13px] font-bold">Sepetim</span>
                </span>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F4821F] text-white text-[10px] font-bold">{itemCount}</span>
                )}
              </Link>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[1px] mb-2 mt-3" style={{ color: 'var(--text-muted)' }}>
                  Kategoriler
                </p>
                {categories.map(k => (
                  <Link key={k.slug} href={`/katalog/${k.slug}`}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px]"
                    style={{ color: 'var(--text-secondary)' }}>
                    {k.icon} {k.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════ MEGA MENÜ ════════════════════ */}
      {showMega && (
        <div
          className="fixed left-0 right-0 z-40 shadow-2xl"
          style={{
            top: 'calc(36px + 72px + 48px)',
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
          onMouseEnter={keepMega}
          onMouseLeave={closeMega}
        >
          <div className="max-w-7xl mx-auto px-6 py-7">

            <h3 className="text-[24px] font-black tracking-[-0.5px] mb-5"
              style={{ color: 'var(--text-primary)' }}>
              {activeKat?.icon} {activeKat?.name}
            </h3>

            {/* DURUM 1: Alt kategori VAR — solda 2 kolon liste + sağda 4 kolon kart */}
            {subCats.length > 0 && (
              <div className="flex gap-10">
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-2 gap-x-8">
                    {subCats.map(sub => {
                      const badge = getBadge(sub.slug)
                      return (
                        <Link key={sub.slug}
                          href={`/katalog/${sub.slug}`}
                          onClick={() => setMegaOpen(null)}
                          className="flex items-center justify-between py-2.5 text-[14px] font-medium border-b transition-colors hover:text-[#F4821F]"
                          style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                          <span>{sub.name}</span>
                          {badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ml-2"
                              style={{ background: badge.bg, color: badge.color }}>
                              {badge.label}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                  <Link href={`/katalog/${megaOpen}`}
                    onClick={() => setMegaOpen(null)}
                    className="inline-flex items-center gap-1.5 mt-5 text-[13px] font-bold transition-colors hover:text-[#F4821F]"
                    style={{ color: 'var(--text-primary)' }}>
                    Tüm Ürünler <ArrowRight size={13} />
                  </Link>
                </div>

                {cardsList.length > 0 && (
                  <div className="w-[560px] flex-shrink-0">
                    <div className="grid grid-cols-4 gap-3">
                      {cardsList.slice(0, 8).map(p => (
                        <Link key={p.slug} href={`/urun/${p.slug}`}
                          onClick={() => setMegaOpen(null)}
                          className="group flex flex-col rounded-xl overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div className="aspect-square overflow-hidden flex items-center justify-center"
                            style={{ background: 'var(--bg-secondary)' }}>
                            {p.mainImageUrl ? (
                              <img src={p.mainImageUrl} alt={p.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={e => (e.currentTarget.style.display = 'none')} />
                            ) : (
                              <Package size={28} className="opacity-30" />
                            )}
                          </div>
                          <p className="text-[11px] font-bold leading-tight text-center px-1.5 py-2 line-clamp-2"
                            style={{ color: 'var(--text-primary)' }}>
                            {p.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DURUM 2: Alt kategori YOK ama ürün VAR */}
            {subCats.length === 0 && cardsList.length > 0 && (
              <div className="flex gap-10">
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-x-6 gap-y-1.5 mb-5">
                    {megaProducts.slice(0, 12).map(p => (
                      <Link key={p.slug} href={`/urun/${p.slug}`}
                        onClick={() => setMegaOpen(null)}
                        className="text-[13px] py-1 transition-colors hover:text-[#F4821F]"
                        style={{ color: 'var(--text-secondary)' }}>
                        {p.name}
                      </Link>
                    ))}
                  </div>
                  <Link href={`/katalog/${megaOpen}`}
                    onClick={() => setMegaOpen(null)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold transition-colors hover:text-[#F4821F]"
                    style={{ color: 'var(--text-primary)' }}>
                    Tüm Ürünler <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}

            {/* DURUM 3: HİÇ İÇERİK YOK — uyarı göster */}
            {subCats.length === 0 && cardsList.length === 0 && (
              <div className="py-12 text-center">
                <Package size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Bu kategoride henüz ürün veya alt kategori yok.
                </p>
                <Link href={`/katalog/${megaOpen}`}
                  onClick={() => setMegaOpen(null)}
                  className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-bold transition-colors hover:text-[#F4821F]"
                  style={{ color: '#F4821F' }}>
                  Kategori sayfasını ziyaret et <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}