import type { Metadata } from 'next'
// @ts-ignore: side-effect import for global CSS (no type declarations)
import './globals.css'

import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import WelcomeDialog from '@/components/ui/WelcomeDialog'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import CookieConsent from '@/components/ui/CookieConsent'
import Analytics from '@/components/ui/Analytics'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baskiurunleri.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "baskıurunleri.com — Türkiye'nin En Hızlı Online Matbaası",
    template: '%s | baskıurunleri.com',
  },
  description: 'Büyük format, kartvizit, sticker, tabela. Tasarımını yükle, anlık fiyatı gör, 48 saatte kapında.',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <WhatsAppButton />
          <CookieConsent />
          <Analytics />
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '8px', fontSize: '13px' },
          }} />
          <WelcomeDialog />
        </ThemeProvider>
      </body>
    </html>
  )
}
