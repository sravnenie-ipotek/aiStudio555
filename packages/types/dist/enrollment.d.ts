/**
 * Enrollment & Learning Progress Schemas
 * Zod validation schemas for course enrollment and progress tracking
 * @module @aistudio555/types/enrollment
 */
import { z } from 'zod';
export declare const EnrollmentStatusEnum: z.ZodEnum<["PENDING", "ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED", "SUSPENDED"]>;
export declare const ProgressStatusEnum: z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "SKIPPED"]>;
export declare const EnrollmentPaymentStatusEnum: z.ZodEnum<["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL"]>;
/**
 * Course enrollment creation schema
 */
export declare const CreateEnrollmentSchema: z.ZodObject<{
    courseId: z.ZodString;
    userId: z.ZodString;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    couponCode: z.ZodOptional<z.ZodString>;
    installmentPlan: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    courseId: string;
    userId: string;
    installmentPlan: boolean;
    paymentMethodId?: string | undefined;
    couponCode?: string | undefined;
}, {
    courseId: string;
    userId: string;
    paymentMethodId?: string | undefined;
    couponCode?: string | undefined;
    installmentPlan?: boolean | undefined;
}>;
/**
 * Full enrollment schema
 */
export declare const EnrollmentSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    courseId: z.ZodString;
    status: z.ZodEnum<["PENDING", "ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED", "SUSPENDED"]>;
    enrolledAt: z.ZodDate;
    startedAt: z.ZodNullable<z.ZodDate>;
    completedAt: z.ZodNullable<z.ZodDate>;
    expiresAt: z.ZodNullable<z.ZodDate>;
    progress: z.ZodDefault<z.ZodNumber>;
    lastAccessedAt: z.ZodNullable<z.ZodDate>;
    paymentStatus: z.ZodEnum<["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL"]>;
    paymentId: z.ZodNullable<z.ZodString>;
    certificateId: z.ZodNullable<z.ZodString>;
    totalTimeSpent: z.ZodDefault<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status: "COMPLETED" | "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED";
    courseId: string;
    userId: string;
    id: string;
    enrolledAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    expiresAt: Date | null;
    progress: number;
    lastAccessedAt: Date | null;
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIAL";
    paymentId: string | null;
    certificateId: string | null;
    totalTimeSpent: number;
    metadata?: Record<string, any> | undefined;
}, {
    status: "COMPLETED" | "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED";
    courseId: string;
    userId: string;
    id: string;
    enrolledAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    expiresAt: Date | null;
    lastAccessedAt: Date | null;
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIAL";
    paymentId: string | null;
    certificateId: string | null;
    progress?: number | undefined;
    totalTimeSpent?: number | undefined;
    metadata?: Record<string, any> | undefined;
}>;
/**
 * Update enrollment progress schema
 */
export declare const UpdateEnrollmentProgressSchema: z.ZodObject<{
    enrollmentId: z.ZodString;
    lessonId: z.ZodString;
    status: z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "SKIPPED"]>;
    timeSpent: z.ZodNumber;
    score: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
    lessonId: string;
    enrollmentId: string;
    timeSpent: number;
    score?: number | undefined;
    notes?: string | undefined;
}, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
    lessonId: string;
    enrollmentId: string;
    timeSpent: number;
    score?: number | undefined;
    notes?: string | undefined;
}>;
/**
 * Lesson progress schema
 */
export declare const LessonProgressSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    enrollmentId: z.ZodString;
    lessonId: z.ZodString;
    status: z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "SKIPPED"]>;
    startedAt: z.ZodNullable<z.ZodDate>;
    completedAt: z.ZodNullable<z.ZodDate>;
    lastAccessedAt: z.ZodDate;
    timeSpent: z.ZodDefault<z.ZodNumber>;
    score: z.ZodNullable<z.ZodNumber>;
    attempts: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodString>;
    bookmarks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodNumber;
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        timestamp: number;
        note?: string | undefined;
    }, {
        timestamp: number;
        note?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
    lessonId: string;
    score: number | null;
    userId: string;
    id: string;
    startedAt: Date | null;
    completedAt: Date | null;
    lastAccessedAt: Date;
    enrollmentId: string;
    timeSpent: number;
    notes: string | null;
    attempts: number;
    bookmarks?: {
        timestamp: number;
        note?: string | undefined;
    }[] | undefined;
}, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
    lessonId: string;
    score: number | null;
    userId: string;
    id: string;
    startedAt: Date | null;
    completedAt: Date | null;
    lastAccessedAt: Date;
    enrollmentId: string;
    notes: string | null;
    timeSpent?: number | undefined;
    attempts?: number | undefined;
    bookmarks?: {
        timestamp: number;
        note?: string | undefined;
    }[] | undefined;
}>;
/**
 * Module progress aggregation schema
 */
