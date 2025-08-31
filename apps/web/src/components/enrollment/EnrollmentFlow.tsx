'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Calendar, Users, Clock, Globe, Award, ArrowRight, ArrowLeft, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/hooks/useTranslation';
import { CourseData } from '@/types/course';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { InstallmentPlanSelector } from './InstallmentPlanSelector';
import { EnrollmentSummary } from './EnrollmentSummary';

interface EnrollmentFlowProps {
  course: CourseData;
  onComplete?: () => void;
}

type EnrollmentStep = 'details' | 'payment' | 'confirmation';

export function EnrollmentFlow({ course, onComplete }: EnrollmentFlowProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>('details');
  const [enrollmentData, setEnrollmentData] = useState({
    studentInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      timezone: '',
      preferredLanguage: 'en',
      studyGoals: '',
    },
    paymentMethod: 'credit_card' as 'credit_card' | 'paypal' | 'bank_transfer',
    installmentPlan: 'full' as 'full' | '3_months' | '6_months' | '12_months',
    agreedToTerms: false,
    subscribedToNewsletter: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 'details', label: t('enrollment.steps.details'), icon: Users },
    { id: 'payment', label: t('enrollment.steps.payment'), icon: CreditCard },
    { id: 'confirmation', label: t('enrollment.steps.confirmation'), icon: CheckCircle },
  ];

  const handleNext = () => {
    if (currentStep === 'details') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handlePayment();
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('details');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would call the actual payment API
      // const response = await processPayment(enrollmentData);

      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle payment error
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePrice = () => {
    const basePrice = course.discountedPrice || course.price;
    const installmentFee = {
      'full': 0,
      '3_months': basePrice * 0.05,
      '6_months': basePrice * 0.08,
      '12_months': basePrice * 0.12,
    };
    return basePrice + installmentFee[enrollmentData.installmentPlan];
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full transition-colors
                  ${isActive ? 'bg-primary text-primary-foreground' :
                    isCompleted ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'}
                `}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`ml-3 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderDetailsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('enrollment.studentDetails.title')}</CardTitle>
        <CardDescription>{t('enrollment.studentDetails.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('enrollment.fields.firstName')}</Label>
            <Input
              id="firstName"
              value={enrollmentData.studentInfo.firstName}
              onChange={(e) => setEnrollmentData({
                ...enrollmentData,
                studentInfo: { ...enrollmentData.studentInfo, firstName: e.target.value },
              })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('enrollment.fields.lastName')}</Label>
            <Input
              id="lastName"
              value={enrollmentData.studentInfo.lastName}
              onChange={(e) => setEnrollmentData({
                ...enrollmentData,
                studentInfo: { ...enrollmentData.studentInfo, lastName: e.target.value },
              })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('enrollment.fields.email')}</Label>
            <Input
              id="email"
              type="email"
              value={enrollmentData.studentInfo.email}
              onChange={(e) => setEnrollmentData({
                ...enrollmentData,
                studentInfo: { ...enrollmentData.studentInfo, email: e.target.value },
              })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('enrollment.fields.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={enrollmentData.studentInfo.phone}
              onChange={(e) => setEnrollmentData({
                ...enrollmentData,
                studentInfo: { ...enrollmentData.studentInfo, phone: e.target.value },
              })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">{t('enrollment.fields.country')}</Label>
            <Input
              id="country"
              value={enrollmentData.studentInfo.country}
              onChange={(e) => setEnrollmentData({
                ...enrollmentData,
                studentInfo: { ...enrollmentData.studentInfo, country: e.target.value },
              })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">{t('enrollment.fields.timezone')}</Label>
            <Input
              id="timezone"
              value={enrollmentData.studentInfo.timezone}
              onChange={(e) => setEnrollmentData({
                ...enrollmentData,
                studentInfo: { ...enrollmentData.studentInfo, timezone: e.target.value },
              })}
              placeholder="UTC+0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studyGoals">{t('enrollment.fields.studyGoals')}</Label>
          <textarea
            id="studyGoals"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={enrollmentData.studentInfo.studyGoals}
            onChange={(e) => setEnrollmentData({
              ...enrollmentData,
              studentInfo: { ...enrollmentData.studentInfo, studyGoals: e.target.value },
            })}
            placeholder={t('enrollment.fields.studyGoalsPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('enrollment.fields.preferredLanguage')}</Label>
          <RadioGroup
            value={enrollmentData.studentInfo.preferredLanguage}
            onValueChange={(value) => setEnrollmentData({
              ...enrollmentData,
              studentInfo: { ...enrollmentData.studentInfo, preferredLanguage: value },
            })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="lang-en" />
              <Label htmlFor="lang-en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="he" id="lang-he" />
              <Label htmlFor="lang-he">עברית</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ru" id="lang-ru" />
              <Label htmlFor="lang-ru">Русский</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletter"
            checked={enrollmentData.subscribedToNewsletter}
            onCheckedChange={(checked) => setEnrollmentData({
              ...enrollmentData,
              subscribedToNewsletter: checked as boolean,
            })}
          />
          <Label htmlFor="newsletter" className="text-sm">
            {t('enrollment.fields.subscribeNewsletter')}
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('enrollment.payment.title')}</CardTitle>
          <CardDescription>{t('enrollment.payment.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PaymentMethodSelector
            selectedMethod={enrollmentData.paymentMethod}
            onMethodChange={(method) => setEnrollmentData({
              ...enrollmentData,
              paymentMethod: method,
            })}
          />

          <InstallmentPlanSelector
            selectedPlan={enrollmentData.installmentPlan}
            onPlanChange={(plan) => setEnrollmentData({
              ...enrollmentData,
              installmentPlan: plan,
            })}
            basePrice={course.discountedPrice || course.price}
          />

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">{t('enrollment.payment.subtotal')}</span>
              <span>${course.discountedPrice || course.price}</span>
            </div>
            {enrollmentData.installmentPlan !== 'full' && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">{t('enrollment.payment.installmentFee')}</span>
                <span>${(calculatePrice() - (course.discountedPrice || course.price)).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>{t('enrollment.payment.total')}</span>
              <span className="text-primary">${calculatePrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{t('enrollment.payment.securePayment')}</p>
                <p className="text-muted-foreground">{t('enrollment.payment.securePaymentDescription')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Lock className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{t('enrollment.payment.moneyBackGuarantee')}</p>
                <p className="text-muted-foreground">{t('enrollment.payment.moneyBackDescription')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={enrollmentData.agreedToTerms}
              onCheckedChange={(checked) => setEnrollmentData({
                ...enrollmentData,
                agreedToTerms: checked as boolean,
              })}
            />
            <Label htmlFor="terms" className="text-sm">
              {t('enrollment.payment.agreeToTerms')}
            </Label>
          </div>
        </CardContent>
      </Card>

      <EnrollmentSummary
        course={course}
        enrollmentData={enrollmentData}
        totalPrice={calculatePrice()}
      />
    </div>
  );

  const renderConfirmationStep = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mb-6"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-4">{t('enrollment.confirmation.title')}</h2>
        <p className="text-muted-foreground mb-8">
          {t('enrollment.confirmation.message', { courseName: course.title })}
        </p>

        <div className="bg-muted rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-4">{t('enrollment.confirmation.nextSteps')}</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
              <span className="text-sm">{t('enrollment.confirmation.step1')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
              <span className="text-sm">{t('enrollment.confirmation.step2')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
              <span className="text-sm">{t('enrollment.confirmation.step3')}</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            size="lg"
          >
            {t('enrollment.confirmation.goToDashboard')}
          </Button>
          <Button
            onClick={() => router.push('/courses')}
            variant="outline"
            size="lg"
          >
            {t('enrollment.confirmation.browseMoreCourses')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'confirmation' && renderConfirmationStep()}
        </motion.div>
      </AnimatePresence>

      {currentStep !== 'confirmation' && (
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 'details'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 'details' && !enrollmentData.studentInfo.email) ||
              (currentStep === 'payment' && !enrollmentData.agreedToTerms) ||
              isProcessing
            }
          >
            {isProcessing ? (
              <>{t('common.processing')}</>
            ) : currentStep === 'payment' ? (
              <>{t('enrollment.payment.completePurchase')}</>
            ) : (
              <>
                {t('common.next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
