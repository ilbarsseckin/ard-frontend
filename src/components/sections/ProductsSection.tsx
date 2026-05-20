'use client'
import Link from 'next/link'
import { ArrowRight, Image, CreditCard, Star, SignpostBig, FileText, Gift } from 'lucide-react'

const products = [
  {
    icon: Image, name: 'Büyük format baskı', slug: 'buyuk-format-vinil',
    desc: 'Vinil, branda, poster, araç giydirme. UV ve solvent mürekkep.',
    price: '₺185/m²\'den', badge: 'En çok tercih',
    color: '#185FA5', bg: 'rgba(55,138,221,0.08)', big: true,
    tags: ['Vinil', 'Branda', 'Araç giydirme'],
  },
  {
    icon: CreditCard, name: 'Kartvizit', slug: 'kartvizit-350g',
    desc: '350g mat/parlak, selofan, kabartma seçeneği',
    price: '₺180 / 250 adet', color: '#0F6E56', bg: 'rgba(29,158,117,0.08)',
  },
  {
    icon: Star, name: 'Sticker & etiket', slug: 'sticker-genel',
    desc: 'Özel kesim, şeffaf, mat, parlak seçenekleri',
    price: '₺2.5 / adetten', color: '#854F0B', bg: 'rgba(186,117,23,0.08)',
  },
  {
    icon: SignpostBig, name: 'Tabela & levha', slug: 'tabela-forex',
    desc: 'Forex, alüminyum, pleksi, ışıklı kutu',
    price: '₺120 / m²\'den', color: '#534AB7', bg: 'rgba(83,74,183,0.08)',
  },
  {
    icon: FileText, name: 'Broşür & flyer', slug: 'brosur-a5',
    desc: 'A4, A5, DL, üçlü katlama seçeneği',
    price: '₺95 / 100 adetten', color: '#993556', bg: 'rgba(212,83,126,0.08)',
  },
  {
    icon: Gift, name: 'Promosyon', slug: 'promosyon-kupa',
    desc: 'Kupa, kalem, bez çanta ve daha fazlası',
    price: '₺35\'ten', color: '#F4821F', bg: 'rgba(244,130,31,0.08)',
  },
]

export default function ProductsSection() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">
            Ne basmak istiyorsun?
          </h2>
          <p className="text-[13px] text-gray-400 mt-1">Ürünü seç, anlık fiyat hesapla</p>
        </div>
        <Link href="/urunler" className="text-[12px] text-gray-400 hover:text-[#F4821F] transition-colors">
          Tüm ürünler →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {products.map((p, i) => (
          <Link key={p.slug} href={`/siparis?urun=${p.slug}`}
            className={`card-hover bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5 cursor-pointer block ${p.big ? 'col-span-2 flex items-center gap-5' : ''}`}>

            <div className={`${p.big ? 'w-16 h-16 flex-shrink-0' : 'w-10 h-10 mb-3'} rounded-xl flex items-center justify-center`}
              style={{ background: p.bg }}>
              <p.icon size={p.big ? 30 : 20} style={{ color: p.color }} />
            </div>

            <div className="flex-1 min-w-0">
              {p.badge && (
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded mb-1.5"
                  style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                  {p.badge}
                </span>
              )}
              <div className={`font-medium text-gray-900 dark:text-gray-100 mb-1 ${p.big ? 'text-[15px]' : 'text-[13px]'}`}>{p.name}</div>
              <div className="text-[11px] text-gray-400 leading-relaxed mb-3">{p.desc}</div>
              {p.big && p.tags && (
                <div className="flex gap-1.5 mb-3">
                  {p.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.05] text-gray-500 dark:text-gray-400">{t}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{p.price}</span>
                <ArrowRight size={13} className="text-[#F4821F]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
