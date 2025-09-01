'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Phone, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface ConsultationFormProps {
  courseId?: string;
  courseName?: string;
  className?: string;
  compact?: boolean;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function ConsultationForm({ 
  courseId, 
  courseName, 
  className,
  compact = false 
}: ConsultationFormProps) {
  const { tSync } = useTranslation();
  
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredTime: 'any'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = tSync('form.validation.nameRequired') || 'Имя обязательно';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = tSync('form.validation.phoneRequired') || 'Телефон обязателен';
    } else if (!/^[\+]?[1-9][\d]{7,14}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = tSync('form.validation.phoneInvalid') || 'Неверный формат телефона';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = tSync('form.validation.emailInvalid') || 'Неверный email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormState('loading');
    
    try {
      // Simulate API call
      const response = await fetch('/api/consultation-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          courseId,
          courseName,
          source: 'course-page',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit consultation request');
      }

      setFormState('success');
      
      // Track conversion event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', {
          course_id: courseId,
          course_name: courseName,
          event_category: 'consultation',
          event_label: 'consultation_request'
        });
      }

    } catch (error) {
      console.error('Error submitting consultation request:', error);
      setFormState('error');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (formState === 'success') {
    return (
      <Card id="consultation-form" className={cn("max-w-md mx-auto", className)}>
        <CardContent className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-3">
            {tSync('form.success.title') || 'Заявка отправлена!'}
          </h3>
          <p className="text-green-700 mb-6">
            {tSync('form.success.message') || 'Мы свяжемся с вами в течение 15 минут'}
          </p>
          <div className="flex flex-col gap-2 text-sm text-green-600">
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Звонок в течение 15 минут</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Программа курса на email</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="consultation-form" className={cn("max-w-md mx-auto shadow-xl", className)}>
      <CardHeader className={compact ? "p-4 pb-0" : "p-6 pb-0"}>
        <CardTitle className={cn(
          "text-center",
          compact ? "text-lg" : "text-2xl"
        )}>
          {tSync('form.title') || 'Получите бесплатную консультацию'}
        </CardTitle>
        <p className={cn(
          "text-gray-600 text-center",
          compact ? "text-sm mt-2" : "text-base mt-3"
        )}>
          {courseName 
            ? tSync('form.subtitle.course', { course: courseName }) || `Узнайте больше о курсе "${courseName}"`
            : tSync('form.subtitle.general') || 'Узнайте, какой курс подходит именно вам'
          }
        </p>
      </CardHeader>

      <CardContent className={compact ? "p-4" : "p-6"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field */}
          <div>
            <Input
              type="text"
              placeholder={tSync('form.fields.name.placeholder') || 'Ваше имя *'}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={cn(
                "border-2 focus:border-primary-yellow transition-colors",
                errors.name ? "border-red-500" : "border-gray-300",
                compact ? "py-2" : "py-3"
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <Input
              type="tel"
              placeholder={tSync('form.fields.phone.placeholder') || '+7 (___) ___-__-__ *'}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={cn(
                "border-2 focus:border-primary-yellow transition-colors",
                errors.phone ? "border-red-500" : "border-gray-300",
                compact ? "py-2" : "py-3"
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email Field (Optional) */}
          <div>
            <Input
              type="email"
              placeholder={tSync('form.fields.email.placeholder') || 'Email (необязательно)'}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                "border-2 focus:border-primary-yellow transition-colors",
                errors.email ? "border-red-500" : "border-gray-300",
                compact ? "py-2" : "py-3"
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Preferred Time */}
          {!compact && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {tSync('form.fields.preferredTime.label') || 'Удобное время для звонка:'}
              </label>
              <select
                value={formData.preferredTime}
                onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                className="w-full border-2 border-gray-300 focus:border-primary-yellow rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
              >
                <option value="any">{tSync('form.fields.preferredTime.any') || 'Любое время'}</option>
                <option value="morning">{tSync('form.fields.preferredTime.morning') || 'Утром (9:00-12:00)'}</option>
                <option value="afternoon">{tSync('form.fields.preferredTime.afternoon') || 'Днём (12:00-17:00)'}</option>
                <option value="evening">{tSync('form.fields.preferredTime.evening') || 'Вечером (17:00-20:00)'}</option>
              </select>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 py-2">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>{tSync('form.trust.secure') || 'Конфиденциально'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{tSync('form.trust.fast') || 'Ответим за 15 минут'}</span>
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={formState === 'loading'}
            className={cn(
              "w-full bg-primary-yellow hover:bg-yellow-hover text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl",
              compact ? "py-2 text-sm" : "py-4 text-base"
            )}
          >
            {formState === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tSync('form.button.sending') || 'Отправляем...'}
              </>
            ) : (
              tSync('form.button.submit') || 'Получить консультацию бесплатно'
            )}
          </Button>
          
          {/* Error State */}
          {formState === 'error' && (
            <div className="text-center">
              <p className="text-red-600 text-sm flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {tSync('form.error.message') || 'Произошла ошибка. Попробуйте еще раз или позвоните нам'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {tSync('form.error.phone') || 'Телефон: +7 (495) 123-45-67'}
              </p>
            </div>
          )}

          {/* Additional Benefits */}
          {!compact && (
            <div className="mt-6 p-4 bg-primary-yellow/10 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                {tSync('form.benefits.title') || 'Что вы получите:'}
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {tSync('form.benefits.consultation') || 'Персональную консультацию по выбору курса'}</li>
                <li>• {tSync('form.benefits.program') || 'Подробную программу обучения'}</li>
                <li>• {tSync('form.benefits.career') || 'План развития карьеры в AI'}</li>
                <li>• {tSync('form.benefits.discount') || 'Специальное предложение со скидкой'}</li>
              </ul>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}