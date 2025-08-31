/**
 * Logging Utilities
 * Structured logging with Winston
 */
import winston from 'winston';
/**
 * Log levels
 */
export declare const LogLevel: {
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly HTTP: "http";
    readonly DEBUG: "debug";
};
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
/**
 * Create logger instance
 */
export declare function createLogger(service: string): winston.Logger;
/**
 * Default logger instance
 */
export declare const logger: winston.Logger;
/**
 * Log HTTP requests
 */
export declare function logHttpRequest(method: string, url: string, statusCode: number, duration: number, userId?: string): void;
/**
 * Log error with context
 */
export declare function logError(error: Error, context?: Record<string, any>): void;
/**
 * Performance timer
 */
export declare class PerformanceTimer {
    private startTime;
    private marks;
    constructor();
    mark(name: string): void;
    getDuration(markName?: string): number;
    log(operation: string, metadata?: Record<string, any>): void;
}
//# sourceMappingURL=logger.d.ts.map