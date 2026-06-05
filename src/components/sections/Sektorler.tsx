import Image from 'next/image'
import Link from 'next/link'

const sektorler = [
  {
    title: 'Fuar & Etkinlik',
    desc: 'Rollup, branda, afiş ve tanıtım ürünleri',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    href: '/urunler?q=branda',
  },
  {
    title: 'Restoran & Cafe',
    desc: 'Menü, masaüstü ürünleri ve etiket baskıları',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop',
    href: '/urunler?q=menu',
  },
  {
    title: 'Eğitim Sektörü',
    desc: 'Broşür, katalog ve okul baskı çözümleri',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
    href: '/urunler?q=brosur',
  },
  {
    title: 'Sağlık Sektörü',
    desc: 'Tabela, yönlendirme ve kurumsal baskılar',
    image:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop',
    href: '/urunler?q=tabela',
  },
  {
    title: 'Emlak & Gayrimenkul',
    desc: 'Satılık/kiralık tabela ve vitrin çözümleri',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop',
    href: '/urunler?q=tabela',
  },
  {

  title: 'Mağaza & Market',
  desc: 'Sticker, kampanya ve raf etiketi ürünleri',
  image:
    'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200&auto=format&fit=crop',
  href: '/urunler?q=sticker',
  },
]

export default function Sektorler() {
  return (
    <section className="px-6 pb-14 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#F4821F] mb-2">
          Sektörel Çözümler
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sektörünüze Özel Baskı Ürünleri
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sektorler.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group relative overflow-hidden rounded-3xl h-[260px]"
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

            <div className="absolute bottom-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {s.title}
              </h3>

              <p className="text-sm text-white/80 leading-5 mb-4">
                {s.desc}
              </p>

              <span className="inline-flex items-center text-sm font-semibold text-white">
                Ürünleri İncele →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}