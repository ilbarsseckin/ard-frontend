'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LogOut, LayoutDashboard, Shield, Users, Star,
  Moon, Sun, Settings, ExternalLink, ChevronDown, FolderTree, Tag, Box,
  Home, Image as ImageIcon, ClipboardList, MessageSquare, Gift, Megaphone, Bell,
  MoreHorizontal,
} from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Logo from '@/components/ui/Logo'

const catalogLinks = [
  { href: '/admin/katalog/siparisler',  label: 'Siparişler',  icon: ClipboardList, desc: 'Gelen siparişler' },
  { href: '/admin/katalog/urunler',     label: 'Ürünler',     icon: Box,           desc: 'Katalog ürünleri' },
  { href: '/admin/katalog/kategoriler', label: 'Kategoriler', icon: FolderTree,    desc: 'Hiyerarşik kategoriler' },
  { href: '/admin/katalog/markalar',    label: 'Markalar',    icon: Tag,           desc: 'Marka tanımları' },
  { href: '/admin/katalog/yorumlar',    label: 'Yorumlar',    icon: MessageSquare, desc: 'Müşteri yorumları' },
]

const homeLinks = [
  { href: '/admin/anasayfa/hero', label: 'Hero Slider',    icon: ImageIcon, desc: 'Üst banner slideları' },
  { href: '/admin/duyurular',     label: 'Duyuru Bantları', icon: Bell,      desc: 'Üst bildirim şeritleri' },
  { href: '/admin/kampanyalar',   label: 'Kampanyalar',    icon: Megaphone,  desc: 'Kampanya yönetimi' },
]

const digerLinks = [
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users   },
  { href: '/admin/roller',       label: 'Roller',       icon: Shield  },
  { href: '/admin/referanslar',  label: 'Referanslar',  icon: Star    },
  { href: '/admin/bayiler',      label: 'Bayiler',      icon: Users   },
  { href: '/admin/ayarlar',      label: 'Ayarlar',      icon: Settings },
]

type DropdownKey = 'katalog' | 'anasayfa' | 'diger' | 'mobile' | null

