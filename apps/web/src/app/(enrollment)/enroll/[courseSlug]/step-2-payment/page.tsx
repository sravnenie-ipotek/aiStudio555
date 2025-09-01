import { Metadata } from 'next'
import Link from 'next/link'

interface Step2PaymentPageProps {
  params: Promise<{
    courseSlug: string
  }>
}

export const metadata: Metadata = {
  title: 'Payment Information',
  description: 'Select your payment method and complete enrollment',
}

export default async function Step2PaymentPage({ params }: Step2PaymentPageProps) {
  const { courseSlug } = await params;
  const courseName = courseSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step 2 of 3</span>
            <span>Payment Information</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-yellow h-2 rounded-full w-2/3 transition-all duration-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Choose Your Payment Method
              </h1>

              {/* Payment Options */}
              <div className="space-y-4 mb-8">
                {/* Credit Card Option */}
                <div className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary-yellow transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="credit-card"
                        name="payment-method"
                        className="h-4 w-4 text-primary-yellow focus:ring-primary-yellow"
                        defaultChecked
                      />
                      <label htmlFor="credit-card" className="ml-3 font-medium">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                        VISA
                      </div>
                      <div className="w-8 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                        MC
                      </div>
                    </div>
                  </div>
                </div>

                {/* PayPal Option */}
                <div className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary-yellow transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="payment-method"
                        className="h-4 w-4 text-primary-yellow focus:ring-primary-yellow"
                      />
                      <label htmlFor="paypal" className="ml-3 font-medium">
                        PayPal
                      </label>
                    </div>
                    <div className="text-blue-600 font-bold text-sm">PayPal</div>
                  </div>
                </div>

                {/* Installment Plan */}
                <div className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary-yellow transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="installments"
                        name="payment-method"
                        className="h-4 w-4 text-primary-yellow focus:ring-primary-yellow"
                      />
                      <label htmlFor="installments" className="ml-3">
                        <div className="font-medium">Installment Plan</div>
                        <div className="text-sm text-gray-600">3 payments of $400/month</div>
                      </label>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      Popular
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit Card Form */}
              <div id="card-form" className="space-y-6">
                <h3 className="text-lg font-semibold">Card Information</h3>
                
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                      CVC *
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                  />
                </div>

                {/* Billing Address */}
                <div>
                  <h4 className="text-md font-semibold mb-4">Billing Address</h4>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 mt-8">
                <Link
                  href={`/enroll/${courseSlug}/step-1-info`}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 text-center rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </Link>
                <Link
                  href={`/enroll/${courseSlug}/step-3-confirmation`}
                  className="flex-1 bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-center transition-all hover:-translate-y-1"
                >
                  Complete Payment
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{courseName}</h4>
                  <p className="text-sm text-gray-600">AI Transformation Course</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Course Price</span>
                    <span>$1,500</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Early Bird Discount</span>
                    <span>-$300</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee</span>
                    <span>$0</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$1,200</span>
                  </div>
                </div>

                {/* Guarantee Badge */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mt-6">
                  <div className="text-green-600 font-semibold mb-1">
                    💼 Job Placement Guarantee
                  </div>
                  <div className="text-sm text-green-700">
                    Get placed in 5+ countries or full refund
                  </div>
                </div>

                {/* What's Included */}
                <div className="mt-6 space-y-2">
                  <h4 className="font-medium mb-3">What's Included:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      12 weeks of intensive training
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Live sessions with experts
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Real-world projects
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Certificate of completion
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Job placement support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center">
            <div className="w-6 h-6 text-primary-blue mr-3">🔒</div>
            <p className="text-sm text-gray-600">
              Your payment is secured with 256-bit SSL encryption. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}