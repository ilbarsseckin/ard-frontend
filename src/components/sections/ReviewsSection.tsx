const reviews = [
  { text: 'Mağazamızın tüm tabela işlerini buradan yaptırıyoruz. Kalite ve hız konusunda hiç sorun yaşamadık.', name: 'Ahmet Yılmaz', role: 'Mağaza sahibi · İstanbul', initials: 'AY', color: '#185FA5' },
  { text: 'Fuar brandamız 2 günde hazırdı. Renk tutarlılığı mükemmeldi. Bir dahaki fuarda yine buradayım.', name: 'Seda Demir', role: 'Etkinlik org. · Ankara', initials: 'SD', color: '#F4821F' },
  { text: 'Dosyamı yükledim, anlık fiyatı gördüm, ödedim. 48 saatte kapımdaydı. Harika bir hizmet.', name: 'Murat Kaya', role: 'Grafik tasarımcı · İzmir', initials: 'MK', color: '#1D9E75' },
]

export default function ReviewsSection() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-3">
        <div>
          <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Yorumlar</p>
          <h2 className="text-[32px] font-bold tracking-[-1px]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
            Müşteriler anlatıyor
          </h2>
          <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-secondary)' }}>4.9 · 840 Google yorumu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className="text-[#F4821F] text-sm">★</span>
              ))}
            </div>
            <p className="text-[13px] leading-[1.7] mb-5 italic"
              style={{ color: 'var(--text-secondary)', fontFamily: 'Georgia, serif' }}>
              "{r.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: r.color }}>
                {r.initials}
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{r.name}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
