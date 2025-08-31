'use client';

import React from 'react';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';

interface InstallmentPlanSelectorProps {
  selectedPlan: 'full' | '3_months' | '6_months' | '12_months';
  onPlanChange: (plan: 'full' | '3_months' | '6_months' | '12_months') => void;
  basePrice: number;
}

export function InstallmentPlanSelector({ selectedPlan, onPlanChange, basePrice }: InstallmentPlanSelectorProps) {
  const { t } = useTranslation();

  const installmentPlans = [
    {
      id: 'full',
      label: t('enrollment.payment.plans.full'),
      description: t('enrollment.payment.plans.fullDescription'),
      monthlyAmount: basePrice,
      totalAmount: basePrice,
      savings: 0,
      recommended: true,
    },
    {
      id: '3_months',
      label: t('enrollment.payment.plans.threeMonths'),
      description: t('enrollment.payment.plans.threeMonthsDescription'),
      monthlyAmount: (basePrice * 1.05) / 3,
      totalAmount: basePrice * 1.05,
      savings: 0,
      recommended: false,
    },
    {
      id: '6_months',
      label: t('enrollment.payment.plans.sixMonths'),
      description: t('enrollment.payment.plans.sixMonthsDescription'),
      monthlyAmount: (basePrice * 1.08) / 6,
      totalAmount: basePrice * 1.08,
      savings: 0,
      recommended: false,
    },
    {
      id: '12_months',
      label: t('enrollment.payment.plans.twelveMonths'),
      description: t('enrollment.payment.plans.twelveMonthsDescription'),
      monthlyAmount: (basePrice * 1.12) / 12,
      totalAmount: basePrice * 1.12,
      savings: 0,
      recommended: false,
    },
  ];

  return (
    <div className="space-y-4">
      <Label>{t('enrollment.payment.selectPlan')}</Label>
      <RadioGroup value={selectedPlan} onValueChange={onPlanChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {installmentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative rounded-lg border p-4 cursor-pointer
                transition-all hover:shadow-md
                ${selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border'}
              `}
              onClick={() => onPlanChange(plan.id as any)}
            >
              {plan.recommended && (
                <Badge className="absolute -top-2 -right-2" variant="default">
                  {t('enrollment.payment.recommended')}
                </Badge>
              )}

              <div className="flex items-start space-x-3">
                <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={plan.id} className="cursor-pointer text-base">
                    {plan.label}
                  </Label>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        ${plan.monthlyAmount.toFixed(2)}
                        {plan.id !== 'full' && <span className="text-muted-foreground">/{t('common.month')}</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>{t('enrollment.payment.total')}: ${plan.totalAmount.toFixed(2)}</span>
                    </div>

                    {plan.id !== 'full' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{plan.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
