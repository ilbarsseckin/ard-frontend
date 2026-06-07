import type { Metadata } from 'next'
// @ts-ignore: CSS module declarations may not be present in this project setup
import './globals.css'

import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import WelcomeDialog from '@/components/ui/WelcomeDialog'

export const metadata: Metadata = {
  metadataBase: new URL('https://baskiurunleri.com'),
  title: {
    default: 'Baskı Ürünleri — Türkiye\'nin En Hızlı Online Matbaası',
    template: '%s | Baskıürünleri.com',
  },
  description: 'Kartvizit, broşür, bayrak, tabela, promosyon ürünleri ve daha fazlası. Profesyonel baskı kalitesi, hızlı teslimat, uygun fiyat. Tasarımını yükle, 48 saatte kapında.',
  keywords: [
    'kartvizit baskı', 'broşür baskı', 'bayrak baskı', 'tabela baskı',
    'online matbaa', 'ucuz baskı', 'hızlı baskı', 'promosyon ürünleri',
    'dijital baskı', 'baskı fiyatları', 'kartvizit fiyatı'
  ],
  authors: [{ name: 'Baskıürünleri.com' }],
  creator: 'Baskıürünleri.com',
  publisher: 'Baskıürünleri.com',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://baskiurunleri.com',
    siteName: 'Baskıürünleri.com',
    title: 'Baskı Ürünleri — Türkiye\'nin En Hızlı Online Matbaası',
    description: 'Kartvizit, broşür, bayrak, tabela ve promosyon ürünleri. 48 saatte kapında.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baskıürünleri.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baskı Ürünleri — Online Matbaa',
    description: 'Kartvizit, broşür, bayrak, tabela. 48 saatte kapında.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  alternates: {
    canonical: 'https://baskiurunleri.com',
  },
  verification: {
    google: 'dXF9UI_9aX1dEwnwmRqVcSFlm6DFwjPa4sLOOknPYpQ',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '8px', fontSize: '13px' },
          }} />
          <WelcomeDialog />
        </ThemeProvider>
      </body>
    </html>
  )
}