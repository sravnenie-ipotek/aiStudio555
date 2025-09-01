export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-yellow rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Preparing your learning experience
          </p>
        </div>
      </div>
    </div>
  )
}