/**
 * Course-related type definitions
 * Updated to match Prisma schema v2.0 - Extended course catalog system
 */
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
export declare enum EnrollmentStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
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
    status: EnrollmentStatus;
}
export type EnrollmentStatusType = 'active' | 'completed' | 'paused' | 'dropped' | 'expired';
export interface CourseProgress {
    courseId: string;
    userId: string;
    completedLessons: string[];
    completedModules: string[];
    quizScores: Record<string, number>;
    assignmentSubmissions: AssignmentSubmission[];
    totalTimeSpent: number;
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
//# sourceMappingURL=course.d.ts.map