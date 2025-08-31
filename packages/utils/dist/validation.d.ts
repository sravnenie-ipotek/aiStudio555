/**
 * Validation Utilities
 * Common validation functions and patterns
 */
import { z } from 'zod';
/**
 * Email validation
 */
export declare const emailSchema: z.ZodString;
export declare const isValidEmail: (email: string) => boolean;
/**
 * Phone validation (international format)
 */
export declare const phoneSchema: z.ZodString;
export declare const isValidPhone: (phone: string) => boolean;
/**
 * Password validation
 */
export declare const passwordSchema: z.ZodString;
export declare const isValidPassword: (password: string) => boolean;
/**
 * URL validation
 */
export declare const urlSchema: z.ZodString;
export declare const isValidUrl: (url: string) => boolean;
/**
 * UUID validation
 */
export declare const uuidSchema: z.ZodString;
export declare const isValidUuid: (uuid: string) => boolean;
/**
 * Credit card validation (basic Luhn algorithm)
 */
export declare const isValidCreditCard: (cardNumber: string) => boolean;
//# sourceMappingURL=validation.d.ts.map