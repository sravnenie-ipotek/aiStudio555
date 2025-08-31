import { z } from 'zod';
export declare const ApiErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodAny>;
    timestamp: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    timestamp: string;
    details?: any;
    path?: string | undefined;
}, {
    code: string;
    message: string;
    timestamp: string;
    details?: any;
    path?: string | undefined;
}>;
export declare const ApiSuccessSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: z.ZodAny;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    success: true;
    data?: any;
}, {
    timestamp: string;
    success: true;
    data?: any;
}>;
export declare const PaginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sort?: string | undefined;
    order?: "asc" | "desc" | undefined;
    search?: string | undefined;
}, {
    sort?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    order?: "asc" | "desc" | undefined;
    search?: string | undefined;
}>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export interface ApiEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    authenticated: boolean;
    roles?: string[];
    rateLimit?: {
        windowMs: number;
        max: number;
    };
}
export interface ApiRequestContext {
    user?: {
        id: string;
        email: string;
        role: string;
    };
    requestId: string;
    ip: string;
    userAgent: string;
    timestamp: Date;
}
export interface ApiResponseHeaders {
    'X-Request-ID': string;
    'X-RateLimit-Limit': string;
    'X-RateLimit-Remaining': string;
    'X-RateLimit-Reset': string;
}
export declare enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}
export interface WebhookEvent {
    id: string;
    type: string;
    data: any;
    timestamp: Date;
    signature: string;
}
export interface HealthCheckResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    uptime: number;
    timestamp: Date;
    services: {
        database: 'up' | 'down';
        redis: 'up' | 'down';
        storage: 'up' | 'down';
        email: 'up' | 'down';
    };
}
//# sourceMappingURL=api.d.ts.map