import Link from 'next/link'
import { Printer, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-black/[0.07] dark:border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-[7px] bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
                <Printer size={13} className="text-[#F4821F]" />
              </div>
              <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100">BaskıPro</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-[180px]">
              Türkiye'nin en hızlı online matbaa platformu. Kaliteli baskı, hızlı teslimat.
            </p>
            <div className="flex gap-2 mt-4">
              {[Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="w-7 h-7 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-[#F4821F] transition-colors">
                  <Icon size={13} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400 tracking-[1px] mb-3 uppercase">Ürünler</p>
            {['Vinil baskı', 'Kartvizit', 'Tabela', 'Sticker', 'Broşür', 'Promosyon'].map(l => (
              <Link key={l} href="/urunler" className="block text-[12px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-1.5 transition-colors">{l}</Link>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400 tracking-[1px] mb-3 uppercase">Kurumsal</p>
            {['Hakkımızda', 'Referanslar', 'Blog', 'Kariyer'].map(l => (
              <span key={l} className="block text-[12px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-1.5 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400 tracking-[1px] mb-3 uppercase">İletişim</p>
            {[
              { Icon: Phone, text: '0212 000 00 00' },
              { Icon: Mail, text: 'info@baskipro.com' },
              { Icon: MapPin, text: 'İkitelli OSB, İstanbul' },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-1.5 mb-2">
                <Icon size={11} className="text-gray-400 flex-shrink-0" />
                <span className="text-[12px] text-gray-400">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-black/[0.07] dark:border-white/[0.07] pt-5 flex justify-between items-center">
          <span className="text-[11px] text-gray-400">© 2025 BaskıPro — Tüm hakları saklıdır</span>
          <div className="flex gap-4">
            {['Gizlilik', 'KVKK', 'Kullanım koşulları'].map(l => (
              <span key={l} className="text-[11px] text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
