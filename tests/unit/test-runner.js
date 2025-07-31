const fs = require('fs');
const path = require('path');

// Simple test runner that validates the HTML structure
function runBasicTests() {
    const loginHtmlPath = path.join(__dirname, 'src/pages/login.html');
    
    if (!fs.existsSync(loginHtmlPath)) {
        console.log('❌ Test Failed: login.html file not found');
        return false;
    }
    
    const htmlContent = fs.readFileSync(loginHtmlPath, 'utf8');
    
    const tests = [
        {
            name: 'HTML file contains form element',
            test: () => htmlContent.includes('<form id="loginForm">'),
        },
        {
            name: 'HTML file contains email input',
            test: () => htmlContent.includes('type="email"') && htmlContent.includes('id="email"'),
        },
        {
            name: 'HTML file contains password input',
            test: () => htmlContent.includes('type="password"') && htmlContent.includes('id="password"'),
        },
        {
            name: 'HTML file contains submit button',
            test: () => htmlContent.includes('type="submit"'),
        },
        {
            name: 'HTML file contains error message element',
            test: () => htmlContent.includes('id="errorMessage"'),
        },
        {
            name: 'HTML file contains success message element',
            test: () => htmlContent.includes('id="successMessage"'),
        },
        {
            name: 'HTML file contains forgot password link',
            test: () => htmlContent.includes('Forgot your password?'),
        },
        {
            name: 'HTML file contains form validation JavaScript',
            test: () => htmlContent.includes('isValidEmail') && htmlContent.includes('addEventListener'),
        },
        {
            name: 'HTML file contains CSS styling',
            test: () => htmlContent.includes('<style>') && htmlContent.includes('login-container'),
        },
        {
            name: 'HTML file has proper page title',
            test: () => htmlContent.includes('<title>Login Page</title>'),
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    console.log('\n🧪 Running Basic HTML Structure Tests...\n');
    
    tests.forEach((testCase, index) => {
        try {
            const result = testCase.test();
            if (result) {
                console.log(`✅ Test ${index + 1}: ${testCase.name}`);
                passed++;
            } else {
                console.log(`❌ Test ${index + 1}: ${testCase.name}`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ Test ${index + 1}: ${testCase.name} - Error: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! Your login page structure is correct.');
        return true;
    } else {
        console.log('\n⚠️  Some tests failed. Please check your HTML structure.');
        return false;
    }
}

// Run the tests
runBasicTests();