// cypress/support/types.ts

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPPORT';
  emailVerified: boolean;
  locale: 'en' | 'ru' | 'he';
  createdAt: string;
  updatedAt: string;
}

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  locale?: 'en' | 'ru' | 'he';
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  emailVerified?: boolean;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  duration: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: 'en' | 'ru' | 'he';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  instructorId: string;
  categoryId: string;
  tags: string[];
  thumbnail?: string;
  stripePriceId?: string;
  paypalItemId?: string;
  maxStudents?: number;
  currentStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  method: 'STRIPE' | 'PAYPAL';
  externalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
}

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  locale?: 'en' | 'ru' | 'he';
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  courseInterest?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Test configuration types
export interface TestConfig {
  baseUrl: string;
  apiUrl: string;
  enablePayments: boolean;
  enableMultiLanguage: boolean;
  testEmail: string;
  testPassword: string;
}

// Viewport types for responsive testing
export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  isMobile?: boolean;
  isTablet?: boolean;
}

export const VIEWPORTS: ViewportConfig[] = [
  { name: 'mobile', width: 375, height: 812, isMobile: true },
  { name: 'tablet', width: 768, height: 1024, isTablet: true },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'wide', width: 1536, height: 960 },
];

// Test data factories
export const testUserFactory = (overrides?: Partial<TestUser>): TestUser => ({
  email: `test+${Date.now()}@projectdes.ai`,
  password: 'Test123!@#',
  firstName: 'Test',
  lastName: 'User',
  locale: 'en',
  role: 'STUDENT',
  emailVerified: true,
  ...overrides,
});

export const testCourseFactory = (overrides?: Partial<Course>): Partial<Course> => ({
  title: 'Test Course',
  description: 'A test course for automated testing',
  price: 1000,
  currency: 'USD',
  duration: '8 weeks',
  level: 'BEGINNER',
  language: 'en',
  status: 'PUBLISHED',
  tags: ['test', 'automation'],
  maxStudents: 100,
  currentStudents: 0,
  ...overrides,
});

// Error types
export interface TestError {
  type: 'VALIDATION' | 'NETWORK' | 'AUTH' | 'PAYMENT' | 'UNKNOWN';
  message: string;
  code?: string;
  details?: any;
}

// Custom matchers for testing
export interface CustomMatchers {
  toHaveValidationError(fieldName: string): void;
  toBeAccessible(): void;
  toHaveCorrectMetaTags(): void;
  toLoadWithinTimeout(timeout: number): void;
}

declare global {
  namespace Cypress {
    interface Chainable extends CustomMatchers {}
  }
}