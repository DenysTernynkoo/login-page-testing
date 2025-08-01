const User = require('./models/User');

async function testLogin() {
  try {
    console.log('🔍 Testing user login...');
    
    // Test finding user by email
    const user = await User.findByEmail('demo@example.com');
    console.log('User found:', user ? user.toJSON() : 'Not found');
    
    if (user) {
      console.log('Stored password hash:', user.password ? user.password.substring(0, 20) + '...' : 'null');
      
      // Test password verification
      try {
        const isValid = await User.verifyPassword('DemoPass123!', user.password);
        console.log('Password valid:', isValid);
      } catch (pwError) {
        console.error('Password verification error:', pwError.message);
        
        // Try direct bcrypt verification
        const bcrypt = require('bcryptjs');
        try {
          const directTest = await bcrypt.compare('DemoPass123!', user.password);
          console.log('Direct bcrypt test:', directTest);
        } catch (bcryptError) {
          console.error('Direct bcrypt error:', bcryptError.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLogin();