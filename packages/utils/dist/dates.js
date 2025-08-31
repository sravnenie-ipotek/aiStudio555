/**
 * Date Utilities
 * Date manipulation and formatting helpers
 */
/**
 * Format date to readable string
 */
export function formatDate(date, locale = 'en-US', options) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    };
    return d.toLocaleDateString(locale, defaultOptions);
}
/**
 * Format date and time
 */
export function formatDateTime(date, locale = 'en-US', options) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    };
    return d.toLocaleString(locale, defaultOptions);
}
/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);
    if (diffSec < 60)
        return 'just now';
    if (diffMin < 60)
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24)
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7)
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffWeek < 4)
        return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    if (diffMonth < 12)
        return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
}
/**
 * Add days to date
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
/**
 * Add hours to date
 */
export function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}
/**
 * Get start of day
 */
export function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
/**
 * Get end of day
 */
export function endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
/**
 * Check if date is today
 */
export function isToday(date) {
    const today = new Date();
    return (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear());
}
/**
 * Check if date is in the past
 */
export function isPast(date) {
    return date < new Date();
}
/**
 * Check if date is in the future
 */
export function isFuture(date) {
    return date > new Date();
}
/**
 * Get days between two dates
 */
export function daysBetween(date1, date2) {
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0)
        return `${mins}m`;
    if (mins === 0)
        return `${hours}h`;
    return `${hours}h ${mins}m`;
}
//# sourceMappingURL=dates.js.map