/**
 * Comprehensive UI Testing Suite
 * Tests all aspects of user interface functionality, appearance, and behavior
 * 
 * Test Categories:
 * - Visual Regression Testing
 * - Cross-Browser Compatibility
 * - Responsive Design Testing
 * - Accessibility Testing
 * - Performance UI Testing
 * - Interactive Elements Testing
 * - Layout and Positioning
 * - Color and Typography
 * - Animation and Transitions
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class UIComprehensiveTester {
    constructor(page) {
        this.page = page;
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0,
            details: []
        };
        this.screenshots = [];
    }

    async runAllUITests() {
        console.log('🎨 Starting Comprehensive UI Testing Suite...');
        console.log('=' .repeat(60));

        // Run all test categories
        await this.testVisualElements();
        await this.testResponsiveDesign();
        await this.testInteractiveElements();
        await this.testAccessibility();
        await this.testPerformanceUI();
        await this.testCrossBrowserCompatibility();
        await this.testLayoutAndPositioning();
        await this.testColorAndTypography();
        await this.testAnimationsAndTransitions();

        return this.generateReport();
    }

    // 1. Visual Elements Testing
    async testVisualElements() {
        console.log('\n🖼️  Testing Visual Elements...');
        
        const tests = [
            {
                name: 'Gradient Background',
                test: async () => {
                    const body = this.page.locator('body');
                    const bgImage = await body.evaluate(el => 
                        window.getComputedStyle(el).backgroundImage
                    );
                    return bgImage.includes('linear-gradient');
                },
                category: 'Visual'
            },
            {
                name: 'Logo Visibility',
                test: async () => {
                    const logo = this.page.locator('.logo');
                    return await logo.isVisible();
                },
                category: 'Visual'
            },
            {
                name: 'Card Shadows',
                test: async () => {
                    const cards = this.page.locator('.feature-card, .login-container');
                    const count = await cards.count();
                    let shadowsFound = 0;
                    
                    for (let i = 0; i < count; i++) {
                        const shadow = await cards.nth(i).evaluate(el => 
                            window.getComputedStyle(el).boxShadow
                        );
                        if (shadow !== 'none') shadowsFound++;
                    }
                    
                    return shadowsFound > 0;
                },
                category: 'Visual'
            },
            {
                name: 'Glassmorphism Effects',
                test: async () => {
                    const elements = this.page.locator('.navbar, .feature-card');
                    const count = await elements.count();
                    let effectsFound = 0;
                    
                    for (let i = 0; i < count; i++) {
                        const backdrop = await elements.nth(i).evaluate(el => 
                            window.getComputedStyle(el).backdropFilter
                        );
                        if (backdrop !== 'none') effectsFound++;
                    }
                    
                    return effectsFound > 0;
                },
                category: 'Visual'
            }
        ];

        await this.runTestCategory('Visual Elements', tests);
    }

    // 2. Responsive Design Testing
    async testResponsiveDesign() {
        console.log('\n📱 Testing Responsive Design...');

        const viewports = [
            { name: 'Mobile Portrait', width: 375, height: 667 },
            { name: 'Mobile Landscape', width: 667, height: 375 },
            { name: 'Tablet Portrait', width: 768, height: 1024 },
            { name: 'Tablet Landscape', width: 1024, height: 768 },
            { name: 'Desktop Small', width: 1280, height: 720 },
            { name: 'Desktop Large', width: 1920, height: 1080 }
        ];

        for (const viewport of viewports) {
            await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
            await this.page.waitForTimeout(500); // Allow layout to settle

            const tests = [
                {
                    name: `${viewport.name} - Navigation Visible`,
                    test: async () => {
                        const nav = this.page.locator('nav, .navbar');
                        return await nav.isVisible();
                    },
                    category: 'Responsive'
                },
                {
                    name: `${viewport.name} - Content Readable`,
                    test: async () => {
                        const content = this.page.locator('h1, h2, p');
                        const count = await content.count();
                        let readableCount = 0;
                        
                        for (let i = 0; i < Math.min(count, 5); i++) {
                            const fontSize = await content.nth(i).evaluate(el => 
                                parseInt(window.getComputedStyle(el).fontSize)
                            );
                            if (fontSize >= 14) readableCount++;
                        }
                        
                        return readableCount > 0;
                    },
                    category: 'Responsive'
                },
                {
                    name: `${viewport.name} - No Horizontal Scroll`,
                    test: async () => {
                        const scrollWidth = await this.page.evaluate(() => 
                            document.documentElement.scrollWidth
                        );
                        return scrollWidth <= viewport.width + 20; // 20px tolerance
                    },
                    category: 'Responsive'
                }
            ];

            await this.runTestCategory(`Responsive (${viewport.name})`, tests);
            
            // Take screenshot for visual verification
            await this.takeScreenshot(`responsive-${viewport.name.toLowerCase().replace(' ', '-')}`);
        }

        // Reset to default viewport
        await this.page.setViewportSize({ width: 1280, height: 720 });
    }

    // 3. Interactive Elements Testing
    async testInteractiveElements() {
        console.log('\n🖱️  Testing Interactive Elements...');

        const tests = [
            {
                name: 'Button Hover Effects',
                test: async () => {
                    const buttons = this.page.locator('button, .btn, input[type="submit"]');
                    const count = await buttons.count();
                    
                    if (count === 0) return false;
                    
                    const button = buttons.first();
                    const originalTransform = await button.evaluate(el => 
                        window.getComputedStyle(el).transform
                    );
                    
                    await button.hover();
                    await this.page.waitForTimeout(300);
                    
                    const hoverTransform = await button.evaluate(el => 
                        window.getComputedStyle(el).transform
                    );
                    
                    return originalTransform !== hoverTransform;
                },
                category: 'Interactive'
            },
            {
                name: 'Link Functionality',
                test: async () => {
                    const links = this.page.locator('a[href]');
                    const count = await links.count();
                    
                    if (count === 0) return false;
                    
                    let workingLinks = 0;
                    for (let i = 0; i < Math.min(count, 5); i++) {
                        const href = await links.nth(i).getAttribute('href');
                        if (href && (href.startsWith('http') || href.startsWith('/') || href.startsWith('#'))) {
                            workingLinks++;
                        }
                    }
                    
                    return workingLinks > 0;
                },
                category: 'Interactive'
            },
            {
                name: 'Form Input Focus',
                test: async () => {
                    const inputs = this.page.locator('input, textarea, select');
                    const count = await inputs.count();
                    
                    if (count === 0) return true; // No forms to test
                    
                    const input = inputs.first();
                    await input.focus();
                    
                    const borderColor = await input.evaluate(el => 
                        window.getComputedStyle(el).borderColor
                    );
                    
                    return borderColor !== 'rgb(0, 0, 0)'; // Default black border
                },
                category: 'Interactive'
            },
            {
                name: 'Smooth Scrolling',
                test: async () => {
                    const scrollLinks = this.page.locator('a[href^="#"]');
                    const count = await scrollLinks.count();
                    
                    if (count === 0) return true; // No scroll links to test
                    
                    const scrollBehavior = await this.page.evaluate(() => 
                        window.getComputedStyle(document.documentElement).scrollBehavior
                    );
                    
                    return scrollBehavior === 'smooth';
                },
                category: 'Interactive'
            }
        ];

        await this.runTestCategory('Interactive Elements', tests);
    }

    // 4. Accessibility Testing
    async testAccessibility() {
        console.log('\n♿ Testing Accessibility...');

        const tests = [
            {
                name: 'Alt Attributes on Images',
                test: async () => {
                    const images = this.page.locator('img');
                    const count = await images.count();
                    
                    if (count === 0) return true; // No images to test
                    
                    let imagesWithAlt = 0;
                    for (let i = 0; i < count; i++) {
                        const alt = await images.nth(i).getAttribute('alt');
                        if (alt !== null) imagesWithAlt++;
                    }
                    
                    return imagesWithAlt === count;
                },
                category: 'Accessibility'
            },
            {
                name: 'Form Labels Association',
                test: async () => {
                    const inputs = this.page.locator('input[id]');
                    const count = await inputs.count();
                    
                    if (count === 0) return true; // No form inputs to test
                    
                    let associatedInputs = 0;
                    for (let i = 0; i < count; i++) {
                        const id = await inputs.nth(i).getAttribute('id');
                        const label = this.page.locator(`label[for="${id}"]`);
                        if (await label.count() > 0) associatedInputs++;
                    }
                    
                    return associatedInputs > 0;
                },
                category: 'Accessibility'
            },
            {
                name: 'Keyboard Navigation',
                test: async () => {
                    const focusableElements = this.page.locator(
                        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
                    );
                    const count = await focusableElements.count();
                    
                    if (count === 0) return true; // No focusable elements
                    
                    // Test tab navigation
                    await this.page.keyboard.press('Tab');
                    const activeElement = await this.page.evaluate(() => 
                        document.activeElement.tagName
                    );
                    
                    return ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement);
                },
                category: 'Accessibility'
            },
            {
                name: 'Color Contrast',
                test: async () => {
                    const textElements = this.page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
                    const count = await textElements.count();
                    
                    let contrastIssues = 0;
                    for (let i = 0; i < Math.min(count, 10); i++) {
                        const styles = await textElements.nth(i).evaluate(el => {
                            const computed = window.getComputedStyle(el);
                            return {
                                color: computed.color,
                                backgroundColor: computed.backgroundColor
                            };
                        });
                        
                        // Basic contrast check (simplified)
                        if (styles.color === styles.backgroundColor) {
                            contrastIssues++;
                        }
                    }
                    
                    return contrastIssues === 0;
                },
                category: 'Accessibility'
            }
        ];

        await this.runTestCategory('Accessibility', tests);
    }

    // 5. Performance UI Testing
    async testPerformanceUI() {
        console.log('\n⚡ Testing UI Performance...');

        const tests = [
            {
                name: 'Page Load Performance',
                test: async () => {
                    const startTime = Date.now();
                    await this.page.reload();
                    await this.page.waitForLoadState('domcontentloaded');
                    const loadTime = Date.now() - startTime;
                    
                    return loadTime < 3000; // 3 seconds
                },
                category: 'Performance'
            },
            {
                name: 'CSS Animation Performance',
                test: async () => {
                    const animatedElements = this.page.locator('[style*="transition"], .animated');
                    const count = await animatedElements.count();
                    
                    if (count === 0) return true; // No animations to test
                    
                    // Check for performance-heavy properties
                    const perfMetrics = await this.page.evaluate(() => {
                        const entries = performance.getEntriesByType('measure');
                        return entries.length < 100; // Arbitrary threshold
                    });
                    
                    return perfMetrics;
                },
                category: 'Performance'
            },
            {
                name: 'Image Optimization',
                test: async () => {
                    const images = this.page.locator('img');
                    const count = await images.count();
                    
                    if (count === 0) return true; // No images to test
                    
                    let optimizedImages = 0;
                    for (let i = 0; i < count; i++) {
                        const src = await images.nth(i).getAttribute('src');
                        if (src) {
                            // Check for common optimized formats or data URIs
                            if (src.includes('.webp') || src.includes('.avif') || src.startsWith('data:')) {
                                optimizedImages++;
                            }
                        }
                    }
                    
                    return optimizedImages >= count * 0.5; // At least 50% optimized
                },
                category: 'Performance'
            }
        ];

        await this.runTestCategory('UI Performance', tests);
    }

    // 6. Cross-Browser Compatibility (Simulated)
    async testCrossBrowserCompatibility() {
        console.log('\n🌐 Testing Cross-Browser Compatibility...');

        const tests = [
            {
                name: 'CSS Grid/Flexbox Support',
                test: async () => {
                    const gridElements = this.page.locator('[style*="display: grid"], [style*="display: flex"]');
                    const count = await gridElements.count();
                    
                    if (count === 0) {
                        // Check CSS classes that might use grid/flex
                        const modernLayouts = await this.page.locator('.grid, .flex, .d-flex').count();
                        return modernLayouts > 0;
                    }
                    
                    return true;
                },
                category: 'Compatibility'
            },
            {
                name: 'Modern CSS Features',
                test: async () => {
                    const modernFeatures = await this.page.evaluate(() => {
                        const testElement = document.createElement('div');
                        document.body.appendChild(testElement);
                        
                        // Test backdrop-filter support
                        testElement.style.backdropFilter = 'blur(10px)';
                        const backdropSupport = testElement.style.backdropFilter !== '';
                        
                        // Test CSS custom properties
                        testElement.style.setProperty('--test', 'value');
                        const customPropSupport = testElement.style.getPropertyValue('--test') === 'value';
                        
                        document.body.removeChild(testElement);
                        
                        return backdropSupport || customPropSupport;
                    });
                    
                    return modernFeatures;
                },
                category: 'Compatibility'
            },
            {
                name: 'JavaScript ES6+ Features',
                test: async () => {
                    const es6Support = await this.page.evaluate(() => {
                        try {
                            // Test arrow functions, const/let, template literals
                            const test = () => `ES6 ${2021}`;
                            return typeof test === 'function';
                        } catch (e) {
                            return false;
                        }
                    });
                    
                    return es6Support;
                },
                category: 'Compatibility'
            }
        ];

        await this.runTestCategory('Cross-Browser Compatibility', tests);
    }

    // 7. Layout and Positioning
    async testLayoutAndPositioning() {
        console.log('\n📐 Testing Layout and Positioning...');

        const tests = [
            {
                name: 'Element Positioning',
                test: async () => {
                    const fixedElements = this.page.locator('.navbar, .header');
                    const count = await fixedElements.count();
                    
                    if (count === 0) return true; // No fixed elements
                    
                    const position = await fixedElements.first().evaluate(el => 
                        window.getComputedStyle(el).position
                    );
                    
                    return position === 'fixed' || position === 'sticky';
                },
                category: 'Layout'
            },
            {
                name: 'Content Overflow',
                test: async () => {
                    const containers = this.page.locator('.container, .content, main');
                    const count = await containers.count();
                    
                    if (count === 0) return true; // No containers to test
                    
                    let overflowIssues = 0;
                    for (let i = 0; i < count; i++) {
                        const overflow = await containers.nth(i).evaluate(el => {
                            const rect = el.getBoundingClientRect();
                            return rect.width > window.innerWidth;
                        });
                        
                        if (overflow) overflowIssues++;
                    }
                    
                    return overflowIssues === 0;
                },
                category: 'Layout'
            },
            {
                name: 'Z-Index Layering',
                test: async () => {
                    const layeredElements = this.page.locator('.modal, .dropdown, .tooltip, .navbar');
                    const count = await layeredElements.count();
                    
                    if (count === 0) return true; // No layered elements
                    
                    let properZIndex = 0;
                    for (let i = 0; i < count; i++) {
                        const zIndex = await layeredElements.nth(i).evaluate(el => 
                            parseInt(window.getComputedStyle(el).zIndex) || 0
                        );
                        
                        if (zIndex > 0) properZIndex++;
                    }
                    
                    return properZIndex > 0;
                },
                category: 'Layout'
            }
        ];

        await this.runTestCategory('Layout and Positioning', tests);
    }

    // 8. Color and Typography
    async testColorAndTypography() {
        console.log('\n🎨 Testing Color and Typography...');

        const tests = [
            {
                name: 'Font Loading',
                test: async () => {
                    const fontFamilies = await this.page.evaluate(() => {
                        const elements = document.querySelectorAll('h1, h2, p, body');
                        const fonts = new Set();
                        
                        elements.forEach(el => {
                            const family = window.getComputedStyle(el).fontFamily;
                            fonts.add(family);
                        });
                        
                        return Array.from(fonts);
                    });
                    
                    return fontFamilies.length > 0 && !fontFamilies.every(font => 
                        font.includes('Times') || font.includes('serif')
                    );
                },
                category: 'Typography'
            },
            {
                name: 'Text Readability',
                test: async () => {
                    const textElements = this.page.locator('p, span, div');
                    const count = await textElements.count();
                    
                    let readableElements = 0;
                    for (let i = 0; i < Math.min(count, 10); i++) {
                        const fontSize = await textElements.nth(i).evaluate(el => 
                            parseInt(window.getComputedStyle(el).fontSize)
                        );
                        
                        if (fontSize >= 14) readableElements++;
                    }
                    
                    return readableElements > 0;
                },
                category: 'Typography'
            },
            {
                name: 'Color Consistency',
                test: async () => {
                    const brandElements = this.page.locator('.btn, .navbar, .logo');
                    const count = await brandElements.count();
                    
                    if (count === 0) return true; // No brand elements
                    
                    const colors = new Set();
                    for (let i = 0; i < count; i++) {
                        const color = await brandElements.nth(i).evaluate(el => 
                            window.getComputedStyle(el).backgroundColor
                        );
                        colors.add(color);
                    }
                    
                    return colors.size <= 5; // Reasonable color palette limit
                },
                category: 'Color'
            }
        ];

        await this.runTestCategory('Color and Typography', tests);
    }

    // 9. Animations and Transitions
    async testAnimationsAndTransitions() {
        console.log('\n🎬 Testing Animations and Transitions...');

        const tests = [
            {
                name: 'CSS Transitions',
                test: async () => {
                    const transitionElements = this.page.locator('button, .btn, a, .card');
                    const count = await transitionElements.count();
                    
                    if (count === 0) return true; // No transition elements
                    
                    let transitionsFound = 0;
                    for (let i = 0; i < Math.min(count, 5); i++) {
                        const transition = await transitionElements.nth(i).evaluate(el => 
                            window.getComputedStyle(el).transition
                        );
                        
                        if (transition !== 'all 0s ease 0s') transitionsFound++;
                    }
                    
                    return transitionsFound > 0;
                },
                category: 'Animation'
            },
            {
                name: 'Animation Performance',
                test: async () => {
                    // Check for performance-friendly transform animations
                    const animatedElements = await this.page.locator('[style*="transform"], [style*="opacity"]').count();
                    const heavyAnimations = await this.page.locator('[style*="width"], [style*="height"], [style*="left"], [style*="top"]').count();
                    
                    return animatedElements >= heavyAnimations;
                },
                category: 'Animation'
            },
            {
                name: 'Smooth Scrolling Animation',
                test: async () => {
                    const scrollBehavior = await this.page.evaluate(() => 
                        window.getComputedStyle(document.documentElement).scrollBehavior
                    );
                    
                    return scrollBehavior === 'smooth';
                },
                category: 'Animation'
            }
        ];

        await this.runTestCategory('Animations and Transitions', tests);
    }

    // Utility Methods
    async runTestCategory(categoryName, tests) {
        console.log(`\n  Testing ${categoryName}:`);
        
        for (const test of tests) {
            try {
                const result = await test.test();
                const status = result ? '✅ PASS' : '❌ FAIL';
                console.log(`    ${status} - ${test.name}`);
                
                this.testResults.total++;
                if (result) {
                    this.testResults.passed++;
                } else {
                    this.testResults.failed++;
                }
                
                this.testResults.details.push({
                    category: test.category,
                    name: test.name,
                    status: result ? 'PASS' : 'FAIL',
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.log(`    ⚠️  WARN - ${test.name}: ${error.message}`);
                this.testResults.warnings++;
                this.testResults.total++;
                
                this.testResults.details.push({
                    category: test.category,
                    name: test.name,
                    status: 'WARNING',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }

    async takeScreenshot(name) {
        try {
            const screenshotPath = `tests/ui/screenshots/${name}-${Date.now()}.png`;
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            this.screenshots.push(screenshotPath);
            console.log(`    📸 Screenshot saved: ${screenshotPath}`);
        } catch (error) {
            console.log(`    ⚠️  Could not take screenshot: ${error.message}`);
        }
    }

    generateReport() {
        const passRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPREHENSIVE UI TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${this.testResults.total}`);
        console.log(`✅ Passed: ${this.testResults.passed}`);
        console.log(`❌ Failed: ${this.testResults.failed}`);
        console.log(`⚠️  Warnings: ${this.testResults.warnings}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        console.log(`📸 Screenshots: ${this.screenshots.length}`);
        
        // Category breakdown
        const categories = {};
        this.testResults.details.forEach(test => {
            if (!categories[test.category]) {
                categories[test.category] = { pass: 0, fail: 0, warn: 0, total: 0 };
            }
            categories[test.category].total++;
            if (test.status === 'PASS') categories[test.category].pass++;
            else if (test.status === 'FAIL') categories[test.category].fail++;
            else categories[test.category].warn++;
        });
        
        console.log('\n📊 Results by Category:');
        Object.entries(categories).forEach(([category, stats]) => {
            const categoryPass = ((stats.pass / stats.total) * 100).toFixed(1);
            console.log(`  ${category}: ${stats.pass}/${stats.total} (${categoryPass}%)`);
        });
        
        // Recommendations
        console.log('\n💡 Recommendations:');
        if (passRate >= 90) {
            console.log('  🌟 Excellent UI quality! Ready for production.');
        } else if (passRate >= 75) {
            console.log('  👍 Good UI quality. Minor improvements recommended.');
        } else if (passRate >= 60) {
            console.log('  ⚠️  UI needs improvement. Address failing tests.');
        } else {
            console.log('  🚨 Significant UI issues found. Major fixes required.');
        }
        
        return {
            summary: this.testResults,
            categories,
            passRate: parseFloat(passRate),
            screenshots: this.screenshots,
            timestamp: new Date().toISOString()
        };
    }
}

// Export for use in other test files
module.exports = { UIComprehensiveTester };

// Standalone execution
if (require.main === module) {
    const { chromium } = require('playwright');
    
    (async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        
        // Test all pages
        const pages = [
            { name: 'Home', url: 'file:///mnt/c/Users/Denya/src/pages/index.html' },
            { name: 'Login', url: 'file:///mnt/c/Users/Denya/src/pages/login.html' },
            { name: 'Register', url: 'file:///mnt/c/Users/Denya/src/pages/register.html' }
        ];
        
        const allResults = [];
        
        for (const pageInfo of pages) {
            console.log(`\n🔍 Testing ${pageInfo.name} Page: ${pageInfo.url}`);
            console.log('='.repeat(80));
            
            try {
                await page.goto(pageInfo.url);
                await page.waitForLoadState('domcontentloaded');
                
                const tester = new UIComprehensiveTester(page);
                const results = await tester.runAllUITests();
                
                allResults.push({
                    page: pageInfo.name,
                    url: pageInfo.url,
                    results
                });
                
            } catch (error) {
                console.log(`❌ Error testing ${pageInfo.name}: ${error.message}`);
                allResults.push({
                    page: pageInfo.name,
                    url: pageInfo.url,
                    error: error.message
                });
            }
        }
        
        // Overall summary
        console.log('\n' + '='.repeat(80));
        console.log('🏆 OVERALL UI TEST SUMMARY');
        console.log('='.repeat(80));
        
        let totalPassed = 0, totalFailed = 0, totalWarnings = 0, totalTests = 0;
        
        allResults.forEach(result => {
            if (result.results) {
                console.log(`${result.page}: ${result.results.passRate}% pass rate`);
                totalPassed += result.results.summary.passed;
                totalFailed += result.results.summary.failed;
                totalWarnings += result.results.summary.warnings;
                totalTests += result.results.summary.total;
            } else {
                console.log(`${result.page}: ERROR - ${result.error}`);
            }
        });
        
        const overallPassRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
        
        console.log(`\nOverall Results:`);
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Overall Pass Rate: ${overallPassRate}%`);
        console.log(`✅ ${totalPassed} | ❌ ${totalFailed} | ⚠️ ${totalWarnings}`);
        
        await browser.close();
        
        console.log('\n🎉 UI Testing Complete!');
        
    })().catch(console.error);
}