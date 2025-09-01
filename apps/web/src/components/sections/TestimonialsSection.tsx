'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  course: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Мария Иванова',
    role: 'AI Product Manager',
    company: 'Tech Corp',
    image: '/images/testimonial-1.jpg',
    rating: 5,
    text: 'Курс AI Transformation Manager полностью изменил мою карьеру. За 3 месяца я освоила навыки, которые позволили мне получить работу мечты с зарплатой в 2 раза выше!',
    course: 'AI Transformation Manager',
  },
  {
    id: '2',
    name: 'Алексей Петров',
    role: 'No-Code Developer',
    company: 'StartupHub',
    image: '/images/testimonial-2.jpg',
    rating: 5,
    text: 'Благодаря курсу No-Code Development я запустил свой бизнес и создаю сайты для клиентов без написания кода. Преподаватели AIStudio555 - настоящие профессионалы!',
    course: 'No-Code Development',
  },
  {
    id: '3',
    name: 'Елена Смирнова',
    role: 'Content Creator',
    company: 'MediaPro',
    image: '/images/testimonial-3.jpg',
    rating: 5,
    text: 'Курс по AI видео генерации открыл для меня новые возможности. Теперь я создаю профессиональный контент в 10 раз быстрее и зарабатываю на этом отличные деньги.',
    course: 'AI Video Generation',
  },
];

interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const { tSync } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className={`py-16 md:py-24 bg-gray-50 ${className || ''}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {tSync('testimonials.title') || 'Отзывы наших выпускников'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tSync('testimonials.subtitle') || 'Истории успеха тех, кто уже изменил свою жизнь'}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-yellow-500" />
            </div>

            {/* Testimonial Content */}
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[currentIndex].rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed italic">
                "{testimonials[currentIndex].text}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 flex items-center justify-center text-white font-bold text-xl">
                  {testimonials[currentIndex].name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>

                {/* Name and Details */}
                <h4 className="text-lg font-semibold text-gray-900">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-600">
                  {testimonials[currentIndex].role} @ {testimonials[currentIndex].company}
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  Выпускник курса "{testimonials[currentIndex].course}"
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between absolute inset-y-0 left-0 right-0 items-center px-4">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-yellow-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
