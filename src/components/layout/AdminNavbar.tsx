'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

import {
  Package, ShoppingBag, LogOut, LayoutDashboard, Shield, Users, Star,
  Moon, Sun, Settings, ExternalLink, ChevronDown, FolderTree, Tag, Box,
  Home, Image as ImageIcon, ClipboardList, MessageSquare, Gift, Megaphone,
} from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Logo from '@/components/ui/Logo'

const allLinks = [
  { href: '/admin',              label: 'Dashboard',   icon: LayoutDashboard, perm: null,                adminOnly: false },
  { href: '/admin/urunler',      label: 'Ürünler',     icon: Package,         perm: 'urun.goruntule',    adminOnly: false },
  { href: '/admin/kuponlar',     label: 'Kuponlar',    icon: Gift,            perm: null,                adminOnly: true  },
  { href: '/admin/kampanyalar',  label: 'Kampanyalar', icon: Megaphone,       perm: null,                adminOnly: true  },
  { href: '/admin/referanslar',  label: 'Referanslar', icon: Star,            perm: 'referans.yonet',    adminOnly: false },
  { href: '/admin/roller',       label: 'Roller',      icon: Shield,          perm: null,                adminOnly: true  },
  { href: '/admin/ayarlar',      label: 'Ayarlar',     icon: Settings,        perm: null,                adminOnly: true  },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar',icon: Users,           perm: null,                adminOnly: true  },
  { href: '/admin/bayiler',      label: 'Bayiler',     icon: Users,           perm: null,                adminOnly: false },
]

const catalogLinks = [
  { href: '/admin/katalog/kategoriler', label: 'Kategoriler', icon: FolderTree,    desc: 'Hiyerarşik kategoriler' },
  { href: '/admin/katalog/markalar',    label: 'Markalar',    icon: Tag,           desc: 'Marka tanımları' },
  { href: '/admin/katalog/urunler',     label: 'Ürünler',     icon: Box,           desc: 'Katalog ürünleri' },
  { href: '/admin/katalog/siparisler',  label: 'Siparişler',  icon: ClipboardList, desc: 'Gelen siparişler' },
  { href: '/admin/katalog/yorumlar',    label: 'Yorumlar',    icon: MessageSquare, desc: 'Müşteri yorumları' },
]

const homeLinks = [
  { href: '/admin/anasayfa/hero', label: 'Hero Slider', icon: ImageIcon, desc: 'Üst banner slide\'ları' },
]

export default function AdminNavbar() {
  const initialized = useRef(false)
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [visibleLinks, setVisibleLinks] = useState<typeof allLinks>([])

  const [catalogOpen, setCatalogOpen] = useState(false)
  const catalogRef = useRef<HTMLDivElement>(null)

  const [homeOpen, setHomeOpen] = useState(false)
  const homeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    try {
      const stored = localStorage.getItem('baski-auth')
      if (!stored) return
      const { state } = JSON.parse(stored)
      const userRole = state?.user?.role || ''
      const userId   = state?.user?.id   || ''
      const token    = state?.token      || ''

      setName(state?.user?.name || '')

      if (userRole === 'ADMIN') {
        setVisibleLinks(allLinks)
        return
      }

      setVisibleLinks(allLinks.filter(l => !l.adminOnly && !l.perm))

      if (userId && token) {
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/roles/users/${userId}/permissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => {
          const perms = new Set<string>(res.data.data || [])
          setVisibleLinks(allLinks.filter(l => {
            if (l.adminOnly) return false
            if (!l.perm)     return true
            return perms.has(l.perm)
          }))
        }).catch(() => {})
      }
    } catch {}
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setCatalogOpen(false)
      }
      if (homeRef.current && !homeRef.current.contains(e.target as Node)) {
        setHomeOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('baski-auth')
    router.push('/giris')
  }

  const isCatalogPath = pathname.startsWith('/admin/katalog')
  const isHomePath = pathname.startsWith('/admin/anasayfa')

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md"
      style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg-primary) 92%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-6 h-[56px] flex items-center justify-between">

        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="h-7" />
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}>
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-0.5">
            {visibleLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg transition-colors font-medium"
                style={pathname === l.href
                  ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.2)' }
                  : { color: 'var(--text-secondary)', border: '1px solid transparent' }}>
                <l.icon size={13} />
                {l.label}
              </Link>
            ))}

            {/* ─── KATALOG DROPDOWN ─── */}
            <div ref={catalogRef} className="relative">
              <button onClick={() => { setCatalogOpen(o => !o); setHomeOpen(false) }}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg transition-colors font-medium"
                style={isCatalogPath
                  ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.2)' }
                  : { color: 'var(--text-secondary)', border: '1px solid transparent' }}>
                <FolderTree size={13} />
                Katalog
                <ChevronDown size={11} className={`transition-transform duration-200 ${catalogOpen ? 'rotate-180' : ''}`} />
              </button>

              {catalogOpen && (
                <div className="absolute top-full left-0 mt-2 w-[260px] rounded-xl overflow-hidden shadow-lg z-50"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {catalogLinks.map(l => {
                    const active = pathname === l.href || pathname.startsWith(l.href + '/')
                    return (
                      <Link key={l.href} href={l.href}
                        onClick={() => setCatalogOpen(false)}
                        className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-orange-500/5"
                        style={{
                          background: active ? 'rgba(244,130,31,0.06)' : 'transparent',
                          borderBottom: '1px solid var(--border)',
                        }}>
                        <l.icon size={14}
                          style={{ color: active ? '#F4821F' : 'var(--text-muted)', marginTop: 2 }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold leading-tight"
                            style={{ color: active ? '#F4821F' : 'var(--text-primary)' }}>
                            {l.label}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {l.desc}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ─── ANA SAYFA DROPDOWN ─── */}
            <div ref={homeRef} className="relative">
              <button onClick={() => { setHomeOpen(o => !o); setCatalogOpen(false) }}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg transition-colors font-medium"
                style={isHomePath
                  ? { background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.2)' }
                  : { color: 'var(--text-secondary)', border: '1px solid transparent' }}>
                <Home size={13} />
                Ana Sayfa
                <ChevronDown size={11} className={`transition-transform duration-200 ${homeOpen ? 'rotate-180' : ''}`} />
              </button>

              {homeOpen && (
                <div className="absolute top-full left-0 mt-2 w-[260px] rounded-xl overflow-hidden shadow-lg z-50"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {homeLinks.map(l => {
                    const active = pathname === l.href || pathname.startsWith(l.href + '/')
                    return (
                      <Link key={l.href} href={l.href}
                        onClick={() => setHomeOpen(false)}
                        className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-orange-500/5"
                        style={{
                          background: active ? 'rgba(244,130,31,0.06)' : 'transparent',
                          borderBottom: '1px solid var(--border)',
                        }}>
                        <l.icon size={14}
                          style={{ color: active ? '#F4821F' : 'var(--text-muted)', marginTop: 2 }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold leading-tight"
                            style={{ color: active ? '#F4821F' : 'var(--text-primary)' }}>
                            {l.label}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {l.desc}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/urunler"
            className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            <ExternalLink size={11} />
            Siteye dön
          </Link>

          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{name}</span>

          <button onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface)' }}>
            {theme === 'dark' ? <Sun size={13} className="text-[#F4821F]" /> : <Moon size={13} />}
          </button>

          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-[12px] px-2 py-1.5 rounded-lg transition-colors hover:text-red-500"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut size={13} /> Çıkış
          </button>
        </div>
      </div>
    </nav>
  )
}