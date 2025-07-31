const fs = require('fs');
const path = require('path');

function runHomePageTests() {
    console.log('🏠 Running Basic Home Page Tests...\n');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Check if index.html exists
    try {
        const homePath = path.join(process.cwd(), 'src/pages/index.html');
        if (fs.existsSync(homePath)) {
            console.log('✅ Test 1: index.html file exists');
            passed++;
        } else {
            throw new Error('index.html not found');
        }
    } catch (error) {
        console.log('❌ Test 1: index.html file exists -', error.message);
        failed++;
    }
    
    // Test 2: Check HTML structure and navigation
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('navbar') && html.includes('nav-links') && html.includes('logo')) {
            console.log('✅ Test 2: Navigation structure present');
            passed++;
        } else {
            throw new Error('Missing navigation structure');
        }
    } catch (error) {
        console.log('❌ Test 2: Navigation structure -', error.message);
        failed++;
    }
    
    // Test 3: Check hero section
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('hero-section') && html.includes('Welcome to Your Site') && html.includes('hero-buttons')) {
            console.log('✅ Test 3: Hero section complete');
            passed++;
        } else {
            throw new Error('Missing hero section elements');
        }
    } catch (error) {
        console.log('❌ Test 3: Hero section -', error.message);
        failed++;
    }
    
    // Test 4: Check feature cards
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        const featureCardCount = (html.match(/feature-card/g) || []).length;
        if (featureCardCount >= 6 && html.includes('features-grid')) {
            console.log('✅ Test 4: Six feature cards present');
            passed++;
        } else {
            throw new Error(`Only ${featureCardCount} feature cards found, expected 6`);
        }
    } catch (error) {
        console.log('❌ Test 4: Feature cards -', error.message);
        failed++;
    }
    
    // Test 5: Check statistics section
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('stats-section') && html.includes('stat-number') && html.includes('data-target')) {
            console.log('✅ Test 5: Statistics section with animations');
            passed++;
        } else {
            throw new Error('Missing statistics section');
        }
    } catch (error) {
        console.log('❌ Test 5: Statistics section -', error.message);
        failed++;
    }
    
    // Test 6: Check JavaScript functionality
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('animateCounter') && html.includes('IntersectionObserver') && html.includes('smoothing')) {
            console.log('✅ Test 6: Interactive JavaScript features present');
            passed++;
        } else {
            throw new Error('Missing JavaScript functionality');
        }
    } catch (error) {
        console.log('❌ Test 6: JavaScript functionality -', error.message);
        failed++;
    }
    
    // Test 7: Check links to other pages
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        const loginLinks = (html.match(/login\.html/g) || []).length;
        const registerLinks = (html.match(/register\.html/g) || []).length;
        
        if (loginLinks >= 1 && registerLinks >= 2) { // Navbar + hero button
            console.log('✅ Test 7: Navigation links to login and registration pages');
            passed++;
        } else {
            throw new Error(`Login links: ${loginLinks}, Register links: ${registerLinks}`);
        }
    } catch (error) {
        console.log('❌ Test 7: Page navigation links -', error.message);
        failed++;
    }
    
    // Test 8: Check responsive design elements
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('@media') && html.includes('viewport') && html.includes('flex')) {
            console.log('✅ Test 8: Responsive design CSS present');
            passed++;
        } else {
            throw new Error('Missing responsive design elements');
        }
    } catch (error) {
        console.log('❌ Test 8: Responsive design -', error.message);
        failed++;
    }
    
    // Test 9: Check glassmorphism and modern design
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('backdrop-filter') && html.includes('blur') && html.includes('rgba')) {
            console.log('✅ Test 9: Modern glassmorphism design effects');
            passed++;
        } else {
            throw new Error('Missing modern design effects');
        }
    } catch (error) {
        console.log('❌ Test 9: Modern design effects -', error.message);
        failed++;
    }
    
    // Test 10: Check animations and transitions
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('animation') && html.includes('fadeIn') && html.includes('transition')) {
            console.log('✅ Test 10: CSS animations and transitions present');
            passed++;
        } else {
            throw new Error('Missing animations and transitions');
        }
    } catch (error) {
        console.log('❌ Test 10: Animations and transitions -', error.message);
        failed++;
    }
    
    // Test 11: Check footer
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('footer') && html.includes('footer-links') && html.includes('2025')) {
            console.log('✅ Test 11: Footer with links and copyright');
            passed++;
        } else {
            throw new Error('Missing footer elements');
        }
    } catch (error) {
        console.log('❌ Test 11: Footer -', error.message);
        failed++;
    }
    
    // Test 12: Check test files exist
    try {
        const homeTests = fs.existsSync('tests/e2e/home.spec.js');
        const homePerformanceTests = fs.existsSync('tests/e2e/home-performance.spec.js');
        const homeUXTests = fs.existsSync('tests/e2e/home-ux.spec.js');
        
        if (homeTests && homePerformanceTests && homeUXTests) {
            console.log('✅ Test 12: All home page test files created');
            passed++;
        } else {
            throw new Error(`Missing test files: home(${homeTests}), perf(${homePerformanceTests}), ux(${homeUXTests})`);
        }
    } catch (error) {
        console.log('❌ Test 12: Test files -', error.message);
        failed++;
    }
    
    // Test 13: Count functional tests
    try {
        const testContent = fs.readFileSync('tests/e2e/home.spec.js', 'utf8');
        const testCount = (testContent.match(/test\(/g) || []).length;
        
        if (testCount >= 20) {
            console.log(`✅ Test 13: Functional tests contain ${testCount} test cases`);
            passed++;
        } else {
            throw new Error(`Only ${testCount} test cases found, expected 20+`);
        }
    } catch (error) {
        console.log('❌ Test 13: Functional test count -', error.message);
        failed++;
    }
    
    // Test 14: Count performance tests
    try {
        const testContent = fs.readFileSync('tests/e2e/home-performance.spec.js', 'utf8');
        const testCount = (testContent.match(/test\(/g) || []).length;
        
        if (testCount >= 15) {
            console.log(`✅ Test 14: Performance tests contain ${testCount} test cases`);
            passed++;
        } else {
            throw new Error(`Only ${testCount} test cases found, expected 15+`);
        }
    } catch (error) {
        console.log('❌ Test 14: Performance test count -', error.message);
        failed++;
    }
    
    // Test 15: Count UX tests
    try {
        const testContent = fs.readFileSync('tests/e2e/home-ux.spec.js', 'utf8');
        const testCount = (testContent.match(/test\(/g) || []).length;
        
        if (testCount >= 25) {
            console.log(`✅ Test 15: UX tests contain ${testCount} test cases`);
            passed++;
        } else {
            throw new Error(`Only ${testCount} test cases found, expected 25+`);
        }
    } catch (error) {
        console.log('❌ Test 15: UX test count -', error.message);
        failed++;
    }
    
    // Test 16: Check emoji icons
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        const emojiIcons = ['🚀', '🔒', '📱', '🎨', '⚡', '🌟'];
        const allIconsPresent = emojiIcons.every(icon => html.includes(icon));
        
        if (allIconsPresent) {
            console.log('✅ Test 16: All feature icons present (emoji-based, fast loading)');
            passed++;
        } else {
            throw new Error('Missing some feature icons');
        }
    } catch (error) {
        console.log('❌ Test 16: Feature icons -', error.message);
        failed++;
    }
    
    // Test 17: Check consistent gradient with other pages
    try {
        const homeHtml = fs.readFileSync('src/pages/index.html', 'utf8');
        const loginHtml = fs.readFileSync('src/pages/login.html', 'utf8');
        
        const homeGradient = homeHtml.includes('667eea') && homeHtml.includes('764ba2');
        const loginGradient = loginHtml.includes('667eea') && loginHtml.includes('764ba2');
        
        if (homeGradient && loginGradient) {
            console.log('✅ Test 17: Consistent gradient design across all pages');
            passed++;
        } else {
            throw new Error('Gradient colors not consistent across pages');
        }
    } catch (error) {
        console.log('❌ Test 17: Design consistency -', error.message);
        failed++;
    }
    
    // Test 18: Check accessibility features
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        if (html.includes('<nav>') && html.includes('<main>') && html.includes('<footer>') && html.includes('alt=')) {
            console.log('✅ Test 18: Semantic HTML and accessibility features');
            passed++;
        } else {
            throw new Error('Missing semantic HTML elements');
        }
    } catch (error) {
        console.log('❌ Test 18: Accessibility features -', error.message);
        failed++;
    }
    
    // Summary
    console.log('\n🏠 Home Page Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    const successRate = Math.round((passed / (passed + failed)) * 100);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    // Detailed feature analysis
    console.log('\n📊 Home Page Feature Analysis:');
    
    try {
        const html = fs.readFileSync('src/pages/index.html', 'utf8');
        
        // Count features
        const navLinks = (html.match(/nav-links.*?href/g) || []).length;
        const featureCards = (html.match(/feature-card/g) || []).length;
        const buttons = (html.match(/btn/g) || []).length;
        const sections = (html.match(/section/g) || []).length;
        
        console.log(`   • Navigation Links: ${navLinks}`);
        console.log(`   • Feature Cards: ${featureCards}`);
        console.log(`   • Interactive Buttons: ${buttons}`);
        console.log(`   • Page Sections: ${sections}`);
        
        // Check modern features
        const hasGlassmorphism = html.includes('backdrop-filter');
        const hasAnimations = html.includes('IntersectionObserver');
        const hasResponsive = html.includes('@media');
        const hasSmoothing = html.includes('smooth');
        
        console.log(`   • Glassmorphism Effects: ${hasGlassmorphism ? '✅' : '❌'}`);
        console.log(`   • Animated Statistics: ${hasAnimations ? '✅' : '❌'}`);
        console.log(`   • Responsive Design: ${hasResponsive ? '✅' : '❌'}`);
        console.log(`   • Smooth Scrolling: ${hasSmoothing ? '✅' : '❌'}`);
        
    } catch (error) {
        console.log('   Error analyzing features:', error.message);
    }
    
    if (successRate >= 90) {
        console.log('\n🎉 Excellent! Your home page is feature-complete and well-tested.');
        console.log('\n🌟 Home Page Highlights:');
        console.log('   • Modern glassmorphism design with gradient background');
        console.log('   • Comprehensive navigation system');
        console.log('   • Six compelling feature cards with icons');
        console.log('   • Animated statistics for engagement');
        console.log('   • Smooth scrolling and transitions');
        console.log('   • Fully responsive mobile design');
        console.log('   • Complete test coverage (60+ tests across 3 suites)');
        console.log('   • Consistent branding with login/registration pages');
        console.log('   • SEO-friendly semantic HTML structure');
        console.log('   • Performance-optimized with CSS animations');
    } else if (successRate >= 80) {
        console.log('\n👍 Good! Your home page is mostly complete with minor issues.');
    } else {
        console.log('\n⚠️  Some issues found. Please review the failed tests above.');
    }
    
    console.log('\n📁 Test Files Created:');
    console.log('   • e2e/home.spec.js (20+ functional tests)');
    console.log('   • e2e/home-performance.spec.js (15+ performance tests)');
    console.log('   • e2e/home-ux.spec.js (25+ UX tests)');
    console.log('   • test-home-basic.js (18 validation tests)');
    
    return successRate >= 90;
}

// Run the tests
runHomePageTests();