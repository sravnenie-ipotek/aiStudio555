'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const { tSync } = useTranslation();

  return (
    <section
      className={`relative ${className || ''} min-h-screen bg-gradient-to-br from-[#FFDA17] via-[#FFE555] to-[#FFDA17]`}
    >
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, transparent 50%, rgba(0,0,0,0.1) 50%)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Content Container - responsive padding and centering */}
      <div className="relative z-10 min-h-screen flex items-center py-20 lg:py-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive width - full on mobile, 8/12 on desktop */}
          <div className="w-full lg:w-8/12 xl:w-7/12">
            <div className="text-left">
              {/* Badge - better contrast */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white mb-6">
                <span className="text-white font-medium text-sm">
                  {tSync('hero.badge') || 'Старт нового потока 1 февраля'}
                </span>
              </div>

              {/* Main Title - responsive sizing */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-black mb-4 sm:mb-6 leading-tight">
                {tSync('hero.title') || 'AI-трансформация для разработчиков и бизнеса'}
              </h1>

              {/* Subtitle - responsive sizing */}
              <p className="text-base sm:text-lg md:text-xl text-black/70 mb-6 sm:mb-8 leading-relaxed">
                {tSync('hero.subtitle') ||
                  'Персональное менторство, практические курсы и стратегии роста для next-level карьеры'}
              </p>

              {/* CTA Buttons - stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#FFDA17] hover:bg-[#E2C528] text-black font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {tSync('hero.cta.primary') || 'Начать обучение'}
                  <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>

                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-black font-semibold rounded-lg transition-all duration-300 border-2 border-black/20 hover:border-black/30 text-sm sm:text-base"
                >
                  {tSync('hero.cta.secondary') || 'Бесплатная консультация'}
                </Link>
              </div>

              {/* Statistics - responsive grid */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-black/10">
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-black">12K+</div>
                  <div className="text-xs sm:text-sm text-black/60 mt-1">
                    {tSync('hero.stats.students') || '12,000+ выпускников'}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-black">25+</div>
                  <div className="text-xs sm:text-sm text-black/60 mt-1">
                    {tSync('hero.stats.courses') || '25+ курсов'}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-black">87%</div>
                  <div className="text-xs sm:text-sm text-black/60 mt-1">
                    {tSync('hero.stats.employment') || '87% трудоустройство'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
