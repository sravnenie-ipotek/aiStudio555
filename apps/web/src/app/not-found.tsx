import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* 404 Illustration */}
          <div className="w-24 h-24 bg-primary-yellow rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-black">404</span>
          </div>
          
          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved. 
            Let's get you back on track with your learning journey.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
            >
              Back to Home
            </Link>
            
            <Link
              href="/courses"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Courses
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/dashboard"
                className="text-primary-blue hover:text-blue-700 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="text-primary-blue hover:text-blue-700 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="text-primary-blue hover:text-blue-700 font-medium"
              >
                Support
              </Link>
              <Link
                href="/about"
                className="text-primary-blue hover:text-blue-700 font-medium"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search Suggestion */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Can't find what you're looking for?{' '}
            <Link
              href="/contact"
              className="text-primary-blue hover:text-blue-700 font-medium"
            >
              Get in touch
            </Link>
            {' '}and we'll help you find it.
          </p>
        </div>
      </div>
    </div>
  )
}