'use client';

import React from 'react';
import { 
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  Globe, 
  Award,
  Briefcase,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeaturesProps {
  variant?: 'grid' | 'alternating';
  className?: string;
}

export function Features({ variant = 'grid', className }: FeaturesProps) {
  const features = [
    {
      icon: Zap,
      title: 'Быстрый старт',
      description: 'От новичка до Junior AI-специалиста за 3 месяца интенсивного обучения',
      color: 'text-primary-yellow',
      bgColor: 'bg-primary-yellow/10',
    },
    {
      icon: Users,
      title: 'Менторская поддержка',
      description: 'Персональный ментор и групповые занятия с экспертами индустрии',
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10',
    },
    {
      icon: Briefcase,
      title: 'Гарантия трудоустройства',
      description: 'Помощь в трудоустройстве или возврат денег по договору',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Globe,
      title: 'Международные проекты',
      description: 'Работа с реальными заказчиками из США, Европы и Азии',
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10',
    },
    {
      icon: Award,
      title: 'Сертификация',
      description: 'Международный сертификат, признаваемый работодателями',
      color: 'text-primary-yellow',
      bgColor: 'bg-primary-yellow/10',
    },
    {
      icon: Clock,
      title: 'Гибкий график',
      description: 'Учитесь в удобное время с доступом к материалам 24/7',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const benefits = [
    'Практические проекты с первого дня',
    'Портфолио из 10+ AI-проектов',
    'Стажировка в IT-компаниях',
    'Карьерные консультации',
    'Доступ к закрытому сообществу',
    'Пожизненные обновления курса',
  ];

  if (variant === 'alternating') {
    return (
      <section className={cn('section bg-white', className)}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-text-gray max-w-3xl mx-auto">
              Мы создали уникальную программу обучения, которая гарантирует результат
            </p>
          </div>
          
          <div className="space-y-24">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'flex flex-col lg:flex-row items-center gap-12',
                  index % 2 === 1 && 'lg:flex-row-reverse'
                )}
              >
                <div className="flex-1 space-y-6">
                  <div className={cn('inline-flex p-4 rounded-2xl', feature.bgColor)}>
                    <feature.icon className={cn('w-8 h-8', feature.color)} />
                  </div>
                  <h3 className="text-3xl font-bold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-text-gray leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {benefits.slice(index * 2, index * 2 + 2).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="aspect-video bg-gradient-to-br from-surface-light to-surface-gray rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('section bg-light-bg', className)}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-yellow/10 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-primary-yellow" />
            <span className="text-sm font-medium text-primary-yellow">
              Преимущества обучения
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Что вы получите
          </h2>
          <p className="text-lg text-text-gray max-w-3xl mx-auto">
            Комплексная программа подготовки AI-специалистов с фокусом на практику и результат
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={cn('inline-flex p-4 rounded-xl mb-6', feature.bgColor)}>
                <feature.icon className={cn('w-7 h-7', feature.color)} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-gray leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Benefits List */}
        <div className="mt-16 bg-gradient-to-r from-primary-yellow to-yellow-dark rounded-3xl p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-dark-pure mb-6">
                Дополнительные преимущества
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-dark-pure/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-dark-pure" />
                    </div>
                    <span className="text-dark-pure/90 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-dark-pure/5 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-6">
                <div className="text-4xl font-bold text-primary-yellow mb-2">95%</div>
                <p className="text-sm text-text-gray">Успешное трудоустройство</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}