import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Reset Password - Projectdes AI Academy',
  description: 'Reset your password to regain access to your AI transformation courses and learning materials.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-yellow rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h1>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {/* Password Reset Form */}
      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
            placeholder="Enter your email address"
          />
          <p className="text-xs text-gray-500 mt-1">
            This should be the email address you used to create your account
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
        >
          Send Reset Link
        </button>
      </form>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>We'll send a secure reset link to your email</li>
          <li>Click the link in your email (check spam if needed)</li>
          <li>Create a new secure password</li>
          <li>Sign in with your new password</li>
        </ol>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm text-green-700 font-medium">Security Protected</p>
            <p className="text-xs text-green-600">
              Reset links expire in 1 hour for your security. Only the most recent link will work.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Sign In */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            href="/auth/login"
            className="text-primary-blue hover:text-blue-700 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Alternative Help */}
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-3">
          Still having trouble accessing your account?
        </p>
        <div className="space-y-2">
          <Link
            href="/contact"
            className="block text-primary-blue hover:text-blue-700 text-sm font-medium"
          >
            Contact Support Team
          </Link>
          <Link
            href="/auth/register"
            className="block text-primary-blue hover:text-blue-700 text-sm font-medium"
          >
            Create New Account
          </Link>
        </div>
      </div>

      {/* Troubleshooting Tips */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Troubleshooting Tips</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Check your spam/junk folder for the reset email</li>
          <li>• Make sure you're using the correct email address</li>
          <li>• Try disabling ad blockers or browser extensions</li>
          <li>• Clear your browser cache and cookies</li>
          <li>• Contact support if you don't receive the email within 10 minutes</li>
        </ul>
      </div>
    </div>
  )
}