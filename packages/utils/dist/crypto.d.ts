/**
 * Cryptography Utilities
 * Security and encryption helpers
 */
/**
 * Hash a password
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Verify a password against a hash
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * Generate a random token
 */
export declare function generateToken(length?: number): string;
/**
 * Generate JWT token
 */
export declare function generateJWT(payload: object, secret: string, expiresIn?: string | number): string;
/**
 * Verify JWT token
 */
export declare function verifyJWT<T = any>(token: string, secret: string): T | null;
/**
 * Generate OTP (One-Time Password)
 */
export declare function generateOTP(length?: number): string;
/**
 * Hash data for comparison (non-password)
 */
export declare function hashData(data: string): string;
/**
 * Generate UUID v4
 */
export declare function generateUUID(): string;
//# sourceMappingURL=crypto.d.ts.map