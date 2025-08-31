import { test as base, expect, Page } from '@playwright/test';

export interface AuthUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface TestContext {
  page: Page;
  authenticatedUser: AuthUser;
}

// Test data for different user types
export const testUsers = {
  student: {
    email: 'student@test.projectdes.com',
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'Student',
    phone: '+1234567890'
  },
  instructor: {
    email: 'instructor@test.projectdes.com', 
    password: 'InstructorPass123!',
    firstName: 'Test',
    lastName: 'Instructor'
  },
  admin: {
    email: 'admin@test.projectdes.com',
    password: 'AdminPass123!',
    firstName: 'Test',
    lastName: 'Admin'
  }
} as const;

// Authentication helper functions
export class AuthHelper {
  constructor(private page: Page) {}

  async login(user: AuthUser) {
    // Navigate to login page
    await this.page.goto('/auth/login');
    
    // Wait for page to load
    await expect(this.page).toHaveTitle(/.*Login.*/);
    
    // Fill login form
    await this.page.getByTestId('email-input').fill(user.email);
    await this.page.getByTestId('password-input').fill(user.password);
    
    // Submit form
    await this.page.getByTestId('login-submit').click();
    
    // Wait for successful login (redirect to dashboard)
    await this.page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Verify we're logged in by checking for dashboard elements
    await expect(this.page.getByTestId('user-avatar')).toBeVisible();
  }

  async register(user: AuthUser) {
    await this.page.goto('/auth/register');
    
    await expect(this.page).toHaveTitle(/.*Register.*/);
    
    // Fill registration form
    await this.page.getByTestId('first-name-input').fill(user.firstName);
    await this.page.getByTestId('last-name-input').fill(user.lastName);
    await this.page.getByTestId('email-input').fill(user.email);
    await this.page.getByTestId('password-input').fill(user.password);
    await this.page.getByTestId('confirm-password-input').fill(user.password);
    
    if (user.phone) {
      await this.page.getByTestId('phone-input').fill(user.phone);
    }
    
    // Submit form
    await this.page.getByTestId('register-submit').click();
    
    // Wait for successful registration
    await this.page.waitForURL('/dashboard', { timeout: 10000 });
  }

  async logout() {
    // Click user menu
    await this.page.getByTestId('user-menu-trigger').click();
    
    // Click logout
    await this.page.getByTestId('logout-button').click();
    
    // Wait for redirect to home or login
    await this.page.waitForURL('/', { timeout: 5000 });
  }

  async forgotPassword(email: string) {
    await this.page.goto('/auth/forgot-password');
    
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('forgot-password-submit').click();
    
    // Wait for success message
    await expect(this.page.getByTestId('success-message')).toBeVisible();
  }

  async resetPassword(token: string, newPassword: string) {
    await this.page.goto(`/auth/reset-password?token=${token}`);
    
    await this.page.getByTestId('password-input').fill(newPassword);
    await this.page.getByTestId('confirm-password-input').fill(newPassword);
    await this.page.getByTestId('reset-password-submit').click();
    
    // Wait for success message
    await expect(this.page.getByTestId('success-message')).toBeVisible();
  }

  async verifyEmail(token: string) {
    await this.page.goto(`/auth/verify-email?token=${token}`);
    
    // Wait for verification success
    await expect(this.page.getByTestId('verification-success')).toBeVisible();
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.getByTestId('user-avatar').waitFor({ timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }
}

// Extended test fixture with authentication
export const test = base.extend<TestContext>({
  authenticatedUser: testUsers.student,
  
  page: async ({ page, authenticatedUser }, use) => {
    const authHelper = new AuthHelper(page);
    
    // Login before each test
    await authHelper.login(authenticatedUser);
    
    await use(page);
    
    // Logout after each test
    if (await authHelper.isLoggedIn()) {
      await authHelper.logout();
    }
  }
});

export { expect };