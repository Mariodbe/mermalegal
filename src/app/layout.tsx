import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'MermaLegal — Evita Multas Ley 1/2025 | Plan Prevención Desperdicio Alimentario',
    template: '%s | MermaLegal',
  },
  description:
    'Genera el plan de prevención de desperdicio alimentario obligatorio por la Ley 1/2025. Evita multas de hasta 500.000€ en tu restaurante, hotel o bar. Gratis en 2 minutos.',
  keywords: [
    'ley 1 2025 hostelería',
    'multas ley 1 2025',
    'plan prevención desperdicio alimentario',
    'registro trazabilidad mermas',
    'ley desperdicio alimentario restaurantes',
    'plan prevención mermas artículo 5',
    'cómo hacer plan prevención desperdicio alimentario',
  ],
  authors: [{ name: 'MermaLegal' }],
  creator: 'MermaLegal',
  metadataBase: new URL('https://mermalegal.com'),
  openGraph: {
    siteName: 'MermaLegal',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
