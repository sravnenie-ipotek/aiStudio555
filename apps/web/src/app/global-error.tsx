'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log critical application errors
    console.error('Global application error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error)
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {/* Critical Error Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Error Message */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Critical Application Error
              </h1>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                We encountered a critical error that prevented the application from loading properly. 
                Our team has been automatically notified and is working to resolve the issue.
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={reset}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold transition-colors"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Reload Page
                </button>
                
                <a
                  href="/"
                  className="block w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
                >
                  Go to Homepage
                </a>
              </div>

              {/* Help Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Need Immediate Help?</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href="mailto:support@projectdes-academy.com"
                    className="flex items-center justify-center space-x-2 text-primary-blue hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email Support</span>
                  </a>
                  
                  <a
                    href="tel:+1555123456"
                    className="flex items-center justify-center space-x-2 text-primary-blue hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Support</span>
                  </a>
                </div>
              </div>

              {/* Browser Compatibility Note */}
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Browser Issues?</strong> Try updating your browser or clearing cache and cookies. 
                  We recommend using the latest version of Chrome, Firefox, Safari, or Edge.
                </p>
              </div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-red-600 hover:text-red-700">
                    Developer Error Details
                  </summary>
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-mono text-red-700 overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {error.message}
                    </div>
                    {error.digest && (
                      <div className="mb-2">
                        <strong>Digest:</strong> {error.digest}
                      </div>
                    )}
                    {error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-xs">{error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
            
            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Error ID: {error.digest || 'N/A'} • {new Date().toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                © 2024 Projectdes AI Academy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}