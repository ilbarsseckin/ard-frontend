'use client'

const badges = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L4 7v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V7L14 3z" stroke="#10B981" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 14l3.5 3.5L19 11" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'SSL Güvenli Ödeme',
    desc: '256-bit şifreleme',
    color: '#10B981',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="2" stroke="#6366F1" strokeWidth="1.8"/>
        <path d="M4 12h20" stroke="#6366F1" strokeWidth="1.8"/>
        <path d="M8 17h4" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'iyzico ile Ödeme',
    desc: 'Taksit imkânı',
    color: '#6366F1',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 16h14v-8H5v8zM19 16h4l-2-6h-2v6z" stroke="#F4821F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="19" r="2" stroke="#F4821F" strokeWidth="1.5"/>
        <circle cx="20" cy="19" r="2" stroke="#F4821F" strokeWidth="1.5"/>
      </svg>
    ),
    title: '48 Saat Teslimat',
    desc: 'Hızlı kargo garantisi',
    color: '#F4821F',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4a10 10 0 100 20A10 10 0 0014 4z" stroke="#0EA5E9" strokeWidth="1.8"/>
        <path d="M14 8v6l4 2" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: '7/24 Destek',
    desc: 'WhatsApp & canlı chat',
    color: '#0EA5E9',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l2.5 7.5H24l-6.5 4.7 2.5 7.5L14 19.2l-6 4.5 2.5-7.5L4 11.5h7.5L14 4z" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    title: '4.9 Google Puanı',
    desc: '840+ müşteri yorumu',
    color: '#F59E0B',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M9 12h10M9 16h6" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="4" y="5" width="20" height="18" rx="2" stroke="#EC4899" strokeWidth="1.8"/>
        <path d="M9 5V3M19 5V3" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Tasarım Desteği',
    desc: 'Ücretsiz grafiker',
    color: '#EC4899',
  },
]

export default function GuvenRozetleri() {
  return (
    <section className="py-10 px-4" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 py-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${badge.color}15` }}>
                {badge.icon}
              </div>
              <div>
                <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {badge.title}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}