/**
 * @projectdes/db - Database Layer with Prisma ORM
 * Central database access and models for Projectdes Academy
 */

// Export Prisma client instance and types
export * from './client';

// Export database utilities
export * from './utils';

// Re-export Prisma types (will be available after prisma generate)
export * from '@prisma/client';
