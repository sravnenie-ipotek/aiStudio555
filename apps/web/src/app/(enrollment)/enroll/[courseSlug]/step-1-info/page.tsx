import { Metadata } from 'next'
import Link from 'next/link'

interface Step1InfoPageProps {
  params: Promise<{
    courseSlug: string
  }>
}

export const metadata: Metadata = {
  title: 'Personal Information',
  description: 'Enter your personal information to begin enrollment',
}

export default async function Step1InfoPage({ params }: Step1InfoPageProps) {
  const { courseSlug } = await params;
  const courseName = courseSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step 1 of 3</span>
            <span>Personal Information</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-yellow h-2 rounded-full w-1/3 transition-all duration-300"></div>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enrollment for {courseName}
          </h1>
          <p className="text-gray-600">
            Please provide your information to continue with enrollment.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
              >
                <option value="">Select your country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="il">Israel</option>
                <option value="ru">Russia</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Language Preference */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language *
              </label>
              <select
                id="language"
                name="language"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="he">Hebrew</option>
              </select>
            </div>

            {/* Professional Background */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Professional Experience *
              </label>
              <select
                id="experience"
                name="experience"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
              >
                <option value="">Select your experience level</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-yellow focus:ring-primary-yellow border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/legal/terms" className="text-primary-blue hover:underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="text-primary-blue hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href={`/courses/${courseSlug}`}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 text-center rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Course
              </Link>
              <Link
                href={`/enroll/${courseSlug}/step-2-payment`}
                className="flex-1 bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-center transition-all hover:-translate-y-1"
              >
                Continue to Payment
              </Link>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center">
            <div className="w-6 h-6 text-primary-blue mr-3">🔒</div>
            <p className="text-sm text-gray-600">
              Your information is secure and encrypted. We never share your personal data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}