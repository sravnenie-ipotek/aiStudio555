'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps) {
  const { tSync } = useTranslation();

  return (
    <section className={`py-16 md:py-24 bg-[#FFDA17] ${className || ''}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black/10 rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-black" />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
            {tSync('cta.title') || 'Готовы начать карьеру в IT?'}
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            {tSync('cta.subtitle') ||
              'Присоединяйтесь к тысячам выпускников AIStudio555, которые уже работают в ведущих IT-компаниях мира'}
          </p>

          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-black mb-1">3-6</div>
              <div className="text-black/70 text-sm">месяцев обучения</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-black mb-1">87%</div>
              <div className="text-black/70 text-sm">трудоустройство</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-black mb-1">24/7</div>
              <div className="text-black/70 text-sm">поддержка</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              {tSync('cta.button.primary') || 'Выбрать курс'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-black font-semibold rounded-lg border-2 border-black hover:bg-black/10 transition-all duration-300"
            >
              {tSync('cta.button.secondary') || 'Получить консультацию'}
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-black/70 text-sm">
            {tSync('cta.badge') ||
              '🔒 Безопасная оплата • 💳 Рассрочка от 3 месяцев • 📚 Доступ навсегда'}
          </div>
        </div>
      </div>
    </section>
  );
}
