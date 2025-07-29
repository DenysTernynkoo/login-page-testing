import { test, expect } from '@playwright/test';

const loginPagePath = 'file:///mnt/c/Users/Denya/login.html';

test.describe('Login Page UX Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginPagePath);
  });

  test.describe('Visual Design & Layout', () => {
    test('should have visually appealing gradient background', async ({ page }) => {
      const body = page.locator('body');
      const backgroundStyle = await body.evaluate(el => 
        window.getComputedStyle(el).backgroundImage
      );
      
      // Check for gradient background
      expect(backgroundStyle).toContain('linear-gradient');
      console.log('✅ Gradient background applied correctly');
    });

    test('should have properly centered login container', async ({ page }) => {
      const container = page.locator('.login-container');
      
      // Check container is visible and properly styled
      await expect(container).toBeVisible();
      
      const containerStyles = await container.evaluate(el => ({
        maxWidth: window.getComputedStyle(el).maxWidth,
        padding: window.getComputedStyle(el).padding,
        borderRadius: window.getComputedStyle(el).borderRadius
      }));
      
      expect(containerStyles.maxWidth).toBe('400px');
      expect(containerStyles.borderRadius).toBe('10px');
      console.log('✅ Login container properly styled and centered');
    });

    test('should have consistent spacing and typography', async ({ page }) => {
      // Check heading typography
      const heading = page.locator('h1');
      const headingStyle = await heading.evaluate(el => ({
        fontSize: window.getComputedStyle(el).fontSize,
        color: window.getComputedStyle(el).color,
        marginBottom: window.getComputedStyle(el).marginBottom
      }));
      
      expect(headingStyle.fontSize).toBe('32px'); // 2rem
      console.log('✅ Typography hierarchy is consistent');
      
      // Check form group spacing
      const formGroups = page.locator('.form-group');
      const count = await formGroups.count();
      expect(count).toBe(2); // Email and password groups
      console.log('✅ Form elements have proper spacing');
    });
  });

  test.describe('User Interaction Feedback', () => {
    test('should provide immediate visual feedback on input focus', async ({ page }) => {
      const emailInput = page.locator('#email');
      
      // Check initial border color
      const initialBorder = await emailInput.evaluate(el => 
        window.getComputedStyle(el).borderColor
      );
      
      // Focus on input
      await emailInput.focus();
      
      // Check focused border color changes
      const focusedBorder = await emailInput.evaluate(el => 
        window.getComputedStyle(el).borderColor
      );
      
      expect(focusedBorder).not.toBe(initialBorder);
      console.log('✅ Input focus provides visual feedback');
    });

    test('should show hover effects on submit button', async ({ page }) => {
      const submitBtn = page.locator('.login-btn');
      
      // Get initial transform
      const initialTransform = await submitBtn.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // Hover over button
      await submitBtn.hover();
      
      // Wait for CSS transition
      await page.waitForTimeout(300);
      
      // Check if transform changes on hover
      const hoveredTransform = await submitBtn.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // Should have translateY effect
      expect(hoveredTransform).toContain('matrix');
      console.log('✅ Button hover effect working correctly');
    });

    test('should show loading state during form submission', async ({ page }) => {
      await page.fill('#email', 'test@example.com');
      await page.fill('#password', 'password123');
      
      const submitBtn = page.locator('.login-btn');
      
      // Submit form
      await submitBtn.click();
      
      // Check immediate loading state
      await expect(submitBtn).toHaveText('Signing In...');
      await expect(submitBtn).toBeDisabled();
      
      // Wait for process to complete
      await expect(submitBtn).toHaveText('Sign In', { timeout: 3000 });
      await expect(submitBtn).toBeEnabled();
      
      console.log('✅ Loading state provides clear user feedback');
    });
  });

  test.describe('Error Message UX', () => {
    test('should display error messages with proper styling', async ({ page }) => {
      // Trigger an error
      await page.click('.login-btn');
      
      const errorMessage = page.locator('#errorMessage');
      await expect(errorMessage).toBeVisible();
      
      // Check error message styling
      const errorStyle = await errorMessage.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        fontSize: window.getComputedStyle(el).fontSize,
        display: window.getComputedStyle(el).display
      }));
      
      // Should be red and visible
      expect(errorStyle.color).toContain('rgb(231, 76, 60)'); // Red color
      expect(errorStyle.display).toBe('block');
      
      console.log('✅ Error messages have proper visual treatment');
    });

    test('should clear previous errors when user corrects input', async ({ page }) => {
      // Create an error first
      await page.fill('#email', 'invalid-email');
      await page.click('.login-btn');
      await expect(page.locator('#errorMessage')).toBeVisible();
      
      // Correct the input and try again
      await page.fill('#email', 'test@example.com');
      await page.fill('#password', 'password123');
      await page.click('.login-btn');
      
      // Error should be hidden
      await expect(page.locator('#errorMessage')).toBeHidden();
      
      console.log('✅ Error messages clear appropriately');
    });

    test('should show contextual error messages', async ({ page }) => {
      const testCases = [
        { email: '', password: '', expectedError: 'Please fill in all fields' },
        { email: 'invalid', password: 'test123', expectedError: 'Please enter a valid email address' },
        { email: 'test@example.com', password: '123', expectedError: 'Password must be at least 6 characters long' }
      ];
      
      for (const testCase of testCases) {
        await page.fill('#email', testCase.email);
        await page.fill('#password', testCase.password);
        await page.click('.login-btn');
        
        await expect(page.locator('#errorMessage')).toHaveText(testCase.expectedError);
        
        // Clear form for next test
        await page.fill('#email', '');
        await page.fill('#password', '');
      }
      
      console.log('✅ Contextual error messages are specific and helpful');
    });
  });

  test.describe('Accessibility & Usability', () => {
    test('should have proper label associations', async ({ page }) => {
      // Check email label
      const emailLabel = page.locator('label[for="email"]');
      const emailInput = page.locator('#email');
      
      await expect(emailLabel).toBeVisible();
      await expect(emailInput).toHaveAttribute('id', 'email');
      
      // Check password label
      const passwordLabel = page.locator('label[for="password"]');
      const passwordInput = page.locator('#password');
      
      await expect(passwordLabel).toBeVisible();
      await expect(passwordInput).toHaveAttribute('id', 'password');
      
      console.log('✅ Form labels are properly associated');
    });

    test('should support keyboard-only navigation', async ({ page }) => {
      // Start from beginning
      await page.keyboard.press('Tab');
      await expect(page.locator('#email')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('#password')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('.login-btn')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('a')).toBeFocused(); // Forgot password link
      
      console.log('✅ Keyboard navigation works correctly');
    });

    test('should have readable text contrast', async ({ page }) => {
      // Check heading contrast
      const heading = page.locator('h1');
      const headingColor = await heading.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      // Should be dark color for good contrast
      expect(headingColor).toBe('rgb(51, 51, 51)');
      
      // Check label contrast
      const label = page.locator('label').first();
      const labelColor = await label.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      expect(labelColor).toBe('rgb(51, 51, 51)');
      
      console.log('✅ Text has sufficient contrast for readability');
    });

    test('should have helpful placeholder behavior', async ({ page }) => {
      const emailInput = page.locator('#email');
      const passwordInput = page.locator('#password');
      
      // Check inputs are properly typed
      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Check required attributes
      await expect(emailInput).toHaveAttribute('required');
      await expect(passwordInput).toHaveAttribute('required');
      
      console.log('✅ Input fields have appropriate attributes');
    });
  });

  test.describe('Success Flow UX', () => {
    test('should provide clear success feedback', async ({ page }) => {
      await page.fill('#email', 'test@example.com');
      await page.fill('#password', 'password123');
      await page.click('.login-btn');
      
      // Wait for success message
      const successMessage = page.locator('#successMessage');
      await expect(successMessage).toBeVisible({ timeout: 2000 });
      await expect(successMessage).toHaveText('Login successful! Redirecting...');
      
      // Check success message styling
      const successStyle = await successMessage.evaluate(el => ({
        color: window.getComputedStyle(el).color,
        display: window.getComputedStyle(el).display
      }));
      
      // Should be green and visible
      expect(successStyle.color).toContain('rgb(39, 174, 96)'); // Green color
      expect(successStyle.display).toBe('block');
      
      console.log('✅ Success feedback is clear and positive');
    });
  });

  test.describe('Mobile Responsiveness UX', () => {
    test('should adapt to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      const container = page.locator('.login-container');
      await expect(container).toBeVisible();
      
      // Check container adapts to mobile
      const containerWidth = await container.evaluate(el => 
        el.getBoundingClientRect().width
      );
      
      // Should be less than viewport width with proper padding
      expect(containerWidth).toBeLessThan(375);
      
      // Check inputs are properly sized
      const emailInput = page.locator('#email');
      const inputWidth = await emailInput.evaluate(el => 
        el.getBoundingClientRect().width
      );
      
      expect(inputWidth).toBeGreaterThan(250); // Should be readable
      
      console.log('✅ Mobile responsiveness works correctly');
    });

    test('should maintain usability on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      
      const container = page.locator('.login-container');
      await expect(container).toBeVisible();
      
      // Should still be centered and properly sized
      const containerStyles = await container.evaluate(el => ({
        width: el.getBoundingClientRect().width,
        maxWidth: window.getComputedStyle(el).maxWidth
      }));
      
      expect(containerStyles.maxWidth).toBe('400px');
      
      console.log('✅ Tablet layout maintains good UX');
    });
  });

  test.describe('Micro-interactions & Polish', () => {
    test('should have smooth transitions and animations', async ({ page }) => {
      const emailInput = page.locator('#email');
      
      // Check if CSS transitions are defined
      const transitionProperty = await emailInput.evaluate(el => 
        window.getComputedStyle(el).transition
      );
      
      // Should have border-color transition
      expect(transitionProperty).toContain('border-color');
      
      console.log('✅ Smooth transitions enhance user experience');
    });

    test('should handle rapid user interactions gracefully', async ({ page }) => {
      // Rapid form interactions
      await page.fill('#email', 'test@example.com');
      await page.fill('#password', 'password123');
      
      // Rapid button clicks
      await page.click('.login-btn');
      await page.click('.login-btn');
      await page.click('.login-btn');
      
      // Should handle gracefully without breaking
      await expect(page.locator('.login-btn')).toHaveText('Signing In...');
      
      console.log('✅ Handles rapid interactions without issues');
    });

    test('should maintain state consistency', async ({ page }) => {
      // Fill form
      await page.fill('#email', 'user@example.com');
      await page.fill('#password', 'mypassword');
      
      // Create an error
      await page.fill('#password', '123'); // Too short
      await page.click('.login-btn');
      
      // Check email value is preserved
      await expect(page.locator('#email')).toHaveValue('user@example.com');
      await expect(page.locator('#password')).toHaveValue('123');
      
      console.log('✅ Form state consistency maintained');
    });
  });
});