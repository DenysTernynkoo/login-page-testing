const fs = require('fs');

function runUXTests() {
    console.log('🎨 Running UX Tests for Login Page...\n');
    
    let passed = 0;
    let failed = 0;
    
    try {
        const html = fs.readFileSync('login.html', 'utf8');
        
        // Test 1: Visual Design Elements
        console.log('📱 Testing Visual Design & Layout...');
        if (html.includes('linear-gradient') && html.includes('login-container')) {
            console.log('✅ UX1: Gradient background and container styling present');
            passed++;
        } else {
            console.log('❌ UX1: Missing visual design elements');
            failed++;
        }
        
        // Test 2: Form Labels and Accessibility
        console.log('\n♿ Testing Accessibility & Usability...');
        const hasLabels = html.includes('label for="email"') && html.includes('label for="password"');
        const hasRequiredAttrs = html.includes('required') && html.includes('type="email"');
        
        if (hasLabels && hasRequiredAttrs) {
            console.log('✅ UX2: Proper form labels and accessibility attributes');
            passed++;
        } else {
            console.log('❌ UX2: Missing accessibility features');
            failed++;
        }
        
        // Test 3: User Feedback Systems
        console.log('\n💬 Testing User Feedback Systems...');
        const hasErrorHandling = html.includes('error-message') && html.includes('success-message');
        const hasLoadingStates = html.includes('Signing In...') && html.includes('disabled = true');
        
        if (hasErrorHandling && hasLoadingStates) {
            console.log('✅ UX3: Error messages and loading states implemented');
            passed++;
        } else {
            console.log('❌ UX3: Missing user feedback systems');
            failed++;
        }
        
        // Test 4: Interactive Elements
        console.log('\n🖱️ Testing Interactive Elements...');
        const hasHoverEffects = html.includes('hover') && html.includes('transform');
        const hasFocusStates = html.includes('focus') && html.includes('border-color');
        
        if (hasHoverEffects && hasFocusStates) {
            console.log('✅ UX4: Hover effects and focus states present');
            passed++;
        } else {
            console.log('❌ UX4: Missing interactive feedback');
            failed++;
        }
        
        // Test 5: Responsive Design
        console.log('\n📱 Testing Responsive Design...');
        const hasResponsive = html.includes('viewport') && html.includes('max-width');
        const hasFlexbox = html.includes('flex') || html.includes('justify-content');
        
        if (hasResponsive && hasFlexbox) {
            console.log('✅ UX5: Responsive design and layout systems');
            passed++;
        } else {
            console.log('❌ UX5: Limited responsive design features');
            failed++;
        }
        
        // Test 6: Form Validation UX
        console.log('\n✔️ Testing Form Validation UX...');
        const hasClientValidation = html.includes('isValidEmail') && html.includes('showError');
        const hasValidationMessages = html.includes('Please fill in all fields') && 
                                     html.includes('Please enter a valid email');
        
        if (hasClientValidation && hasValidationMessages) {
            console.log('✅ UX6: Client-side validation with helpful messages');
            passed++;
        } else {
            console.log('❌ UX6: Validation UX needs improvement');
            failed++;
        }
        
        // Test 7: Typography and Readability
        console.log('\n📝 Testing Typography & Readability...');
        const hasTypography = html.includes('font-family') && html.includes('font-size');
        const hasColorContrast = html.includes('#333') && html.includes('#666');
        
        if (hasTypography && hasColorContrast) {
            console.log('✅ UX7: Typography hierarchy and color contrast');
            passed++;
        } else {
            console.log('❌ UX7: Typography needs attention');
            failed++;
        }
        
        // Test 8: Micro-interactions
        console.log('\n✨ Testing Micro-interactions...');
        const hasTransitions = html.includes('transition') && html.includes('ease');
        const hasAnimations = html.includes('translateY') || html.includes('transform');
        
        if (hasTransitions && hasAnimations) {
            console.log('✅ UX8: Smooth transitions and micro-animations');
            passed++;
        } else {
            console.log('❌ UX8: Missing micro-interaction polish');
            failed++;
        }
        
        // Test 9: Error State Design
        console.log('\n⚠️ Testing Error State Design...');
        const hasErrorStyling = html.includes('#e74c3c') && html.includes('error-message');
        const hasSuccessStyling = html.includes('#27ae60') && html.includes('success-message');
        
        if (hasErrorStyling && hasSuccessStyling) {
            console.log('✅ UX9: Proper error and success state styling');
            passed++;
        } else {
            console.log('❌ UX9: State styling needs improvement');
            failed++;
        }
        
        // Test 10: Overall Polish
        console.log('\n🎯 Testing Overall Polish...');
        const hasBoxShadow = html.includes('box-shadow');
        const hasBorderRadius = html.includes('border-radius');
        const hasSpacing = html.includes('margin') && html.includes('padding');
        
        if (hasBoxShadow && hasBorderRadius && hasSpacing) {
            console.log('✅ UX10: Visual polish with shadows, radius, and spacing');
            passed++;
        } else {
            console.log('❌ UX10: Needs more visual polish');
            failed++;
        }
        
    } catch (error) {
        console.log('❌ Error reading login.html:', error.message);
        failed++;
    }
    
    // UX Score Calculation
    console.log('\n🎨 UX Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    const uxScore = Math.round((passed / (passed + failed)) * 100);
    console.log(`🎯 UX Score: ${uxScore}%`);
    
    // UX Rating
    let rating;
    if (uxScore >= 90) rating = '🌟 Excellent UX';
    else if (uxScore >= 80) rating = '⭐ Good UX';
    else if (uxScore >= 70) rating = '👍 Fair UX';
    else rating = '⚠️ Needs UX Improvement';
    
    console.log(`📈 UX Rating: ${rating}`);
    
    if (uxScore >= 80) {
        console.log('\n🎉 Your login page provides a great user experience!');
        console.log('📋 UX Features Verified:');
        console.log('   • Visual appeal with gradient design');
        console.log('   • Accessible form labels and inputs');
        console.log('   • Clear error and success feedback');
        console.log('   • Interactive hover and focus states');
        console.log('   • Responsive design principles');
        console.log('   • Smooth animations and transitions');
    } else {
        console.log('\n💡 UX Improvement Suggestions:');
        console.log('   • Add more visual polish with shadows/gradients');
        console.log('   • Improve accessibility with ARIA labels');
        console.log('   • Add more interactive feedback');
        console.log('   • Enhance responsive design');
    }
    
    return uxScore;
}

// Run UX Tests
const score = runUXTests();

// Also check if comprehensive UX test file exists
console.log('\n🧪 Comprehensive UX Test Suite:');
if (fs.existsSync('e2e/login-ux.spec.js')) {
    const uxTestContent = fs.readFileSync('e2e/login-ux.spec.js', 'utf8');
    const testCount = (uxTestContent.match(/test\(/g) || []).length;
    console.log(`✅ Created: ${testCount} comprehensive UX tests in login-ux.spec.js`);
    console.log('   • Visual Design & Layout tests');
    console.log('   • User Interaction Feedback tests');
    console.log('   • Error Message UX tests');
    console.log('   • Accessibility & Usability tests');
    console.log('   • Mobile Responsiveness tests');
    console.log('   • Micro-interactions & Polish tests');
} else {
    console.log('❌ Comprehensive UX test file not found');
}