import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface CoursePageProps {
  params: {
    slug: string
  }
}

// Mock course data - replace with actual data fetching
const getCourse = async (slug: string) => {
  const courses = {
    'ai-transformation-manager': {
      id: 'ai-transformation-manager',
      title: 'AI Transformation Manager',
      description: 'Master AI strategy and implementation for business transformation',
      price: 1500,
      discountedPrice: 1200,
      duration: '12 weeks',
      level: 'Advanced',
      stripePriceId: 'price_ai_transform',
    },
    'no-code-website-development': {
      id: 'no-code-website-development',
      title: 'No-Code Website Development',
      description: 'Build professional websites without coding using modern tools',
      price: 1000,
      discountedPrice: 800,
      duration: '8 weeks',
      level: 'Beginner',
      stripePriceId: 'price_no_code',
    },
    'ai-video-avatar-generation': {
      id: 'ai-video-avatar-generation',
      title: 'AI Video & Avatar Generation',
      description: 'Create engaging video content with AI-powered avatars',
      price: 1300,
      discountedPrice: 1000,
      duration: '10 weeks',
      level: 'Intermediate',
      stripePriceId: 'price_ai_video',
    },
  }
  
  return courses[slug as keyof typeof courses] || null
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourse(params.slug)
  
  if (!course) {
    return {
      title: 'Course Not Found',
    }
  }

  return {
    title: course.title,
    description: course.description,
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.slug)
  
  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Course Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-primary-yellow text-black px-3 py-1 rounded-full text-sm font-semibold">
              {course.level}
            </span>
            <span className="text-gray-600">{course.duration}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {course.title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {course.description}
          </p>
          
          {/* Pricing */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-primary-blue">
              ${course.discountedPrice}
            </span>
            <span className="text-xl text-gray-500 line-through">
              ${course.price}
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
              Save ${course.price - course.discountedPrice}
            </span>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary-yellow hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1">
              Enroll Now
            </button>
            <button className="border-2 border-gray-300 hover:border-primary-blue text-gray-700 px-8 py-4 rounded-xl font-semibold transition-colors">
              Download Syllabus
            </button>
          </div>
        </div>
        
        {/* Course Image/Video */}
        <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
          <span className="text-gray-500">Course Preview Video</span>
        </div>
      </div>

      {/* Course Details Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8" aria-label="Course sections">
          <button className="border-b-2 border-primary-yellow py-4 px-1 text-sm font-medium text-primary-blue">
            Overview
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Curriculum
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Instructors
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Reviews
          </button>
        </nav>
      </div>

      {/* Course Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* What You'll Learn */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'AI strategy development',
                'Implementation frameworks',
                'ROI measurement',
                'Change management',
                'Technology assessment',
                'Team leadership',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary-yellow rounded-full flex items-center justify-center">
                    <span className="text-black text-sm">✓</span>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Requirements</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• 2+ years of professional experience</li>
              <li>• Basic understanding of business processes</li>
              <li>• Access to a computer with internet connection</li>
              <li>• Commitment to complete the full program</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary-blue mb-2">
                ${course.discountedPrice}
              </div>
              <div className="text-gray-500 line-through mb-4">
                ${course.price}
              </div>
              <button className="w-full bg-primary-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-1">
                Enroll Now
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="font-semibold">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="font-semibold">Multi-language</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Certificate:</span>
                <span className="font-semibold">Yes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Job Guarantee:</span>
                <span className="font-semibold">Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}