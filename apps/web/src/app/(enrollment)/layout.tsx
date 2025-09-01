import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Enrollment | Projectdes AI Academy',
    default: 'Enrollment | Projectdes AI Academy',
  },
  description: 'Complete your enrollment in Projectdes AI Academy courses.',
  robots: {
    index: false, // Don't index enrollment pages
    follow: false,
  },
}

interface EnrollmentLayoutProps {
  children: React.ReactNode
}

export default function EnrollmentLayout({ children }: EnrollmentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header for Enrollment */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-blue">
                Projectdes AI Academy
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Secure Enrollment
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact support at support@projectdes.academy</p>
            <p className="mt-2">© 2024 Projectdes AI Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}