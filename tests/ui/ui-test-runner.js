/**
 * UI Test Runner
 * Orchestrates all UI testing suites and generates comprehensive reports
 */

const { chromium, firefox, webkit } = require('playwright');
const { UIComprehensiveTester } = require('./ui-comprehensive-tester');
const { VisualRegressionTester } = require('./visual-regression-tester');
const fs = require('fs').promises;
const path = require('path');

class UITestRunner {
    constructor(options = {}) {
        this.options = {
            browsers: options.browsers || ['chromium'],
            pages: options.pages || [
                { name: 'Home', url: 'file:///mnt/c/Users/Denya/src/pages/index.html' },
                { name: 'Login', url: 'file:///mnt/c/Users/Denya/src/pages/login.html' },
                { name: 'Register', url: 'file:///mnt/c/Users/Denya/src/pages/register.html' }
            ],
            runVisualRegression: options.runVisualRegression !== false,
            runComprehensive: options.runComprehensive !== false,
            generateReport: options.generateReport !== false,
            ...options
        };
        
        this.results = {
            startTime: new Date(),
            browsers: {},
            summary: {
                totalTests: 0,
                passedTests: 0,
                failedTests: 0,
                warnings: 0
            }
        };
    }

    async runAllTests() {
        console.log('🚀 Starting Complete UI Test Suite');
        console.log('=' .repeat(80));
        console.log(`Browsers: ${this.options.browsers.join(', ')}`);
        console.log(`Pages: ${this.options.pages.map(p => p.name).join(', ')}`);
        console.log(`Visual Regression: ${this.options.runVisualRegression ? 'Yes' : 'No'}`);
        console.log(`Comprehensive Tests: ${this.options.runComprehensive ? 'Yes' : 'No'}`);

        for (const browserName of this.options.browsers) {
            await this.runBrowserTests(browserName);
        }

        if (this.options.generateReport) {
            await this.generateHtmlReport();
        }

        return this.generateSummary();
    }

