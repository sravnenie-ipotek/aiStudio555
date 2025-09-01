import { Metadata } from 'next'
import { redirect } from 'next/navigation'
// import { getUser } from '@/lib/auth' // Uncomment when auth is implemented

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | Projectdes AI Academy',
    default: 'Dashboard | Projectdes AI Academy',
  },
  description: 'Student dashboard for Projectdes AI Academy courses and progress tracking.',
  robots: {
    index: false, // Don't index dashboard pages
    follow: false,
  },
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // TODO: Implement auth check when ready
  // const user = await getUser()
  // if (!user) {
  //   redirect('/auth/login')
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-blue">
              Projectdes Academy
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <a
              href="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">📊</span>
              Overview
            </a>
            <a
              href="/dashboard/courses"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">📚</span>
              My Courses
            </a>
            <a
              href="/dashboard/progress"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">📈</span>
              Progress
            </a>
            <a
              href="/dashboard/assignments"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">📝</span>
              Assignments
            </a>
            <a
              href="/dashboard/community"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">👥</span>
              Community
            </a>
            <a
              href="/dashboard/certificates"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">🏆</span>
              Certificates
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">⚙️</span>
              Settings
            </a>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-yellow rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">JS</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Student</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold text-primary-blue">
            Projectdes Academy
          </h1>
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}