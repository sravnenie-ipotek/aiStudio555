import { z } from 'zod';

// API Request/Response Schemas
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
  timestamp: z.string(),
  path: z.string().optional(),
});

export const ApiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  timestamp: z.string(),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
});

// TypeScript Types
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

export enum HttpStatusCode {
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
  SERVICE_UNAVAILABLE = 503,
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
