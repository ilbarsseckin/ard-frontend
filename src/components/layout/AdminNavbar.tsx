'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { Printer, Package, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Moon, Sun } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/urunler', label: 'Ürünler', icon: Package },
  { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingBag },
]

export default function AdminNavbar() {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()
  const { theme, toggle } = useTheme()
  const router = useRouter()

  const handleLogout = () => { logout(); router.push('/giris') }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/[0.07] dark:border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[7px] bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
              <Printer size={14} className="text-[#F4821F]" />
            </div>
            <span className="text-[13px] font-medium text-gray-900 dark:text-gray-100">BaskıPro</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4821F]/10 text-[#F4821F] font-medium">Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg transition-colors ${pathname === l.href ? 'bg-gray-100 dark:bg-white/[0.08] text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}>
                <l.icon size={13} />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">{user?.name}</span>
          <button onClick={toggle} className="w-8 h-8 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400">
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5">
            <LogOut size={13} /> Çıkış
          </button>
        </div>
      </div>
    </nav>
  )
}
