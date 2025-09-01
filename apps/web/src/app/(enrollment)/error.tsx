'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function EnrollmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log enrollment-specific errors
    console.error('Enrollment error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Enrollment Error
          </h2>
          
          <p className="text-gray-600 mb-8">
            We encountered an issue processing your enrollment. This could be due to a 
            payment processing error, network timeout, or server issue. Your data is safe.
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
              href="/courses"
              className="block w-full bg-primary-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Courses
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
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
        
        {/* Support Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having trouble enrolling?{' '}
            <Link
              href="/contact"
              className="text-primary-blue hover:text-blue-700 font-medium"
            >
              Get enrollment help
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}