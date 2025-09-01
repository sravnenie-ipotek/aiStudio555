import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Explore our comprehensive AI transformation courses: AI Transformation Manager, No-Code Website Development, and AI Video & Avatar Generation.',
}

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl mb-6">
          AI Transformation Courses
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Choose from our flagship programs designed to transform working professionals 
          into certified AI specialists through fast-track, project-based learning.
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Course cards will be implemented here */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
          <h3 className="text-xl font-bold mb-3">AI Transformation Manager</h3>
          <p className="text-gray-600 mb-4">Master AI strategy and implementation</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-blue">$1,500</span>
            <button className="bg-primary-yellow hover:bg-yellow-400 px-6 py-2 rounded-xl font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="w-16 h-16 bg-primary-yellow rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Project-Based Learning</h3>
            <p className="text-gray-600">Learn by building real-world projects</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-primary-yellow rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Job Placement Guarantee</h3>
            <p className="text-gray-600">International placement in 5+ countries</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-primary-yellow rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">Learn from industry professionals</p>
          </div>
        </div>
      </div>
    </div>
  )
}