import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const posts = [
  { slug: 'branda-baski-rehberi', title: 'Branda Baskıda Dikkat Edilmesi Gerekenler', date: 'Mart 2025', cat: 'Rehber' },
  { slug: 'kartvizit-tasarim-ipuclari', title: 'Kartvizit Tasarımında 10 Altın Kural', date: 'Şubat 2025', cat: 'Tasarım' },
  { slug: 'uv-vs-solvent', title: 'UV Baskı mı Solvent mi? Farklar ve Kullanım Alanları', date: 'Ocak 2025', cat: 'Teknik' },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Blog</p>
        <h1 className="text-[40px] font-bold tracking-[-1px] mb-12"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
          Baskı dünyasından
        </h1>
        <div className="space-y-4">
          {posts.map((p, i) => (
            <a key={i} href={`/blog/${p.slug}`}
              className="group flex items-start justify-between p-6 rounded-2xl transition-all hover:scale-[1.01] block"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div>
                <span className="text-[10px] font-bold text-[#F4821F] uppercase tracking-[1px]">{p.cat}</span>
                <h2 className="text-[17px] font-bold mt-1"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>{p.title}</h2>
                <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{p.date}</p>
              </div>
              <span className="text-[#F4821F] group-hover:translate-x-1 transition-transform mt-2 flex-shrink-0">→</span>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}