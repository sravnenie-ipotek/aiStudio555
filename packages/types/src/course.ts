/**
 * Course-related type definitions
 * Updated to match Prisma schema v2.0 - Extended course catalog system
 */

// Core course interface matching Prisma schema
export interface CourseData {
  id: string;
  slug: string;
  
  // Multi-language content (JSON fields)
  title: MultiLanguageContent;
  description: MultiLanguageContent;
  shortDescription?: MultiLanguageContent;
  
  // Images and media
  thumbnail?: string;
  heroImage?: string;
  thumbnailImage?: string;
  ogImage?: string;
  
  // Marketing content
  keyBenefits: string[];
  targetAudience: string[];
  careerOutcomes: string[];
  skillsLearned: string[];
  features: CourseFeature[];
  
  // Course format and platform
  format: CourseFormat;
  platform?: string;
  
  // Pricing
  price: number;
  currency: string;
  discountPrice?: number;
  paymentPlans: PaymentPlan[];
  
  // Duration structure
  duration: number; // hours (legacy)
  durationWeeks?: number;
  hoursPerWeek?: number;
  totalHours?: number;
  
  // Computed metrics
  studentCount: number;
  averageRating?: number;
  completionRate?: number;
  
  // Enrollment & scheduling
  nextStartDate?: Date;
  enrollmentDeadline?: Date;
  maxStudents?: number;
  minStudents?: number;
  
  // Metadata
  level: CourseLevel;
  language: Locale;
  difficulty?: number; // 1-5 scale
  
  // Relations
  categoryId: string;
  category: CategoryData;
  instructorId: string;
  instructor: InstructorData;
  modules: CourseModule[];
  enrollments: CourseEnrollment[];
  reviews: CourseReview[];
  testimonials: CourseTestimonial[];
  
  // Publishing
  status: CourseStatus;
  publishedAt?: Date;
  isActive: boolean;
  isFeatured: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Multi-language content interface
export interface MultiLanguageContent {
  en?: string;
  ru?: string;
  he?: string;
}

// Course feature interface
export interface CourseFeature {
  name: string;
  description: string;
  icon?: string;
}

// Payment plan interface
export interface PaymentPlan {
  id: string;
  name: string;
  installments: number;
  price: number;
  interval: 'month' | 'week';
  description?: string;
}

// Category interface
export interface CategoryData {
  id: string;
  slug: string;
  name: MultiLanguageContent;
  description?: MultiLanguageContent;
  icon?: string;
  parentId?: string;
  parent?: CategoryData;
  children: CategoryData[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Updated instructor interface to match Prisma
export interface InstructorData {
  id: string;
  locale: Locale;
  name: string;
  company?: string;
  bio?: any; // JSON from TipTap
  avatarId?: string;
  avatar?: MediaAsset;
  linkedin?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Media asset interface
export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
}

// Course review interface
export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number; // 1-5
  title?: string;
  content?: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Course testimonial interface
export interface CourseTestimonial {
  id: string;
  locale: Locale;
  studentName: string;
  avatarId?: string;
  avatar?: MediaAsset;
  quote: string;
  courseId?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enums matching Prisma schema
export enum CourseFormat {
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
  IN_PERSON = 'IN_PERSON'
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE', 
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum Locale {
  EN = 'EN',
  RU = 'RU',
  HE = 'HE'
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

// API Response types
export interface CoursesListResponse {
  success: true;
  data: CourseData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  links: {
    self: string;
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
}

export interface CourseDetailResponse {
  success: true;
  data: CourseData;
}

export interface CategoriesListResponse {
  success: true;
  data: CategoryData[];
}

export interface FeaturedCoursesResponse {
  success: true;
  data: CourseData[];
  meta: {
    total: number;
  };
}

// API Query parameters
export interface CoursesQueryParams {
  // Pagination
  page?: number;
  limit?: number;
  
  // Filtering
  category?: string;
  level?: CourseLevel;
  format?: CourseFormat;
  language?: Locale;
  status?: CourseStatus;
  featured?: boolean;
  active?: boolean;
  
  // Price filtering
  priceMin?: number;
  priceMax?: number;
  
  // Search
  search?: string;
  
  // Sorting
  sort?: 'title' | 'price' | 'rating' | 'students' | 'date' | 'popularity';
  order?: 'asc' | 'desc';
  
  // Advanced filters
  instructor?: string;
  tags?: string[];
  minRating?: number;
  
  // Date filters
  startDateFrom?: Date;
  startDateTo?: Date;
}

// Legacy types for backwards compatibility
export type CourseCategory = string;

export interface Instructor extends InstructorData {
  title: string;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  expertise: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  duration: string;
  isLocked: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: LessonType;
  content: LessonContent;
  duration: string;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  resources?: Resource[];
  quiz?: Quiz;
}

export type LessonType = 'video' | 'reading' | 'quiz' | 'assignment' | 'project';

export interface LessonContent {
  type: LessonType;
  videoUrl?: string;
  readingContent?: string;
  assignmentDetails?: AssignmentDetails;
  projectDetails?: ProjectDetails;
}

export interface AssignmentDetails {
  instructions: string;
  dueDate?: Date;
  maxScore: number;
  rubric?: RubricItem[];
  submissionType: 'file' | 'text' | 'url';
}

export interface ProjectDetails {
  overview: string;
  requirements: string[];
  deliverables: string[];
  timeline: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'download' | 'code';
  url: string;
  size?: string;
  description?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
  maxAttempts?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
}

export interface RubricItem {
  criteria: string;
  points: number;
  description: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // percentage
  currentModuleId?: string;
  currentLessonId?: string;
  lastAccessedAt: Date;
  certificateId?: string;
  grade?: number;
  status: EnrollmentStatus;
}

export type EnrollmentStatusType = 
  | 'active'
  | 'completed'
  | 'paused'
  | 'dropped'
  | 'expired';

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  completedModules: string[];
  quizScores: Record<string, number>;
  assignmentSubmissions: AssignmentSubmission[];
  totalTimeSpent: number; // in minutes
  lastLesson?: string;
  streak: number;
  achievements: Achievement[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: Date;
  content: string | File;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  criteria: AchievementCriteria;
}

export interface AchievementCriteria {
  type: 'lessons_completed' | 'streak' | 'quiz_score' | 'course_completed' | 'perfect_score';
  value: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  userId: string;
  courseName: string;
  studentName: string;
  instructorName: string;
  completionDate: Date;
  grade?: string;
  certificateNumber: string;
  validationUrl: string;
  skills: string[];
  createdAt: Date;
}
