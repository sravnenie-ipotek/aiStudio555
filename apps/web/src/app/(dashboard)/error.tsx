'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log dashboard-specific errors
    console.error('Dashboard error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dashboard Error
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            We encountered an issue loading your dashboard. This could be due to a temporary server issue, 
            network connectivity problem, or data synchronization error. Your learning progress and data are safe.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={reset}
              className="w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reload Dashboard</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/courses"
                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors text-sm"
              >
                My Courses
              </Link>
              <Link
                href="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-colors text-sm"
              >
                Home
              </Link>
            </div>
          </div>

          {/* Quick Access Links */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-blue transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>
              
              <Link
                href="/dashboard/progress"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-blue transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Progress</span>
              </Link>
              
              <Link
                href="/dashboard/certificates"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-blue transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span>Certificates</span>
              </Link>
              
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-blue transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Support</span>
              </Link>
            </div>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Technical Details (Development Mode)
              </summary>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-40">
                <div className="mb-2">
                  <strong>Error Message:</strong> {error.message}
                </div>
                {error.digest && (
                  <div className="mb-2">
                    <strong>Error Digest:</strong> {error.digest}
                  </div>
                )}
                {error.stack && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="mt-1 whitespace-pre-wrap text-xs">{error.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
        
        {/* Status Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Issue persisting? Our technical team can help.
          </p>
          <div className="flex justify-center space-x-4 text-xs">
            <Link
              href="/contact"
              className="text-primary-blue hover:text-blue-700 font-medium"
            >
              Report Issue
            </Link>
            <span className="text-gray-400">|</span>
            <a
              href="/status"
              className="text-gray-500 hover:text-gray-700"
            >
              Service Status
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}