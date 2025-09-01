'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log authentication-specific errors
    console.error('Authentication error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-blue">
                Projectdes AI Academy
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Authentication Error
            </h2>
            
            <p className="text-gray-600 mb-8 text-center">
              We encountered an issue with the authentication process. This could be due to a 
              session timeout, network issue, or server problem.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
              >
                Try Again
              </button>
              
              <Link
                href="/auth/login"
                className="block w-full bg-primary-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-center transition-colors"
              >
                Back to Login
              </Link>
              
              <Link
                href="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium text-center transition-colors"
              >
                Go Home
              </Link>
            </div>
            
            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details (Dev Mode)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Message:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div className="mb-2">
                      <strong>Error ID:</strong> {error.digest}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Need help?{' '}
              <Link href="/contact" className="text-primary-blue hover:text-blue-700">
                Contact support
              </Link>
            </p>
            <p className="mt-2">© 2024 Projectdes AI Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}