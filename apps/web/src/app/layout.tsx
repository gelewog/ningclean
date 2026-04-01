import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ningclean - Jasa Cleaning House di Surabaya, Gresik, Sidoarjo',
  description: 'Layanan cleaning rumah profesional di Surabaya, Gresik, dan Sidoarjo. Booking mudah, hasil maksimal, harga terjangkau.',
  keywords: ['cleaning', 'jasa cleaning', 'surabaya', 'gresik', 'sidoarjo', 'house cleaning'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
