'use client'

const WA_NUMBER = '905XXXXXXXXX' // ← numaranı yaz

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed z-50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      style={{
        bottom: '80px',   // mobil bottom bar'ın üstünde
        right: '16px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: '#25D366',
        boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
      }}
    >
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.505L4 29l7.698-1.807A11.95 11.95 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="white"/>
        <path d="M21.894 18.72c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.014 1.253-.187.214-.373.24-.693.08-.32-.16-1.35-.498-2.573-1.588-.95-.848-1.592-1.896-1.778-2.216-.187-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.106-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.624-.524-.54-.72-.55-.186-.01-.4-.012-.613-.012-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.46 4.827.763.328 1.36.524 1.823.672.766.243 1.464.208 2.016.126.615-.091 1.893-.774 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.134-.293-.214-.613-.374z" fill="#25D366"/>
      </svg>
      <span className="absolute inset-0 rounded-full animate-ping"
        style={{ background: 'rgba(37,211,102,0.3)' }} />
    </a>
  )
}