    async runBrowserTests(browserName) {
        console.log(`\n🌐 Testing in ${browserName.toUpperCase()}`);
        console.log('=' .repeat(60));

        let browser, browserResults;
        
        try {
            // Launch browser
            browser = await this.launchBrowser(browserName);
            const page = await browser.newPage();

            browserResults = {
                name: browserName,
                pages: {},
                summary: {
                    totalTests: 0,
                    passedTests: 0,
                    failedTests: 0,
                    warnings: 0
                }
            };

            // Run tests for each page
            for (const pageInfo of this.options.pages) {
                const pageResults = await this.runPageTests(page, pageInfo, browserName);
                browserResults.pages[pageInfo.name] = pageResults;
                
                // Update browser summary
                browserResults.summary.totalTests += pageResults.summary?.totalTests || 0;
                browserResults.summary.passedTests += pageResults.summary?.passedTests || 0;
                browserResults.summary.failedTests += pageResults.summary?.failedTests || 0;
                browserResults.summary.warnings += pageResults.summary?.warnings || 0;
            }

            this.results.browsers[browserName] = browserResults;

        } catch (error) {
            console.log(`❌ Browser ${browserName} failed: ${error.message}`);
            this.results.browsers[browserName] = {
                name: browserName,
                error: error.message,
                failed: true
            };
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    async launchBrowser(browserName) {
        const launchOptions = {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };

        switch (browserName) {
            case 'chromium':
                return await chromium.launch(launchOptions);
            case 'firefox':
                return await firefox.launch(launchOptions);
            case 'webkit':
                return await webkit.launch(launchOptions);
            default:
                throw new Error(`Unsupported browser: ${browserName}`);
        }
    }

    async runPageTests(page, pageInfo, browserName) {
        console.log(`\n  📄 Testing ${pageInfo.name} page...`);
        
        const pageResults = {
            name: pageInfo.name,
            url: pageInfo.url,
            browser: browserName,
            tests: {}
        };

        try {
            // Navigate to page
            await page.goto(pageInfo.url);
            await page.waitForLoadState('domcontentloaded');

            // Run comprehensive UI tests
            if (this.options.runComprehensive) {
                console.log('    🎨 Running comprehensive UI tests...');
                const comprehensiveTester = new UIComprehensiveTester(page);
                const comprehensiveResults = await comprehensiveTester.runAllUITests();
                pageResults.tests.comprehensive = comprehensiveResults;
                pageResults.summary = {
                    totalTests: comprehensiveResults.summary.total,
                    passedTests: comprehensiveResults.summary.passed,
                    failedTests: comprehensiveResults.summary.failed,
                    warnings: comprehensiveResults.summary.warnings
                };
            }

            // Run visual regression tests (only for chromium to avoid duplicate baselines)
            if (this.options.runVisualRegression && browserName === 'chromium') {
                console.log('    📸 Running visual regression tests...');
                const visualTester = new VisualRegressionTester(page);
                const visualResults = await visualTester.runVisualTests();
                pageResults.tests.visual = visualResults;
                
                // Add visual test results to summary
                if (pageResults.summary) {
                    pageResults.summary.totalTests += visualResults.totalTests;
                    pageResults.summary.passedTests += visualResults.passedTests;
                    pageResults.summary.failedTests += visualResults.failedTests;
                } else {
                    pageResults.summary = {
                        totalTests: visualResults.totalTests,
                        passedTests: visualResults.passedTests,
                        failedTests: visualResults.failedTests,
                        warnings: 0
                    };
                }
            }

        } catch (error) {
            console.log(`    ❌ Page ${pageInfo.name} failed: ${error.message}`);
            pageResults.error = error.message;
            pageResults.summary = {
                totalTests: 0,
                passedTests: 0,
                failedTests: 1,
                warnings: 0
            };
        }

        return pageResults;
    }

    generateSummary() {
        console.log('\n' + '='.repeat(80));
        console.log('📊 COMPLETE UI TEST SUMMARY');
        console.log('='.repeat(80));

        // Calculate totals
        let totalTests = 0, passedTests = 0, failedTests = 0, warnings = 0;
        const browserSummaries = [];

        Object.values(this.results.browsers).forEach(browser => {
            if (browser.failed) {
                failedTests += 1;
                browserSummaries.push({
                    name: browser.name,
                    status: 'FAILED',
                    error: browser.error
                });
            } else {
                totalTests += browser.summary.totalTests;
                passedTests += browser.summary.passedTests;
                failedTests += browser.summary.failedTests;
                warnings += browser.summary.warnings;
                
                const passRate = browser.summary.totalTests > 0 ? 
                    (browser.summary.passedTests / browser.summary.totalTests * 100).toFixed(1) : 0;
                
                browserSummaries.push({
                    name: browser.name,
                    status: 'COMPLETED',
                    passRate: parseFloat(passRate),
                    tests: browser.summary
                });
            }
        });

        this.results.summary = { totalTests, passedTests, failedTests, warnings };
        const overallPassRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0;

        console.log(`\nOverall Results:`);
        console.log(`Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`⚠️  Warnings: ${warnings}`);
        console.log(`📈 Pass Rate: ${overallPassRate}%`);

        console.log(`\nBrowser Results:`);
        browserSummaries.forEach(browser => {
            if (browser.status === 'FAILED') {
                console.log(`  ❌ ${browser.name}: ${browser.error}`);
            } else {
                console.log(`  ✅ ${browser.name}: ${browser.passRate}% pass rate (${browser.tests.passedTests}/${browser.tests.totalTests})`);
            }
        });

        // Page breakdown
        console.log(`\nPage Breakdown:`);
        this.options.pages.forEach(pageInfo => {
            const pageResults = [];
            Object.values(this.results.browsers).forEach(browser => {
                if (browser.pages && browser.pages[pageInfo.name]) {
                    const page = browser.pages[pageInfo.name];
                    const pagePassRate = page.summary ? 
                        (page.summary.passedTests / page.summary.totalTests * 100).toFixed(1) : 0;
                    pageResults.push(`${browser.name}: ${pagePassRate}%`);
                }
            });
            console.log(`  📄 ${pageInfo.name}: ${pageResults.join(', ')}`);
        });

        // Quality assessment
        console.log('\n💡 Quality Assessment:');
        if (overallPassRate >= 95) {
            console.log('  🌟 Excellent UI quality! Production ready.');
        } else if (overallPassRate >= 85) {
            console.log('  👍 Good UI quality. Minor issues to address.');
        } else if (overallPassRate >= 70) {
            console.log('  ⚠️  UI needs improvement. Several issues found.');
        } else {
            console.log('  🚨 Significant UI issues. Major fixes required.');
        }

        this.results.endTime = new Date();
        this.results.duration = this.results.endTime - this.results.startTime;
        this.results.overallPassRate = parseFloat(overallPassRate);

        return this.results;
    }

    async generateHtmlReport() {
        console.log('\n📄 Generating HTML report...');
        
        const reportDir = path.join(process.cwd(), 'tests', 'ui', 'reports');
        try {
            await fs.mkdir(reportDir, { recursive: true });
        } catch {}

        const reportPath = path.join(reportDir, `ui-test-report-${Date.now()}.html`);
        const htmlContent = this.generateHtmlContent();
        
        await fs.writeFile(reportPath, htmlContent);
        console.log(`  📄 Report saved: ${reportPath}`);
        
        return reportPath;
    }

    generateHtmlContent() {
        const timestamp = new Date().toLocaleString();
        const duration = this.results.duration ? (this.results.duration / 1000).toFixed(1) : 'N/A';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Test Report - ${timestamp}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0 0 10px 0; font-size: 2.5em; }
        .header p { margin: 0; opacity: 0.9; font-size: 1.1em; }
        .content { padding: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .metric h3 { margin: 0 0 10px 0; color: #495057; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .metric .value { font-size: 2.5em; font-weight: bold; color: #007bff; margin: 0; }
        .pass { border-color: #28a745; } .pass .value { color: #28a745; }
        .fail { border-color: #dc3545; } .fail .value { color: #dc3545; }
        .warn { border-color: #ffc107; } .warn .value { color: #ffc107; }
        .browser-results { margin: 30px 0; }
        .browser { margin-bottom: 30px; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
        .browser-header { background: #e9ecef; padding: 15px 20px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .browser-content { padding: 20px; }
        .page-results { margin-bottom: 20px; }
        .page-header { font-weight: bold; color: #495057; margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        .test-category { margin: 15px 0; }
        .test-category h4 { margin: 0 0 10px 0; color: #6c757d; font-size: 1em; }
        .test-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; }
        .test-item { padding: 8px 12px; border-radius: 4px; font-size: 0.9em; display: flex; justify-content: space-between; }
        .test-pass { background: #d4edda; color: #155724; }
        .test-fail { background: #f8d7da; color: #721c24; }
        .footer { text-align: center; padding: 20px; color: #6c757d; border-top: 1px solid #dee2e6; margin-top: 30px; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .badge-success { background: #28a745; color: white; }
        .badge-danger { background: #dc3545; color: white; }
        .badge-warning { background: #ffc107; color: #212529; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 UI Test Report</h1>
            <p>Generated on ${timestamp} • Duration: ${duration}s</p>
        </div>
        
        <div class="content">
            <div class="summary">
                <div class="metric">
                    <h3>Total Tests</h3>
                    <div class="value">${this.results.summary.totalTests}</div>
                </div>
                <div class="metric pass">
                    <h3>Passed</h3>
                    <div class="value">${this.results.summary.passedTests}</div>
                </div>
                <div class="metric fail">
                    <h3>Failed</h3>
                    <div class="value">${this.results.summary.failedTests}</div>
                </div>
                <div class="metric warn">
                    <h3>Warnings</h3>
                    <div class="value">${this.results.summary.warnings}</div>
                </div>
                <div class="metric">
                    <h3>Pass Rate</h3>
                    <div class="value">${this.results.overallPassRate}%</div>
                </div>
            </div>

            <div class="browser-results">
                <h2>Browser Results</h2>
                ${Object.values(this.results.browsers).map(browser => this.generateBrowserHtml(browser)).join('')}
            </div>
        </div>
        
        <div class="footer">
            <p>Generated by UI Test Runner • ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>`;
    }

    generateBrowserHtml(browser) {
        if (browser.failed) {
            return `
                <div class="browser">
                    <div class="browser-header">
                        🌐 ${browser.name.toUpperCase()}
                        <span class="status-badge badge-danger">FAILED</span>
                    </div>
                    <div class="browser-content">
                        <p><strong>Error:</strong> ${browser.error}</p>
                    </div>
                </div>
            `;
        }

        const passRate = browser.summary.totalTests > 0 ? 
            (browser.summary.passedTests / browser.summary.totalTests * 100).toFixed(1) : 0;
        
        const statusClass = passRate >= 90 ? 'badge-success' : passRate >= 75 ? 'badge-warning' : 'badge-danger';
        
        return `
            <div class="browser">
                <div class="browser-header">
                    🌐 ${browser.name.toUpperCase()}
                    <span class="status-badge ${statusClass}">${passRate}% PASS</span>
                </div>
                <div class="browser-content">
                    ${Object.values(browser.pages).map(page => this.generatePageHtml(page)).join('')}
                </div>
            </div>
        `;
    }

    generatePageHtml(page) {
        if (page.error) {
            return `
                <div class="page-results">
                    <div class="page-header">📄 ${page.name} - ERROR</div>
                    <p>${page.error}</p>
                </div>
            `;
        }

        return `
            <div class="page-results">
                <div class="page-header">
                    📄 ${page.name} 
                    (${page.summary.passedTests}/${page.summary.totalTests} passed)
                </div>
                ${page.tests.comprehensive ? this.generateTestCategoryHtml('Comprehensive Tests', page.tests.comprehensive) : ''}
                ${page.tests.visual ? this.generateTestCategoryHtml('Visual Tests', page.tests.visual) : ''}
            </div>
        `;
    }

    generateTestCategoryHtml(categoryName, testResults) {
        if (testResults.categories) {
            // Comprehensive test results
            return `
                <div class="test-category">
                    <h4>${categoryName}</h4>
                    <div class="test-grid">
                        ${Object.entries(testResults.categories).map(([category, stats]) => `
                            <div class="test-item ${stats.pass === stats.total ? 'test-pass' : 'test-fail'}">
                                <span>${category}</span>
                                <span>${stats.pass}/${stats.total}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (testResults.results) {
            // Visual test results
            return `
                <div class="test-category">
                    <h4>${categoryName}</h4>
                    <div class="test-grid">
                        ${testResults.results.slice(0, 10).map(result => `
                            <div class="test-item ${result.passed ? 'test-pass' : 'test-fail'}">
                                <span>${result.name}</span>
                                <span>${result.passed ? 'PASS' : 'FAIL'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        return '';
    }
}

module.exports = { UITestRunner };

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        runVisualRegression: !args.includes('--no-visual'),
        runComprehensive: !args.includes('--no-comprehensive'),
        generateReport: !args.includes('--no-report'),
        browsers: args.includes('--all-browsers') ? ['chromium', 'firefox', 'webkit'] : ['chromium']
    };

    (async () => {
        const runner = new UITestRunner(options);
        const results = await runner.runAllTests();
        
        console.log('\n🎉 Complete UI Testing Finished!');
        console.log(`📊 Overall Pass Rate: ${results.overallPassRate}%`);
        
        process.exit(results.summary.failedTests > 0 ? 1 : 0);
    })().catch(console.error);
}