'use client'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { Moon, Sun, ShoppingCart, User, Printer } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const itemCount = useCartStore(s => s.items.length)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/[0.07] dark:border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 h-[58px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
            <Printer size={16} className="text-[#F4821F]" />
          </div>
          <span className="text-[15px] font-medium tracking-[-0.4px] text-gray-900 dark:text-gray-100">
            BaskıPro
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { href: '/urunler', label: 'Ürünler' },
            { href: '/#calisimalar', label: 'Çalışmalar' },
            { href: '/#fabrika', label: 'Fabrika' },
            { href: '/#iletisim', label: 'İletişim' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="w-9 h-9 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          
          <Link href="/hesabim"
            className="w-9 h-9 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <User size={15} />
          </Link>

          <Link href="/sepet" className="relative w-9 h-9 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <ShoppingCart size={15} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4821F] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <Link href="/giris"
            className="text-[12px] text-gray-500 dark:text-gray-400 px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors ml-1">
            Giriş yap
          </Link>
          
          <Link href="/siparis"
            className="text-[12px] font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity ml-1">
            Sipariş ver
          </Link>
        </div>
      </div>
    </nav>
  )
}