export default function AdminNavbar() {
  const initialized = useRef(false)
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const router = useRouter()
  const [name, setName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState<DropdownKey>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    try {
      const stored = localStorage.getItem('baski-auth')
      if (!stored) return
      const { state } = JSON.parse(stored)
      setName(state?.user?.name || '')
      setIsAdmin(state?.user?.role === 'ADMIN')
    } catch {}
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle_ = (key: DropdownKey) => setOpen(o => o === key ? null : key)

  const handleLogout = () => {
    localStorage.removeItem('baski-auth')
    router.push('/giris')
  }

  const isCatalog = pathname.startsWith('/admin/katalog')
  const isHome = pathname.startsWith('/admin/anasayfa') || pathname.startsWith('/admin/duyurular') || pathname.startsWith('/admin/kampanyalar')
  const isDiger = digerLinks.some(l => pathname.startsWith(l.href))

  const activeStyle = { background: 'rgba(244,130,31,0.12)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.25)' }
  const inactiveStyle = { color: 'var(--text-secondary)', border: '1px solid transparent' }

  function DropdownMenu({ items, onClose }: { items: typeof catalogLinks; onClose: () => void }) {
    return (
      <div className="absolute top-full left-0 mt-2 w-[240px] rounded-xl overflow-hidden shadow-xl z-50"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {items.map(l => {
          const active = pathname === l.href || pathname.startsWith(l.href + '/')
          return (
            <Link key={l.href} href={l.href} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-orange-500/5"
              style={{ background: active ? 'rgba(244,130,31,0.06)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: active ? 'rgba(244,130,31,0.15)' : 'var(--bg-secondary)' }}>
                <l.icon size={13} style={{ color: active ? '#F4821F' : 'var(--text-muted)' }} />
              </div>
              <div>
                <p className="text-[12px] font-bold" style={{ color: active ? '#F4821F' : 'var(--text-primary)' }}>
                  {l.label}
                </p>
                {'desc' in l && (
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {(l as any).desc}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <nav ref={navRef} className="sticky top-0 z-50"
      style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-[54px] flex items-center justify-between gap-2">

        {/* Sol — logo + linkler */}
        <div className="flex items-center gap-1">
          <Link href="/admin" className="flex items-center gap-2 mr-2 flex-shrink-0">
            <Logo className="h-7" />
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-black hidden sm:block"
              style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}>
              Admin
            </span>
          </Link>

          {/* Masaüstü nav */}
          <div className="hidden md:flex items-center gap-0.5">

            {/* Dashboard */}
            <Link href="/admin"
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all"
              style={pathname === '/admin' ? activeStyle : inactiveStyle}>
              <LayoutDashboard size={13} />
              Dashboard
            </Link>

            {/* Katalog */}
            <div className="relative">
              <button onClick={() => toggle_('katalog')}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all"
                style={isCatalog || open === 'katalog' ? activeStyle : inactiveStyle}>
                <FolderTree size={13} />
                Katalog
                <ChevronDown size={10} className={`transition-transform ${open === 'katalog' ? 'rotate-180' : ''}`} />
              </button>
              {open === 'katalog' && <DropdownMenu items={catalogLinks} onClose={() => setOpen(null)} />}
            </div>

            {/* Kuponlar */}
            <Link href="/admin/kuponlar"
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all"
              style={pathname.startsWith('/admin/kuponlar') ? activeStyle : inactiveStyle}>
              <Gift size={13} />
              Kuponlar
            </Link>

            {/* Ana Sayfa */}
            <div className="relative">
              <button onClick={() => toggle_('anasayfa')}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all"
                style={isHome || open === 'anasayfa' ? activeStyle : inactiveStyle}>
                <Home size={13} />
                Vitrin
                <ChevronDown size={10} className={`transition-transform ${open === 'anasayfa' ? 'rotate-180' : ''}`} />
              </button>
              {open === 'anasayfa' && <DropdownMenu items={homeLinks} onClose={() => setOpen(null)} />}
            </div>

            {/* Diğer */}
            {isAdmin && (
              <div className="relative">
                <button onClick={() => toggle_('diger')}
                  className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all"
                  style={isDiger || open === 'diger' ? activeStyle : inactiveStyle}>
                  <MoreHorizontal size={13} />
                  Diğer
                  <ChevronDown size={10} className={`transition-transform ${open === 'diger' ? 'rotate-180' : ''}`} />
                </button>
                {open === 'diger' && <DropdownMenu items={digerLinks} onClose={() => setOpen(null)} />}
              </div>
            )}
          </div>

          {/* Mobil menü */}
          <div className="md:hidden">
            <button onClick={() => toggle_('mobile')}
              className="flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg"
              style={open === 'mobile' ? activeStyle : { border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              Menü <ChevronDown size={11} className={open === 'mobile' ? 'rotate-180' : ''} />
            </button>
            {open === 'mobile' && (
              <div className="absolute top-[54px] left-0 right-0 shadow-xl z-50 p-3"
                style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                <div className="grid grid-cols-2 gap-1.5">
                  <Link href="/admin" onClick={() => setOpen(null)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium"
                    style={{ background: pathname === '/admin' ? 'rgba(244,130,31,0.1)' : 'var(--bg-secondary)', color: pathname === '/admin' ? '#F4821F' : 'var(--text-secondary)' }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <Link href="/admin/kuponlar" onClick={() => setOpen(null)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium"
                    style={{ background: pathname.startsWith('/admin/kuponlar') ? 'rgba(244,130,31,0.1)' : 'var(--bg-secondary)', color: pathname.startsWith('/admin/kuponlar') ? '#F4821F' : 'var(--text-secondary)' }}>
                    <Gift size={14} /> Kuponlar
                  </Link>
                  {[...catalogLinks, ...homeLinks, ...digerLinks].map(l => (
                    <Link key={l.href} href={l.href} onClick={() => setOpen(null)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium"
                      style={{ background: pathname.startsWith(l.href) ? 'rgba(244,130,31,0.1)' : 'var(--bg-secondary)', color: pathname.startsWith(l.href) ? '#F4821F' : 'var(--text-secondary)' }}>
                      <l.icon size={14} /> {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sağ — kullanıcı */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link href="/" target="_blank"
            className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <ExternalLink size={11} /> Site
          </Link>

          {name && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black"
                style={{ background: '#F4821F' }}>
                {name.charAt(0).toUpperCase()}
              </div>
              {name.split(' ')[0]}
            </div>
          )}

          <button onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {theme === 'dark' ? <Sun size={13} className="text-[#F4821F]" /> : <Moon size={13} />}
          </button>

          <button onClick={handleLogout}
            className="flex items-center gap-1 text-[12px] px-2 py-1.5 rounded-lg hover:text-red-500 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut size={13} />
            <span className="hidden sm:block">Çıkış</span>
          </button>
        </div>
      </div>
    </nav>
  )
}