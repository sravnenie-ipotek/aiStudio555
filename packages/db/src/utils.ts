/**
 * Database Utility Functions
 * Helper functions for database operations
 */

import { Prisma } from '../node_modules/.prisma/client';

/**
 * Handle Prisma errors and return user-friendly messages
 */
export function handlePrismaError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return 'A unique constraint violation occurred.';
      case 'P2014':
        return 'The change you are trying to make would violate a relation.';
      case 'P2003':
        return 'Foreign key constraint failed.';
      case 'P2025':
        return 'Record not found.';
      default:
        return `Database error: ${error.message}`;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return 'Invalid data provided.';
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return 'Failed to connect to the database.';
  }

  return 'An unexpected database error occurred.';
}

/**
 * Build pagination parameters for Prisma queries
 */
export function buildPaginationParams(
  page: number = 1,
  limit: number = 20
): { skip: number; take: number } {
  const take = Math.min(limit, 100); // Max 100 items per page
  const skip = (Math.max(page, 1) - 1) * take;

  return { skip, take };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  return {
    total,
    page: currentPage,
    limit,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

/**
 * Exclude fields from Prisma result
 */
export function exclude<T, Key extends keyof T>(data: T, keys: Key[]): Omit<T, Key> {
  const result = { ...data };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Safe JSON parsing for JSONB fields
 */
export function safeJsonParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;

  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
