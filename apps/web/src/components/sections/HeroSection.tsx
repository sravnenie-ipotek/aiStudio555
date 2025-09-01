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
      className={`relative ${className || ''} min-h-[75vh] sm:min-h-[80vh] lg:min-h-[85vh] bg-gradient-to-br from-[#FFDA17] via-[#FFE555] to-[#FFDA17]`}
      style={{
        backgroundImage: 'url("/images/starter.png")',
        backgroundSize: 'cover',
        backgroundPosition: '60% center',
        backgroundRepeat: 'no-repeat',
      }}
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

      {/* Content Container - improved spacing and padding */}
      <div className="relative z-10 min-h-full flex flex-col justify-center py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Content wrapper with better width constraints */}
          <div className="w-full max-w-4xl lg:max-w-5xl">
            <div className="text-left space-y-4 sm:space-y-6 lg:space-y-8">

              {/* Badge - improved spacing */}
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black text-white">
                <span className="text-white font-medium text-xs sm:text-sm">
                  {tSync('hero.badge') || 'Старт нового потока 1 февраля'}
                </span>
              </div>

              {/* Main Title - improved responsive typography and spacing */}
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-black text-black leading-[1.1] sm:leading-[1.2] max-w-4xl tracking-tight mb-4"
                style={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: '900'
                }}
              >
                {(tSync('hero.title') || 'AI-трансформация для разработчиков и бизнеса').replace('для ', 'для\n')}
              </h1>

              {/* Subtitle - better line height and max width */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black/70 leading-[1.5] sm:leading-[1.6] max-w-3xl mb-6">
                {tSync('hero.subtitle') ||
                  'Персональное менторство, практические курсы и стратегии роста для next-level карьеры'}
              </p>

              {/* CTA Buttons - improved spacing and sizing */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[#FFDA17] hover:bg-[#E2C528] text-black font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                >
                  {tSync('hero.cta.primary') || 'Начать обучение'}
                  <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                </Link>

                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-gray-50 text-black font-semibold rounded-lg transition-all duration-300 border-2 border-black/20 hover:border-black/30 text-sm sm:text-base whitespace-nowrap"
                >
                  {tSync('hero.cta.secondary') || 'Бесплатная консультация'}
                </Link>
              </div>

              {/* Statistics - improved spacing and typography */}
              <div className="pt-6 sm:pt-8">
                <div className="border-t border-black/10 pt-4 sm:pt-6">
                  <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md">
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-black leading-none mb-1">
                        12K+
                      </div>
                      <div className="text-xs sm:text-sm text-black/60 leading-tight">
                        {tSync('hero.stats.students') || 'выпускников'}
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-black leading-none mb-1">
                        25+
                      </div>
                      <div className="text-xs sm:text-sm text-black/60 leading-tight">
                        {tSync('hero.stats.courses') || 'курсов'}
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-black leading-none mb-1">
                        87%
                      </div>
                      <div className="text-xs sm:text-sm text-black/60 leading-tight">
                        {tSync('hero.stats.employment') || 'трудоустройство'}
                      </div>
                    </div>
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
