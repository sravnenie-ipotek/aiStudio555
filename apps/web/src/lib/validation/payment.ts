/**
 * Payment validation utilities with security focus
 * Implements PCI DSS compliant validation without storing sensitive data
 */

import type { PaymentValidation, BillingDetails } from '@/types/payment';

// Card number validation (Luhn algorithm)
export function validateCardNumber(cardNumber: string): PaymentValidation['cardNumber'] {
  const errors: string[] = [];

  // Remove spaces and hyphens
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');

  // Check if contains only digits
  if (!/^\d+$/.test(cleanNumber)) {
    errors.push('Card number must contain only digits');
  }

  // Check length (13-19 digits for most cards)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    errors.push('Invalid card number length');
  }

  // Luhn algorithm validation
  if (!luhnCheck(cleanNumber)) {
    errors.push('Invalid card number');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Luhn algorithm implementation
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// CVV validation
export function validateCVV(cvv: string, cardBrand?: string): PaymentValidation['cvv'] {
  const errors: string[] = [];

  // Check if contains only digits
  if (!/^\d+$/.test(cvv)) {
    errors.push('CVV must contain only digits');
  }

  // Check length based on card brand
  const expectedLength = cardBrand === 'amex' ? 4 : 3;
  if (cvv.length !== expectedLength) {
    errors.push(`CVV must be ${expectedLength} digits`);
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Expiry date validation
export function validateExpiryDate(month: string, year: string): PaymentValidation['expiryDate'] {
  const errors: string[] = [];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  // Validate month
  if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
    errors.push('Invalid month');
  }

  // Validate year
  if (isNaN(expYear) || expYear < currentYear) {
    errors.push('Card has expired');
  }

  // Check if card has expired
  if (expYear === currentYear && expMonth < currentMonth) {
    errors.push('Card has expired');
  }

  // Check if expiry is too far in the future (10 years)
  if (expYear > currentYear + 10) {
    errors.push('Invalid expiry year');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Billing address validation
export function validateBillingAddress(address: BillingDetails['address']): PaymentValidation['billingAddress'] {
  const errors: string[] = [];

  if (!address.line1 || address.line1.trim().length < 3) {
    errors.push('Address line 1 is required');
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is required');
  }

  if (!address.postalCode || address.postalCode.trim().length < 3) {
    errors.push('Postal code is required');
  }

  if (!address.country || address.country.trim().length !== 2) {
    errors.push('Valid country code is required');
  }

  // Validate postal code format based on country
  if (address.country && address.postalCode) {
    const postalCodeValid = validatePostalCode(address.postalCode, address.country);
    if (!postalCodeValid) {
      errors.push('Invalid postal code format for selected country');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Postal code validation by country
export function validatePostalCode(postalCode: string, countryCode: string): boolean {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    GB: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    AU: /^\d{4}$/,
    JP: /^\d{3}-?\d{4}$/,
    IN: /^\d{6}$/,
    BR: /^\d{5}-?\d{3}$/,
    MX: /^\d{5}$/,
    IL: /^\d{5,7}$/,
    RU: /^\d{6}$/,
  };

  const pattern = patterns[countryCode.toUpperCase()];
  if (!pattern) {
    // Default validation for unknown countries
    return postalCode.length >= 3 && postalCode.length <= 10;
  }

  return pattern.test(postalCode.trim());
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation
export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's between 10 and 15 digits (international)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

// Amount validation
export function validateAmount(amount: number, min: number = 0.01, max: number = 999999.99): boolean {
  return amount >= min && amount <= max && !isNaN(amount);
}

// Complete payment validation
export interface PaymentFormData {
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  billingDetails: BillingDetails;
  amount: number;
}

export function validatePaymentForm(data: PaymentFormData): {
  isValid: boolean;
  errors: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};

  // Validate card number
  const cardValidation = validateCardNumber(data.cardNumber);
  if (!cardValidation.isValid && cardValidation.errors) {
    errors.cardNumber = cardValidation.errors;
  }

  // Validate CVV
  const cvvValidation = validateCVV(data.cvv);
  if (!cvvValidation.isValid && cvvValidation.errors) {
    errors.cvv = cvvValidation.errors;
  }

  // Validate expiry date
  const expiryValidation = validateExpiryDate(data.expiryMonth, data.expiryYear);
  if (!expiryValidation.isValid && expiryValidation.errors) {
    errors.expiry = expiryValidation.errors;
  }

  // Validate billing address
  const addressValidation = validateBillingAddress(data.billingDetails.address);
  if (!addressValidation.isValid && addressValidation.errors) {
    errors.address = addressValidation.errors;
  }

  // Validate email
  if (!validateEmail(data.billingDetails.email)) {
    errors.email = ['Invalid email address'];
  }

  // Validate name
  if (!data.billingDetails.name || data.billingDetails.name.trim().length < 2) {
    errors.name = ['Name is required'];
  }

  // Validate amount
  if (!validateAmount(data.amount)) {
    errors.amount = ['Invalid payment amount'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Get card brand from number
export function getCardBrand(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');

  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^35/,
  };

  for (const [brand, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleanNumber)) {
      return brand;
    }
  }

  return 'unknown';
}

// Mask card number for display
export function maskCardNumber(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  if (cleanNumber.length < 8) {
    return cardNumber;
  }

  const last4 = cleanNumber.slice(-4);
  const masked = cleanNumber.slice(0, -4).replace(/\d/g, '*');

  // Format with spaces every 4 digits
  const formatted = (masked + last4).match(/.{1,4}/g)?.join(' ') || '';
  return formatted;
}

// Sanitize payment data before sending to server
export function sanitizePaymentData(data: any): any {
  const sanitized = { ...data };

  // Never send full card number
  if (sanitized.cardNumber) {
    delete sanitized.cardNumber;
  }

  // Never send CVV
  if (sanitized.cvv) {
    delete sanitized.cvv;
  }

  // Only send masked version if needed
  if (data.cardNumber) {
    sanitized.last4 = data.cardNumber.slice(-4);
    sanitized.brand = getCardBrand(data.cardNumber);
  }

  return sanitized;
}
