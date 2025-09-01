import { z } from 'zod';
export declare const SignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    language: z.ZodDefault<z.ZodEnum<["en", "he", "ru"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    language: "en" | "he" | "ru";
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    language?: "en" | "he" | "ru" | undefined;
}>;
export declare const SignInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
}, {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
}>;
export declare const ResetPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const UpdatePasswordSchema: z.ZodEffects<z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    token: string;
    confirmPassword: string;
}, {
    password: string;
    token: string;
    confirmPassword: string;
}>, {
    password: string;
    token: string;
    confirmPassword: string;
}, {
    password: string;
    token: string;
    confirmPassword: string;
}>;
export declare const UserRegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    language: z.ZodDefault<z.ZodEnum<["en", "he", "ru"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    language: "en" | "he" | "ru";
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    language?: "en" | "he" | "ru" | undefined;
}>;
export declare const UserLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
}, {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
}>;
export declare const PasswordResetRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const PasswordResetSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    token: string;
}, {
    password: string;
    token: string;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface AuthSession {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        avatar?: string;
    };
    tokens: AuthTokens;
}
export declare enum UserRole {
    STUDENT = "STUDENT",
    INSTRUCTOR = "INSTRUCTOR",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
//# sourceMappingURL=auth.d.ts.map