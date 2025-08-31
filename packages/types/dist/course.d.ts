/**
 * Course-related type definitions
 * Used across the application for type safety
 */
export interface CourseData {
    id: string;
    title: string;
    description: string;
    price: number;
    discountedPrice?: number;
    duration: string;
    stripePriceId?: string;
    paypalItemId?: string;
    thumbnail?: string;
    category: CourseCategory;
    level: CourseLevel;
    language: string[];
    instructor: Instructor;
    modules: CourseModule[];
    features: string[];
    requirements: string[];
    outcomes: string[];
    enrollmentCount: number;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
    status: CourseStatus;
}
export type CourseCategory = 'ai-transformation' | 'no-code' | 'video-generation' | 'web-development' | 'data-science' | 'business' | 'marketing';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
export type CourseStatus = 'draft' | 'published' | 'archived' | 'coming-soon';
export interface Instructor {
    id: string;
    name: string;
    bio: string;
    avatar?: string;
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
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'dropped' | 'expired';
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