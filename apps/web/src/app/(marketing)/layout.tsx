import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    template: '%s | Projectdes AI Academy',
    default: 'Projectdes AI Academy - AI Transformation Training',
  },
  description: 'Transform into a certified AI specialist with fast-track, project-based learning programs. International job placement guaranteed.',
}

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}