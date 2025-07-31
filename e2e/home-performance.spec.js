import { test, expect } from '@playwright/test';

const homePagePath = 'file:///mnt/c/Users/Denya/index.html';

test.describe('Home Page Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePagePath);
  });

  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(homePagePath);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds (more content than login page)
    expect(loadTime).toBeLessThan(3000);
    console.log(`Home page load time: ${loadTime}ms`);
  });

  test('should render all critical elements quickly', async ({ page }) => {
    const startTime = Date.now();
    
    // Wait for all critical above-the-fold elements
    await Promise.all([
      page.waitForSelector('.navbar'),
      page.waitForSelector('.hero-title'),
      page.waitForSelector('.hero-subtitle'),
      page.waitForSelector('.hero-buttons'),
      page.waitForSelector('.btn-primary'),
      page.waitForSelector('.btn-secondary')
    ]);
    
    const renderTime = Date.now() - startTime;
    
    // Critical elements should render within 800ms
    expect(renderTime).toBeLessThan(800);
    console.log(`Critical elements render time: ${renderTime}ms`);
  });

  test('should load feature cards efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Wait for all feature cards to be visible
    await page.waitForSelector('.feature-card >> nth=5'); // Wait for 6th card (0-indexed)
    
    const featureLoadTime = Date.now() - startTime;
    
    // All feature cards should load within 1 second
    expect(featureLoadTime).toBeLessThan(1000);
    console.log(`Feature cards load time: ${featureLoadTime}ms`);
  });

  test('should handle navigation clicks responsively', async ({ page }) => {
    const startTime = Date.now();
    
    // Click navigation link
    await page.click('nav a[href="#features"]');
    
    // Wait for smooth scroll to complete
    await page.waitForTimeout(100);
    
    const responseTime = Date.now() - startTime;
    
    // Navigation should respond within 150ms
    expect(responseTime).toBeLessThan(150);
    console.log(`Navigation response time: ${responseTime}ms`);
  });

  test('should animate statistics efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Scroll to stats section to trigger animation
    await page.locator('.stats-section').scrollIntoViewIfNeeded();
    
    // Wait for animation to start
    await page.waitForTimeout(100);
    
    const animationStartTime = Date.now() - startTime;
    
    // Animation should start within 200ms of scroll
    expect(animationStartTime).toBeLessThan(200);
    
    // Wait for animation to complete and verify counters are working
    await page.waitForTimeout(2500);
    
    const finalTime = Date.now() - startTime;
    console.log(`Statistics animation total time: ${finalTime}ms`);
    
    // Verify animation worked by checking counter values
    const counterValue = await page.locator('.stat-number').first().textContent();
    expect(parseInt(counterValue.replace(/,/g, ''))).toBeGreaterThan(0);
  });

  test('should handle rapid navigation efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Rapid navigation simulation
    for (let i = 0; i < 5; i++) {
      await page.click('nav a[href="#features"]');
      await page.waitForTimeout(10);
      await page.click('.logo'); // Click logo to go to top
      await page.waitForTimeout(10);
    }
    
    const totalTime = Date.now() - startTime;
    
    // Should handle rapid navigation within 2 seconds
    expect(totalTime).toBeLessThan(2000);
    console.log(`Rapid navigation total time: ${totalTime}ms`);
  });

  test('should scroll smoothly without performance issues', async ({ page }) => {
    const startTime = Date.now();
    
    // Simulate smooth scrolling through entire page
    await page.evaluate(() => {
      return new Promise(resolve => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 10);
      });
    });
    
    const scrollTime = Date.now() - startTime;
    
    // Should scroll through entire page within 3 seconds
    expect(scrollTime).toBeLessThan(3000);
    console.log(`Full page scroll time: ${scrollTime}ms`);
  });

  test('should handle hover effects efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Hover over all feature cards
    const cards = page.locator('.feature-card');
    const cardCount = await cards.count();
    
    for (let i = 0; i < cardCount; i++) {
      await cards.nth(i).hover();
      await page.waitForTimeout(50); // Brief pause for hover effect
    }
    
    const hoverTime = Date.now() - startTime;
    
    // Should handle all hover effects within 1 second
    expect(hoverTime).toBeLessThan(1000);
    console.log(`All hover effects time: ${hoverTime}ms`);
  });

  test('should load images and icons efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Check that all emoji icons are rendered (they're text, so should be fast)
    const icons = page.locator('.feature-icon');
    await expect(icons).toHaveCount(6);
    
    const iconLoadTime = Date.now() - startTime;
    
    // Icons should load immediately (they're emoji, not images)
    expect(iconLoadTime).toBeLessThan(100);
    console.log(`Icons load time: ${iconLoadTime}ms`);
  });

  test('should maintain performance on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for mobile-specific elements
    await page.waitForSelector('.navbar');
    await page.waitForSelector('.hero-section');
    
    const mobileLoadTime = Date.now() - startTime;
    
    // Mobile should load within same time constraints
    expect(mobileLoadTime).toBeLessThan(3000);
    console.log(`Mobile viewport load time: ${mobileLoadTime}ms`);
  });

  test('should handle rapid button clicks efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Rapid clicking on Get Started button
    for (let i = 0; i < 10; i++) {
      await page.click('.btn-primary', { force: true });
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
    }
    
    const rapidClickTime = Date.now() - startTime;
    
    // Should handle rapid navigation within 10 seconds
    expect(rapidClickTime).toBeLessThan(10000);
    console.log(`Rapid button click handling time: ${rapidClickTime}ms`);
  });

  test('should efficiently handle intersection observer for animations', async ({ page }) => {
    const startTime = Date.now();
    
    // Scroll past stats section multiple times to test observer efficiency
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, 0)); // Top
      await page.waitForTimeout(100);
      await page.locator('.stats-section').scrollIntoViewIfNeeded(); // Stats
      await page.waitForTimeout(100);
    }
    
    const observerTime = Date.now() - startTime;
    
    // Observer operations should be efficient
    expect(observerTime).toBeLessThan(2000);
    console.log(`Intersection observer efficiency test: ${observerTime}ms`);
  });

  test('should handle memory efficiently during extended use', async ({ page }) => {
    // Simulate extended page interaction
    for (let i = 0; i < 20; i++) {
      // Scroll to different sections
      await page.evaluate(() => window.scrollTo(0, Math.random() * document.body.scrollHeight));
      await page.waitForTimeout(50);
      
      // Hover over random elements
      const cards = page.locator('.feature-card');
      const randomIndex = Math.floor(Math.random() * 6);
      await cards.nth(randomIndex).hover();
      await page.waitForTimeout(50);
    }
    
    // Check that page is still responsive
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.navbar')).toBeVisible();
    
    console.log('Memory efficiency test completed - page remains responsive');
  });

  test('should handle CSS animations smoothly', async ({ page }) => {
    const startTime = Date.now();
    
    // Test fade-in animations
    await page.reload();
    await page.waitForSelector('.fade-in');
    
    const fadeInTime = Date.now() - startTime;
    
    // Fade-in animation should complete quickly
    expect(fadeInTime).toBeLessThan(1500);
    console.log(`CSS fade-in animation time: ${fadeInTime}ms`);
    
    // Test slide-in animations
    await page.locator('.slide-in').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Wait for animation
    
    await expect(page.locator('.slide-in')).toBeVisible();
  });

  test('should maintain navbar performance during scroll', async ({ page }) => {
    const measurements = [];
    
    // Measure navbar updates during scroll
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      
      await page.evaluate((scrollPos) => {
        window.scrollTo(0, scrollPos);
      }, i * 100);
      
      await page.waitForTimeout(100);
      
      const endTime = performance.now();
      measurements.push(endTime - startTime);
    }
    
    const avgTime = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    
    // Average scroll response should be under 50ms
    expect(avgTime).toBeLessThan(50);
    console.log(`Average navbar scroll response time: ${avgTime.toFixed(2)}ms`);
  });

  test('should efficiently handle localStorage operations', async ({ page }) => {
    const startTime = Date.now();
    
    // Clear and set localStorage multiple times
    for (let i = 0; i < 100; i++) {
      await page.evaluate((iteration) => {
        localStorage.setItem(`test-${iteration}`, `value-${iteration}`);
      }, i);
    }
    
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    
    const storageTime = Date.now() - startTime;
    
    // Storage operations should be very fast
    expect(storageTime).toBeLessThan(100);
    console.log(`localStorage operations time: ${storageTime}ms`);
  });
});