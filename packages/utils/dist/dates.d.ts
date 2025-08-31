/**
 * Date Utilities
 * Date manipulation and formatting helpers
 */
/**
 * Format date to readable string
 */
export declare function formatDate(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Format date and time
 */
export declare function formatDateTime(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Get relative time (e.g., "2 hours ago")
 */
export declare function getRelativeTime(date: Date | string): string;
/**
 * Add days to date
 */
export declare function addDays(date: Date, days: number): Date;
/**
 * Add hours to date
 */
export declare function addHours(date: Date, hours: number): Date;
/**
 * Get start of day
 */
export declare function startOfDay(date: Date): Date;
/**
 * Get end of day
 */
export declare function endOfDay(date: Date): Date;
/**
 * Check if date is today
 */
export declare function isToday(date: Date): boolean;
/**
 * Check if date is in the past
 */
export declare function isPast(date: Date): boolean;
/**
 * Check if date is in the future
 */
export declare function isFuture(date: Date): boolean;
/**
 * Get days between two dates
 */
export declare function daysBetween(date1: Date, date2: Date): number;
/**
 * Format duration in minutes to readable string
 */
export declare function formatDuration(minutes: number): string;
//# sourceMappingURL=dates.d.ts.map