export declare const ModuleProgressSchema: z.ZodObject<{
    moduleId: z.ZodString;
    totalLessons: z.ZodNumber;
    completedLessons: z.ZodNumber;
    inProgressLessons: z.ZodNumber;
    progress: z.ZodNumber;
    totalTimeSpent: z.ZodNumber;
    averageScore: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    progress: number;
    totalTimeSpent: number;
    moduleId: string;
    totalLessons: number;
    completedLessons: number;
    inProgressLessons: number;
    averageScore: number | null;
}, {
    progress: number;
    totalTimeSpent: number;
    moduleId: string;
    totalLessons: number;
    completedLessons: number;
    inProgressLessons: number;
    averageScore: number | null;
}>;
/**
 * Course progress overview schema
 */
export declare const CourseProgressSchema: z.ZodObject<{
    enrollmentId: z.ZodString;
    courseId: z.ZodString;
    userId: z.ZodString;
    overallProgress: z.ZodNumber;
    modulesProgress: z.ZodArray<z.ZodObject<{
        moduleId: z.ZodString;
        totalLessons: z.ZodNumber;
        completedLessons: z.ZodNumber;
        inProgressLessons: z.ZodNumber;
        progress: z.ZodNumber;
        totalTimeSpent: z.ZodNumber;
        averageScore: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        progress: number;
        totalTimeSpent: number;
        moduleId: string;
        totalLessons: number;
        completedLessons: number;
        inProgressLessons: number;
        averageScore: number | null;
    }, {
        progress: number;
        totalTimeSpent: number;
        moduleId: string;
        totalLessons: number;
        completedLessons: number;
        inProgressLessons: number;
        averageScore: number | null;
    }>, "many">;
    totalTimeSpent: z.ZodNumber;
    estimatedTimeRemaining: z.ZodNumber;
    currentLesson: z.ZodNullable<z.ZodObject<{
        lessonId: z.ZodString;
        moduleId: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        lessonId: string;
        moduleId: string;
    }, {
        title: string;
        lessonId: string;
        moduleId: string;
    }>>;
    nextLesson: z.ZodNullable<z.ZodObject<{
        lessonId: z.ZodString;
        moduleId: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        lessonId: string;
        moduleId: string;
    }, {
        title: string;
        lessonId: string;
        moduleId: string;
    }>>;
    completionDate: z.ZodNullable<z.ZodDate>;
    certificateEligible: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    courseId: string;
    userId: string;
    totalTimeSpent: number;
    enrollmentId: string;
    overallProgress: number;
    modulesProgress: {
        progress: number;
        totalTimeSpent: number;
        moduleId: string;
        totalLessons: number;
        completedLessons: number;
        inProgressLessons: number;
        averageScore: number | null;
    }[];
    estimatedTimeRemaining: number;
    currentLesson: {
        title: string;
        lessonId: string;
        moduleId: string;
    } | null;
    nextLesson: {
        title: string;
        lessonId: string;
        moduleId: string;
    } | null;
    completionDate: Date | null;
    certificateEligible: boolean;
}, {
    courseId: string;
    userId: string;
    totalTimeSpent: number;
    enrollmentId: string;
    overallProgress: number;
    modulesProgress: {
        progress: number;
        totalTimeSpent: number;
        moduleId: string;
        totalLessons: number;
        completedLessons: number;
        inProgressLessons: number;
        averageScore: number | null;
    }[];
    estimatedTimeRemaining: number;
    currentLesson: {
        title: string;
        lessonId: string;
        moduleId: string;
    } | null;
    nextLesson: {
        title: string;
        lessonId: string;
        moduleId: string;
    } | null;
    completionDate: Date | null;
    certificateEligible: boolean;
}>;
/**
 * Certificate generation schema
 */
