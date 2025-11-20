import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-geist',
  preload: true,
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-geist-mono',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#007A72',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://glindent.co.uk'),
  title: {
    default: 'Glindent - Premium Dental Supplies | Way to Dentistry',
    template: '%s | Glindent'
  },
  description: 'UK supplier of premium dental supplies including zirconia discs, X-ray films, composites, and CAD/CAM materials. Backed by 40+ years of Gülsa Medical expertise from Turkey.',
  keywords: [
    'dental supplies UK',
    'zirconia discs',
    'dental X-ray film',
    'CAD/CAM materials',
    'dental composites',
    'dental laboratory supplies',
    'Glindent',
    'Gülsa Medical',
    'pre-shaded zirconia',
    'multi-layer zirconia',
    'dental restoration materials'
  ],
  authors: [{ name: 'Glindent' }],
  creator: 'Glindent',
  publisher: 'Glindent',
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
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://glindent.co.uk',
    siteName: 'Glindent',
    title: 'Glindent - Premium Dental Supplies | Way to Dentistry',
    description: 'UK supplier of premium dental supplies including zirconia discs, X-ray films, composites, and CAD/CAM materials.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Glindent - Premium Dental Supplies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glindent - Premium Dental Supplies',
    description: 'UK supplier of premium dental supplies backed by 40+ years of expertise.',
    images: ['/og-image.jpg'],
    creator: '@glindent',
  },
  alternates: {
    canonical: 'https://glindent.co.uk',
  },
  category: 'medical supplies',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} style={{ overflowX: 'hidden' }}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`font-sans antialiased`} style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
