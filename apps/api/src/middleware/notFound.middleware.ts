/**
 * Not Found Middleware
 * Handles 404 errors for undefined routes
 * @module apps/api/middleware/notFound
 */

import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      suggestion: 'Please check the API documentation at /api',
    },
    timestamp: new Date().toISOString(),
  });
}