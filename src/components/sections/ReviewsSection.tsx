'use client'

const reviews = [
  {
    text: 'Mağazamızın tüm tabela işlerini buradan yaptırıyoruz. Kalite ve hız konusunda hiç sorun yaşamadık. Kesinlikle tavsiye ederim.',
    name: 'Ahmet Yılmaz',
    role: 'Mağaza sahibi',
    location: 'İstanbul',
    initials: 'AY',
    color: '#185FA5',
    stars: 5,
    time: '2 hafta önce',
  },
  {
    text: 'Fuar brandamız 2 günde hazırdı. Renk tutarlılığı mükemmeldi. Bir dahaki fuarda yine buradayım. Çok teşekkürler!',
    name: 'Seda Demir',
    role: 'Etkinlik organizatörü',
    location: 'Ankara',
    initials: 'SD',
    color: '#F4821F',
    stars: 5,
    time: '1 ay önce',
  },
  {
    text: 'Dosyamı yükledim, anlık fiyatı gördüm, ödedim. 48 saatte kapımdaydı. Harika bir hizmet, fiyatlar da çok uygun.',
    name: 'Murat Kaya',
    role: 'Grafik tasarımcı',
    location: 'İzmir',
    initials: 'MK',
    color: '#1D9E75',
    stars: 5,
    time: '3 hafta önce',
  },
  {
    text: '500 adet kartvizit siparişim 2 günde elime ulaştı. Kalitesi harikaydı, renk geçişleri mükemmel. Tekrar tercih edeceğim.',
    name: 'Fatma Şahin',
    role: 'Emlak danışmanı',
    location: 'Gaziantep',
    initials: 'FŞ',
    color: '#9333EA',
    stars: 5,
    time: '5 gün önce',
  },
  {
    text: 'Roll-up siparişlerimizi hep buradan veriyoruz. Teslimat hızı ve baskı kalitesi çok iyi. Müşteri hizmetleri de gayet ilgili.',
    name: 'Kemal Arslan',
    role: 'Pazarlama müdürü',
    location: 'Bursa',
    initials: 'KA',
    color: '#0891B2',
    stars: 5,
    time: '1 hafta önce',
  },
  {
    text: 'Kafe açılışımız için broşür ve kartvizit bastırdım. Tasarım desteği de aldım, gerçekten profesyonelce ilgilendiler.',
    name: 'Zeynep Koç',
    role: 'Kafe sahibi',
    location: 'Antalya',
    initials: 'ZK',
    color: '#DB2777',
    stars: 5,
    time: '2 ay önce',
  },
]

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < count ? '#F59E0B' : '#E5E7EB'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ r }: { r: typeof reviews[0] }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

      {/* Üst — yıldız + tarih + Google */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <StarRating count={r.stars} />
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.time}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0"
          style={{ background: 'var(--bg-secondary)' }}>
          <GoogleLogo />
          <span className="text-[10px] font-bold" style={{ color: '#4285F4' }}>Google</span>
        </div>
      </div>

      {/* Yorum */}
      <p className="text-[13px] leading-[1.75] flex-1" style={{ color: 'var(--text-secondary)' }}>
        "{r.text}"
      </p>

      {/* Kullanıcı */}
      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-black flex-shrink-0"
          style={{ background: r.color }}>
          {r.initials}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
          <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{r.role} · {r.location}</p>
        </div>
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  return (
    <section className="py-16 max-w-7xl mx-auto">

      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-4 sm:px-6">
        <div>
          <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-2">Yorumlar</p>
          <h2 className="text-[28px] sm:text-[32px] font-black tracking-[-1px]"
            style={{ color: 'var(--text-primary)' }}>
            Müşteriler anlatıyor
          </h2>
        </div>

        {/* Google rating özeti */}
        <a href="https://g.co/kgs/baskiurunleri" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 px-5 py-3 rounded-2xl transition-all hover:shadow-md flex-shrink-0 self-start sm:self-auto"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <GoogleLogo />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-black" style={{ color: 'var(--text-primary)' }}>4.9</span>
              <StarRating count={5} />
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>840 Google yorumu</p>
          </div>
        </a>
      </div>

      {/* MOBİL — yatay kaydırma */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {reviews.map((r, i) => (
            <div key={i} className="flex-shrink-0 w-[300px]" style={{ scrollSnapAlign: 'start' }}>
              <ReviewCard r={r} />
            </div>
          ))}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>

      {/* MASAÜSTÜ — grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 px-6">
        {reviews.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>

      {/* Alt link */}
      <div className="mt-8 text-center px-4">
        <a href="https://g.co/kgs/baskiurunleri" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:shadow-md"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <GoogleLogo />
          Tüm Google yorumlarını gör
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      </div>
    </section>
  )
}