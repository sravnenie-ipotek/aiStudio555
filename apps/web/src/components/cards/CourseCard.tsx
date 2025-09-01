'use client';

import { CourseData } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Clock, Users, Award, Star, TrendingUp, BookOpen, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: CourseData;
  featured?: boolean;
  className?: string;
}

export function CourseCard({ course, featured = false, className }: CourseCardProps) {
  const { tSync } = useTranslation();
  
  const discountPercentage = course.discountPrice && course.price
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : 0;

  const currentPrice = course.discountPrice || course.price;
  const displayTitle = course.title?.ru || course.title?.en || 'Course Title';
  const displayDescription = course.shortDescription?.ru || course.shortDescription?.en || course.description?.ru || course.description?.en || 'Course description';

  const scrollToConsultation = () => {
    const element = document.getElementById('consultation-form');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white border-2",
      featured ? "border-primary-yellow shadow-xl ring-2 ring-primary-yellow/20" : "border-gray-200 hover:border-primary-yellow/50",
      className
    )}>
      
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary-yellow text-black font-bold px-3 py-1 shadow-lg">
            {tSync('courses.card.popular') || 'Популярный'}
          </Badge>
        </div>
      )}

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-red-500 text-white font-bold px-3 py-1 shadow-lg animate-pulse">
            -{discountPercentage}%
          </Badge>
        </div>
      )}

      <CardHeader className="p-0">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {course.thumbnailImage || course.thumbnail ? (
            <Image
              src={course.thumbnailImage || course.thumbnail || '/images/course-placeholder.jpg'}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-yellow/20 to-primary-yellow/40">
              <BookOpen className="w-16 h-16 text-primary-yellow" />
            </div>
          )}
          
          {/* Category Badge Overlay */}
          <div className="absolute bottom-4 left-4">
            <Badge 
              className="bg-black/80 text-white px-3 py-1 backdrop-blur-sm"
            >
              {course.category?.name?.ru || course.category?.name?.en || 'AI Курсы'}
            </Badge>
          </div>

          {/* Course Level */}
          <div className="absolute top-4 left-4">
            <Badge 
              variant="outline" 
              className="bg-white/90 text-gray-700 border-white/50 backdrop-blur-sm"
            >
              {course.level || 'Beginner'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-yellow transition-colors leading-tight">
          {displayTitle}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {displayDescription}
        </p>

        {/* Course Metrics Row */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.durationWeeks || Math.ceil((course.duration || 0) / 40) || 8} нед</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.studentCount || 0}+</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.averageRating || 4.8}</span>
          </div>
        </div>

        {/* Career Outcomes - TeachMeSkills Pattern */}
        {course.careerOutcomes && course.careerOutcomes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary-yellow" />
              <h4 className="text-sm font-semibold text-gray-800">
                {tSync('courses.card.careers') || 'Кем станешь:'}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {course.careerOutcomes.slice(0, 2).map((outcome, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-primary-yellow/30 text-gray-700 hover:bg-primary-yellow/10"
                >
                  {outcome}
                </Badge>
              ))}
              {course.careerOutcomes.length > 2 && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-primary-yellow/30 text-primary-yellow font-semibold"
                >
                  +{course.careerOutcomes.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Key Skills Preview */}
        {course.skillsLearned && course.skillsLearned.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              {tSync('courses.card.skills') || 'Изучите:'}
            </h4>
            <div className="text-sm text-gray-700">
              {course.skillsLearned.slice(0, 3).join(' • ')}
              {course.skillsLearned.length > 3 && '...'}
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <div className="flex items-baseline gap-3 mb-4">
          {course.discountPrice ? (
            <>
              <span className="text-2xl font-black text-gray-900">
                ${course.discountPrice}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${course.price}
              </span>
            </>
          ) : (
            <span className="text-2xl font-black text-gray-900">
              ${course.price || 1200}
            </span>
          )}
        </div>

        {/* Payment Plans */}
        {course.paymentPlans && course.paymentPlans.length > 0 && (
          <div className="text-sm text-gray-600 mb-4 flex items-center gap-1">
            <span>от ${Math.floor((currentPrice || 1200) / 6)}/месяц</span>
            <Badge variant="outline" className="text-xs">
              {tSync('courses.card.installments') || 'рассрочка'}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-3">
          {/* Primary CTA */}
          <Button 
            asChild 
            className="w-full bg-primary-yellow hover:bg-yellow-hover text-black font-bold transition-all duration-300 hover:shadow-lg"
          >
            <Link href={`/courses/${course.slug}`} className="inline-flex items-center justify-center">
              {tSync('courses.card.cta.primary') || 'Подробнее о курсе'}
              <TrendingUp className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {/* Secondary CTA */}
          <Button 
            variant="outline" 
            className="w-full border-gray-300 hover:border-primary-yellow hover:bg-primary-yellow/10 text-gray-700 hover:text-black transition-all duration-300"
            onClick={scrollToConsultation}
          >
            {tSync('courses.card.cta.secondary') || 'Консультация'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}