// Alias for backward compatibility
export type CourseData = Course;

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  image?: string;
  instructor?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  features?: string[];
  requirements?: string[];
  curriculum?: {
    title: string;
    lessons: {
      title: string;
      duration: string;
      completed?: boolean;
    }[];
  }[];
  enrollmentCount?: number;
  rating?: number;
  reviews?: number;
}

export interface EnrollmentData {
  courseId: string;
  userId: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  installmentPlan?: 'full' | '3_months' | '6_months' | '12_months';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt: Date;
  certificateEarned?: boolean;
  certificateUrl?: string;
}
