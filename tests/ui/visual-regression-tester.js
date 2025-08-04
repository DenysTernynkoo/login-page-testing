/**
 * Visual Regression Testing Suite
 * Captures and compares screenshots to detect visual changes
 * 
 * Features:
 * - Screenshot comparison with pixel-perfect accuracy
 * - Baseline image management
 * - Difference highlighting
 * - Multi-viewport testing
 * - Automatic baseline updates
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

class VisualRegressionTester {
    constructor(page) {
        this.page = page;
        this.baselineDir = path.join(process.cwd(), 'tests', 'ui', 'baselines');
        this.actualDir = path.join(process.cwd(), 'tests', 'ui', 'actual');
        this.diffDir = path.join(process.cwd(), 'tests', 'ui', 'diffs');
        this.threshold = 0.2; // 0.2% difference threshold
        this.results = [];
    }

    async initialize() {
        // Create directories if they don't exist
        await this.ensureDirectory(this.baselineDir);
        await this.ensureDirectory(this.actualDir);
        await this.ensureDirectory(this.diffDir);
    }

    async ensureDirectory(dir) {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    async runVisualTests() {
        console.log('📸 Starting Visual Regression Testing...');
        await this.initialize();

        const testCases = [
            // Full page screenshots
            {
                name: 'home-page-full',
                url: 'file:///mnt/c/Users/Denya/src/pages/index.html',
                fullPage: true,
                viewport: { width: 1280, height: 720 }
            },
            {
                name: 'login-page-full',
                url: 'file:///mnt/c/Users/Denya/src/pages/login.html',
                fullPage: true,
                viewport: { width: 1280, height: 720 }
            },
            {
                name: 'register-page-full',
                url: 'file:///mnt/c/Users/Denya/src/pages/register.html',
                fullPage: true,
                viewport: { width: 1280, height: 720 }
            },

            // Component-specific screenshots
            {
                name: 'home-hero-section',
                url: 'file:///mnt/c/Users/Denya/src/pages/index.html',
                selector: '.hero-section, .hero',
                viewport: { width: 1280, height: 720 }
            },
            {
                name: 'home-features-section',
                url: 'file:///mnt/c/Users/Denya/src/pages/index.html',
                selector: '.features-section, .features',
                viewport: { width: 1280, height: 720 }
            },
            {
                name: 'login-form',
                url: 'file:///mnt/c/Users/Denya/src/pages/login.html',
                selector: '.login-container, .login-form, #loginForm',
                viewport: { width: 1280, height: 720 }
            },
            {
                name: 'register-form',
                url: 'file:///mnt/c/Users/Denya/src/pages/register.html',
                selector: '.register-container, .register-form, #registerForm',
                viewport: { width: 1280, height: 720 }
            },

            // Mobile responsive screenshots
            {
                name: 'home-page-mobile',
                url: 'file:///mnt/c/Users/Denya/src/pages/index.html',
                fullPage: true,
                viewport: { width: 375, height: 667 }
            },
            {
                name: 'login-page-mobile',
                url: 'file:///mnt/c/Users/Denya/src/pages/login.html',
                fullPage: true,
                viewport: { width: 375, height: 667 }
            },
            {
                name: 'register-page-mobile',
                url: 'file:///mnt/c/Users/Denya/src/pages/register.html',
                fullPage: true,
                viewport: { width: 375, height: 667 }
            },

            // Tablet screenshots
            {
                name: 'home-page-tablet',
                url: 'file:///mnt/c/Users/Denya/src/pages/index.html',
                fullPage: true,
                viewport: { width: 768, height: 1024 }
            },

            // Interactive state screenshots
            {
                name: 'login-form-hover',
                url: 'file:///mnt/c/Users/Denya/src/pages/login.html',
                selector: '.login-container',
                viewport: { width: 1280, height: 720 },
                interactions: [
                    { type: 'hover', selector: 'button[type="submit"], .btn' }
                ]
            },
            {
                name: 'login-form-focus',
                url: 'file:///mnt/c/Users/Denya/src/pages/login.html',
                selector: '.login-container',
                viewport: { width: 1280, height: 720 },
                interactions: [
                    { type: 'focus', selector: '#email, input[type="email"]' }
                ]
            },
            {
                name: 'register-form-error',
                url: 'file:///mnt/c/Users/Denya/src/pages/register.html',
                selector: '.register-container',
                viewport: { width: 1280, height: 720 },
                interactions: [
                    { type: 'click', selector: 'button[type="submit"], .btn' },
                    { type: 'wait', duration: 500 }
                ]
            }
        ];

        for (const testCase of testCases) {
            await this.runSingleVisualTest(testCase);
        }

        return this.generateVisualReport();
    }

    async runSingleVisualTest(testCase) {
        console.log(`\n  📷 Testing: ${testCase.name}`);

        try {
            // Set viewport
            await this.page.setViewportSize(testCase.viewport);

            // Navigate to page
            await this.page.goto(testCase.url);
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(1000); // Allow animations to settle

            // Perform interactions if specified
            if (testCase.interactions) {
                for (const interaction of testCase.interactions) {
                    await this.performInteraction(interaction);
                }
            }

            // Take screenshot
            const screenshotOptions = {
                path: path.join(this.actualDir, `${testCase.name}.png`),
                fullPage: testCase.fullPage || false
            };

            if (testCase.selector) {
                const element = this.page.locator(testCase.selector).first();
                if (await element.count() > 0) {
                    await element.screenshot(screenshotOptions);
                } else {
                    console.log(`    ⚠️  Element not found: ${testCase.selector}`);
                    await this.page.screenshot(screenshotOptions);
                }
            } else {
                await this.page.screenshot(screenshotOptions);
            }

            // Compare with baseline
            const comparisonResult = await this.compareScreenshots(testCase.name);
            this.results.push({
                name: testCase.name,
                ...comparisonResult,
                testCase
            });

            const status = comparisonResult.passed ? '✅ PASS' : '❌ FAIL';
            const diffPercent = comparisonResult.diffPercent ? 
                ` (${comparisonResult.diffPercent.toFixed(3)}% diff)` : '';
            console.log(`    ${status} - ${testCase.name}${diffPercent}`);

        } catch (error) {
            console.log(`    ❌ ERROR - ${testCase.name}: ${error.message}`);
            this.results.push({
                name: testCase.name,
                passed: false,
                error: error.message,
                testCase
            });
        }
    }

    async performInteraction(interaction) {
        try {
            switch (interaction.type) {
                case 'hover':
                    await this.page.locator(interaction.selector).first().hover();
                    break;
                case 'click':
                    await this.page.locator(interaction.selector).first().click();
                    break;
                case 'focus':
                    await this.page.locator(interaction.selector).first().focus();
                    break;
                case 'wait':
                    await this.page.waitForTimeout(interaction.duration || 1000);
                    break;
                case 'scroll':
                    await this.page.locator(interaction.selector).first().scrollIntoViewIfNeeded();
                    break;
            }
            
            if (interaction.wait !== false) {
                await this.page.waitForTimeout(300); // Default wait after interaction
            }
        } catch (error) {
            console.log(`    ⚠️  Interaction failed: ${interaction.type} on ${interaction.selector}`);
        }
    }

    async compareScreenshots(testName) {
        const actualPath = path.join(this.actualDir, `${testName}.png`);
        const baselinePath = path.join(this.baselineDir, `${testName}.png`);
        const diffPath = path.join(this.diffDir, `${testName}.png`);

        try {
            // Check if baseline exists
            try {
                await fs.access(baselinePath);
            } catch {
                // No baseline exists, copy current as baseline
                await fs.copyFile(actualPath, baselinePath);
                console.log(`    📝 Created baseline: ${testName}`);
                return {
                    passed: true,
                    isNewBaseline: true,
                    message: 'New baseline created'
                };
            }

            // Load images
            const actualBuffer = await fs.readFile(actualPath);
            const baselineBuffer = await fs.readFile(baselinePath);

            const actualPng = PNG.sync.read(actualBuffer);
            const baselinePng = PNG.sync.read(baselineBuffer);

            // Check dimensions match
            if (actualPng.width !== baselinePng.width || actualPng.height !== baselinePng.height) {
                return {
                    passed: false,
                    message: `Dimensions mismatch: actual(${actualPng.width}x${actualPng.height}) vs baseline(${baselinePng.width}x${baselinePng.height})`
                };
            }

            // Compare images
            const diffPng = new PNG({ width: actualPng.width, height: actualPng.height });
            const diffPixels = pixelmatch(
                actualPng.data,
                baselinePng.data,
                diffPng.data,
                actualPng.width,
                actualPng.height,
                {
                    threshold: 0.1,
                    includeAA: false
                }
            );

            const totalPixels = actualPng.width * actualPng.height;
            const diffPercent = (diffPixels / totalPixels) * 100;

            if (diffPercent > this.threshold) {
                // Save diff image
                await fs.writeFile(diffPath, PNG.sync.write(diffPng));
                
                return {
                    passed: false,
                    diffPixels,
                    totalPixels,
                    diffPercent,
                    diffPath,
                    message: `Visual difference detected: ${diffPercent.toFixed(3)}% (threshold: ${this.threshold}%)`
                };
            }

            // Clean up diff file if it exists (test passed)
            try {
                await fs.unlink(diffPath);
            } catch {}

            return {
                passed: true,
                diffPixels,
                totalPixels,
                diffPercent,
                message: 'Visual match within threshold'
            };

        } catch (error) {
            return {
                passed: false,
                error: error.message,
                message: `Comparison failed: ${error.message}`
            };
        }
    }

    generateVisualReport() {
        const totalTests = this.results.length;
        const passedTests = this.results.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const passRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0;

        console.log('\n' + '='.repeat(60));
        console.log('📊 VISUAL REGRESSION TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`📈 Pass Rate: ${passRate}%`);

        // Group results by category
        const categories = {
            'Full Page': this.results.filter(r => r.name.includes('full')),
            'Components': this.results.filter(r => !r.name.includes('full') && !r.name.includes('mobile') && !r.name.includes('tablet')),
            'Mobile': this.results.filter(r => r.name.includes('mobile')),
            'Tablet': this.results.filter(r => r.name.includes('tablet')),
            'Interactive': this.results.filter(r => r.name.includes('hover') || r.name.includes('focus') || r.name.includes('error'))
        };

        console.log('\n📊 Results by Category:');
        Object.entries(categories).forEach(([category, tests]) => {
            if (tests.length > 0) {
                const categoryPassed = tests.filter(t => t.passed).length;
                const categoryRate = (categoryPassed / tests.length * 100).toFixed(1);
                console.log(`  ${category}: ${categoryPassed}/${tests.length} (${categoryRate}%)`);
            }
        });

        // Show failed tests details
        const failedTestsDetails = this.results.filter(r => !r.passed);
        if (failedTestsDetails.length > 0) {
            console.log('\n❌ Failed Tests:');
            failedTestsDetails.forEach(test => {
                console.log(`  • ${test.name}: ${test.message || test.error}`);
                if (test.diffPath) {
                    console.log(`    Diff saved: ${test.diffPath}`);
                }
            });
        }

        // Show new baselines
        const newBaselines = this.results.filter(r => r.isNewBaseline);
        if (newBaselines.length > 0) {
            console.log('\n📝 New Baselines Created:');
            newBaselines.forEach(test => {
                console.log(`  • ${test.name}`);
            });
        }

        console.log('\n💡 Recommendations:');
        if (passRate >= 95) {
            console.log('  🌟 Excellent visual consistency! No visual regressions detected.');
        } else if (passRate >= 85) {
            console.log('  👍 Good visual consistency. Minor differences detected.');
        } else if (passRate >= 70) {
            console.log('  ⚠️  Some visual differences detected. Review changes.');
        } else {
            console.log('  🚨 Significant visual changes detected. Requires attention.');
        }

        console.log('\n📂 Output Directories:');
        console.log(`  Baselines: ${this.baselineDir}`);
        console.log(`  Current: ${this.actualDir}`);
        console.log(`  Diffs: ${this.diffDir}`);

        return {
            totalTests,
            passedTests,
            failedTests,
            passRate: parseFloat(passRate),
            categories,
            failedTests: failedTestsDetails,
            newBaselines,
            results: this.results,
            directories: {
                baseline: this.baselineDir,
                actual: this.actualDir,
                diff: this.diffDir
            }
        };
    }

    // Utility method to update baselines
    async updateBaselines(testNames = null) {
        console.log('🔄 Updating baselines...');
        
        const testsToUpdate = testNames ? 
            this.results.filter(r => testNames.includes(r.name)) : 
            this.results;

        for (const test of testsToUpdate) {
            const actualPath = path.join(this.actualDir, `${test.name}.png`);
            const baselinePath = path.join(this.baselineDir, `${test.name}.png`);
            
            try {
                await fs.copyFile(actualPath, baselinePath);
                console.log(`  ✅ Updated baseline: ${test.name}`);
            } catch (error) {
                console.log(`  ❌ Failed to update baseline: ${test.name} - ${error.message}`);
            }
        }
    }
}

module.exports = { VisualRegressionTester };

// Standalone execution
if (require.main === module) {
    const { chromium } = require('playwright');
    
    (async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        
        const tester = new VisualRegressionTester(page);
        const results = await tester.runVisualTests();
        
        // Option to update baselines if this is the first run or if explicitly requested
        const shouldUpdateBaselines = process.argv.includes('--update-baselines');
        if (shouldUpdateBaselines) {
            await tester.updateBaselines();
        }
        
        await browser.close();
        
        console.log('\n🎉 Visual Regression Testing Complete!');
        
        // Exit with appropriate code
        process.exit(results.failedTests > 0 ? 1 : 0);
        
    })().catch(console.error);
}