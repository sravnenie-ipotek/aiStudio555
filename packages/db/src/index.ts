/**
 * @aistudio555/db - Database Layer with Prisma ORM
 * Central database access and models for AiStudio555 Academy
 */

// Export Prisma client instance and types
export * from './client';

// Export database utilities
export * from './utils';

// Export service functions
export * from './services';

// Re-export Prisma types (will be available after prisma generate)
export * from '@prisma/client';
