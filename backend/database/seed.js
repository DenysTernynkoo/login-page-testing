const User = require('../models/User');

// Sample users to seed the database
const sampleUsers = [
  {
    email: 'john.doe@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    email: 'jane.smith@example.com', 
    password: 'StrongPass456!',
    firstName: 'Jane',
    lastName: 'Smith'
  },
  {
    email: 'admin@yoursite.com',
    password: 'AdminPass789!',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    email: 'demo@example.com',
    password: 'DemoPass123!',
    firstName: 'Demo',
    lastName: 'User'
  },
  {
    email: 'test.user@example.com',
    password: 'TestPass456!',
    firstName: 'Test',
    lastName: 'User'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const userData of sampleUsers) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      
      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        skipCount++;
        continue;
      }

      // Create new user
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.email} (${user.firstName} ${user.lastName})`);
      successCount++;

    } catch (error) {
      console.error(`❌ Failed to create user ${userData.email}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Seeding Summary:');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`⏭️  Skipped (already exist): ${skipCount} users`);
  console.log(`❌ Failed: ${errorCount} users`);
  console.log(`📝 Total processed: ${sampleUsers.length} users`);

  if (successCount > 0) {
    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Test Credentials:');
    console.log('┌─────────────────────────────┬─────────────────┐');
    console.log('│ Email                       │ Password        │');
    console.log('├─────────────────────────────┼─────────────────┤');
    sampleUsers.forEach(user => {
      console.log(`│ ${user.email.padEnd(27)} │ ${user.password.padEnd(15)} │`);
    });
    console.log('└─────────────────────────────┴─────────────────┘');
    
    console.log('\n🔗 Try logging in at: http://localhost:3001/login');
  }

  // Get user count
  try {
    const totalUsers = await User.count();
    console.log(`\n👥 Total users in database: ${totalUsers}`);
  } catch (error) {
    console.error('Failed to get user count:', error.message);
  }
}

// Additional function to create a single test user
async function createTestUser(email, password, firstName, lastName) {
  try {
    const userData = { email, password, firstName, lastName };
    
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log(`⏭️  User ${email} already exists`);
      return existingUser;
    }

    // Create user
    const user = await User.create(userData);
    console.log(`✅ Test user created: ${email}`);
    return user;

  } catch (error) {
    console.error(`❌ Failed to create test user:`, error.message);
    throw error;
  }
}

// Function to list all users
async function listAllUsers() {
  try {
    console.log('👥 Fetching all users...\n');
    
    const users = await User.findAll(100, 0);
    const totalUsers = await User.count();

    if (users.length === 0) {
      console.log('📭 No users found in the database');
      return;
    }

    console.log(`📊 Found ${totalUsers} users:`);
    console.log('┌────┬─────────────────────────────┬─────────────────────┬─────────────────────┐');
    console.log('│ ID │ Email                       │ Name                │ Created At          │');
    console.log('├────┼─────────────────────────────┼─────────────────────┼─────────────────────┤');
    
    users.forEach(user => {
      const id = user.id.toString().padEnd(2);
      const email = user.email.padEnd(27);
      const name = `${user.firstName} ${user.lastName}`.padEnd(19);
      const createdAt = new Date(user.createdAt).toLocaleString().padEnd(19);
      console.log(`│ ${id} │ ${email} │ ${name} │ ${createdAt} │`);
    });
    
    console.log('└────┴─────────────────────────────┴─────────────────────┴─────────────────────┘');

  } catch (error) {
    console.error('❌ Failed to list users:', error.message);
  }
}

// Export functions
module.exports = {
  seedDatabase,
  createTestUser,
  listAllUsers
};

// Run seeding if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'list':
      listAllUsers()
        .then(() => process.exit(0))
        .catch(error => {
          console.error('List failed:', error);
          process.exit(1);
        });
      break;
      
    case 'user':
      // Create single user: node seed.js user email@example.com Password123! First Last
      const [, , , email, password, firstName, lastName] = process.argv;
      if (!email || !password || !firstName || !lastName) {
        console.error('❌ Usage: node seed.js user <email> <password> <firstName> <lastName>');
        process.exit(1);
      }
      createTestUser(email, password, firstName, lastName)
        .then(() => process.exit(0))
        .catch(error => {
          console.error('User creation failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      // Default: seed database
      seedDatabase()
        .then(() => process.exit(0))
        .catch(error => {
          console.error('Seeding failed:', error);
          process.exit(1);
        });
  }
}