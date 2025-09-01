import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Account - Projectdes AI Academy',
  description: 'Create your account to start your AI transformation journey. Join thousands of professionals advancing their careers with AI.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-gray-600">
          Join thousands of professionals transforming their careers with AI
        </p>
      </div>

      {/* Registration Form */}
      <form className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email */}
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
            placeholder="john@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
            placeholder="Create a secure password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters with numbers and letters
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
            placeholder="Confirm your password"
          />
        </div>

        {/* Professional Background */}
        <div>
          <label htmlFor="background" className="block text-sm font-semibold text-gray-900 mb-2">
            Current Role/Background
          </label>
          <select
            id="background"
            name="background"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
          >
            <option value="">Select your background</option>
            <option value="developer">Software Developer</option>
            <option value="designer">UI/UX Designer</option>
            <option value="manager">Project/Product Manager</option>
            <option value="marketing">Marketing Professional</option>
            <option value="business">Business Analyst</option>
            <option value="consultant">Consultant</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="student">Student</option>
            <option value="career-change">Career Changer</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="experience" className="block text-sm font-semibold text-gray-900 mb-2">
            AI/Tech Experience Level
          </label>
          <select
            id="experience"
            name="experience"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
          >
            <option value="">Select your level</option>
            <option value="beginner">Beginner - New to AI</option>
            <option value="some-experience">Some Experience - Used AI tools</option>
            <option value="intermediate">Intermediate - Built AI projects</option>
            <option value="advanced">Advanced - AI professional</option>
          </select>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="mt-1 w-5 h-5 text-primary-yellow border-gray-300 rounded focus:ring-2 focus:ring-primary-yellow"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-blue hover:text-blue-700 font-medium">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary-blue hover:text-blue-700 font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Newsletter Opt-in */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            className="w-5 h-5 text-primary-yellow border-gray-300 rounded focus:ring-2 focus:ring-primary-yellow"
          />
          <label htmlFor="newsletter" className="text-sm text-gray-700">
            Send me AI industry insights and course updates
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
        >
          Create Account
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Social Registration */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" fill="#0078D4" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
            <span>Continue with Microsoft</span>
          </button>
        </div>
      </form>

      {/* Sign In Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-primary-blue hover:text-blue-700 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm text-green-700">
            Your information is protected with enterprise-grade security
          </span>
        </div>
      </div>
    </div>
  )
}