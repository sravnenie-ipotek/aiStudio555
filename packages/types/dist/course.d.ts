/**
 * Course-related type definitions
 * Updated to match Prisma schema v2.0 - Extended course catalog system
 */
import { z } from 'zod';
export interface CourseData {
    id: string;
    slug: string;
    title: MultiLanguageContent;
    description: MultiLanguageContent;
    shortDescription?: MultiLanguageContent;
    thumbnail?: string;
    heroImage?: string;
    thumbnailImage?: string;
    ogImage?: string;
    keyBenefits: string[];
    targetAudience: string[];
    careerOutcomes: string[];
    skillsLearned: string[];
    features: CourseFeature[];
    format: CourseFormat;
    platform?: string;
    price: number;
    currency: string;
    discountPrice?: number;
    paymentPlans: PaymentPlan[];
    duration: number;
    durationWeeks?: number;
    hoursPerWeek?: number;
    totalHours?: number;
    studentCount: number;
    averageRating?: number;
    completionRate?: number;
    nextStartDate?: Date;
    enrollmentDeadline?: Date;
    maxStudents?: number;
    minStudents?: number;
    level: CourseLevel;
    language: Locale;
    difficulty?: number;
    categoryId: string;
    category: CategoryData;
    instructorId: string;
    instructor: InstructorData;
    modules: CourseModule[];
    enrollments: CourseEnrollment[];
    reviews: CourseReview[];
    testimonials: CourseTestimonial[];
    status: CourseStatus;
    publishedAt?: Date;
    isActive: boolean;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface MultiLanguageContent {
    en?: string;
    ru?: string;
    he?: string;
}
export interface CourseFeature {
    name: string;
    description: string;
    icon?: string;
}
export interface PaymentPlan {
    id: string;
    name: string;
    installments: number;
    price: number;
    interval: 'month' | 'week';
    description?: string;
}
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
export interface InstructorData {
    id: string;
    locale: Locale;
    name: string;
    company?: string;
    bio?: any;
    avatarId?: string;
    avatar?: MediaAsset;
    linkedin?: string;
    website?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MediaAsset {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    createdAt: Date;
}
export interface CourseReview {
    id: string;
    courseId: string;
    userId: string;
    rating: number;
    title?: string;
    content?: string;
    isVerified: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare enum CourseFormat {
    ONLINE = "ONLINE",
    HYBRID = "HYBRID",
    IN_PERSON = "IN_PERSON"
}
export declare enum CourseLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT"
}
export declare enum CourseStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare enum Locale {
    EN = "EN",
    RU = "RU",
    HE = "HE"
}
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
export interface CoursesQueryParams {
    page?: number;
    limit?: number;
    category?: string;
    level?: CourseLevel;
    format?: CourseFormat;
    language?: Locale;
    status?: CourseStatus;
    featured?: boolean;
    active?: boolean;
    priceMin?: number;
    priceMax?: number;
    search?: string;
    sort?: 'title' | 'price' | 'rating' | 'students' | 'date' | 'popularity';
    order?: 'asc' | 'desc';
    instructor?: string;
    tags?: string[];
    minRating?: number;
    startDateFrom?: Date;
    startDateTo?: Date;
}
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
    timeLimit?: number;
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
    progress: number;
    currentModuleId?: string;
    currentLessonId?: string;
    lastAccessedAt: Date;
    certificateId?: string;
    grade?: number;
    status: EnrollmentStatusType;
}
export type EnrollmentStatusType = 'active' | 'completed' | 'paused' | 'dropped' | 'expired';
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
export declare const CourseCreateSchema: z.ZodObject<{
    title: z.ZodRecord<z.ZodString, z.ZodString>;
    description: z.ZodRecord<z.ZodString, z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    slug: z.ZodString;
    categoryId: z.ZodString;
    instructorId: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    discountPrice: z.ZodOptional<z.ZodNumber>;
    level: z.ZodEnum<["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]>;
    language: z.ZodEnum<["EN", "RU", "HE"]>;
    duration: z.ZodNumber;
    durationWeeks: z.ZodOptional<z.ZodNumber>;
    hoursPerWeek: z.ZodOptional<z.ZodNumber>;
    maxStudents: z.ZodOptional<z.ZodNumber>;
    minStudents: z.ZodOptional<z.ZodNumber>;
    nextStartDate: z.ZodOptional<z.ZodString>;
    enrollmentDeadline: z.ZodOptional<z.ZodString>;
    keyBenefits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    targetAudience: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    careerOutcomes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    skillsLearned: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    format: z.ZodDefault<z.ZodEnum<["ONLINE", "HYBRID", "IN_PERSON"]>>;
    platform: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodString>;
    heroImage: z.ZodOptional<z.ZodString>;
    metaTitle: z.ZodOptional<z.ZodString>;
    metaDescription: z.ZodOptional<z.ZodString>;
    keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    language: "EN" | "RU" | "HE";
    title: Record<string, string>;
    price: number;
    duration: number;
    description: Record<string, string>;
    slug: string;
    categoryId: string;
    instructorId: string;
    currency: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    keyBenefits: string[];
    targetAudience: string[];
    careerOutcomes: string[];
    skillsLearned: string[];
    format: "ONLINE" | "HYBRID" | "IN_PERSON";
    keywords: string[];
    shortDescription?: Record<string, string> | undefined;
    discountPrice?: number | undefined;
    durationWeeks?: number | undefined;
    hoursPerWeek?: number | undefined;
    maxStudents?: number | undefined;
    minStudents?: number | undefined;
    nextStartDate?: string | undefined;
    enrollmentDeadline?: string | undefined;
    platform?: string | undefined;
    thumbnail?: string | undefined;
    heroImage?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
}, {
    language: "EN" | "RU" | "HE";
    title: Record<string, string>;
    price: number;
    duration: number;
    description: Record<string, string>;
    slug: string;
    categoryId: string;
    instructorId: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    shortDescription?: Record<string, string> | undefined;
    currency?: string | undefined;
    discountPrice?: number | undefined;
    durationWeeks?: number | undefined;
    hoursPerWeek?: number | undefined;
    maxStudents?: number | undefined;
    minStudents?: number | undefined;
    nextStartDate?: string | undefined;
    enrollmentDeadline?: string | undefined;
    keyBenefits?: string[] | undefined;
    targetAudience?: string[] | undefined;
    careerOutcomes?: string[] | undefined;
    skillsLearned?: string[] | undefined;
    format?: "ONLINE" | "HYBRID" | "IN_PERSON" | undefined;
    platform?: string | undefined;
    thumbnail?: string | undefined;
    heroImage?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    keywords?: string[] | undefined;
}>;
export declare const CourseUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    description: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    shortDescription: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
    slug: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    instructorId: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    discountPrice: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    level: z.ZodOptional<z.ZodEnum<["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]>>;
    language: z.ZodOptional<z.ZodEnum<["EN", "RU", "HE"]>>;
    duration: z.ZodOptional<z.ZodNumber>;
    durationWeeks: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    hoursPerWeek: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    maxStudents: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    minStudents: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    nextStartDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    enrollmentDeadline: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    keyBenefits: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    targetAudience: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    careerOutcomes: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    skillsLearned: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["ONLINE", "HYBRID", "IN_PERSON"]>>>;
    platform: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    thumbnail: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    heroImage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    keywords: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    language?: "EN" | "RU" | "HE" | undefined;
    title?: Record<string, string> | undefined;
    price?: number | undefined;
    duration?: number | undefined;
    description?: Record<string, string> | undefined;
    shortDescription?: Record<string, string> | undefined;
    slug?: string | undefined;
    categoryId?: string | undefined;
    instructorId?: string | undefined;
    currency?: string | undefined;
    discountPrice?: number | undefined;
    level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | undefined;
    durationWeeks?: number | undefined;
    hoursPerWeek?: number | undefined;
    maxStudents?: number | undefined;
    minStudents?: number | undefined;
    nextStartDate?: string | undefined;
    enrollmentDeadline?: string | undefined;
    keyBenefits?: string[] | undefined;
    targetAudience?: string[] | undefined;
    careerOutcomes?: string[] | undefined;
    skillsLearned?: string[] | undefined;
    format?: "ONLINE" | "HYBRID" | "IN_PERSON" | undefined;
    platform?: string | undefined;
    thumbnail?: string | undefined;
    heroImage?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    keywords?: string[] | undefined;
}, {
    language?: "EN" | "RU" | "HE" | undefined;
    title?: Record<string, string> | undefined;
    price?: number | undefined;
    duration?: number | undefined;
    description?: Record<string, string> | undefined;
    shortDescription?: Record<string, string> | undefined;
    slug?: string | undefined;
    categoryId?: string | undefined;
    instructorId?: string | undefined;
    currency?: string | undefined;
    discountPrice?: number | undefined;
    level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | undefined;
    durationWeeks?: number | undefined;
    hoursPerWeek?: number | undefined;
    maxStudents?: number | undefined;
    minStudents?: number | undefined;
    nextStartDate?: string | undefined;
    enrollmentDeadline?: string | undefined;
    keyBenefits?: string[] | undefined;
    targetAudience?: string[] | undefined;
    careerOutcomes?: string[] | undefined;
    skillsLearned?: string[] | undefined;
    format?: "ONLINE" | "HYBRID" | "IN_PERSON" | undefined;
    platform?: string | undefined;
    thumbnail?: string | undefined;
    heroImage?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    keywords?: string[] | undefined;
}>;
export declare const CourseLessonProgressSchema: z.ZodObject<{
    lessonId: z.ZodString;
    status: z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]>;
    videoProgress: z.ZodOptional<z.ZodNumber>;
    score: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    lessonId: string;
    videoProgress?: number | undefined;
    score?: number | undefined;
}, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    lessonId: string;
    videoProgress?: number | undefined;
    score?: number | undefined;
}>;
export type CourseCreateInput = z.infer<typeof CourseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof CourseUpdateSchema>;
export type CourseLessonProgressInput = z.infer<typeof CourseLessonProgressSchema>;
//# sourceMappingURL=course.d.ts.map