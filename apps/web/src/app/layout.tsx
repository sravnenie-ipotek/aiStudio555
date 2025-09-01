import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/header';

const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AiStudio555 AI Academy - AI-трансформация для разработчиков и бизнеса',
  description: 'Персональное менторство, практические курсы и стратегии роста для next-level карьеры',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" dir="ltr">
      <body className={`${rubik.className} antialiased`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
