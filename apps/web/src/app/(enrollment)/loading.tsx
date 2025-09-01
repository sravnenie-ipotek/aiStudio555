export default function EnrollmentLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Loading Animation */}
          <div className="flex flex-col items-center space-y-6">
            {/* Multi-step Progress Spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-yellow rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 border-2 border-primary-blue rounded-full border-r-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            
            {/* Loading Text */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Enrollment...
              </h2>
              <p className="text-gray-600">
                Setting up your learning journey
              </p>
            </div>
          </div>
          
          {/* Steps Indicator */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Verifying course selection</span>
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900 font-medium">Processing payment</span>
              <div className="w-4 h-4 border-2 border-primary-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Creating account</span>
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-green-700">Secure SSL encrypted processing</span>
            </div>
          </div>
        </div>
        
        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This may take a few moments. Please don't close this window.
          </p>
        </div>
      </div>
    </div>
  )
}