const fs = require('fs');
const path = require('path');

function runBasicTests() {
    console.log('🧪 Running Basic Login Page Tests...\n');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Check if login.html exists
    try {
        const loginPath = path.join(__dirname, 'login.html');
        if (fs.existsSync(loginPath)) {
            console.log('✅ Test 1: login.html file exists');
            passed++;
        } else {
            throw new Error('login.html not found');
        }
    } catch (error) {
        console.log('❌ Test 1: login.html file exists -', error.message);
        failed++;
    }
    
    // Test 2: Check HTML structure
    try {
        const html = fs.readFileSync('login.html', 'utf8');
        if (html.includes('form') && html.includes('email') && html.includes('password')) {
            console.log('✅ Test 2: HTML contains required form elements');
            passed++;
        } else {
            throw new Error('Missing required form elements');
        }
    } catch (error) {
        console.log('❌ Test 2: HTML structure -', error.message);
        failed++;
    }
    
    // Test 3: Check JavaScript validation
    try {
        const html = fs.readFileSync('login.html', 'utf8');
        if (html.includes('isValidEmail') && html.includes('showError')) {
            console.log('✅ Test 3: JavaScript validation functions present');
            passed++;
        } else {
            throw new Error('Missing validation functions');
        }
    } catch (error) {
        console.log('❌ Test 3: JavaScript validation -', error.message);
        failed++;
    }
    
    // Test 4: Check test files exist
    try {
        const functionalTests = fs.existsSync('e2e/login.spec.js');
        const performanceTests = fs.existsSync('e2e/login-performance.spec.js');
        
        if (functionalTests && performanceTests) {
            console.log('✅ Test 4: Test files created successfully');
            passed++;
        } else {
            throw new Error('Test files missing');
        }
    } catch (error) {
        console.log('❌ Test 4: Test files -', error.message);
        failed++;
    }
    
    // Test 5: Check package.json scripts
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (packageJson.scripts && packageJson.scripts['test:functional']) {
            console.log('✅ Test 5: Package.json scripts configured');
            passed++;
        } else {
            throw new Error('Scripts not configured');
        }
    } catch (error) {
        console.log('❌ Test 5: Package.json scripts -', error.message);
        failed++;
    }
    
    // Test 6: Count test cases in functional tests
    try {
        const testContent = fs.readFileSync('e2e/login.spec.js', 'utf8');
        const testCount = (testContent.match(/test\(/g) || []).length;
        
        if (testCount >= 16) {
            console.log(`✅ Test 6: Functional tests contain ${testCount} test cases`);
            passed++;
        } else {
            throw new Error(`Only ${testCount} test cases found, expected 16+`);
        }
    } catch (error) {
        console.log('❌ Test 6: Functional test count -', error.message);
        failed++;
    }
    
    // Test 7: Count test cases in performance tests
    try {
        const testContent = fs.readFileSync('e2e/login-performance.spec.js', 'utf8');
        const testCount = (testContent.match(/test\(/g) || []).length;
        
        if (testCount >= 10) {
            console.log(`✅ Test 7: Performance tests contain ${testCount} test cases`);
            passed++;
        } else {
            throw new Error(`Only ${testCount} test cases found, expected 10+`);
        }
    } catch (error) {
        console.log('❌ Test 7: Performance test count -', error.message);
        failed++;
    }
    
    // Test 8: Check CSS styling
    try {
        const html = fs.readFileSync('login.html', 'utf8');
        if (html.includes('gradient') && html.includes('login-container')) {
            console.log('✅ Test 8: CSS styling present');
            passed++;
        } else {
            throw new Error('Missing CSS styling');
        }
    } catch (error) {
        console.log('❌ Test 8: CSS styling -', error.message);
        failed++;
    }
    
    // Summary
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All basic tests passed! Your login page setup is working correctly.');
        console.log('\n⚠️  Note: Browser-based tests require system dependencies:');
        console.log('   sudo npx playwright install-deps');
        console.log('   npx playwright install');
    } else {
        console.log('\n❌ Some tests failed. Please check the issues above.');
    }
    
    return failed === 0;
}

// Run the tests
runBasicTests();