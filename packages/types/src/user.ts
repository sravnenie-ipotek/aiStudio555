/**
 * User-related type definitions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  isActive: boolean;
}

export type UserRole = 'student' | 'instructor' | 'admin' | 'support';

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  phone?: string;
  country?: string;
  city?: string;
  timezone?: string;
  language: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  interests?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  learning: LearningPreferences;
  appearance: AppearanceSettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  courseUpdates: boolean;
  messages: boolean;
  promotions: boolean;
  achievements: boolean;
  reminders: boolean;
  newsletter: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections-only';
  showProgress: boolean;
  showAchievements: boolean;
  showCertificates: boolean;
  allowMessages: 'everyone' | 'connections' | 'nobody';
  dataCollection: boolean;
  analytics: boolean;
}

export interface LearningPreferences {
  studyGoals?: string;
  preferredLanguage: string;
  subtitles: boolean;
  playbackSpeed: number;
  autoplay: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
  dailyGoal?: number; // minutes per day
  weeklyGoal?: number; // hours per week
  reminderTime?: string; // HH:MM format
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  colorblindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
  ipAddress: string;
  userAgent: string;
  device?: string;
  location?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  action: string;
  resourceId?: string;
  resourceType?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export type ActivityType = 
  | 'course_view'
  | 'lesson_complete'
  | 'quiz_attempt'
  | 'assignment_submit'
  | 'certificate_earned'
  | 'achievement_unlocked'
  | 'message_sent'
  | 'profile_update'
  | 'payment_made';

export interface UserStats {
  userId: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  totalTimeSpent: number; // in minutes
  averageQuizScore: number;
  certificatesEarned: number;
  achievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}
