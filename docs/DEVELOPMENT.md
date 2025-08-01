# Development Workflow

## Project Structure

```
yoursite-web-app/
├── backend/                 # Express.js backend server
│   ├── database/           # SQLite database files and initialization
│   ├── models/             # Database models (User.js)
│   ├── routes/             # API route handlers (auth.js, users.js)
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── src/
│   └── pages/              # Frontend HTML pages
│       ├── index.html      # Home page with authentication
│       ├── login.html      # Login page
│       └── register.html   # Registration page
├── tests/                  # Test suites
│   ├── e2e/               # End-to-end tests (Playwright)
│   └── unit/              # Unit tests
├── config/                 # Configuration files
└── docs/                  # Documentation
```

## Getting Started

### Initial Setup

1. **Install all dependencies:**
   ```bash
   npm run setup
   ```
   This will:
   - Install root dependencies
   - Install backend dependencies
   - Initialize the SQLite database

2. **Alternative manual setup:**
   ```bash
   npm install                 # Install frontend dependencies
   npm run backend:install     # Install backend dependencies
   npm run backend:init-db     # Initialize database
   ```

### Development

#### Run Full Stack Development

Start both frontend and backend simultaneously:
```bash
npm run dev
```

This runs:
- Backend server on `http://localhost:3001`
- Frontend server on `http://localhost:3000`

#### Run Services Separately

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### API Endpoints

The backend provides these API endpoints:

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

#### User Management
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `GET /api/users/all` - Get all users (authenticated)
- `GET /api/users/stats` - Get user statistics (authenticated)

#### Health Check
- `GET /api/health` - Server health status

### Frontend Integration

The frontend pages automatically connect to the backend:

1. **Login/Registration**: Forms submit directly to backend APIs
2. **Authentication**: JWT tokens stored in localStorage
3. **Navigation**: Dynamic based on authentication status
4. **Profile**: User information displayed when logged in

### Database

- **Type**: SQLite (stored in `backend/database/users.db`)
- **Tables**: 
  - `users` - User accounts with authentication data
  - `sessions` - JWT session management (optional)

#### Database Commands

```bash
npm run backend:init-db     # Initialize/recreate database
npm run backend:seed-db     # Seed with sample data (if available)
```

### Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes
- **Account Lockout**: 5 failed attempts locks account for 15 minutes
- **JWT Authentication**: 24-hour token expiration
- **Input Validation**: Server-side validation with express-validator
- **Security Headers**: Helmet middleware for security headers

### Testing

#### Unit Tests
```bash
npm run test:basic           # Basic functionality tests
npm run test:home-basic      # Home page tests
npm run test:registration    # Registration tests
npm run test:security        # Security tests
npm run test:edge-cases      # Edge case tests
```

#### End-to-End Tests
```bash
npm run test                 # Run all Playwright tests
npm run test:ui              # Run tests with UI
npm run test:functional      # Login functionality tests
npm run test:performance     # Performance tests
npm run test:ux              # UX tests
```

#### Comprehensive Testing
```bash
npm run test:all-basic       # All basic unit tests
npm run test:all-negative    # Security and edge case tests
npm run test:all-security    # Complete security test suite
```

### Production Deployment

#### Backend
```bash
cd backend
npm start                    # Production mode
```

#### Environment Variables

Create `.env` file in backend directory:
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

### File Serving

In development, the backend serves static files from `src/pages/`:
- `http://localhost:3001/` → Home page
- `http://localhost:3001/login` → Login page  
- `http://localhost:3001/register` → Registration page

### Common Development Tasks

#### Add New API Endpoint
1. Create route handler in `backend/routes/`
2. Add route to `backend/server.js`
3. Update frontend to call new endpoint
4. Add tests for new functionality

#### Add New Frontend Page
1. Create HTML file in `src/pages/`
2. Add route in `backend/server.js` for serving
3. Update navigation in existing pages
4. Add tests for new page

#### Database Changes
1. Modify `backend/database/init.js`
2. Update models in `backend/models/`
3. Run `npm run backend:init-db` to recreate database
4. Update API endpoints if needed

### Troubleshooting

#### Backend won't start
- Check if port 3001 is available
- Verify database file permissions
- Check for syntax errors in server files

#### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API endpoint URLs in frontend code

#### Authentication issues
- Clear localStorage in browser
- Check JWT token expiration
- Verify backend JWT_SECRET configuration

### Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start full development environment |
| `npm run setup` | Complete project setup |
| `npm run backend:dev` | Start backend in development mode |
| `npm run frontend:dev` | Start frontend development server |
| `npm run test:all-security` | Run comprehensive security tests |
| `npm run clean` | Clean all node_modules |

### Performance Considerations

- **Backend**: Express.js with SQLite is suitable for small to medium applications
- **Frontend**: Static files served directly, minimal JavaScript
- **Database**: Indexed for common queries (email, active users)
- **Caching**: No caching implemented (add Redis for production)
- **Rate Limiting**: Configured to prevent abuse

### Next Steps

1. Add email verification for registration
2. Implement password reset functionality  
3. Add user profile picture upload
4. Implement admin dashboard
5. Add API documentation with Swagger
6. Set up production deployment with Docker
7. Add comprehensive logging
8. Implement database migrations