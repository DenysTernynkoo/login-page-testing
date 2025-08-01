const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/users.db');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.isActive = data.isActive;
    this.lastLogin = data.lastLogin;
    this.loginAttempts = data.loginAttempts;
    this.lockedUntil = data.lockedUntil;
  }

  static getDb() {
    return new sqlite3.Database(dbPath);
  }

  // Create a new user
  static async create(userData) {
    return new Promise((resolve, reject) => {
      const { email, password, firstName, lastName } = userData;
      
      // Hash password
      const saltRounds = 12;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          reject(new Error('Password hashing failed'));
          return;
        }

        const db = User.getDb();
        const query = `
          INSERT INTO users (email, password, firstName, lastName, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        db.run(query, [email, hashedPassword, firstName, lastName], function(err) {
          if (err) {
            db.close();
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
              reject(new Error('Email already exists'));
            } else {
              reject(new Error('Database error: ' + err.message));
            }
            return;
          }

          // Get the created user
          User.findById(this.lastID)
            .then(user => {
              db.close();
              resolve(user);
            })
            .catch(error => {
              db.close();
              reject(error);
            });
        });
      });
    });
  }

  // Find user by email (including password for authentication)
  static async findByEmail(email, includePassword = true) {
    return new Promise((resolve, reject) => {
      const db = User.getDb();
      const query = 'SELECT * FROM users WHERE email = ? AND isActive = 1';

      db.get(query, [email], (err, row) => {
        db.close();
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        if (row) {
          const user = new User(row);
          // Keep password for authentication if requested
          if (includePassword) {
            user.password = row.password;
          }
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Find user by ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const db = User.getDb();
      const query = 'SELECT * FROM users WHERE id = ? AND isActive = 1';

      db.get(query, [id], (err, row) => {
        db.close();
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
        if (err) {
          reject(new Error('Password verification failed'));
          return;
        }
        resolve(result);
      });
    });
  }

  // Update last login
  async updateLastLogin() {
    return new Promise((resolve, reject) => {
      const db = User.getDb();
      const query = `
        UPDATE users 
        SET lastLogin = CURRENT_TIMESTAMP, loginAttempts = 0, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(query, [this.id], (err) => {
        db.close();
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        this.lastLogin = new Date().toISOString();
        this.loginAttempts = 0;
        resolve(this);
      });
    });
  }

  // Increment login attempts
  async incrementLoginAttempts() {
    return new Promise((resolve, reject) => {
      const db = User.getDb();
      const maxAttempts = 5;
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      
      const query = `
        UPDATE users 
        SET loginAttempts = loginAttempts + 1,
            lockedUntil = CASE 
              WHEN loginAttempts + 1 >= ? 
              THEN datetime('now', '+${lockDuration / 1000} seconds')
              ELSE lockedUntil 
            END,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(query, [maxAttempts, this.id], (err) => {
        db.close();
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        this.loginAttempts++;
        if (this.loginAttempts >= maxAttempts) {
          this.lockedUntil = new Date(Date.now() + lockDuration).toISOString();
        }
        resolve(this);
      });
    });
  }

  // Check if account is locked
  isLocked() {
    if (!this.lockedUntil) return false;
    return new Date(this.lockedUntil) > new Date();
  }

  // Get all users (admin function)
  static async findAll(limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      const db = User.getDb();
      const query = `
        SELECT id, email, firstName, lastName, createdAt, lastLogin, isActive 
        FROM users 
        WHERE isActive = 1 
        ORDER BY createdAt DESC 
        LIMIT ? OFFSET ?
      `;

      db.all(query, [limit, offset], (err, rows) => {
        db.close();
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        const users = rows.map(row => new User(row));
        resolve(users);
      });
    });
  }

  // Get user count
  static async count() {
    return new Promise((resolve, reject) => {
      const db = User.getDb();
      const query = 'SELECT COUNT(*) as count FROM users WHERE isActive = 1';

      db.get(query, [], (err, row) => {
        db.close();
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        resolve(row.count);
      });
    });
  }

  // Convert to JSON (excluding sensitive data)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: `${this.firstName} ${this.lastName}`,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
      isActive: this.isActive
    };
  }
}

module.exports = User;