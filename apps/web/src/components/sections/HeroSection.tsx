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

              {/* Main Title - improved responsive typography and spacing */}
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-black text-black leading-[1.2] sm:leading-[1.25] lg:leading-[1.3] max-w-4xl tracking-tight mb-4"
                style={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: '900',
                  lineHeight: '1.3'
                }}
              >
                {(() => {
                  const title = tSync('hero.title') || 'AI-трансформация для разработчиков и бизнеса';
                  // Split the text into three lines for better readability
                  // This handles the exact text from the admin panel
                  if (title.includes('разработчиков и бизнеса')) {
                    return title.replace('для разработчиков и бизнеса', 'для\nразработчиков и\nбизнеса');
                  }
                  // Fallback for other similar patterns
                  return title.replace(/для\s+/g, 'для\n');
                })()}
              </h1>

              {/* Subtitle - better line height and max width */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black/70 leading-[1.5] sm:leading-[1.6] max-w-3xl mb-6">
                {tSync('hero.subtitle') ||
                  'AIStudio555 школа технологий и бизнес-менторства, где сочетаются практические курсы, персональное сопровождение и стратегии развития. Наша миссия — помочь вам освоить востребованные навыки, найти свой путь в мире IT и бизнеса и построить карьеру нового уровня.'}
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
