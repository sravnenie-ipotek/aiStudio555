import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/header';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Projectdes AI Academy',
  description: 'Transform your career with AI education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased`}>
        <Header />
        <div className="pt-16 md:pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
