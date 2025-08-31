/**
 * Payment-related type definitions
 * Includes strict validation for security
 */
export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId?: string;
    invoiceNumber?: string;
    description: string;
    metadata?: PaymentMetadata;
    createdAt: Date;
    updatedAt: Date;
    processedAt?: Date;
    failureReason?: string;
}
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'stripe' | 'apple_pay' | 'google_pay';
export interface PaymentMetadata {
    courseId?: string;
    courseName?: string;
    installmentPlan?: InstallmentPlan;
    discountCode?: string;
    discountAmount?: number;
    taxAmount?: number;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
}
export interface InstallmentPlan {
    id: string;
    type: 'full' | '3_months' | '6_months' | '12_months';
    totalAmount: number;
    installmentAmount: number;
    currentInstallment: number;
    totalInstallments: number;
    nextPaymentDate?: Date;
    schedule: InstallmentSchedule[];
}
export interface InstallmentSchedule {
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    status: PaymentStatus;
    paymentId?: string;
}
export interface PaymentValidation {
    cardNumber?: {
        isValid: boolean;
        errors?: string[];
    };
    cvv?: {
        isValid: boolean;
        errors?: string[];
    };
    expiryDate?: {
        isValid: boolean;
        errors?: string[];
    };
    billingAddress?: {
        isValid: boolean;
        errors?: string[];
    };
}
export interface SecurePaymentData {
    paymentMethodId: string;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    billingDetails: BillingDetails;
}
export interface BillingDetails {
    name: string;
    email: string;
    phone?: string;
    address: BillingAddress;
}
export interface BillingAddress {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}
export interface Invoice {
    id: string;
    invoiceNumber: string;
    paymentId: string;
    userId: string;
    amount: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    dueDate: Date;
    issuedDate: Date;
    paidDate?: Date;
    items: InvoiceItem[];
    billingDetails: BillingDetails;
    taxAmount?: number;
    discountAmount?: number;
    notes?: string;
    pdfUrl?: string;
}
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate?: number;
    taxAmount?: number;
    discountAmount?: number;
}
export interface Refund {
    id: string;
    paymentId: string;
    amount: number;
    reason: RefundReason;
    status: RefundStatus;
    requestedAt: Date;
    processedAt?: Date;
    notes?: string;
    approvedBy?: string;
}
export type RefundReason = 'requested_by_customer' | 'duplicate' | 'fraudulent' | 'course_cancelled' | 'technical_issue' | 'other';
export type RefundStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
export interface PaymentSummary {
    totalSpent: number;
    pendingPayments: number;
    completedPayments: number;
    failedPayments: number;
    upcomingPayments: number;
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
    averageTransactionAmount: number;
}
export interface PaymentSecurityConfig {
    requireCVV: boolean;
    require3DS: boolean;
    allowedCountries?: string[];
    blockedCountries?: string[];
    minAmount?: number;
    maxAmount?: number;
    fraudDetection: boolean;
    ipWhitelist?: string[];
    ipBlacklist?: string[];
}
export interface PaymentValidationSchema {
    amount: {
        min: number;
        max: number;
        currency: string[];
    };
    card: {
        acceptedBrands: string[];
        requireCVV: boolean;
        requireZipCode: boolean;
    };
    billing: {
        requiredFields: string[];
        phoneFormat?: RegExp;
        postalCodeFormat?: RegExp;
    };
}
export interface PCICompliance {
    tokenProvider: 'stripe' | 'paypal' | 'square';
    publicKey: string;
    environment: 'test' | 'production';
    complianceLevel: 'SAQ-A' | 'SAQ-A-EP' | 'SAQ-D';
    lastAuditDate?: Date;
    certificateExpiry?: Date;
}
//# sourceMappingURL=payment.d.ts.map