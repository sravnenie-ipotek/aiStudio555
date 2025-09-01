import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us - Projectdes AI Academy',
  description: 'Learn about our mission to transform working professionals into certified AI specialists through fast-track, project-based learning programs.',
  keywords: ['AI training', 'professional development', 'career transformation', 'AI certification'],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary-yellow via-yellow-300 to-primary-yellow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
              Transforming Careers with AI
            </h1>
            <p className="text-lg sm:text-xl text-black/70 leading-relaxed max-w-3xl mx-auto">
              At Projectdes AI Academy, we're dedicated to bridging the gap between traditional careers and 
              the AI-powered future of work through hands-on, practical training programs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We believe that AI transformation shouldn't be exclusive to tech giants or computer science graduates. 
                Every working professional deserves the opportunity to harness AI tools and methodologies to advance 
                their career and create meaningful impact.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Through our fast-track, project-based learning approach, we make AI education accessible, practical, 
                and immediately applicable to real-world challenges across industries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-primary-yellow rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-black">500+</div>
                  <div className="text-sm text-black/70">Professionals Trained</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Job Placement Rate</div>
                </div>
                <div className="bg-primary-blue rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">5+</div>
                  <div className="text-sm text-white/70">Countries Served</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              These principles guide everything we do, from course design to student support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Practical Learning</h3>
              <p className="text-gray-700 leading-relaxed">
                Every lesson is designed around real-world projects and challenges you'll face in your career. 
                No theoretical fluff—just practical skills that work.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Mentorship</h3>
              <p className="text-gray-700 leading-relaxed">
                You're not just a student number. Every learner gets personalized guidance from industry experts 
                who understand your career goals and challenges.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Guaranteed Results</h3>
              <p className="text-gray-700 leading-relaxed">
                We stand behind our programs with international job placement guarantees. Your success is our success, 
                and we're committed to your career transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Led by Industry Experts
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our instructors and mentors bring decades of experience from leading tech companies, 
              startups, and AI research institutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Instructor {i}</h3>
                <p className="text-primary-blue font-medium mb-3">AI Transformation Lead</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  15+ years experience in AI implementation, machine learning, and digital transformation across Fortune 500 companies.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already made the leap into AI-powered careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="bg-primary-yellow hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 inline-block"
            >
              Explore Courses
            </a>
            <a
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold transition-all inline-block"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}