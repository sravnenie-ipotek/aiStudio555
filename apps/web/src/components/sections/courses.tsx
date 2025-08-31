'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Users,
  Star,
  ArrowRight,
  Zap,
  Calendar,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
  features: string[];
}

export interface CoursesProps {
  className?: string;
}

export function Courses({ className }: CoursesProps) {
  const courses: Course[] = [
    {
      id: '1',
      title: 'AI Transformation Manager',
      description: 'Станьте экспертом по внедрению AI в бизнес-процессы компаний',
      price: 1500,
      discountedPrice: 1000,
      duration: '3 месяца',
      students: 2500,
      rating: 4.9,
      reviews: 450,
      level: 'Beginner',
      category: 'AI Management',
      thumbnail: '/course-ai-manager.jpg',
      instructor: {
        name: 'Александр Петров',
        avatar: '/instructor-1.jpg',
      },
      features: [
        '40+ практических проектов',
        'Сертификат международного образца',
        'Гарантия трудоустройства',
        'Менторская поддержка 24/7',
      ],
    },
    {
      id: '2',
      title: 'No-Code Website Development',
      description: 'Создавайте профессиональные сайты без программирования',
      price: 1200,
      discountedPrice: 1000,
      duration: '2 месяца',
      students: 1800,
      rating: 4.8,
      reviews: 320,
      level: 'Beginner',
      category: 'Web Development',
      thumbnail: '/course-nocode.jpg',
      instructor: {
        name: 'Мария Иванова',
        avatar: '/instructor-2.jpg',
      },
      features: [
        '20+ готовых шаблонов',
        'Интеграция с платежными системами',
        'SEO-оптимизация',
        'Адаптивный дизайн',
      ],
    },
    {
      id: '3',
      title: 'AI Video & Avatar Generation',
      description: 'Освойте создание AI-видео и цифровых аватаров',
      price: 1300,
      discountedPrice: 1000,
      duration: '2.5 месяца',
      students: 1200,
      rating: 4.9,
      reviews: 280,
      level: 'Intermediate',
      category: 'Content Creation',
      thumbnail: '/course-ai-video.jpg',
      instructor: {
        name: 'Дмитрий Волков',
        avatar: '/instructor-3.jpg',
      },
      features: [
        'Работа с нейросетями',
        'Создание deepfake',
        'Анимация аватаров',
        'Монетизация контента',
      ],
    },
  ];

  const levelColors = {
    Beginner: 'bg-success/10 text-success',
    Intermediate: 'bg-primary-yellow/10 text-primary-yellow',
    Advanced: 'bg-error/10 text-error',
  };

  return (
    <section className={cn('section bg-white', className)}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-yellow/10 rounded-full mb-4">
            <Zap className="w-4 h-4 text-primary-yellow" />
            <span className="text-sm font-medium text-primary-yellow">
              Популярные курсы
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Выберите свой путь в AI
          </h2>
          <p className="text-lg text-text-gray max-w-3xl mx-auto">
            Практические курсы с гарантией трудоустройства и зарплатой от $2000
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-primary-yellow/20 to-accent-blue/20 overflow-hidden">
                {course.discountedPrice && (
                  <div className="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    -33% Скидка
                  </div>
                )}
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Category & Level */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-gray">{course.category}</span>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', levelColors[course.level])}>
                    {course.level}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {course.title}
                  </h3>
                  <p className="text-text-gray text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 pb-4 border-b border-border-light">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-yellow to-yellow-dark" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {course.instructor.name}
                    </p>
                    <p className="text-xs text-text-gray">Преподаватель</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-b border-border-light">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-text-gray" />
                      <span className="text-sm font-medium">{course.duration}</span>
                    </div>
                    <p className="text-xs text-text-gray">Длительность</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-text-gray" />
                      <span className="text-sm font-medium">{course.students}</span>
                    </div>
                    <p className="text-xs text-text-gray">Студентов</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-primary-yellow fill-primary-yellow" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <p className="text-xs text-text-gray">{course.reviews} отзывов</p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {course.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4">
                  <div>
                    {course.discountedPrice ? (
                      <>
                        <span className="text-2xl font-bold text-text-primary">
                          {formatPrice(course.discountedPrice)}
                        </span>
                        <span className="text-sm text-text-gray line-through ml-2">
                          {formatPrice(course.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-text-primary">
                        {formatPrice(course.price)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    asChild
                  >
                    <Link href={`/programs/${course.id}`} className="inline-flex items-center">
                      Подробнее
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            asChild
          >
            <Link href="/programs" className="inline-flex items-center">
              Все курсы
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
