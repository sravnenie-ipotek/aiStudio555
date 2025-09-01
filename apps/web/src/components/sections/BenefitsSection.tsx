'use client';

import React from 'react';
import {
  GraduationCap,
  Users,
  Briefcase,
  Clock,
  Award,
  TrendingUp,
  Globe,
  Zap,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: GraduationCap,
    title: 'Практическое обучение',
    description: 'Учитесь на реальных проектах и кейсах из индустрии',
  },
  {
    icon: Users,
    title: 'Опытные преподаватели',
    description: 'Учитесь у экспертов с многолетним опытом в IT',
  },
  {
    icon: Briefcase,
    title: 'Гарантия трудоустройства',
    description: '87% выпускников находят работу в течение 3 месяцев',
  },
  {
    icon: Clock,
    title: 'Гибкий график',
    description: 'Обучайтесь в удобное время из любой точки мира',
  },
  {
    icon: Award,
    title: 'Сертификат',
    description: 'Получите официальный сертификат после окончания',
  },
  {
    icon: TrendingUp,
    title: 'Карьерный рост',
    description: 'Поддержка в развитии карьеры и поиске работы',
  },
  {
    icon: Globe,
    title: 'Международные стандарты',
    description: 'Программы соответствуют мировым стандартам',
  },
  {
    icon: Zap,
    title: 'Быстрый старт',
    description: 'Начните карьеру в IT за 3-6 месяцев',
  },
];

interface BenefitsSectionProps {
  className?: string;
}

export function BenefitsSection({ className }: BenefitsSectionProps) {
  const { tSync } = useTranslation();

  return (
    <section className={`py-16 md:py-24 bg-white ${className || ''}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {tSync('benefits.title') || 'Почему выбирают AIStudio555'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tSync('benefits.subtitle') ||
              'Мы создаем лучшие условия для вашего обучения и карьерного роста'}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-gray-200 hover:border-yellow-500 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors duration-300">
                <benefit.icon className="w-7 h-7 text-yellow-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Benefits Bar */}
        <div className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-gray-600">Онлайн формат</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-600">Поддержка студентов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">∞</div>
              <div className="text-gray-600">Доступ к материалам</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
