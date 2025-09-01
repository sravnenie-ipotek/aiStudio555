import { z } from 'zod';

// Zod Schemas
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  language: z.enum(['en', 'he', 'ru']).default('en'),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const UpdatePasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Aliases for controller compatibility
export const UserRegisterSchema = SignUpSchema;
export const UserLoginSchema = SignInSchema;
export const PasswordResetRequestSchema = ResetPasswordSchema;
export const PasswordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// TypeScript Types
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

export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
