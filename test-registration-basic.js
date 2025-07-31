// Basic manual test script for registration functionality
// This tests the core validation logic without browser dependencies

// Mock DOM elements for testing
const mockDOM = {
    elements: {},
    getElementById: function(id) {
        if (!this.elements[id]) {
            this.elements[id] = {
                value: '',
                textContent: '',
                style: { display: 'none' },
                classList: {
                    items: [],
                    add: function(cls) { if (!this.items.includes(cls)) this.items.push(cls); },
                    remove: function(cls) { this.items = this.items.filter(c => c !== cls); }
                }
            };
        }
        return this.elements[id];
    }
};

// Mock document
global.document = mockDOM;

// Test validation functions (extracted from register.html)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^a-zA-Z0-9]/.test(password);
}

function getPasswordStrength(password) {
    if (password.length === 0) {
        return { text: '', class: '' };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score < 3) {
        return { text: 'Weak password', class: 'strength-weak' };
    } else if (score < 5) {
        return { text: 'Medium strength', class: 'strength-medium' };
    } else {
        return { text: 'Strong password', class: 'strength-strong' };
    }
}

// Test cases
console.log('🧪 Running Registration Form Tests...\n');

// Email validation tests
console.log('📧 Email Validation Tests:');
console.log('✓ Valid email (test@example.com):', isValidEmail('test@example.com'));
console.log('✗ Invalid email (invalid):', !isValidEmail('invalid'));
console.log('✗ Invalid email (@example.com):', !isValidEmail('@example.com'));
console.log('✗ Invalid email (test@):', !isValidEmail('test@'));

// Password strength tests
console.log('\n🔐 Password Strength Tests:');
console.log('✗ Weak password (123):', getPasswordStrength('123').text === 'Weak password');
console.log('✗ Weak password (password):', getPasswordStrength('password').text === 'Weak password');
console.log('⚠️  Medium password (Password1):', getPasswordStrength('Password1').text === 'Medium strength');
console.log('✓ Strong password (Password1!):', getPasswordStrength('Password1!').text === 'Strong password');

// Strong password validation tests
console.log('\n🛡️  Strong Password Validation Tests:');
console.log('✗ Too short (Pass1!):', !isStrongPassword('Pass1!'));
console.log('✗ No uppercase (password1!):', !isStrongPassword('password1!'));
console.log('✗ No lowercase (PASSWORD1!):', !isStrongPassword('PASSWORD1!'));
console.log('✗ No number (Password!):', !isStrongPassword('Password!'));
console.log('✗ No special char (Password1):', !isStrongPassword('Password1'));
console.log('✓ Strong password (Password1!):', isStrongPassword('Password1!'));

// Form validation scenarios
console.log('\n📋 Form Validation Scenarios:');

const testScenarios = [
    {
        name: 'Empty form',
        data: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
        shouldPass: false
    },
    {
        name: 'Valid registration',
        data: { 
            firstName: 'John', 
            lastName: 'Doe', 
            email: 'john@example.com', 
            password: 'StrongPass1!', 
            confirmPassword: 'StrongPass1!' 
        },
        shouldPass: true
    },
    {
        name: 'Password mismatch',
        data: { 
            firstName: 'John', 
            lastName: 'Doe', 
            email: 'john@example.com', 
            password: 'StrongPass1!', 
            confirmPassword: 'DifferentPass1!' 
        },
        shouldPass: false
    },
    {
        name: 'Weak password',
        data: { 
            firstName: 'John', 
            lastName: 'Doe', 
            email: 'john@example.com', 
            password: 'weak', 
            confirmPassword: 'weak' 
        },
        shouldPass: false
    }
];

testScenarios.forEach(scenario => {
    const { firstName, lastName, email, password, confirmPassword } = scenario.data;
    
    let valid = true;
    let errors = [];
    
    if (!firstName || firstName.length < 2) {
        valid = false;
        errors.push('First name invalid');
    }
    
    if (!lastName || lastName.length < 2) {
        valid = false;
        errors.push('Last name invalid');
    }
    
    if (!email || !isValidEmail(email)) {
        valid = false;
        errors.push('Email invalid');
    }
    
    if (!password || !isStrongPassword(password)) {
        valid = false;
        errors.push('Password not strong enough');
    }
    
    if (password !== confirmPassword) {
        valid = false;
        errors.push('Passwords do not match');
    }
    
    const result = valid === scenario.shouldPass ? '✓' : '✗';
    console.log(`${result} ${scenario.name}: ${valid ? 'PASS' : 'FAIL'}`);
    if (errors.length > 0) {
        console.log(`   Errors: ${errors.join(', ')}`);
    }
});

console.log('\n🎉 Registration form validation tests completed!');
console.log('\nThe registration page includes:');
console.log('• Real-time field validation');
console.log('• Password strength indicator');
console.log('• Email format validation');
console.log('• Password confirmation matching');
console.log('• Terms of service acceptance');
console.log('• Responsive design matching login page');
console.log('• Navigation between login and registration pages');