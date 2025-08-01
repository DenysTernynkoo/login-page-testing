/**
 * Backend Integration Tests
 * Tests the integrated frontend-backend structure
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

// Test configuration
const BACKEND_PORT = 3001;
const FRONTEND_PORT = 3000;
const TEST_TIMEOUT = 30000;

class IntegrationTester {
    constructor() {
        this.backendProcess = null;
        this.frontendProcess = null;
        this.testsPassed = 0;
        this.testsFailed = 0;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async makeRequest(options) {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                });
            });
            
            req.on('error', reject);
            req.setTimeout(5000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            
            if (options.body) {
                req.write(options.body);
            }
            req.end();
        });
    }

    async startBackend() {
        this.log('Starting backend server...');
        
        const backendPath = path.join(__dirname, '../../backend');
        this.backendProcess = spawn('node', ['server.js'], {
            cwd: backendPath,
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env, NODE_ENV: 'test' }
        });

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Backend startup timeout'));
            }, 15000);

            this.backendProcess.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Server running')) {
                    clearTimeout(timeout);
                    this.log('Backend server started successfully', 'success');
                    resolve();
                }
            });

            this.backendProcess.stderr.on('data', (data) => {
                this.log(`Backend error: ${data.toString()}`, 'error');
            });

            this.backendProcess.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }

    async testHealthEndpoint() {
        this.log('Testing health endpoint...');
        
        try {
            const response = await this.makeRequest({
                hostname: 'localhost',
                port: BACKEND_PORT,
                path: '/api/health',
                method: 'GET'
            });

            if (response.statusCode === 200) {
                const healthData = JSON.parse(response.body);
                if (healthData.status === 'OK') {
                    this.log('Health endpoint test passed', 'success');
                    this.testsPassed++;
                    return true;
                } else {
                    throw new Error('Invalid health response');
                }
            } else {
                throw new Error(`Health endpoint returned ${response.statusCode}`);
            }
        } catch (error) {
            this.log(`Health endpoint test failed: ${error.message}`, 'error');
            this.testsFailed++;
            return false;
        }
    }

    async testAuthEndpoints() {
        this.log('Testing authentication endpoints...');
        
        // Test registration
        try {
            const regData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@example.com',
                password: 'TestPassword123!',
                confirmPassword: 'TestPassword123!'
            };

            const regResponse = await this.makeRequest({
                hostname: 'localhost',
                port: BACKEND_PORT,
                path: '/api/auth/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(regData)
            });

            if (regResponse.statusCode === 201) {
                const regResult = JSON.parse(regResponse.body);
                if (regResult.success && regResult.data.token) {
                    this.log('Registration test passed', 'success');
                    this.testsPassed++;

                    // Test login with the registered user
                    const loginResponse = await this.makeRequest({
                        hostname: 'localhost',
                        port: BACKEND_PORT,
                        path: '/api/auth/login',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: regData.email,
                            password: regData.password
                        })
                    });

                    if (loginResponse.statusCode === 200) {
                        const loginResult = JSON.parse(loginResponse.body);
                        if (loginResult.success && loginResult.data.token) {
                            this.log('Login test passed', 'success');
                            this.testsPassed++;
                            return loginResult.data.token;
                        }
                    }
                }
            }
            
            throw new Error('Authentication flow failed');
        } catch (error) {
            this.log(`Authentication test failed: ${error.message}`, 'error');
            this.testsFailed++;
            return null;
        }
    }

    async testProtectedEndpoints(token) {
        if (!token) {
            this.log('Skipping protected endpoint tests (no token)', 'error');
            this.testsFailed++;
            return;
        }

        this.log('Testing protected endpoints...');
        
        try {
            const profileResponse = await this.makeRequest({
                hostname: 'localhost',
                port: BACKEND_PORT,
                path: '/api/users/profile',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (profileResponse.statusCode === 200) {
                const profileData = JSON.parse(profileResponse.body);
                if (profileData.success && profileData.data.user) {
                    this.log('Protected endpoint test passed', 'success');
                    this.testsPassed++;
                    return true;
                }
            }
            
            throw new Error('Protected endpoint test failed');
        } catch (error) {
            this.log(`Protected endpoint test failed: ${error.message}`, 'error');
            this.testsFailed++;
            return false;
        }
    }

    async testStaticFileServing() {
        this.log('Testing static file serving...');
        
        try {
            const indexResponse = await this.makeRequest({
                hostname: 'localhost',
                port: BACKEND_PORT,
                path: '/',
                method: 'GET'
            });

            if (indexResponse.statusCode === 200 && 
                indexResponse.body.includes('<!DOCTYPE html>') &&
                indexResponse.body.includes('YourSite')) {
                this.log('Static file serving test passed', 'success');
                this.testsPassed++;
                return true;
            }
            
            throw new Error('Static files not served correctly');
        } catch (error) {
            this.log(`Static file serving test failed: ${error.message}`, 'error');
            this.testsFailed++;
            return false;
        }
    }

    async testSecurityFeatures() {
        this.log('Testing security features...');
        
        try {
            // Test rate limiting by making multiple requests
            const requests = [];
            for (let i = 0; i < 6; i++) {
                requests.push(this.makeRequest({
                    hostname: 'localhost',
                    port: BACKEND_PORT,
                    path: '/api/auth/login',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'invalid@example.com',
                        password: 'wrongpassword'
                    })
                }));
            }

            const responses = await Promise.all(requests);
            const rateLimited = responses.some(r => r.statusCode === 429);
            
            if (rateLimited) {
                this.log('Rate limiting test passed', 'success');
                this.testsPassed++;
                return true;
            } else {
                this.log('Rate limiting may not be working correctly', 'error');
                this.testsFailed++;
                return false;
            }
        } catch (error) {
            this.log(`Security test failed: ${error.message}`, 'error');
            this.testsFailed++;
            return false;
        }
    }

    async cleanup() {
        this.log('Cleaning up test processes...');
        
        if (this.backendProcess) {
            this.backendProcess.kill('SIGTERM');
            await new Promise(resolve => {
                this.backendProcess.on('exit', resolve);
                setTimeout(resolve, 2000);
            });
        }
        
        if (this.frontendProcess) {
            this.frontendProcess.kill('SIGTERM');
            await new Promise(resolve => {
                this.frontendProcess.on('exit', resolve);
                setTimeout(resolve, 2000);
            });
        }
    }

    async runTests() {
        this.log('Starting integration tests...');
        
        try {
            // Start backend
            await this.startBackend();
            
            // Wait a moment for server to fully initialize
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Run tests
            await this.testHealthEndpoint();
            const token = await this.testAuthEndpoints();
            await this.testProtectedEndpoints(token);
            await this.testStaticFileServing();
            await this.testSecurityFeatures();
            
        } catch (error) {
            this.log(`Test suite failed: ${error.message}`, 'error');
            this.testsFailed++;
        } finally {
            await this.cleanup();
        }

        // Report results
        this.log('='.repeat(50));
        this.log(`Integration Tests Complete`);
        this.log(`Tests Passed: ${this.testsPassed}`);
        this.log(`Tests Failed: ${this.testsFailed}`);
        this.log(`Success Rate: ${Math.round((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100)}%`);
        this.log('='.repeat(50));

        if (this.testsFailed === 0) {
            this.log('🎉 All integration tests passed!', 'success');
            process.exit(0);
        } else {
            this.log('❌ Some tests failed. Check the logs above.', 'error');
            process.exit(1);
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new IntegrationTester();
    
    process.on('SIGINT', async () => {
        console.log('\n🛑 Tests interrupted by user');
        await tester.cleanup();
        process.exit(1);
    });
    
    tester.runTests().catch(error => {
        console.error('Failed to run tests:', error);
        process.exit(1);
    });
}

module.exports = IntegrationTester;