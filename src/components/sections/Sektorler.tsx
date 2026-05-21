import Link from 'next/link'

const sektorler = [
  { icon: '🏪', label: 'Fuar / Etkinlik\nÜrünleri',   href: '/urunler?q=branda' },
  { icon: '☕', label: 'Restoran / Cafe\nÜrünleri',  href: '/urunler?q=menu' },
  { icon: '📚', label: 'Eğitim\nSektörü',             href: '/urunler?q=brosur' },
  { icon: '🏥', label: 'Sağlık\nSektörü',             href: '/urunler?q=tabela' },
  { icon: '🏠', label: 'Emlak / Gayrimenkul\nÜrünleri', href: '/urunler?q=tabela' },
  { icon: '🛒', label: 'Mağaza / Market\nÜrünleri',  href: '/urunler?q=sticker' },
]

export default function Sektorler() {
  return (
    <section className="px-6 pb-10 max-w-7xl mx-auto">
      <h2 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 mb-6">
        Sektörlere Göre Ürünler
      </h2>
      <div className="grid grid-cols-6 gap-3">
        {sektorler.map((s, i) => (
          <Link
            key={i}
            href={s.href}
            className="group bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5 flex flex-col items-center text-center hover:border-[#F4821F]/40 hover:shadow-sm transition-all"
          >
            <span className="text-[36px] mb-3 group-hover:scale-110 transition-transform duration-200">
              {s.icon}
            </span>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-[0.5px] leading-tight whitespace-pre-line">
              {s.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}