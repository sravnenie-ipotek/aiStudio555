'use client';

import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Users, Clock, Globe, BookOpen, Award, Zap } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function DistanceLearning() {
  const { tSync } = useTranslation();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Main content card with shadcn/ui */}
          <Card className="order-2 lg:order-1 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-[#FFDA17]/20 text-[#070707] hover:bg-[#FFDA17]/30">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Онлайн обучение
                </Badge>
              </div>
              
              <CardTitle className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {tSync('distanceLearning.title') || 'О дистанционном обучении'}
              </CardTitle>
              
              <CardDescription className="text-lg text-gray-700 leading-relaxed">
                {tSync('distanceLearning.description') ||
                  'Мифы о дистанционном образовании приказали долго жить еще во времена пандемии. Сегодня сложно найти человека, который бы не верил, что на «дистанте» можно освоить интересную и «дорогую» профессию.'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Benefits with icons */}
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="p-1 bg-green-100 rounded-full">
                    <Globe className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Учитесь в удобное время из любой точки мира</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Персональный ментор и поддержка 24/7</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="p-1 bg-purple-100 rounded-full">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Практические проекты и реальный опыт</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#FFDA17] hover:bg-[#f0be0c] text-[#070707] font-bold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/about-online-learning">
                    {tSync('distanceLearning.cta') || 'Узнать больше'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-200 hover:border-[#FFDA17] hover:bg-[#FFDA17]/10 text-gray-900 font-bold text-base px-8 py-6 rounded-xl transition-all duration-300"
                >
                  <Link href="/consultation">
                    {tSync('distanceLearning.consultation') || 'Консультация'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Professional image card without background */}
          <Card className="order-1 lg:order-2 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
            <CardContent className="p-8 h-full flex items-center justify-center relative">
              {/* Clean professional presentation */}
              <div className="relative">
                <Image
                  src="/images/womanFarStudy.jpeg"
                  alt={tSync('distanceLearning.imageAlt') || 'Девушка обучается онлайн с ноутбуком'}
                  width={400}
                  height={500}
                  className="rounded-2xl object-cover shadow-lg"
                  priority
                />
                
                {/* Floating elements for visual interest */}
                <div className="absolute -top-4 -right-4 bg-[#FFDA17] p-3 rounded-full shadow-lg animate-bounce">
                  <Zap className="w-6 h-6 text-gray-800" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg border-2 border-[#FFDA17]">
                  <BookOpen className="w-6 h-6 text-[#070707]" />
                </div>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 bg-[#FFDA17] rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-500 rounded-full"></div>
                <div className="absolute top-1/2 left-4 w-12 h-12 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Stats section for additional UX */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center p-6 border-0 bg-white/80 shadow-lg">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-[#070707] mb-2">5000+</div>
              <div className="text-sm text-gray-600">Выпускников</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 border-0 bg-white/80 shadow-lg">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-[#070707] mb-2">98%</div>
              <div className="text-sm text-gray-600">Довольных студентов</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 border-0 bg-white/80 shadow-lg">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-[#070707] mb-2">24/7</div>
              <div className="text-sm text-gray-600">Поддержка</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 border-0 bg-white/80 shadow-lg">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-[#070707] mb-2">50+</div>
              <div className="text-sm text-gray-600">Курсов</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
