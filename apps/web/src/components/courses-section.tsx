'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  Award,
  Calendar,
  BookOpen,
  DollarSign,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';

export interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  image?: string
  price: number
  discountedPrice?: number
  currency: string
  duration: string
  studentsCount: number
  rating: number
  reviewsCount: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  highlights: string[]
  outcomes: string[]
  instructor: {
    name: string
    title: string
    avatar?: string
  }
  nextCohort: string
  stripePriceId?: string
  paypalItemId?: string
  popular?: boolean
  badge?: string
}

export interface CoursesProps {
  className?: string
  variant?: 'grid' | 'carousel' | 'featured'
  showFilters?: boolean
  maxCourses?: number
  title?: string
  subtitle?: string
  ctaText?: string
}

const courses: Course[] = [
  {
    id: 'ai-transformation-manager',
    title: 'AI Transformation Manager',
    subtitle: 'Lead AI initiatives in any organization',
    description: 'Master the strategic implementation of AI solutions across organizations. Learn to identify opportunities, manage AI projects, and drive digital transformation initiatives.',
    price: 1500,
    discountedPrice: 1200,
    currency: 'USD',
    duration: '12 weeks',
    studentsCount: 2847,
    rating: 4.9,
    reviewsCount: 431,
    level: 'Intermediate',
    category: 'Strategy & Leadership',
    highlights: [
      'AI Strategy Development',
      'Project Management',
      'ROI Analysis & Measurement',
      'Change Management',
      'Vendor Selection',
    ],
    outcomes: [
      'Lead AI transformation projects',
      'Develop comprehensive AI strategies',
      'Manage cross-functional AI teams',
      'Measure and optimize AI ROI',
    ],
    instructor: {
      name: 'Dr. Sarah Chen',
      title: 'Former AI Director at Microsoft',
    },
    nextCohort: 'March 15, 2024',
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'no-code-development',
    title: 'No-Code Website Development',
    subtitle: 'Build professional websites without coding',
    description: 'Create stunning, fully functional websites using the latest no-code platforms. Perfect for entrepreneurs, marketers, and anyone wanting to build web presence quickly.',
    price: 1000,
    discountedPrice: 800,
    currency: 'USD',
    duration: '8 weeks',
    studentsCount: 1923,
    rating: 4.8,
    reviewsCount: 287,
    level: 'Beginner',
    category: 'Development',
    highlights: [
      'Webflow Mastery',
      'Advanced Interactions',
      'E-commerce Integration',
      'SEO Optimization',
      'Client Management',
    ],
    outcomes: [
      'Build professional websites',
      'Create e-commerce stores',
      'Implement advanced animations',
      'Start freelance business',
    ],
    instructor: {
      name: 'Marcus Rodriguez',
      title: 'Lead Designer at Airbnb',
    },
    nextCohort: 'February 28, 2024',
  },
  {
    id: 'ai-video-avatar',
    title: 'AI Video & Avatar Generation',
    subtitle: 'Create content with AI-powered video',
    description: 'Master cutting-edge AI video generation tools to create professional content at scale. Learn avatar creation, voice synthesis, and automated video production.',
    price: 1300,
    discountedPrice: 1000,
    currency: 'USD',
    duration: '10 weeks',
    studentsCount: 1456,
    rating: 4.9,
    reviewsCount: 203,
    level: 'Advanced',
    category: 'Content Creation',
    highlights: [
      'AI Avatar Creation',
      'Voice Synthesis',
      'Video Automation',
      'Content Strategy',
      'Brand Integration',
    ],
    outcomes: [
      'Generate AI-powered videos',
      'Create realistic avatars',
      'Automate content production',
      'Scale video marketing',
    ],
    instructor: {
      name: 'Alex Thompson',
      title: 'Creative Director at Meta',
    },
    nextCohort: 'March 8, 2024',
    badge: 'New Course',
  },
];

