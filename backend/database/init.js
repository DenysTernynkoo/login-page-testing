const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'users.db');

function initDatabase() {
  return new Promise((resolve, reject) => {
    console.log('📂 Database path:', dbPath);
    
    // Create database directory if it doesn't exist
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
    });

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        isActive INTEGER DEFAULT 1,
        lastLogin DATETIME,
        loginAttempts INTEGER DEFAULT 0,
        lockedUntil DATETIME
      )
    `;

    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('❌ Error creating users table:', err);
        reject(err);
        return;
      }
      console.log('✅ Users table created/verified');
    });

    // Create sessions table for JWT blacklisting (optional)
    const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        token TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `;

    db.run(createSessionsTable, (err) => {
      if (err) {
        console.error('❌ Error creating sessions table:', err);
        reject(err);
        return;
      }
      console.log('✅ Sessions table created/verified');
    });

    // Create indexes for better performance after tables are created
    db.serialize(() => {
      const createIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_users_active ON users(isActive)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expiresAt)'
      ];

      let indexesCreated = 0;
      createIndexes.forEach(indexQuery => {
        db.run(indexQuery, (err) => {
          if (err) {
            console.error('❌ Error creating index:', err);
            reject(err);
            return;
          }
          indexesCreated++;
          if (indexesCreated === createIndexes.length) {
            console.log('✅ Database indexes created/verified');
            
            db.close((err) => {
              if (err) {
                console.error('❌ Error closing database:', err);
                reject(err);
              } else {
                console.log('✅ Database initialization complete');
                resolve();
              }
            });
          }
        });
      });
    });
  });
}

// Export for use in server.js
module.exports = initDatabase;

// Run directly if called from command line
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error);
      process.exit(1);
    });
}