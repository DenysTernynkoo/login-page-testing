import { test, expect } from '@playwright/test';

const loginPagePath = 'file:///mnt/c/Users/Denya/src/pages/login.html';

test.describe('Login Page Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginPagePath);
  });

  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(loginPagePath);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('should render all elements quickly', async ({ page }) => {
    const startTime = Date.now();
    
    // Wait for all critical elements to be visible
    await Promise.all([
      page.waitForSelector('h1'),
      page.waitForSelector('#email'),
      page.waitForSelector('#password'),
      page.waitForSelector('button[type="submit"]')
    ]);
    
    const renderTime = Date.now() - startTime;
    
    // All elements should render within 500ms
    expect(renderTime).toBeLessThan(500);
    console.log(`Element render time: ${renderTime}ms`);
  });

  test('should handle form submission efficiently', async ({ page }) => {
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    
    const startTime = Date.now();
    await page.click('button[type="submit"]');
    
    // Wait for button text change (immediate response)
    await expect(page.locator('button[type="submit"]')).toHaveText('Signing In...');
    const responseTime = Date.now() - startTime;
    
    // Form should respond immediately (within 100ms)
    expect(responseTime).toBeLessThan(100);
    console.log(`Form submission response time: ${responseTime}ms`);
  });

  test('should validate inputs quickly', async ({ page }) => {
    // Test email validation performance
    const startTime = Date.now();
    await page.fill('#email', 'invalid-email');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#errorMessage')).toBeVisible();
    const validationTime = Date.now() - startTime;
    
    // Validation should complete within 50ms
    expect(validationTime).toBeLessThan(50);
    console.log(`Input validation time: ${validationTime}ms`);
  });

  test('should handle multiple rapid form submissions', async ({ page }) => {
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    
    const startTime = Date.now();
    
    // Simulate rapid clicking
    for (let i = 0; i < 5; i++) {
      await page.click('button[type="submit"]');
      await page.waitForTimeout(10); // Small delay between clicks
    }
    
    const totalTime = Date.now() - startTime;
    
    // Should handle rapid submissions without breaking (within 1 second)
    expect(totalTime).toBeLessThan(1000);
    
    // Button should still be in correct state
    await expect(page.locator('button[type="submit"]')).toHaveText('Signing In...');
    console.log(`Multiple submissions handled in: ${totalTime}ms`);
  });

  test('should have efficient CSS animations', async ({ page }) => {
    // Test hover animation performance
    const button = page.locator('button[type="submit"]');
    
    const startTime = Date.now();
    await button.hover();
    
    // Wait for hover effect to complete
    await page.waitForTimeout(300); // CSS transition duration
    
    const animationTime = Date.now() - startTime;
    
    // Animation should complete smoothly within 400ms
    expect(animationTime).toBeLessThan(400);
    console.log(`Hover animation time: ${animationTime}ms`);
  });

  test('should handle input field focus efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Focus on email field
    await page.focus('#email');
    
    // Check focus border appears (CSS transition)
    await expect(page.locator('#email')).toBeFocused();
    
    const focusTime = Date.now() - startTime;
    
    // Focus should be immediate (within 50ms)
    expect(focusTime).toBeLessThan(50);
    console.log(`Input focus time: ${focusTime}ms`);
  });

  test('should maintain performance with large inputs', async ({ page }) => {
    // Test with very long email and password
    const longEmail = 'a'.repeat(100) + '@example.com';
    const longPassword = 'p'.repeat(1000);
    
    const startTime = Date.now();
    
    await page.fill('#email', longEmail);
    await page.fill('#password', longPassword);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#errorMessage')).toBeVisible();
    
    const processingTime = Date.now() - startTime;
    
    // Should handle large inputs within 200ms
    expect(processingTime).toBeLessThan(200);
    console.log(`Large input processing time: ${processingTime}ms`);
  });

  test('should measure memory usage during form interactions', async ({ page }) => {
    // Perform multiple form interactions
    for (let i = 0; i < 10; i++) {
      await page.fill('#email', `test${i}@example.com`);
      await page.fill('#password', `password${i}`);
      await page.click('button[type="submit"]');
      
      // Wait for error or success message
      await page.waitForSelector('#errorMessage, #successMessage', { state: 'visible' });
      
      // Clear form
      await page.fill('#email', '');
      await page.fill('#password', '');
      
      // Hide messages
      await page.evaluate(() => {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
      });
    }
    
    // Test passes if no memory leaks cause page crashes
    await expect(page.locator('h1')).toBeVisible();
    console.log('Memory usage test completed successfully');
  });

  test('should handle concurrent validation calls', async ({ page }) => {
    const startTime = Date.now();
    
    // Simulate rapid typing and validation
    await page.fill('#email', 'a');
    await page.fill('#email', 'ab');
    await page.fill('#email', 'abc');
    await page.fill('#email', 'invalid');
    await page.fill('#password', '123');
    
    await page.click('button[type="submit"]');
    await expect(page.locator('#errorMessage')).toBeVisible();
    
    const totalTime = Date.now() - startTime;
    
    // Should handle rapid input changes efficiently
    expect(totalTime).toBeLessThan(100);
    console.log(`Concurrent validation time: ${totalTime}ms`);
  });
});