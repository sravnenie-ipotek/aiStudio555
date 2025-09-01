'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Statistic {
  value: number;
  suffix: string;
  label: string;
  duration: number;
}

const statistics: Statistic[] = [
  {
    value: 12000,
    suffix: '+',
    label: 'Выпускников',
    duration: 2000,
  },
  {
    value: 15,
    suffix: '+',
    label: 'Курсов',
    duration: 1500,
  },
  {
    value: 87,
    suffix: '%',
    label: 'Трудоустройство',
    duration: 2500,
  },
  {
    value: 8,
    suffix: ' лет',
    label: 'На рынке',
    duration: 1800,
  },
];

interface StatisticsSectionProps {
  className?: string;
}

export function StatisticsSection({ className }: StatisticsSectionProps) {
  const { tSync } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState(statistics.map(() => 0));

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('statistics-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
        if (isInViewport && !isVisible) {
          setIsVisible(true);
          startCountAnimation();
        }
      }
    };

    const startCountAnimation = () => {
      statistics.forEach((stat, index) => {
        const increment = stat.value / (stat.duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(timer);
          }
          setCounters(prev => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(current);
            return newCounters;
          });
        }, 16);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <section
      id="statistics-section"
      className={`py-16 md:py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 ${className || ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-2">
                {counters[index]}
                {stat.suffix}
              </div>
              <div className="text-gray-300 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
