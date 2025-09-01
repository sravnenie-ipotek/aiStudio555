import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard Overview',
  description: 'Student dashboard overview with course progress and recent activity.',
}

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-gray-600">
          Continue your AI transformation journey. You're making great progress!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">2</h3>
          <p className="text-gray-600 text-sm">Enrolled Courses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
              This Week
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">12.5h</h3>
          <p className="text-gray-600 text-sm">Study Time</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
              Total
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
          <p className="text-gray-600 text-sm">Completed Lessons</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Average
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">87%</h3>
          <p className="text-gray-600 text-sm">Course Progress</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Current Courses */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              <Link
                href="/dashboard/courses"
                className="text-primary-blue hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {/* Course 1 */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      AI Transformation Manager
                    </h3>
                    <p className="text-sm text-gray-600">Module 3: Implementation Strategies</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    85% Complete
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-yellow h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Next: Risk Assessment Framework</span>
                  <Link
                    href="/dashboard/courses/ai-transformation-manager"
                    className="text-primary-blue hover:text-blue-700 font-medium"
                  >
                    Continue
                  </Link>
                </div>
              </div>

              {/* Course 2 */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      No-Code Website Development
                    </h3>
                    <p className="text-sm text-gray-600">Module 5: Advanced Integrations</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    92% Complete
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-yellow h-2 rounded-full w-[92%]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Next: Final Project Submission</span>
                  <Link
                    href="/dashboard/courses/no-code-website"
                    className="text-primary-blue hover:text-blue-700 font-medium"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Completed "AI Strategy Planning"
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 text-sm">📝</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Submitted Assignment #7
                  </p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-yellow-600 text-sm">💬</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Participated in community discussion
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-purple-600 text-sm">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Earned "Quick Learner" badge
                  </p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/progress"
              className="block text-center text-primary-blue hover:text-blue-700 text-sm font-medium mt-4 pt-4 border-t border-gray-100"
            >
              View All Activity
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-orange-200 bg-orange-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  Due Tomorrow
                </span>
                <span className="text-orange-600">⚠️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Project Proposal
              </h3>
              <p className="text-sm text-gray-600">AI Transformation Manager</p>
            </div>

            <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Due in 3 days
                </span>
                <span className="text-blue-600">📝</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Website Portfolio
              </h3>
              <p className="text-sm text-gray-600">No-Code Development</p>
            </div>

            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  Due in 1 week
                </span>
                <span className="text-green-600">🎥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Peer Review
              </h3>
              <p className="text-sm text-gray-600">Community Assignment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}