/**
 * Formatting Utilities
 * Text and data formatting helpers
 */
/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        // US format: (123) 456-7890
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
        // US format with country code: +1 (123) 456-7890
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    // International format: keep as is or basic formatting
    return phone;
}
/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}
/**
 * Format percentage
 */
export function formatPercentage(value, decimals = 0) {
    return `${(value * 100).toFixed(decimals)}%`;
}
/**
 * Format file size
 */
export function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}
/**
 * Slugify text for URLs
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
/**
 * Capitalize first letter
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
/**
 * Title case
 */
export function titleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}
/**
 * Truncate text
 */
export function truncate(text, length, suffix = '...') {
    if (text.length <= length)
        return text;
    return text.slice(0, length - suffix.length) + suffix;
}
/**
 * Strip HTML tags
 */
export function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
}
/**
 * Format number with commas
 */
export function formatNumber(num) {
    return num.toLocaleString('en-US');
}
//# sourceMappingURL=formatting.js.map