export declare const GenerateCertificateSchema: z.ZodObject<{
    enrollmentId: z.ZodString;
    courseId: z.ZodString;
    userId: z.ZodString;
    completionDate: z.ZodDate;
    grade: z.ZodOptional<z.ZodString>;
    score: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    courseId: string;
    userId: string;
    enrollmentId: string;
    completionDate: Date;
    score?: number | undefined;
    grade?: string | undefined;
}, {
    courseId: string;
    userId: string;
    enrollmentId: string;
    completionDate: Date;
    score?: number | undefined;
    grade?: string | undefined;
}>;
/**
 * Certificate schema
 */
export declare const CertificateSchema: z.ZodObject<{
    id: z.ZodString;
    certificateNumber: z.ZodString;
    enrollmentId: z.ZodString;
    courseId: z.ZodString;
    userId: z.ZodString;
    issuedAt: z.ZodDate;
    expiresAt: z.ZodNullable<z.ZodDate>;
    grade: z.ZodNullable<z.ZodString>;
    score: z.ZodNullable<z.ZodNumber>;
    templateId: z.ZodOptional<z.ZodString>;
    verificationUrl: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    score: number | null;
    courseId: string;
    userId: string;
    id: string;
    expiresAt: Date | null;
    enrollmentId: string;
    grade: string | null;
    certificateNumber: string;
    issuedAt: Date;
    verificationUrl: string;
    metadata?: Record<string, any> | undefined;
    templateId?: string | undefined;
}, {
    score: number | null;
    courseId: string;
    userId: string;
    id: string;
    expiresAt: Date | null;
    enrollmentId: string;
    grade: string | null;
    certificateNumber: string;
    issuedAt: Date;
    verificationUrl: string;
    metadata?: Record<string, any> | undefined;
    templateId?: string | undefined;
}>;
/**
 * Learning analytics schema
 */
export declare const LearningAnalyticsSchema: z.ZodObject<{
    userId: z.ZodString;
    totalCoursesEnrolled: z.ZodNumber;
    totalCoursesCompleted: z.ZodNumber;
    totalTimeSpent: z.ZodNumber;
    averageCompletionRate: z.ZodNumber;
    averageScore: z.ZodNullable<z.ZodNumber>;
    streakDays: z.ZodNumber;
    lastActiveDate: z.ZodDate;
    preferredLearningTime: z.ZodNullable<z.ZodString>;
    strongestSubjects: z.ZodArray<z.ZodString, "many">;
    improvementAreas: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    userId: string;
    totalTimeSpent: number;
    averageScore: number | null;
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    averageCompletionRate: number;
    streakDays: number;
    lastActiveDate: Date;
    preferredLearningTime: string | null;
    strongestSubjects: string[];
    improvementAreas: string[];
}, {
    userId: string;
    totalTimeSpent: number;
    averageScore: number | null;
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    averageCompletionRate: number;
    streakDays: number;
    lastActiveDate: Date;
    preferredLearningTime: string | null;
    strongestSubjects: string[];
    improvementAreas: string[];
}>;
export type EnrollmentStatus = z.infer<typeof EnrollmentStatusEnum>;
export type ProgressStatus = z.infer<typeof ProgressStatusEnum>;
export type EnrollmentPaymentStatus = z.infer<typeof EnrollmentPaymentStatusEnum>;
export type CreateEnrollment = z.infer<typeof CreateEnrollmentSchema>;
export type Enrollment = z.infer<typeof EnrollmentSchema>;
export type UpdateEnrollmentProgress = z.infer<typeof UpdateEnrollmentProgressSchema>;
export type LessonProgress = z.infer<typeof LessonProgressSchema>;
export type ModuleProgress = z.infer<typeof ModuleProgressSchema>;
export type CourseProgress = z.infer<typeof CourseProgressSchema>;
export type GenerateCertificate = z.infer<typeof GenerateCertificateSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type LearningAnalytics = z.infer<typeof LearningAnalyticsSchema>;
export declare const EnrollmentCreateSchema: z.ZodObject<{
    courseId: z.ZodString;
    userId: z.ZodString;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    couponCode: z.ZodOptional<z.ZodString>;
    installmentPlan: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    courseId: string;
    userId: string;
    installmentPlan: boolean;
    paymentMethodId?: string | undefined;
    couponCode?: string | undefined;
}, {
    courseId: string;
    userId: string;
    paymentMethodId?: string | undefined;
    couponCode?: string | undefined;
    installmentPlan?: boolean | undefined;
}>;
//# sourceMappingURL=enrollment.d.ts.map