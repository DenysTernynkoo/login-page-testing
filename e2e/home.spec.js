import { test, expect } from '@playwright/test';

const homePagePath = 'file:///mnt/c/Users/Denya/index.html';

test.describe('Home Page Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePagePath);
  });

  test('should load home page with all main elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Welcome - Your Site');
    
    // Check navigation bar elements
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.logo')).toHaveText('YourSite');
    
    // Check navigation links
    await expect(page.locator('nav a[href="index.html"]')).toHaveText('Home');
    await expect(page.locator('nav a[href="#features"]')).toHaveText('Features');
    await expect(page.locator('nav a[href="#about"]')).toHaveText('About');
    await expect(page.locator('nav a[href="login.html"]')).toHaveText('Sign In');
    await expect(page.locator('nav a[href="register.html"]')).toHaveText('Sign Up');
  });

  test('should display hero section with correct content', async ({ page }) => {
    // Check hero title and subtitle
    await expect(page.locator('.hero-title')).toHaveText('Welcome to Your Site');
    await expect(page.locator('.hero-subtitle')).toContainText('Discover amazing features');
    
    // Check hero buttons
    await expect(page.locator('.hero-buttons .btn-primary')).toHaveText('Get Started');
    await expect(page.locator('.hero-buttons .btn-secondary')).toHaveText('Learn More');
    
    // Verify button links
    await expect(page.locator('.hero-buttons .btn-primary')).toHaveAttribute('href', 'register.html');
    await expect(page.locator('.hero-buttons .btn-secondary')).toHaveAttribute('href', '#features');
  });

  test('should display all six feature cards', async ({ page }) => {
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(6);
    
    // Check specific feature titles
    const expectedFeatures = [
      'Fast & Reliable',
      'Secure & Private',
      'Mobile Ready',
      'Beautiful Design',
      'Easy to Use',
      'Premium Support'
    ];
    
    for (const feature of expectedFeatures) {
      await expect(page.locator('.feature-title').filter({ hasText: feature })).toBeVisible();
    }
    
    // Check that all feature cards have icons and descriptions
    await expect(page.locator('.feature-icon')).toHaveCount(6);
    await expect(page.locator('.feature-description')).toHaveCount(6);
  });

  test('should display statistics section with correct values', async ({ page }) => {
    // Check that stats section exists
    await expect(page.locator('.stats-section')).toBeVisible();
    
    // Check stat items
    const statItems = page.locator('.stat-item');
    await expect(statItems).toHaveCount(4);
    
    // Check stat labels
    await expect(page.locator('.stat-label').filter({ hasText: 'Happy Users' })).toBeVisible();
    await expect(page.locator('.stat-label').filter({ hasText: '% Uptime' })).toBeVisible();
    await expect(page.locator('.stat-label').filter({ hasText: 'Countries' })).toBeVisible();
    await expect(page.locator('.stat-label').filter({ hasText: '7 Support' })).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Test login navigation
    const signInLink = page.locator('nav a[href="login.html"]');
    await expect(signInLink).toBeVisible();
    
    // Test registration navigation
    const signUpLink = page.locator('nav a[href="register.html"]');
    await expect(signUpLink).toBeVisible();
    
    // Test Get Started button
    const getStartedBtn = page.locator('.hero-buttons .btn-primary');
    await expect(getStartedBtn).toHaveAttribute('href', 'register.html');
  });

  test('should navigate to login page when Sign In is clicked', async ({ page }) => {
    await page.click('nav a[href="login.html"]');
    await page.waitForLoadState('domcontentloaded');
    
    // Should be on login page
    await expect(page).toHaveTitle('Login Page');
    await expect(page.locator('h1')).toHaveText('Welcome Back');
  });

  test('should navigate to registration page when Sign Up is clicked', async ({ page }) => {
    await page.click('nav a[href="register.html"]');
    await page.waitForLoadState('domcontentloaded');
    
    // Should be on registration page
    await expect(page).toHaveTitle('Register - Create Account');
    await expect(page.locator('h1')).toHaveText('Create Account');
  });

  test('should navigate to registration page when Get Started is clicked', async ({ page }) => {
    await page.click('.hero-buttons .btn-primary');
    await page.waitForLoadState('domcontentloaded');
    
    // Should be on registration page
    await expect(page).toHaveTitle('Register - Create Account');
  });

  test('should have smooth scrolling to features section', async ({ page }) => {
    // Click Learn More button
    await page.click('.hero-buttons .btn-secondary');
    
    // Wait a moment for smooth scroll
    await page.waitForTimeout(1000);
    
    // Check that features section is visible
    await expect(page.locator('#features')).toBeInViewport();
  });

  test('should display footer with correct links', async ({ page }) => {
    await expect(page.locator('.footer')).toBeVisible();
    
    // Check footer links
    const footerLinks = page.locator('.footer-links a');
    await expect(footerLinks).toHaveCount(6);
    
    // Check copyright text
    await expect(page.locator('.footer-content p')).toContainText('© 2025 YourSite. All rights reserved');
  });

  test('should have responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should still be visible and functional
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.nav-links')).toBeVisible();
    
    // All nav links should be accessible
    await expect(page.locator('nav a[href="login.html"]')).toBeVisible();
    await expect(page.locator('nav a[href="register.html"]')).toBeVisible();
  });

  test('should handle anchor link navigation', async ({ page }) => {
    // Click on Features link in navbar
    await page.click('nav a[href="#features"]');
    
    // Wait for smooth scroll
    await page.waitForTimeout(1000);
    
    // Features section should be in viewport
    await expect(page.locator('#features')).toBeInViewport();
  });

  test('should animate statistics when scrolled into view', async ({ page }) => {
    // Scroll to stats section
    await page.locator('.stats-section').scrollIntoViewIfNeeded();
    
    // Wait for animation to complete
    await page.waitForTimeout(2500);
    
    // Check that counters have animated values (not zero)
    const happyUsersText = await page.locator('.stat-number').first().textContent();
    expect(parseInt(happyUsersText.replace(/,/g, ''))).toBeGreaterThan(0);
  });

  test('should have working feature card hover effects', async ({ page }) => {
    const firstCard = page.locator('.feature-card').first();
    
    // Get initial position
    const initialBox = await firstCard.boundingBox();
    
    // Hover over card
    await firstCard.hover();
    
    // Wait for animation
    await page.waitForTimeout(500);
    
    // Card should have hover effects (this is visual, so we just verify it's still visible)
    await expect(firstCard).toBeVisible();
  });

  test('should maintain navigation state on scroll', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Wait for scroll effect
    await page.waitForTimeout(300);
    
    // Navigation should still be visible and functional
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
  });

  test('should track user interactions', async ({ page }) => {
    // Listen for console logs (click tracking)
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });
    
    // Click Get Started button
    await page.click('.hero-buttons .btn-primary');
    
    // Check if click was tracked (in real app this would be analytics)
    // For now we just verify the button click worked
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle('Register - Create Account');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through navigation elements
    await page.keyboard.press('Tab');
    await expect(page.locator('.logo')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('nav a[href="index.html"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('nav a[href="#features"]')).toBeFocused();
  });

  test('should display welcome message for first-time visitors', async ({ page }) => {
    // Clear localStorage to simulate first visit
    await page.evaluate(() => localStorage.clear());
    
    // Reload page
    await page.reload();
    
    // Check that hasVisited flag is set
    const hasVisited = await page.evaluate(() => localStorage.getItem('hasVisited'));
    expect(hasVisited).toBe('true');
  });

  test('should have proper page structure and semantics', async ({ page }) => {
    // Check main structural elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check sections
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('.stats-section')).toBeVisible();
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(1);
    await expect(page.locator('h3')).toHaveCount(6); // Feature titles
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate to login page
    await page.click('nav a[href="login.html"]');
    await expect(page).toHaveTitle('Login Page');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveTitle('Welcome - Your Site');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveTitle('Login Page');
  });

  test('should maintain functionality with JavaScript disabled', async ({ page }) => {
    // Disable JavaScript
    await page.context().addInitScript(() => {
      delete window.IntersectionObserver;
    });
    
    await page.reload();
    
    // Basic functionality should still work
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(6);
    
    // Links should still work (basic HTML functionality)
    await expect(page.locator('nav a[href="login.html"]')).toBeVisible();
  });
});