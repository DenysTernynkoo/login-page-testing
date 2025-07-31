import { test, expect } from '@playwright/test';

const homePagePath = 'file:///mnt/c/Users/Denya/src/pages/index.html';

test.describe('Home Page UX Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePagePath);
  });

  test.describe('Visual Design & Layout', () => {
    test('should have consistent gradient background design', async ({ page }) => {
      const body = page.locator('body');
      const backgroundStyle = await body.evaluate(el => 
        window.getComputedStyle(el).backgroundImage
      );
      
      // Check for consistent gradient with login/register pages
      expect(backgroundStyle).toContain('linear-gradient');
      expect(backgroundStyle).toContain('667eea');
      expect(backgroundStyle).toContain('764ba2');
      console.log('✅ Consistent gradient background applied');
    });

    test('should have visually appealing glassmorphism navbar', async ({ page }) => {
      const navbar = page.locator('.navbar');
      
      const navbarStyles = await navbar.evaluate(el => ({
        background: window.getComputedStyle(el).background,
        backdropFilter: window.getComputedStyle(el).backdropFilter,
        position: window.getComputedStyle(el).position
      }));
      
      expect(navbarStyles.position).toBe('fixed');
      expect(navbarStyles.backdropFilter).toContain('blur');
      console.log('✅ Navbar has proper glassmorphism effect');
    });

    test('should have proper typography hierarchy', async ({ page }) => {
      // Check main heading
      const heroTitle = page.locator('.hero-title');
      const titleStyle = await heroTitle.evaluate(el => ({
        fontSize: window.getComputedStyle(el).fontSize,
        fontWeight: window.getComputedStyle(el).fontWeight,
        textShadow: window.getComputedStyle(el).textShadow
      }));
      
      expect(parseFloat(titleStyle.fontSize)).toBeGreaterThan(48); // Should be large
      expect(titleStyle.fontWeight).toBe('700'); // Bold
      expect(titleStyle.textShadow).not.toBe('none');
      console.log('✅ Typography hierarchy is well-defined');
    });

    test('should have consistent spacing and layout', async ({ page }) => {
      // Check section spacing
      const sections = ['.hero-section', '.features-section', '.stats-section'];
      
      for (const section of sections) {
        await expect(page.locator(section)).toBeVisible();
        
        const sectionPadding = await page.locator(section).evaluate(el => 
          window.getComputedStyle(el).padding
        );
        
        expect(sectionPadding).not.toBe('0px');
      }
      console.log('✅ Consistent section spacing maintained');
    });
  });

  test.describe('User Interaction Feedback', () => {
    test('should provide immediate feedback on button hover', async ({ page }) => {
      const getPrimaryBtn = page.locator('.btn-primary').first();
      
      // Get initial transform
      const initialTransform = await getPrimaryBtn.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // Hover over button
      await getPrimaryBtn.hover();
      await page.waitForTimeout(300);
      
      // Should have hover effect
      const hoverTransform = await getPrimaryBtn.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // Transform should change (translateY effect)
      expect(hoverTransform).not.toBe(initialTransform);
      console.log('✅ Button hover effects working correctly');
    });

    test('should provide visual feedback on feature card hover', async ({ page }) => {
      const firstCard = page.locator('.feature-card').first();
      
      // Get initial box shadow
      const initialShadow = await firstCard.evaluate(el => 
        window.getComputedStyle(el).boxShadow
      );
      
      // Hover over card
      await firstCard.hover();
      await page.waitForTimeout(400);
      
      // Box shadow should enhance on hover
      const hoverShadow = await firstCard.evaluate(el => 
        window.getComputedStyle(el).boxShadow
      );
      
      expect(hoverShadow).not.toBe(initialShadow);
      console.log('✅ Feature card hover effects enhance user experience');
    });

    test('should show smooth scroll behavior', async ({ page }) => {
      // Test smooth scrolling to features
      await page.click('.btn-secondary'); // Learn More button
      
      // Wait for scroll animation
      await page.waitForTimeout(1000);
      
      // Features section should be in view
      await expect(page.locator('#features')).toBeInViewport();
      console.log('✅ Smooth scrolling provides good UX');
    });

    test('should show navbar background change on scroll', async ({ page }) => {
      const navbar = page.locator('.navbar');
      
      // Get initial background
      const initialBg = await navbar.evaluate(el => 
        window.getComputedStyle(el).background
      );
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      // Background should change
      const scrolledBg = await navbar.evaluate(el => 
        window.getComputedStyle(el).background
      );
      
      expect(scrolledBg).not.toBe(initialBg);
      console.log('✅ Navbar provides scroll feedback');
    });
  });

  test.describe('Animation & Micro-interactions', () => {
    test('should animate statistics counters when in view', async ({ page }) => {
      // Scroll to stats section
      await page.locator('.stats-section').scrollIntoViewIfNeeded();
      
      // Wait a moment for animation to start
      await page.waitForTimeout(500);
      
      // Check that counter is animating (should be > 0)
      const counterValue = await page.locator('.stat-number').first().textContent();
      const numValue = parseInt(counterValue.replace(/,/g, ''));
      
      expect(numValue).toBeGreaterThan(0);
      
      // Wait for animation to complete
      await page.waitForTimeout(2000);
      
      // Should reach target value
      const finalValue = await page.locator('.stat-number').first().textContent();
      const finalNum = parseInt(finalValue.replace(/,/g, ''));
      
      expect(finalNum).toBeGreaterThanOrEqual(10000); // Target value
      console.log('✅ Statistics animation provides engaging feedback');
    });

    test('should have smooth page load animations', async ({ page }) => {
      // Reload to test fade-in animation
      await page.reload();
      
      // Check that fade-in elements exist
      await expect(page.locator('.fade-in')).toBeVisible();
      await expect(page.locator('.slide-in')).toBeVisible();
      
      console.log('✅ Page load animations enhance first impression');
    });

    test('should have consistent transition timing', async ({ page }) => {
      const button = page.locator('.btn').first();
      
      const transition = await button.evaluate(el => 
        window.getComputedStyle(el).transition
      );
      
      expect(transition).toContain('0.3s'); // Consistent timing
      console.log('✅ Consistent transition timing across elements');
    });
  });

  test.describe('Content Hierarchy & Readability', () => {
    test('should have clear content hierarchy', async ({ page }) => {
      // Main title should be prominent
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText('Welcome to Your Site');
      
      // Section title should be clear
      await expect(page.locator('h2')).toHaveCount(1);
      await expect(page.locator('h2')).toHaveText('Why Choose Us?');
      
      // Feature titles should be consistent
      await expect(page.locator('h3')).toHaveCount(6);
      
      console.log('✅ Clear content hierarchy guides user attention');
    });

    test('should have readable text contrast', async ({ page }) => {
      // Check hero text contrast (white on gradient)
      const heroTitle = page.locator('.hero-title');
      const titleColor = await heroTitle.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      expect(titleColor).toBe('rgb(255, 255, 255)'); // White text
      
      // Check feature card text
      const cardText = page.locator('.feature-description').first();
      const cardColor = await cardText.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      expect(cardColor).toBe('rgb(255, 255, 255)'); // White text on semi-transparent cards
      console.log('✅ Text contrast ensures good readability');
    });

    test('should have compelling and clear messaging', async ({ page }) => {
      // Hero message should be engaging
      const subtitle = await page.locator('.hero-subtitle').textContent();
      expect(subtitle).toContain('Discover amazing features');
      expect(subtitle).toContain('thousands of users');
      
      // Feature descriptions should be informative
      const features = page.locator('.feature-description');
      const count = await features.count();
      
      for (let i = 0; i < count; i++) {
        const text = await features.nth(i).textContent();
        expect(text.length).toBeGreaterThan(30); // Substantial descriptions
      }
      
      console.log('✅ Content is compelling and informative');
    });
  });

  test.describe('Navigation & Usability', () => {
    test('should have intuitive navigation flow', async ({ page }) => {
      // Primary CTA should lead to registration
      const getStartedBtn = page.locator('.btn-primary').first();
      await expect(getStartedBtn).toHaveAttribute('href', 'register.html');
      
      // Secondary CTA should lead to more info
      const learnMoreBtn = page.locator('.btn-secondary').first();
      await expect(learnMoreBtn).toHaveAttribute('href', '#features');
      
      // Navigation should have clear sign in/up options
      await expect(page.locator('nav a[href="login.html"]')).toHaveText('Sign In');
      await expect(page.locator('nav a[href="register.html"]')).toHaveText('Sign Up');
      
      console.log('✅ Navigation flow guides users effectively');
    });

    test('should provide contextual navigation options', async ({ page }) => {
      // Multiple paths to registration
      const registrationLinks = page.locator('a[href="register.html"]');
      const linkCount = await registrationLinks.count();
      
      expect(linkCount).toBeGreaterThanOrEqual(2); // Navbar + hero button
      
      // Clear branding/home link
      await expect(page.locator('.logo')).toHaveAttribute('href', 'index.html');
      
      console.log('✅ Multiple conversion paths available');
    });

    test('should maintain navigation consistency', async ({ page }) => {
      // Logo should always be visible
      await expect(page.locator('.logo')).toBeVisible();
      
      // Main navigation should always be accessible
      await expect(page.locator('.nav-links')).toBeVisible();
      
      // Scroll down and check navbar persistence
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(300);
      
      await expect(page.locator('.navbar')).toBeVisible();
      console.log('✅ Navigation remains consistently accessible');
    });
  });

  test.describe('Mobile & Responsive UX', () => {
    test('should adapt beautifully to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Hero title should still be readable
      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toBeVisible();
      
      const mobileFontSize = await heroTitle.evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      
      expect(parseFloat(mobileFontSize)).toBeGreaterThan(30); // Still large enough
      
      // Navigation should adapt
      await expect(page.locator('.nav-container')).toBeVisible();
      
      console.log('✅ Mobile adaptation maintains usability');
    });

    test('should maintain touch-friendly interactions on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Buttons should be touch-friendly size
      const buttons = page.locator('.btn');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const buttonBox = await buttons.nth(i).boundingBox();
        expect(buttonBox.height).toBeGreaterThanOrEqual(44); // iOS guideline
      }
      
      console.log('✅ Touch targets are appropriately sized');
    });

    test('should handle orientation changes gracefully', async ({ page }) => {
      // Test landscape mobile
      await page.setViewportSize({ width: 667, height: 375 });
      
      // Content should still be accessible
      await expect(page.locator('.hero-section')).toBeVisible();
      await expect(page.locator('.navbar')).toBeVisible();
      
      // Switch back to portrait
      await page.setViewportSize({ width: 375, height: 667 });
      
      await expect(page.locator('.hero-section')).toBeVisible();
      console.log('✅ Orientation changes handled smoothly');
    });
  });

  test.describe('Accessibility & Inclusive Design', () => {
    test('should have proper semantic structure', async ({ page }) => {
      // Semantic HTML structure
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      
      // Proper heading structure
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h2')).toHaveCount(1);
      await expect(page.locator('h3')).toHaveCount(6);
      
      console.log('✅ Semantic structure supports screen readers');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through navigation
      await page.keyboard.press('Tab');
      await expect(page.locator('.logo')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('nav a[href="index.html"]')).toBeFocused();
      
      // Continue tabbing through nav links
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Skip to About
      await page.keyboard.press('Tab');
      await expect(page.locator('nav a[href="login.html"]')).toBeFocused();
      
      console.log('✅ Keyboard navigation works throughout page');
    });

    test('should have accessible color contrast', async ({ page }) => {
      // White text on gradient should have sufficient contrast
      const textElements = ['.hero-title', '.hero-subtitle', '.feature-title'];
      
      for (const selector of textElements) {
        const color = await page.locator(selector).first().evaluate(el => 
          window.getComputedStyle(el).color
        );
        expect(color).toBe('rgb(255, 255, 255)'); // White for contrast
      }
      
      console.log('✅ Color contrast meets accessibility standards');
    });
  });

  test.describe('Performance Perception & Loading UX', () => {
    test('should show content progressively', async ({ page }) => {
      // Critical content should load first
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.hero-section')).toBeVisible();
      
      // Features can load slightly after
      await page.waitForTimeout(100);
      await expect(page.locator('.features-section')).toBeVisible();
      
      console.log('✅ Progressive content loading improves perceived performance');
    });

    test('should handle slow connections gracefully', async ({ page }) => {
      // Simulate slow connection
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      await page.reload();
      
      // Essential content should still be visible
      await expect(page.locator('.hero-title')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.navbar')).toBeVisible();
      
      console.log('✅ Graceful degradation on slow connections');
    });
  });

  test.describe('Conversion & Business UX', () => {
    test('should have compelling call-to-action placement', async ({ page }) => {
      // Primary CTA should be above the fold
      const getStartedBtn = page.locator('.btn-primary').first();
      await expect(getStartedBtn).toBeInViewport();
      
      // CTA should stand out visually
      const btnBackground = await getStartedBtn.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      expect(btnBackground).toBe('rgb(255, 255, 255)'); // Contrasting white
      console.log('✅ CTAs are prominently placed and visible');
    });

    test('should build trust through design elements', async ({ page }) => {
      // Statistics should build credibility
      await expect(page.locator('.stats-section')).toBeVisible();
      
      // Multiple trust indicators
      const statsCount = await page.locator('.stat-item').count();
      expect(statsCount).toBe(4);
      
      // Feature benefits should be clear
      const featureCount = await page.locator('.feature-card').count();
      expect(featureCount).toBe(6);
      
      console.log('✅ Trust-building elements effectively positioned');
    });

    test('should provide clear value proposition', async ({ page }) => {
      // Hero section should communicate value clearly
      const subtitle = await page.locator('.hero-subtitle').textContent();
      expect(subtitle).toContain('thousands of users');
      expect(subtitle).toContain('trust our platform');
      
      // Features should highlight benefits
      const securityFeature = page.locator('.feature-title').filter({ hasText: 'Secure & Private' });
      await expect(securityFeature).toBeVisible();
      
      const reliabilityFeature = page.locator('.feature-title').filter({ hasText: 'Fast & Reliable' });
      await expect(reliabilityFeature).toBeVisible();
      
      console.log('✅ Value proposition is clearly communicated');
    });
  });
});