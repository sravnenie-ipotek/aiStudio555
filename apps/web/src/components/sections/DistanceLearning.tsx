'use client';

import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Users, Clock, Globe } from 'lucide-react';
import Image from 'next/image';

export function DistanceLearning() {
  const { tSync } = useTranslation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Feature badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Online</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Flexible</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Mentorship</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {tSync('distanceLearning.title') || 'О дистанционном обучении'}
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {tSync('distanceLearning.description') ||
                'Мифы о дистанционном образовании приказали долго жить еще во времена пандемии. Сегодня сложно найти человека, который бы не верил, что на «дистанте» можно освоить интересную и «дорогую» профессию. Онлайн-обучение вступило в схватку с университетскими парами и ранними подъемами, и теперь берет над всем этим верх.'}
            </p>

            {/* Benefits list */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Учитесь в удобное время из любой точки мира</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Персональный ментор и поддержка 24/7</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Практические проекты и реальный опыт</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/about-online-learning"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FFDA17] hover:bg-[#E2C528] text-black font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                {tSync('distanceLearning.cta') || 'Узнать больше'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/consultation"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
              >
                {tSync('distanceLearning.consultation') || 'Консультация'}
              </Link>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden bg-[#FFDA17] p-8 lg:p-12">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

              {/* Main Image */}
              <div className="relative z-10">
                <Image
                  src="/images/womanFarStudy.jpeg"
                  alt={tSync('distanceLearning.imageAlt') || 'Девушка обучается онлайн с ноутбуком'}
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
