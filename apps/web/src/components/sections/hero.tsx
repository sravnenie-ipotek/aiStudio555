'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle, Star, Users, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroProps {
  variant?: 'default' | 'video' | 'minimal';
  className?: string;
}

export function Hero({ variant = 'default', className }: HeroProps) {
  const stats = [
    { value: '10,000+', label: 'Выпускников' },
    { value: '95%', label: 'Трудоустройство' },
    { value: '4.9', label: 'Рейтинг', icon: Star },
    { value: '50+', label: 'Стран' },
  ];

  return (
    <section
      className={cn(
        'relative min-h-[90vh] flex items-center overflow-hidden',
        'bg-gradient-to-br from-dark-pure via-dark-header to-dark-secondary',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-yellow/10 border border-primary-yellow/20 rounded-full">
              <TrendingUp className="w-4 h-4 text-primary-yellow" />
              <span className="text-sm font-medium text-primary-yellow">
                #1 AI Академия в СНГ
              </span>
            </div>
            
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Стань{' '}
                <span className="text-gradient">AI-специалистом</span>
                {' '}за 3 месяца
              </h1>
              <p className="text-lg md:text-xl text-text-light max-w-2xl">
                Практическая трансформация в востребованного AI-эксперта с гарантией трудоустройства и зарплатой от $2000
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                variant="primary"
                asChild
              >
                <Link href="/programs" className="inline-flex items-center">
                  Начать обучение
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                leftIcon={<PlayCircle className="w-5 h-5" />}
                className="border-white text-white hover:bg-white hover:text-dark-pure"
              >
                Смотреть презентацию
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-yellow to-yellow-dark border-2 border-dark-pure flex items-center justify-center text-xs font-semibold text-dark-pure"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-text-light">
                <span className="text-white font-semibold">500+</span> студентов учатся прямо сейчас
              </div>
            </div>
          </div>
          
          {/* Hero Image/Video */}
          <div className="relative">
            {variant === 'video' ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-pure/50 to-transparent" />
              </div>
            ) : (
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-yellow/20 to-accent-blue/20">
                  <Image
                    src="/hero-image.jpg"
                    alt="AI Специалист"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-float">
                  <Award className="w-8 h-8 text-primary-yellow mb-2" />
                  <p className="text-sm font-semibold">Сертификат</p>
                  <p className="text-xs text-text-gray">Международный</p>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-float-delayed">
                  <Users className="w-8 h-8 text-accent-blue mb-2" />
                  <p className="text-sm font-semibold">Менторство</p>
                  <p className="text-xs text-text-gray">24/7 поддержка</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}
                </span>
                {stat.icon && <stat.icon className="w-6 h-6 text-primary-yellow" />}
              </div>
              <p className="text-sm text-text-light">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}