/**
 * Logging Utilities
 * Structured logging with Winston
 */

import winston from 'winston';

/**
 * Log levels
 */
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

/**
 * Create logger instance
 */
export function createLogger(service: string): winston.Logger {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({
      fillWith: ['service', 'requestId', 'userId'],
    }),
    winston.format.json()
  );

  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `${timestamp} [${service}] ${level}: ${message} ${metaStr}`;
    })
  );

  const transports: winston.transport[] = [];

  // Console transport
  if (isDevelopment) {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
        level: 'debug',
      })
    );
  } else {
    transports.push(
      new winston.transports.Console({
        format: logFormat,
        level: 'info',
      })
    );
  }

  // File transport for errors
  if (!isDevelopment) {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );

    transports.push(
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );
  }

  return winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: logFormat,
    defaultMeta: { service },
    transports,
    exitOnError: false,
  });
}

/**
 * Default logger instance
 */
export const logger = createLogger('app');

/**
 * Log HTTP requests
 */
export function logHttpRequest(
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  userId?: string
): void {
  const message = `${method} ${url} ${statusCode} ${duration}ms`;

  if (statusCode >= 500) {
    logger.error(message, { method, url, statusCode, duration, userId });
  } else if (statusCode >= 400) {
    logger.warn(message, { method, url, statusCode, duration, userId });
  } else {
    logger.http(message, { method, url, statusCode, duration, userId });
  }
}

/**
 * Log error with context
 */
export function logError(error: Error, context?: Record<string, any>): void {
  logger.error(error.message, {
    ...context,
    stack: error.stack,
    name: error.name,
  });
}

/**
 * Performance timer
 */
export class PerformanceTimer {
  private startTime: number;
  private marks: Map<string, number>;

  constructor() {
    this.startTime = Date.now();
    this.marks = new Map();
  }

  mark(name: string): void {
    this.marks.set(name, Date.now());
  }

  getDuration(markName?: string): number {
    const endTime = markName ? this.marks.get(markName) : Date.now();
    if (!endTime) return 0;
    return endTime - this.startTime;
  }

  log(operation: string, metadata?: Record<string, any>): void {
    const duration = this.getDuration();
    logger.info(`${operation} completed in ${duration}ms`, {
      duration,
      ...metadata,
    });
  }
}
