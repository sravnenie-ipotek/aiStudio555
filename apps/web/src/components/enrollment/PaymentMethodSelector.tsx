'use client';

import React from 'react';
import { CreditCard, Wallet, Building2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface PaymentMethodSelectorProps {
  selectedMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  onMethodChange: (method: 'credit_card' | 'paypal' | 'bank_transfer') => void;
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  const { t } = useTranslation();

  const paymentMethods = [
    {
      id: 'credit_card',
      label: t('enrollment.payment.methods.creditCard'),
      description: t('enrollment.payment.methods.creditCardDescription'),
      icon: CreditCard,
    },
    {
      id: 'paypal',
      label: t('enrollment.payment.methods.paypal'),
      description: t('enrollment.payment.methods.paypalDescription'),
      icon: Wallet,
    },
    {
      id: 'bank_transfer',
      label: t('enrollment.payment.methods.bankTransfer'),
      description: t('enrollment.payment.methods.bankTransferDescription'),
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-4">
      <Label>{t('enrollment.payment.selectMethod')}</Label>
      <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              className={`
                relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer
                transition-colors hover:bg-muted/50
                ${selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-border'}
              `}
              onClick={() => onMethodChange(method.id as any)}
            >
              <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
              <Icon className="w-5 h-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <Label htmlFor={method.id} className="cursor-pointer">
                  {method.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}