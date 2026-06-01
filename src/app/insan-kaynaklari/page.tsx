import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const positions = [
  { title: 'Baskı Operatörü', dept: 'Üretim', type: 'Tam zamanlı' },
  { title: 'Grafik Tasarımcı', dept: 'Tasarım', type: 'Tam zamanlı' },
  { title: 'Müşteri Temsilcisi', dept: 'Satış', type: 'Tam zamanlı' },
  { title: 'Lojistik Koordinatör', dept: 'Operasyon', type: 'Tam zamanlı' },
]

export default function InsanKaynaklariPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">İnsan Kaynakları</p>
        <h1 className="text-[40px] font-bold tracking-[-1px] mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
          Ekibimize katılın
        </h1>
        <p className="text-[15px] mb-12" style={{ color: 'var(--text-secondary)' }}>
          Büyüyen ekibimize yetenekli bireyler arıyoruz.
        </p>
        <div className="space-y-3">
          {positions.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div>
                <h3 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.dept} · {p.type}</p>
              </div>
              <a href={`mailto:ik@baskiurunleri.com?subject=${p.title} Başvurusu`}
                className="text-[12px] font-bold bg-[#F4821F] text-white px-5 py-2.5 rounded-xl hover:bg-[#e07010] transition-colors">
                Başvur
              </a>
            </div>
          ))}
        </div>
        <div className="mt-10 p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Açık pozisyon göremiyorsanız CV nizi <strong>ik@baskiurunleri.com</strong> adresine gönderin.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}