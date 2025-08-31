import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import '@/styles/globals.css';

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
        {children}
      </body>
    </html>
  );
}