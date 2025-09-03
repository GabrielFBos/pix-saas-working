import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PIX SaaS Learning - Sistema de Pagamento PIX',
  description: 'Sistema SaaS completo com integração PIX. Aprenda a implementar pagamentos PIX de forma prática e profissional.',
  keywords: 'PIX, pagamento, SaaS, Next.js, TypeScript, desenvolvimento',
  authors: [{ name: 'Gabriel Fernandes' }],
  creator: 'Gabriel Fernandes',
  publisher: 'PIX SaaS Learning',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://paycode.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PIX SaaS Learning',
    description: 'Sistema SaaS completo com integração PIX',
    url: 'https://paycode.vercel.app',
    siteName: 'PIX SaaS Learning',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PIX SaaS Learning',
    description: 'Sistema SaaS completo com integração PIX',
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
