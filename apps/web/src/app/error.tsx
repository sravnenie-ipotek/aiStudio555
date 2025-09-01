'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          
          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h2>
          
          <p className="text-gray-600 mb-8">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
            >
              Try Again
            </button>
            
            <a
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Go Home
            </a>
          </div>
          
          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Dev Mode)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto">
                <div className="mb-2">
                  <strong>Message:</strong> {error.message}
                </div>
                {error.digest && (
                  <div className="mb-2">
                    <strong>Digest:</strong> {error.digest}
                  </div>
                )}
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
        
        {/* Support Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need immediate help?{' '}
            <a
              href="/contact"
              className="text-primary-blue hover:text-blue-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}