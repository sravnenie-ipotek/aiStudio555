'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Clock, Shield, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoursesHeroProps {
  metrics: {
    graduateCount: number;
    yearsInOperation: number;
    successRate: number;
    averageSalaryIncrease: number;
  };
  className?: string;
}

export function CoursesHero({ 
  metrics = {
    graduateCount: 12000,
    yearsInOperation: 8,
    successRate: 87,
    averageSalaryIncrease: 150
  },
  className 
}: CoursesHeroProps) {
  const { tSync } = useTranslation();

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <section
      className={cn(
        "relative py-16 lg:py-24 bg-gradient-to-br from-primary-yellow via-yellow-light to-primary-yellow overflow-hidden",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 75%, transparent 50%, rgba(0,0,0,0.05) 50%)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Authority Signal Badge - TeachMeSkills Pattern */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-black/10 backdrop-blur-sm text-black mb-8 border border-black/5">
            <Users className="w-5 h-5 mr-2" />
            <span className="text-base sm:text-lg font-bold">
              {metrics.graduateCount.toLocaleString()}+ {tSync('courses.hero.graduates') || 'выпускников'}
            </span>
            <span className="mx-3 text-black/60 hidden sm:inline">•</span>
            <span className="text-base sm:text-lg font-bold hidden sm:inline">
              {metrics.yearsInOperation} {tSync('courses.hero.years') || 'лет опыта'}
            </span>
          </div>

          {/* Primary Value Proposition */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-black leading-[1.1] mb-6">
            <span className="block">
              {tSync('courses.hero.title') || 'AI-Курсы Online'}
            </span>
            <span className="block bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
              {tSync('courses.hero.subtitle') || 'для карьерного роста'}
            </span>
          </h1>

          {/* Secondary Value Proposition */}
          <p className="text-lg lg:text-xl text-black/80 leading-relaxed mb-10 max-w-4xl mx-auto">
            {tSync('courses.hero.description') || 
             'Персональное менторство, практические проекты и гарантированное трудоустройство в AI-сфере'}
          </p>

          {/* Dual CTA Strategy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="xl" 
              className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-6 text-base sm:text-lg shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto min-w-[200px]"
              onClick={() => scrollToElement('courses-catalog')}
            >
              {tSync('courses.hero.cta.primary') || 'Выбрать курс'}
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              className="border-2 border-black/20 hover:border-black text-black font-bold px-8 py-6 text-base sm:text-lg bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto min-w-[200px]"
              onClick={() => scrollToElement('consultation-form')}
            >
              {tSync('courses.hero.cta.secondary') || 'Бесплатная консультация'}
            </Button>
          </div>

          {/* Social Proof Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {/* Employment Rate */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/30 hover:bg-white/30 transition-colors duration-300">
              <div className="text-2xl lg:text-3xl font-black text-black mb-2">
                {metrics.successRate}%
              </div>
              <div className="text-xs lg:text-sm text-black/70 font-medium">
                {tSync('courses.hero.metrics.employment') || 'трудоустройство'}
              </div>
            </div>
            
            {/* Salary Increase */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/30 hover:bg-white/30 transition-colors duration-300">
              <div className="text-2xl lg:text-3xl font-black text-black mb-2">
                +{metrics.averageSalaryIncrease}%
              </div>
              <div className="text-xs lg:text-sm text-black/70 font-medium">
                {tSync('courses.hero.metrics.salary') || 'рост зарплаты'}
              </div>
            </div>
            
            {/* Certificate */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/30 hover:bg-white/30 transition-colors duration-300 flex flex-col items-center">
              <Award className="w-6 h-6 lg:w-8 lg:h-8 text-black mb-2" />
              <div className="text-xs lg:text-sm text-black/70 font-medium text-center">
                {tSync('courses.hero.metrics.certificate') || 'сертификат'}
              </div>
            </div>
            
            {/* Flexible Schedule */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/30 hover:bg-white/30 transition-colors duration-300 flex flex-col items-center">
              <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-black mb-2" />
              <div className="text-xs lg:text-sm text-black/70 font-medium text-center">
                {tSync('courses.hero.metrics.flexible') || 'гибкий график'}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-black/60">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span>{tSync('courses.hero.trust.secure') || 'Безопасная оплата'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>{tSync('courses.hero.trust.rating') || '4.8 из 5 звёзд'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{tSync('courses.hero.trust.support') || '24/7 поддержка'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}