/**
 * Cryptography Utilities
 * Security and encryption helpers
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
/**
 * Hash a password
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}
/**
 * Verify a password against a hash
 */
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
/**
 * Generate a random token
 */
export function generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}
/**
 * Generate JWT token
 */
export function generateJWT(payload, secret, expiresIn = '1d') {
    const options = { expiresIn: expiresIn };
    return jwt.sign(payload, secret, options);
}
/**
 * Verify JWT token
 */
export function verifyJWT(token, secret) {
    try {
        return jwt.verify(token, secret);
    }
    catch {
        return null;
    }
}
/**
 * Generate OTP (One-Time Password)
 */
export function generateOTP(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}
/**
 * Hash data for comparison (non-password)
 */
export function hashData(data) {
    // Simple hash for non-sensitive data comparison
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
}
/**
 * Generate UUID v4
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
//# sourceMappingURL=crypto.js.map