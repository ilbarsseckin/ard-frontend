'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function IletisimPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">İletişim</p>
        <h1 className="text-[40px] font-bold tracking-[-1px] mb-12"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
          Bize ulaşın
        </h1>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: Phone, label: 'Telefon', value: '0212 000 00 00' },
              { icon: Mail, label: 'E-posta', value: 'info@baskipro.com' },
              { icon: MapPin, label: 'Adres', value: 'İkitelli OSB, Atatürk Blv. No:1, İstanbul' },
              { icon: Clock, label: 'Çalışma Saatleri', value: 'Pzt–Cmt: 08:00–18:00' },
            ].map(({ icon: Icon, label, value }, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(244,130,31,0.1)' }}>
                  <Icon size={18} className="text-[#F4821F]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1px]"
                    style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="text-[14px] font-semibold mt-0.5"
                    style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-[18px] font-bold mb-5"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Mesaj gönderin
            </h2>
            <div className="space-y-3">
              {['Ad Soyad', 'E-posta', 'Telefon'].map(p => (
                <input key={p} placeholder={p}
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              ))}
              <textarea placeholder="Mesajınız" rows={4}
                className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              <button className="w-full py-3 rounded-xl text-[13px] font-bold text-white bg-[#F4821F] hover:bg-[#e07010] transition-colors">
                Gönder
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}