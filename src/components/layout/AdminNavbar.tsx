'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Printer, Package, ShoppingBag, LogOut, LayoutDashboard, Shield, Users, Star, Moon, Sun, Settings } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const allLinks = [
  { href: '/admin',             label: 'Dashboard',  icon: LayoutDashboard, perm: null,               adminOnly: false },
  { href: '/admin/urunler',     label: 'Ürünler',    icon: Package,         perm: 'urun.goruntule',   adminOnly: false },
  { href: '/admin/siparisler',  label: 'Siparişler', icon: ShoppingBag,     perm: 'siparis.goruntule',adminOnly: false },
  { href: '/admin/referanslar', label: 'Referanslar',icon: Star,            perm: 'referans.yonet',   adminOnly: false },
  { href: '/admin/roller',      label: 'Roller',     icon: Shield,          perm: null,               adminOnly: true  },
  { href: '/admin/ayarlar',     label: 'Ayarlar',    icon: Settings,        perm: null,               adminOnly: true  },
  { href: '/admin/kullanicilar',label: 'Kullanıcılar',icon: Users,          perm: null,               adminOnly: true  },
]

export default function AdminNavbar() {
  const initialized = useRef(false)
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [visibleLinks, setVisibleLinks] = useState<typeof allLinks>([])

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

      // ADMIN her şeyi görür
      if (userRole === 'ADMIN') {
        setVisibleLinks(allLinks)
        return
      }

      // OPERATOR — perm gerektirmeyen linkleri hemen göster
      setVisibleLinks(allLinks.filter(l => !l.adminOnly && !l.perm))

      // Sonra izinleri çek ve perm gerektirenleri ekle
      if (userId && token) {
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/roles/users/${userId}/permissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => {
          const perms = new Set<string>(res.data.data || [])
          setVisibleLinks(allLinks.filter(l => {
            if (l.adminOnly) return false        // admin-only: gizli
            if (!l.perm)     return true         // perm yok: her zaman görünür
            return perms.has(l.perm)             // perm var: izin kontrolü
          }))
        }).catch(() => {})
      }
    } catch {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('baski-auth')
    router.push('/giris')
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md"
      style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg-primary) 92%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-6 h-[56px] flex items-center justify-between">

        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#F4821F] flex items-center justify-center">
              <Printer size={13} className="text-white" />
            </div>
            <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Baskı<span className="text-[#F4821F]">Pro</span>
            </span>
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
          </div>
        </div>

        <div className="flex items-center gap-2">
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