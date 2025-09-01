export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-blue">
                Projectdes AI Academy
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Secure Authentication
            </div>
          </div>
        </div>
      </header>

      {/* Loading Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Loading Animation */}
            <div className="flex flex-col items-center space-y-6">
              {/* Spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-yellow rounded-full border-t-transparent animate-spin"></div>
              </div>
              
              {/* Loading Text */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Authenticating...
                </h2>
                <p className="text-gray-600">
                  Verifying your credentials securely
                </p>
              </div>
            </div>
            
            {/* Progress Dots */}
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Projectdes AI Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}