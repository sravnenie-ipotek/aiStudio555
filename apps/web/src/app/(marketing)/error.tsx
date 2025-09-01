'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log marketing page errors
    console.error('Marketing page error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-8">
              We're experiencing a temporary issue loading this page. Our team has been 
              notified and is working to fix it. Please try again in a moment.
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
                href="/"
                className="block w-full bg-primary-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Back to Home
              </Link>
              
              <Link
                href="/courses"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Browse Courses
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
          
          {/* Quick Links */}
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link
                href="/courses"
                className="flex items-center space-x-2 text-primary-blue hover:text-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Courses</span>
              </Link>
              
              <Link
                href="/about"
                className="flex items-center space-x-2 text-primary-blue hover:text-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About</span>
              </Link>
              
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-primary-blue hover:text-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact</span>
              </Link>
              
              <Link
                href="/auth/login"
                className="flex items-center space-x-2 text-primary-blue hover:text-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}