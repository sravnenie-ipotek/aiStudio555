import { test, expect } from '../../fixtures/auth';
import { TestHelpers } from '../../utils/test-helpers';
import { testUsers } from '../../fixtures/auth';

test.describe('Dashboard - Settings', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    
    // Mock user profile data
    await testHelpers.mockApiResponse('/users/profile', {
      id: '1',
      email: testUsers.student.email,
      firstName: testUsers.student.firstName,
      lastName: testUsers.student.lastName,
      phone: testUsers.student.phone,
      avatar: null,
      bio: 'Aspiring AI transformation manager',
      timezone: 'UTC',
      language: 'en',
      notifications: {
        email: {
          courseUpdates: true,
          marketing: false,
          lessons: true,
          certificates: true
        },
        push: {
          lessons: true,
          announcements: false
        }
      },
      privacy: {
        profilePublic: false,
        showProgress: true,
        allowMessages: true
      }
    });
  });

  test('should display settings page correctly @smoke @critical', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Check page structure
    await expect(page).toHaveTitle(/.*Settings.*/);
    await expect(page.getByTestId('settings-page-title')).toContainText('Account Settings');
    
    // Check settings tabs
    await expect(page.getByTestId('settings-tab-profile')).toBeVisible();
    await expect(page.getByTestId('settings-tab-security')).toBeVisible();
    await expect(page.getByTestId('settings-tab-notifications')).toBeVisible();
    await expect(page.getByTestId('settings-tab-privacy')).toBeVisible();
    
    // Profile tab should be active by default
    await expect(page.getByTestId('settings-tab-profile')).toHaveClass(/active|current/);
    
    await testHelpers.takeScreenshot('settings-page-main');
  });

  test('should update profile information @critical', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Mock successful profile update
    await testHelpers.mockApiResponse('/users/profile', {
      message: 'Profile updated successfully'
    }, 200);
    
    // Update profile fields
    await testHelpers.fillField('first-name-input', 'Updated');
    await testHelpers.fillField('last-name-input', 'Name');
    await testHelpers.fillField('phone-input', '+1987654321');
    await testHelpers.fillField('bio-textarea', 'Updated bio description');
    
    // Select timezone
    await page.getByTestId('timezone-select').selectOption('America/New_York');
    
    // Select language
    await page.getByTestId('language-select').selectOption('es');
    
    // Submit form
    await page.getByTestId('save-profile-btn').click();
    
    // Check success message
    await testHelpers.expectSuccess('Profile updated successfully');
  });

  test('should validate profile form fields', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Clear required fields
    await page.getByTestId('first-name-input').clear();
    await page.getByTestId('last-name-input').clear();
    await page.getByTestId('first-name-input').blur();
    
    // Check validation errors
    await expect(page.getByTestId('first-name-input-error')).toContainText('First name is required');
    await expect(page.getByTestId('last-name-input-error')).toContainText('Last name is required');
    
    // Test invalid phone number
    await testHelpers.fillField('phone-input', '123', false);
    await page.getByTestId('phone-input').blur();
    await expect(page.getByTestId('phone-input-error')).toContainText('Please enter a valid phone number');
  });

  test('should upload and update profile avatar', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Mock file upload
    const fileChooser = page.waitForEvent('filechooser');
    await page.getByTestId('avatar-upload-btn').click();
    const fileChooserEvent = await fileChooser;
    
    // Mock successful avatar upload
    await testHelpers.mockApiResponse('/users/avatar', {
      avatar: '/uploads/avatars/user-1-avatar.jpg',
      message: 'Avatar updated successfully'
    });
    
    await fileChooserEvent.setFiles({
      name: 'avatar.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image data')
    });
    
    // Check success message
    await testHelpers.expectSuccess('Avatar updated successfully');
    
    // Verify avatar preview
    await expect(page.getByTestId('avatar-preview')).toHaveAttribute('src', /avatar/);
  });

  test('should change password successfully', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Navigate to security tab
    await page.getByTestId('settings-tab-security').click();
    
    // Mock successful password change
    await testHelpers.mockApiResponse('/users/change-password', {
      message: 'Password changed successfully'
    });
    
    // Fill password change form
    await testHelpers.fillField('current-password-input', 'CurrentPass123!');
    await testHelpers.fillField('new-password-input', 'NewPass123!');
    await testHelpers.fillField('confirm-new-password-input', 'NewPass123!');
    
    // Submit form
    await page.getByTestId('change-password-btn').click();
    
    // Check success message
    await testHelpers.expectSuccess('Password changed successfully');
    
    // Form should reset
    await expect(page.getByTestId('current-password-input')).toHaveValue('');
    await expect(page.getByTestId('new-password-input')).toHaveValue('');
    await expect(page.getByTestId('confirm-new-password-input')).toHaveValue('');
  });

  test('should validate password change requirements', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.getByTestId('settings-tab-security').click();
    
    // Test weak new password
    await testHelpers.fillField('current-password-input', 'CurrentPass123!');
    await testHelpers.fillField('new-password-input', 'weak', false);
    await page.getByTestId('new-password-input').blur();
    
    await expect(page.getByTestId('new-password-input-error')).toContainText('Password must be at least 8 characters');
    
    // Test password confirmation mismatch
    await testHelpers.fillField('new-password-input', 'StrongPass123!');
    await testHelpers.fillField('confirm-new-password-input', 'DifferentPass123!', false);
    await page.getByTestId('confirm-new-password-input').blur();
    
    await expect(page.getByTestId('confirm-new-password-input-error')).toContainText('Passwords do not match');
  });

  test('should handle incorrect current password', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.getByTestId('settings-tab-security').click();
    
    // Mock incorrect current password error
    await testHelpers.mockApiResponse('/users/change-password', {
      message: 'Current password is incorrect'
    }, 400);
    
    // Fill form with wrong current password
    await testHelpers.fillField('current-password-input', 'WrongPassword');
    await testHelpers.fillField('new-password-input', 'NewPass123!');
    await testHelpers.fillField('confirm-new-password-input', 'NewPass123!');
    
    await page.getByTestId('change-password-btn').click();
    
    // Check error message
    await testHelpers.expectError('Current password is incorrect');
  });

  test('should update notification preferences @critical', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Navigate to notifications tab
    await page.getByTestId('settings-tab-notifications').click();
    
    // Mock successful notification update
    await testHelpers.mockApiResponse('/users/notifications', {
      message: 'Notification preferences updated'
    });
    
    // Toggle notification settings
    await page.getByTestId('notification-course-updates').uncheck();
    await page.getByTestId('notification-marketing').check();
    await page.getByTestId('notification-push-lessons').uncheck();
    await page.getByTestId('notification-push-announcements').check();
    
    // Save changes
    await page.getByTestId('save-notifications-btn').click();
    
    // Check success message
    await testHelpers.expectSuccess('Notification preferences updated');
  });

  test('should display current notification preferences', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.getByTestId('settings-tab-notifications').click();
    
    // Check current preferences match mock data
    await expect(page.getByTestId('notification-course-updates')).toBeChecked();
    await expect(page.getByTestId('notification-marketing')).not.toBeChecked();
    await expect(page.getByTestId('notification-lessons')).toBeChecked();
    await expect(page.getByTestId('notification-certificates')).toBeChecked();
    await expect(page.getByTestId('notification-push-lessons')).toBeChecked();
    await expect(page.getByTestId('notification-push-announcements')).not.toBeChecked();
  });

  test('should update privacy settings', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Navigate to privacy tab
    await page.getByTestId('settings-tab-privacy').click();
    
    // Mock successful privacy update
    await testHelpers.mockApiResponse('/users/privacy', {
      message: 'Privacy settings updated'
    });
    
    // Toggle privacy settings
    await page.getByTestId('privacy-profile-public').check();
    await page.getByTestId('privacy-show-progress').uncheck();
    await page.getByTestId('privacy-allow-messages').uncheck();
    
    // Save changes
    await page.getByTestId('save-privacy-btn').click();
    
    // Check success message
    await testHelpers.expectSuccess('Privacy settings updated');
  });

  test('should display current privacy preferences', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.getByTestId('settings-tab-privacy').click();
    
    // Check current preferences match mock data
    await expect(page.getByTestId('privacy-profile-public')).not.toBeChecked();
    await expect(page.getByTestId('privacy-show-progress')).toBeChecked();
    await expect(page.getByTestId('privacy-allow-messages')).toBeChecked();
  });

  test('should enable two-factor authentication', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.getByTestId('settings-tab-security').click();
    
    // Mock 2FA setup
    await testHelpers.mockApiResponse('/users/2fa/setup', {
      qrCode: 'data:image/png;base64,fake-qr-code',
      backupCodes: ['12345678', '87654321', '11111111'],
      message: '2FA setup initiated'
    });
    
    // Click enable 2FA
    await page.getByTestId('enable-2fa-btn').click();
    
    // Should show 2FA setup modal
    await expect(page.getByTestId('2fa-setup-modal')).toBeVisible();
    await expect(page.getByTestId('2fa-qr-code')).toBeVisible();
    await expect(page.getByTestId('2fa-backup-codes')).toBeVisible();
    
    // Enter verification code
    await testHelpers.fillField('2fa-verification-code', '123456');
    
    // Mock successful 2FA verification
    await testHelpers.mockApiResponse('/users/2fa/verify', {
      message: '2FA enabled successfully'
    });
    
    await page.getByTestId('verify-2fa-btn').click();
    
    // Check success and modal closure
    await testHelpers.expectSuccess('2FA enabled successfully');
    await expect(page.getByTestId('2fa-setup-modal')).toBeHidden();
  });

  test('should show loading states during form submissions', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Delay profile update response
    await page.route('**/api/users/profile', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Profile updated' })
      });
    });
    
    // Update a field and submit
    await testHelpers.fillField('first-name-input', 'Loading Test');
    await page.getByTestId('save-profile-btn').click();
    
    // Check loading state
    await expect(page.getByTestId('save-profile-btn')).toBeDisabled();
    await expect(page.getByTestId('save-profile-btn')).toContainText('Saving...');
    await expect(page.getByTestId('profile-loading-spinner')).toBeVisible();
    
    // Wait for completion
    await testHelpers.waitForLoading();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Mock profile update error
    await testHelpers.mockApiResponse('/users/profile', {
      message: 'Failed to update profile'
    }, 500);
    
    // Try to update profile
    await testHelpers.fillField('first-name-input', 'Error Test');
    await page.getByTestId('save-profile-btn').click();
    
    // Check error message
    await testHelpers.expectError('Failed to update profile');
    
    // Form should remain enabled
    await expect(page.getByTestId('save-profile-btn')).toBeEnabled();
  });

  test('should be responsive on mobile @mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard/settings');
    
    // Check mobile layout
    await expect(page.getByTestId('settings-mobile-view')).toBeVisible();
    
    // Settings tabs should be in mobile format (accordion or dropdown)
    await expect(page.getByTestId('mobile-settings-tabs')).toBeVisible();
    
    // Click profile section
    await page.getByTestId('mobile-tab-profile').click();
    await expect(page.getByTestId('profile-settings-section')).toBeVisible();
    
    await testHelpers.takeScreenshot('settings-mobile');
  });

  test('should support keyboard navigation @accessibility', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Test tab navigation
    await testHelpers.testKeyboardNavigation([
      'settings-tab-profile',
      'settings-tab-security', 
      'settings-tab-notifications',
      'settings-tab-privacy'
    ]);
    
    // Test form field navigation
    await page.getByTestId('settings-tab-profile').click();
    await testHelpers.testKeyboardNavigation([
      'first-name-input',
      'last-name-input',
      'phone-input',
      'bio-textarea',
      'timezone-select',
      'language-select',
      'save-profile-btn'
    ]);
  });

  test('should meet accessibility standards @accessibility', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Check accessibility compliance
    await testHelpers.checkAccessibility();
    
    // Check ARIA labels on form elements
    await expect(page.getByTestId('first-name-input')).toHaveAttribute('aria-label');
    await expect(page.getByTestId('settings-tabs')).toHaveAttribute('role', 'tablist');
    
    // Check proper heading hierarchy
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toHaveCount.greaterThan(0);
  });

  test('should preserve unsaved changes warning', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Make changes to form
    await testHelpers.fillField('first-name-input', 'Changed Name');
    
    // Try to navigate away
    await page.getByTestId('nav-dashboard').click();
    
    // Should show unsaved changes warning
    await expect(page.getByTestId('unsaved-changes-modal')).toBeVisible();
    await expect(page.getByTestId('unsaved-changes-modal')).toContainText('You have unsaved changes');
    
    // Choose to stay
    await page.getByTestId('stay-on-page-btn').click();
    await expect(page).toHaveURL('/dashboard/settings');
    
    // Changes should be preserved
    await expect(page.getByTestId('first-name-input')).toHaveValue('Changed Name');
  });

  test('should reset form to original values', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Make changes
    await testHelpers.fillField('first-name-input', 'Changed');
    await testHelpers.fillField('last-name-input', 'Changed');
    
    // Click reset button
    await page.getByTestId('reset-form-btn').click();
    
    // Values should revert to original
    await expect(page.getByTestId('first-name-input')).toHaveValue(testUsers.student.firstName);
    await expect(page.getByTestId('last-name-input')).toHaveValue(testUsers.student.lastName);
  });
});