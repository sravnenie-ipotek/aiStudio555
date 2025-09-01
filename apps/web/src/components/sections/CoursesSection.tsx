'use client';

import React from 'react';
import Link from 'next/link';
import { Code, Apple } from 'lucide-react';

interface Course {
  id: string;
  title: {
    line1: string;
    line2: string;
  };
  icon: 'frontend' | 'python' | 'ios' | 'uxui';
  href: string;
}

const courses: Course[] = [
  {
    id: 'frontend-dev',
    title: {
      line1: 'Front End',
      line2: 'разработчик',
    },
    icon: 'frontend',
    href: '/courses/frontend',
  },
  {
    id: 'python-dev',
    title: {
      line1: 'Python',
      line2: 'разработчик',
    },
    icon: 'python',
    href: '/courses/python',
  },
  {
    id: 'ios-dev',
    title: {
      line1: 'iOS',
      line2: 'разработчик',
    },
    icon: 'ios',
    href: '/courses/ios',
  },
  {
    id: 'uxui-designer',
    title: {
      line1: 'UX/UI',
      line2: 'дизайнер',
    },
    icon: 'uxui',
    href: '/courses/uxui',
  },
];

interface CoursesSectionProps {
  className?: string;
}

// Course Icon Components
const FrontendIcon = () => <div className="text-black text-2xl font-bold">&lt;/&gt;</div>;

const PythonIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-black fill-current">
    <path d="M12.003 0c3.17 0 5.774.904 7.188 2.46 1.414 1.557 2.115 3.786 2.115 6.686v1.708c0 2.901-.701 5.129-2.115 6.686-1.414 1.556-4.018 2.46-7.188 2.46s-5.773-.904-7.187-2.46c-1.414-1.557-2.116-3.785-2.116-6.686V9.146c0-2.9.702-5.129 2.116-6.686C6.23.904 8.834 0 12.003 0zm0 1.25c-2.793 0-5.07.772-6.26 2.052-1.192 1.281-1.743 3.204-1.743 5.844v1.708c0 2.64.551 4.563 1.743 5.844 1.19 1.28 3.467 2.052 6.26 2.052s5.07-.772 6.261-2.052c1.192-1.281 1.742-3.204 1.742-5.844V9.146c0-2.64-.55-4.563-1.742-5.844C17.074 2.022 14.796 1.25 12.003 1.25z" />
  </svg>
);

const IOSIcon = () => <Apple className="w-8 h-8 text-black" />;

const UXUIIcon = () => <div className="text-black text-lg font-bold">UX/UI</div>;

const renderIcon = (iconType: string) => {
  switch (iconType) {
    case 'frontend':
      return <FrontendIcon />;
    case 'python':
      return <PythonIcon />;
    case 'ios':
      return <IOSIcon />;
    case 'uxui':
      return <UXUIIcon />;
    default:
      return <Code className="w-8 h-8 text-black" />;
  }
};

export function CoursesSection({ className }: CoursesSectionProps) {
  return (
    <section className={`py-16 md:py-24 bg-white ${className || ''}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
            Самые востребованные
            <br />
            направления в IT
          </h2>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map(course => (
            <div key={course.id} className="flex flex-col items-center text-center space-y-6 group">
              {/* 3D Yellow Icon Box */}
              <div className="relative">
                <div className="w-24 h-24 bg-[#FFDA17] rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                  {renderIcon(course.icon)}
                </div>
                {/* 3D Shadow Effect */}
                <div className="absolute inset-0 w-24 h-24 bg-[#E5C400] rounded-2xl -z-10 transform translate-x-1 translate-y-1 opacity-60"></div>
              </div>

              {/* Course Title */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-black leading-tight">{course.title.line1}</h3>
                <h3 className="text-xl font-bold text-black leading-tight">{course.title.line2}</h3>
              </div>

              {/* CTA Button */}
              <Link
                href={course.href}
                className="w-full max-w-[200px] bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Подробнее о курсе
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
