'use client';

import { Course } from '@/types/course';
import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Clock, Users, Award, Star, TrendingUp, BookOpen, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

// TODO: Fix type to use proper CourseData from shared types
interface CourseCardProps {
  course: any; // Temporarily using any to fix build
  featured?: boolean;
  className?: string;
}

function CourseCardComponent({ course, featured = false, className }: CourseCardProps) {
  const { tSync } = useTranslation();
  
  const discountPercentage = course.discountedPrice && course.price
    ? Math.round(((course.price - course.discountedPrice) / course.price) * 100)
    : 0;

  const currentPrice = course.discountedPrice || course.price;
  const displayTitle = course.title?.ru || course.title?.en || 'Course Title';
  const displayDescription = course.shortDescription?.ru || course.shortDescription?.en || course.description?.ru || course.description?.en || 'Course description';

  // Performance: Memoize scroll function
  const scrollToConsultation = useCallback(() => {
    const element = document.getElementById('consultation-form');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-200 hover:shadow-lg bg-white border border-border-light rounded-2xl",
      featured ? "border-nav-yellow shadow-card ring-2 ring-nav-yellow/20" : "hover:border-nav-yellow/30",
      className
    )}>
      
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-nav-yellow text-text-primary font-bold px-3 py-1 shadow-card">
            ⭐ {tSync('courses.card.popular') || 'Популярный'}
          </Badge>
        </div>
      )}

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-error text-white font-bold px-3 py-1 shadow-card">
            -{discountPercentage}%
          </Badge>
        </div>
      )}

      <CardHeader className="p-0">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden bg-light-bg rounded-t-2xl">
          {course.thumbnailImage || course.thumbnail ? (
            <Image
              src={course.thumbnailImage || course.thumbnail || '/images/course-placeholder.jpg'}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-light-bg to-surface-light">
              <BookOpen className="w-16 h-16 text-text-gray" />
            </div>
          )}
          
          {/* Category Badge Overlay */}
          <div className="absolute bottom-4 left-4">
            <Badge 
              className="bg-text-primary/90 text-white px-3 py-1 backdrop-blur-sm font-medium"
            >
              {course.category?.name?.ru || course.category?.name?.en || 'AI Курсы'}
            </Badge>
          </div>

          {/* Course Level */}
          {!discountPercentage && (
            <div className="absolute top-4 left-4">
              <Badge 
                variant="outline" 
                className="bg-white/95 text-text-secondary border-border-light backdrop-blur-sm font-medium"
              >
                {course.level || 'Beginner'}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-nav-yellow transition-colors duration-200 leading-tight">
          {displayTitle}
        </h3>

        {/* Course Description */}
        <p className="text-text-secondary text-base leading-relaxed mb-4 line-clamp-3">
          {displayDescription}
        </p>

        {/* Course Metrics Row */}
        <div className="flex items-center gap-4 text-sm text-text-gray mb-4 p-3 bg-light-bg rounded-lg">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-nav-yellow" />
            <span>{course.durationWeeks || Math.ceil((course.duration || 0) / 40) || 8} нед</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-nav-yellow" />
            <span>{course.studentCount || 0}+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-nav-yellow text-nav-yellow" />
            <span>{course.averageRating || 4.8}</span>
          </div>
        </div>

        {/* Career Outcomes - TeachMeSkills Pattern */}
        {course.careerOutcomes && course.careerOutcomes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-nav-yellow" />
              <h4 className="text-sm font-semibold text-text-primary">
                {tSync('courses.card.careers') || 'Кем станешь:'}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {course.careerOutcomes.slice(0, 2).map((outcome: any, index: any) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-nav-yellow/30 text-text-secondary hover:bg-nav-yellow/10 transition-colors"
                >
                  {outcome}
                </Badge>
              ))}
              {course.careerOutcomes.length > 2 && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-nav-yellow/30 text-nav-yellow font-semibold"
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
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              {tSync('courses.card.skills') || 'Изучите:'}
            </h4>
            <div className="text-sm text-text-secondary leading-relaxed">
              {course.skillsLearned.slice(0, 3).join(' • ')}
              {course.skillsLearned.length > 3 && '...'}
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <div className="flex items-baseline gap-3 mb-4 p-4 bg-light-bg rounded-lg">
          {course.discountedPrice ? (
            <>
              <span className="text-2xl font-black text-nav-yellow">
                ₽{course.discountedPrice.toLocaleString()}
              </span>
              <span className="text-lg text-text-gray line-through">
                ₽{course.price?.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-2xl font-black text-text-primary">
              ₽{(course.price || 1200).toLocaleString()}
            </span>
          )}
        </div>

        {/* Payment Plans */}
        {course.paymentPlans && course.paymentPlans.length > 0 && (
          <div className="text-sm text-text-secondary mb-4 flex items-center gap-2">
            <span>от ₽{Math.floor((currentPrice || 1200) / 6).toLocaleString()}/месяц</span>
            <Badge variant="outline" className="text-xs border-nav-yellow/30 text-nav-yellow">
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
            className="w-full bg-primary-yellow hover:bg-yellow-hover text-text-primary font-bold transition-all duration-200 hover:shadow-button rounded-lg min-h-[48px]"
          >
            <Link href={`/courses/${course.slug}`} className="inline-flex items-center justify-center">
              {tSync('courses.card.cta.primary') || 'Подробнее о курсе'}
              <TrendingUp className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {/* Secondary CTA */}
          <Button 
            variant="outline" 
            className="w-full border-border-light hover:border-nav-yellow hover:bg-nav-yellow/10 text-text-secondary hover:text-text-primary transition-all duration-200 rounded-lg min-h-[48px]"
            onClick={scrollToConsultation}
          >
            {tSync('courses.card.cta.secondary') || 'Консультация'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Performance: Memoize CourseCard to prevent unnecessary re-renders
export const CourseCard = memo(CourseCardComponent, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.course.id === nextProps.course.id &&
    prevProps.course.price === nextProps.course.price &&
    prevProps.course.discountedPrice === nextProps.course.discountedPrice &&
    prevProps.featured === nextProps.featured &&
    prevProps.className === nextProps.className
  );
});