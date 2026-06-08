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
    <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-14">
      <div className="mb-6 md:mb-8">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4821F] md:text-sm">
          Sektörel Çözümler
        </p>

        <h2 className="max-w-[520px] text-[24px] font-black leading-tight text-gray-900 md:text-3xl dark:text-white">
          Sektörünüze Özel Baskı Ürünleri
        </h2>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
        {sektorler.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group relative h-[230px] min-w-[250px] snap-start overflow-hidden rounded-3xl bg-gray-200 md:h-[260px] md:min-w-0"
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="(max-width: 768px) 250px, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <h3 className="mb-2 text-[20px] font-black leading-tight text-white md:text-2xl">
                {s.title}
              </h3>

              <p className="mb-4 text-[13px] leading-5 text-white/85 md:text-sm">
                {s.desc}
              </p>

              <span className="inline-flex items-center text-[13px] font-bold text-white md:text-sm">
                Ürünleri İncele →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}