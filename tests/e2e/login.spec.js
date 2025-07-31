import { test, expect } from '@playwright/test';

const loginPagePath = 'file:///mnt/c/Users/Denya/src/pages/login.html';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginPagePath);
  });

  test('should load login page with all elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Login Page');
    
    // Check main heading
    await expect(page.locator('h1')).toHaveText('Welcome Back');
    
    // Check form elements exist
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Forgot your password?' })).toBeVisible();
    
    // Check labels
    await expect(page.locator('label[for="email"]')).toHaveText('Email Address');
    await expect(page.locator('label[for="password"]')).toHaveText('Password');
  });

  test('should show error when submitting empty form', async ({ page }) => {
    // Click submit button without filling form
    await page.click('button[type="submit"]');
    
    // Check error message appears
    await expect(page.locator('#errorMessage')).toBeVisible();
    await expect(page.locator('#errorMessage')).toHaveText('Please fill in all fields');
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('#email', 'invalid-email');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    // Check error message
    await expect(page.locator('#errorMessage')).toBeVisible();
    await expect(page.locator('#errorMessage')).toHaveText('Please enter a valid email address');
  });

  test('should show error for short password', async ({ page }) => {
    // Fill form with short password
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', '123');
    await page.click('button[type="submit"]');
    
    // Check error message
    await expect(page.locator('#errorMessage')).toBeVisible();
    await expect(page.locator('#errorMessage')).toHaveText('Password must be at least 6 characters long');
  });

  test('should show error when email is empty but password is filled', async ({ page }) => {
    // Fill only password
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    // Check error message
    await expect(page.locator('#errorMessage')).toBeVisible();
    await expect(page.locator('#errorMessage')).toHaveText('Please fill in all fields');
  });

  test('should show error when password is empty but email is filled', async ({ page }) => {
    // Fill only email
    await page.fill('#email', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Check error message
    await expect(page.locator('#errorMessage')).toBeVisible();
    await expect(page.locator('#errorMessage')).toHaveText('Please fill in all fields');
  });

  test('should show success message for valid login', async ({ page }) => {
    // Fill form with valid data
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check that button shows loading state
    await expect(page.locator('button[type="submit"]')).toHaveText('Signing In...');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    
    // Wait for success message (after the 1.5s timeout)
    await expect(page.locator('#successMessage')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#successMessage')).toHaveText('Login successful! Redirecting...');
    
    // Check that button returns to normal state
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should handle forgot password click', async ({ page }) => {
    // Set up dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Forgot password functionality would be implemented here');
      await dialog.accept();
    });
    
    // Click forgot password link
    await page.click('a:has-text("Forgot your password?")');
  });

  test('should hide error message when form is resubmitted', async ({ page }) => {
    // First submit with invalid data
    await page.fill('#email', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('#errorMessage')).toBeVisible();
    
    // Then submit with valid data
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    // Error message should be hidden
    await expect(page.locator('#errorMessage')).toBeHidden();
  });

  test('should focus on email field when page loads', async ({ page }) => {
    // Check that email field can be focused
    await page.focus('#email');
    await expect(page.locator('#email')).toBeFocused();
  });

  test('should allow typing in form fields', async ({ page }) => {
    const testEmail = 'user@example.com';
    const testPassword = 'mypassword123';
    
    // Type in email field
    await page.fill('#email', testEmail);
    await expect(page.locator('#email')).toHaveValue(testEmail);
    
    // Type in password field
    await page.fill('#password', testPassword);
    await expect(page.locator('#password')).toHaveValue(testPassword);
  });

  test('should validate multiple invalid email formats', async ({ page }) => {
    const invalidEmails = [
      'plainaddress',
      '@missingdomain.com',
      'missing@.com',
      'missing@domain',
      'spaces @domain.com'
    ];
    
    for (const email of invalidEmails) {
      await page.fill('#email', email);
      await page.fill('#password', 'password123');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('#errorMessage')).toBeVisible();
      await expect(page.locator('#errorMessage')).toHaveText('Please enter a valid email address');
      
      // Clear the form for next iteration
      await page.fill('#email', '');
      await page.fill('#password', '');
    }
  });

  test('should have proper form structure and accessibility', async ({ page }) => {
    // Check form exists
    await expect(page.locator('#loginForm')).toBeVisible();
    
    // Check inputs have proper labels
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    
    // Check inputs have required attribute
    await expect(page.locator('#email')).toHaveAttribute('required', '');
    await expect(page.locator('#password')).toHaveAttribute('required', '');
    
    // Check input types
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('#email')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#password')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should submit form with Enter key', async ({ page }) => {
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    
    // Press Enter in password field
    await page.locator('#password').press('Enter');
    
    // Check that form submits
    await expect(page.locator('button[type="submit"]')).toHaveText('Signing In...');
    await expect(page.locator('#successMessage')).toBeVisible({ timeout: 2000 });
  });

  test('should maintain input values after validation errors', async ({ page }) => {
    const email = 'test@example.com';
    const shortPassword = '123';
    
    await page.fill('#email', email);
    await page.fill('#password', shortPassword);
    await page.click('button[type="submit"]');
    
    // Check error appears
    await expect(page.locator('#errorMessage')).toBeVisible();
    
    // Check values are maintained
    await expect(page.locator('#email')).toHaveValue(email);
    await expect(page.locator('#password')).toHaveValue(shortPassword);
  });
});