const CourseCard = React.forwardRef<HTMLDivElement, { course: Course; variant?: 'default' | 'compact' | 'featured' }>(
  ({ course, variant = 'default' }, ref) => {
    const discountPercentage = course.discountedPrice
      ? Math.round(((course.price - course.discountedPrice) / course.price) * 100)
      : 0;

    return (
      <div
        ref={ref}
        className={cn(
          'group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300',
          'border border-border-light hover:border-primary-yellow/20 hover:-translate-y-1',
          variant === 'featured' && 'ring-2 ring-primary-yellow',
        )}
      >
        {/* Course Badge */}
        {(course.popular || course.badge) && (
          <div className="absolute top-4 left-4 z-10">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-bold',
              course.popular
                ? 'bg-primary-yellow text-dark-pure'
                : 'bg-success text-white',
            )}>
              {course.badge || 'Most Popular'}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-error text-white px-2 py-1 rounded-full text-xs font-bold">
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Course Image */}
        <div className="relative aspect-video overflow-hidden">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-yellow/20 via-accent-blue/20 to-primary-yellow/30 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary-yellow" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-dark-pure/0 group-hover:bg-dark-pure/20 transition-colors duration-300 flex items-center justify-center">
            <Button
              variant="primary"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                course.level === 'Beginner' && 'bg-success/10 text-success',
                course.level === 'Intermediate' && 'bg-warning/10 text-warning',
                course.level === 'Advanced' && 'bg-error/10 text-error',
              )}>
                {course.level}
              </span>
              <span className="text-xs text-text-gray">{course.category}</span>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary-yellow transition-colors duration-300">
              {course.title}
            </h3>
            <p className="text-text-gray text-sm mb-3">
              {course.subtitle}
            </p>

            {/* Rating and Stats */}
            <div className="flex items-center space-x-4 text-sm text-text-gray mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-warning fill-warning" />
                <span className="font-medium">{course.rating}</span>
                <span>({course.reviewsCount})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.studentsCount.toLocaleString()} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          {variant !== 'compact' && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-text-primary mb-3">
                What you'll learn:
              </h4>
              <ul className="space-y-2" role="list">
                {course.highlights.slice(0, 3).map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-text-gray">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructor */}
          <div className="flex items-center space-x-3 mb-6 p-3 bg-surface-light rounded-lg">
            <div className="h-10 w-10 bg-primary-yellow/20 rounded-full flex items-center justify-center">
              <Award className="h-5 w-5 text-primary-yellow" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                {course.instructor.name}
              </div>
              <div className="text-xs text-text-gray">
                {course.instructor.title}
              </div>
            </div>
          </div>

          {/* Pricing and CTA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {course.discountedPrice ? (
                  <>
                    <span className="text-2xl font-bold text-text-primary">
                      {formatCurrency(course.discountedPrice, course.currency)}
                    </span>
                    <span className="text-sm text-text-gray line-through">
                      {formatCurrency(course.price, course.currency)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-text-primary">
                    {formatCurrency(course.price, course.currency)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-text-gray">Next cohort</div>
                <div className="text-sm font-medium text-text-primary">
                  {course.nextCohort}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`} className="inline-flex items-center justify-center">
                  Enroll Now
                  <TrendingUp className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/courses/${course.id}#preview`}>
                  Preview Course
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

CourseCard.displayName = 'CourseCard';

const CoursesSection = React.forwardRef<HTMLElement, CoursesProps>(
  ({
    className,
    variant = 'grid',
    showFilters = false,
    maxCourses,
    title = 'Transform Your Career with Our AI Courses',
    subtitle = 'Choose from our comprehensive curriculum designed to take you from beginner to AI expert',
    ctaText = 'View All Courses',
    ...props
  }, ref) => {
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

    const displayedCourses = maxCourses
      ? courses.slice(0, maxCourses)
      : courses;

    const categories = ['all', ...new Set(courses.map(course => course.category))];

    const filteredCourses = selectedCategory === 'all'
      ? displayedCourses
      : displayedCourses.filter(course => course.category === selectedCategory);

    return (
      <section
        ref={ref}
        className={cn(
          'py-16 lg:py-24 bg-light-bg font-rubik',
          className,
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              {title}
            </h2>
            <p className="text-lg lg:text-xl text-text-gray leading-relaxed mb-8">
              {subtitle}
            </p>

            {/* Category Filters */}
            {showFilters && (
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === 'all' ? 'All Courses' : category}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant={variant === 'featured' ? 'featured' : 'default'}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto border border-border-light">
              <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
                Not sure which course is right for you?
              </h3>
              <p className="text-lg text-text-gray mb-8 max-w-2xl mx-auto">
                Book a free 30-minute consultation with our career advisors. We'll help you choose
                the perfect course based on your background and career goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="xl" variant="primary" asChild>
                  <Link href="/consultation" className="inline-flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Free Consultation
                  </Link>
                </Button>

                <Button size="xl" variant="outline" asChild>
                  <Link href="/courses" className="inline-flex items-center">
                    {ctaText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-text-gray">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-primary-yellow" />
                  <span>Learn from industry experts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-primary-yellow" />
                  <span>Job placement guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary-yellow" />
                  <span>Join 5,000+ successful graduates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

CoursesSection.displayName = 'CoursesSection';

export { CoursesSection, CourseCard, courses };
export type { Course };
