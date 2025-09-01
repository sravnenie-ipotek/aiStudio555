export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Courses Section */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
            
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}