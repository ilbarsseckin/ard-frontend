import { Star } from 'lucide-react'

const reviews = [
  {
    text: '"Mağazamızın tüm tabela işlerini buradan yaptırıyoruz. Kalite ve hız konusunda hiç sorun yaşamadık. Kesinlikle tavsiye ederim."',
    name: 'Ahmet Yılmaz', role: 'Mağaza sahibi · İstanbul', initials: 'AY', color: '#0F2040',
  },
  {
    text: '"Fuar brandamız 2 günde hazırdı. Renk tutarlılığı mükemmeldi. Bir dahaki fuarda yine buradayım."',
    name: 'Seda Demir', role: 'Etkinlik org. · Ankara', initials: 'SD', color: '#F4821F',
  },
  {
    text: '"Dosyamı yükledim, anlık fiyatı gördüm, ödedim. 48 saatte kapımdaydı. Harika bir hizmet."',
    name: 'Murat Kaya', role: 'Grafik tasarımcı · İzmir', initials: 'MK', color: '#0F6E56',
  },
]

export default function ReviewsSection() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">
            Müşteriler anlatıyor
          </h2>
          <p className="text-[13px] text-gray-400 mt-1">4.9 · 840 Google yorumu</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={12} fill="#F4821F" className="text-[#F4821F]" />
              ))}
            </div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{r.text}</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0"
                style={{ background: r.color }}>
                {r.initials}
              </div>
              <div>
                <div className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{r.name}</div>
                <div className="text-[10px] text-gray-400">{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
