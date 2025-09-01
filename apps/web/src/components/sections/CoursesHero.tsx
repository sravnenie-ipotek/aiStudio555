'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Clock, Shield, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
        "relative py-20 lg:py-32 bg-white overflow-hidden",
        className
      )}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 70%, transparent 60%, rgba(7,7,7,0.03) 60%)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Authority Signal Badge - TeachMeSkills Clean Pattern */}
          <div className="inline-flex items-center px-8 py-4 rounded-full bg-light-bg border border-border-light text-text-primary mb-12 hover:bg-surface-light transition-colors duration-200">
            <Users className="w-5 h-5 mr-3 text-nav-yellow" />
            <span className="text-base sm:text-lg font-bold">
              {metrics.graduateCount.toLocaleString()}+ {tSync('courses.hero.graduates') || 'выпускников'}
            </span>
            <span className="mx-4 text-text-gray hidden sm:inline">•</span>
            <span className="text-base sm:text-lg font-bold hidden sm:inline">
              {metrics.yearsInOperation} {tSync('courses.hero.years') || 'лет опыта'}
            </span>
          </div>

          {/* Primary Value Proposition - TeachMeSkills Typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-text-primary leading-[1.1] mb-8">
            <span className="block">
              {tSync('courses.hero.title') || 'AI-Курсы Online'}
            </span>
            <span className="block">
              <span className="text-nav-yellow">{tSync('courses.hero.subtitle') || 'для карьерного роста'}</span>
            </span>
          </h1>

          {/* Secondary Value Proposition */}
          <p className="text-xl lg:text-2xl text-text-secondary leading-relaxed mb-12 max-w-4xl mx-auto font-medium">
            {tSync('courses.hero.description') || 
             'Персональное менторство, практические проекты и гарантированное трудоустройство в AI-сфере'}
          </p>

          {/* Enhanced Dual CTA Strategy - Premium UX with Interactive Elements */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 justify-center items-center mb-20">
            {/* Choose Course Button with Interactive Image */}
            <div className="group flex flex-col sm:flex-row items-center gap-6 lg:gap-4">
              <Button 
                size="lg" 
                className="bg-primary-yellow hover:bg-yellow-hover text-text-primary font-semibold px-6 py-3 text-base rounded-lg shadow-button hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-yellow/20 min-h-[48px] min-w-[160px]"
                onClick={() => scrollToElement('courses-catalog')}
                aria-label="Выбрать подходящий AI курс"
              >
                {tSync('courses.hero.cta.primary') || 'Выбрать курс'}
                <TrendingUp className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <Image
                  src="/images/chooseStudy.jpeg"
                  alt="Изображение выбора курса"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 80px, 96px"
                />
              </div>
            </div>
            
            {/* Enhanced Consultation Button with Premium Interactive Design */}
            <div className="group flex flex-col sm:flex-row items-center gap-6 lg:gap-4 relative">
              {/* Subtle glow effect for consultation CTA */}
              <div className="absolute -inset-2 bg-gradient-to-r from-nav-yellow/10 to-nav-yellow/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Button 
                variant="outline" 
                size="lg"
                className="relative border-2 border-nav-yellow hover:border-nav-yellow hover:bg-nav-yellow hover:text-text-primary text-nav-yellow font-semibold px-6 py-3 text-base rounded-lg bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-nav-yellow/30 min-h-[48px] min-w-[200px] hover:-translate-y-1"
                onClick={() => scrollToElement('consultation-form')}
                aria-label="Записаться на бесплатную консультацию с AI экспертом"
              >
                <span className="relative z-10">
                  {tSync('courses.hero.cta.secondary') || 'Бесплатная консультация'}
                </span>
                
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-nav-yellow/90 to-yellow-hover/90 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
              </Button>
              
              {/* Enhanced Consultation Image with Premium Styling */}
              <div className="relative">
                {/* Animated background ring */}
                <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-nav-yellow/20 to-yellow-hover/20 animate-pulse"></div>
                
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 border-4 border-white group-hover:border-nav-yellow/30">
                  <Image
                    src="/images/chips/a-graphic-design-of-a-circular-button-wi_DThCDVrNTgCQm3JIrwGmeg_41VKs1AnRP6oWcrTUct9rQ.png"
                    alt="Консультация - иконка чата с экспертом"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 80px, 96px"
                    priority
                  />
                  
                  {/* Floating notification indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white shadow-md group-hover:scale-125 transition-transform duration-300 animate-bounce">
                    <div className="w-full h-full bg-success rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
              </div>
              
              {/* Consultation benefits tooltip - shows on hover */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-text-primary text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-20">
                <span>15 мин · Персональный план · Бесплатно</span>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-text-primary rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Social Proof Metrics Grid - Clean White Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Employment Rate */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-border-light shadow-card hover:shadow-lg transition-all duration-200 hover:border-nav-yellow/20">
              <div className="text-3xl lg:text-4xl font-black text-nav-yellow mb-3">
                {metrics.successRate}%
              </div>
              <div className="text-sm lg:text-base text-text-secondary font-medium">
                {tSync('courses.hero.metrics.employment') || 'трудоустройство'}
              </div>
            </div>
            
            {/* Salary Increase */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-border-light shadow-card hover:shadow-lg transition-all duration-200 hover:border-nav-yellow/20">
              <div className="text-3xl lg:text-4xl font-black text-nav-yellow mb-3">
                +{metrics.averageSalaryIncrease}%
              </div>
              <div className="text-sm lg:text-base text-text-secondary font-medium">
                {tSync('courses.hero.metrics.salary') || 'рост зарплаты'}
              </div>
            </div>
            
            {/* Certificate */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-border-light shadow-card hover:shadow-lg transition-all duration-200 hover:border-nav-yellow/20 flex flex-col items-center">
              <Award className="w-8 h-8 lg:w-10 lg:h-10 text-nav-yellow mb-3" />
              <div className="text-sm lg:text-base text-text-secondary font-medium text-center">
                {tSync('courses.hero.metrics.certificate') || 'сертификат'}
              </div>
            </div>
            
            {/* Flexible Schedule */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-border-light shadow-card hover:shadow-lg transition-all duration-200 hover:border-nav-yellow/20 flex flex-col items-center">
              <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-nav-yellow mb-3" />
              <div className="text-sm lg:text-base text-text-secondary font-medium text-center">
                {tSync('courses.hero.metrics.flexible') || 'гибкий график'}
              </div>
            </div>
          </div>

          {/* Trust Indicators - Clean Layout */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-text-gray">
            <div className="flex items-center gap-3 text-base font-medium">
              <Shield className="w-5 h-5 text-nav-yellow" />
              <span>{tSync('courses.hero.trust.secure') || 'Безопасная оплата'}</span>
            </div>
            <div className="flex items-center gap-3 text-base font-medium">
              <Star className="w-5 h-5 text-nav-yellow fill-current" />
              <span>{tSync('courses.hero.trust.rating') || '4.8 из 5 звёзд'}</span>
            </div>
            <div className="flex items-center gap-3 text-base font-medium">
              <Clock className="w-5 h-5 text-nav-yellow" />
              <span>{tSync('courses.hero.trust.support') || '24/7 поддержка'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}