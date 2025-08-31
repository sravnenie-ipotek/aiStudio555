'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Globe, Award, Users, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { CourseData } from '@/types/course';

interface EnrollmentSummaryProps {
  course: CourseData;
  enrollmentData: any;
  totalPrice: number;
}

export function EnrollmentSummary({ course, enrollmentData, totalPrice }: EnrollmentSummaryProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('enrollment.summary.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('course.duration')}</p>
              <p className="text-sm font-medium">{course.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('course.startDate')}</p>
              <p className="text-sm font-medium">{t('course.flexibleStart')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('course.format')}</p>
              <p className="text-sm font-medium">{t('course.online')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('course.certificate')}</p>
              <p className="text-sm font-medium">{t('course.included')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">{t('enrollment.summary.whatYouGet')}</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary mt-0.5" />
              <span>{t('enrollment.summary.lifetimeAccess')}</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Users className="w-4 h-4 text-primary mt-0.5" />
              <span>{t('enrollment.summary.expertSupport')}</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Award className="w-4 h-4 text-primary mt-0.5" />
              <span>{t('enrollment.summary.jobPlacement')}</span>
            </li>
          </ul>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t('enrollment.summary.totalPrice')}</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
              {enrollmentData.installmentPlan !== 'full' && (
                <p className="text-sm text-muted-foreground">
                  {t('enrollment.summary.perMonth', { 
                    amount: (totalPrice / parseInt(enrollmentData.installmentPlan.split('_')[0])).toFixed(2) 
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}