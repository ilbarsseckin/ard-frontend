import { Zap, Users, Globe, Star, Clock, Cpu } from 'lucide-react'

const stats = [
  { icon: Users, value: '12.000+', label: 'Mutlu Müşteri', color: '#F4821F' },
  { icon: Globe, value: '81 İl', label: 'Teslimat Ağı', color: '#378ADD' },
  { icon: Clock, value: '48 Saat', label: 'Ortalama Teslimat', color: '#1D9E75' },
  { icon: Cpu, value: '1.200 m²', label: 'Fabrika Alanı', color: '#534AB7' },
  { icon: Star, value: '4.9 / 5', label: 'Google Puanı', color: '#BA7517' },
  { icon: Zap, value: '7/24', label: 'Online Sipariş', color: '#D4537E' },
]

export default function StatsSection() {
  return (
    <section className="py-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-6 divide-x" style={{ borderColor: 'var(--border)' }}>
          {stats.map((s, i) => (
            <div key={i} className="px-6 py-7 text-center group cursor-default">
              <div className="flex justify-center mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                  style={{ background: `${s.color}14` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-[20px] font-bold tracking-[-0.5px]"
                style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>{s.value}</div>
              <div className="text-[10px] mt-1 uppercase tracking-[0.8px] font-medium"
                style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
