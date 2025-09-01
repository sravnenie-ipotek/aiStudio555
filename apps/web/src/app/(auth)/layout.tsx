import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Projectdes AI Academy',
    default: 'Authentication | Projectdes AI Academy',
  },
  description: 'Sign in or create your Projectdes AI Academy account.',
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-blue">
                Projectdes AI Academy
              </h1>
            </a>
            <div className="text-sm text-gray-500">
              Secure Authentication
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Need help?{' '}
              <a href="/contact" className="text-primary-blue hover:text-blue-700">
                Contact support
              </a>
            </p>
            <p className="mt-2">© 2024 Projectdes AI Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}