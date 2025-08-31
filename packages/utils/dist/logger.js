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
};
/**
 * Create logger instance
 */
export function createLogger(service) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.metadata({
        fillWith: ['service', 'requestId', 'userId'],
    }), winston.format.json());
    const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.simple(), winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${service}] ${level}: ${message} ${metaStr}`;
    }));
    const transports = [];
    // Console transport
    if (isDevelopment) {
        transports.push(new winston.transports.Console({
            format: consoleFormat,
            level: 'debug',
        }));
    }
    else {
        transports.push(new winston.transports.Console({
            format: logFormat,
            level: 'info',
        }));
    }
    // File transport for errors
    if (!isDevelopment) {
        transports.push(new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: logFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }));
        transports.push(new winston.transports.File({
            filename: 'logs/combined.log',
            format: logFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }));
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
export function logHttpRequest(method, url, statusCode, duration, userId) {
    const message = `${method} ${url} ${statusCode} ${duration}ms`;
    if (statusCode >= 500) {
        logger.error(message, { method, url, statusCode, duration, userId });
    }
    else if (statusCode >= 400) {
        logger.warn(message, { method, url, statusCode, duration, userId });
    }
    else {
        logger.http(message, { method, url, statusCode, duration, userId });
    }
}
/**
 * Log error with context
 */
export function logError(error, context) {
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
    startTime;
    marks;
    constructor() {
        this.startTime = Date.now();
        this.marks = new Map();
    }
    mark(name) {
        this.marks.set(name, Date.now());
    }
    getDuration(markName) {
        const endTime = markName ? this.marks.get(markName) : Date.now();
        if (!endTime)
            return 0;
        return endTime - this.startTime;
    }
    log(operation, metadata) {
        const duration = this.getDuration();
        logger.info(`${operation} completed in ${duration}ms`, {
            duration,
            ...metadata,
        });
    }
}
//# sourceMappingURL=logger.js.map