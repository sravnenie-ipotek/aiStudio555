export default function MarketingLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-primary-yellow via-yellow-300 to-primary-yellow py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="animate-pulse">
              {/* Badge skeleton */}
              <div className="w-48 h-8 bg-black/20 rounded-full mb-6"></div>
              
              {/* Title skeleton */}
              <div className="space-y-3 mb-6">
                <div className="h-12 bg-black/20 rounded-lg w-full"></div>
                <div className="h-12 bg-black/20 rounded-lg w-4/5"></div>
              </div>
              
              {/* Subtitle skeleton */}
              <div className="space-y-2 mb-8">
                <div className="h-6 bg-black/20 rounded w-full"></div>
                <div className="h-6 bg-black/20 rounded w-3/4"></div>
              </div>
              
              {/* Buttons skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="w-48 h-12 bg-black/30 rounded-lg"></div>
                <div className="w-56 h-12 bg-white/30 rounded-lg"></div>
              </div>
              
              {/* Stats skeleton */}
              <div className="grid grid-cols-3 gap-8 max-w-md">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-8 bg-black/20 rounded w-16"></div>
                    <div className="h-4 bg-black/20 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}