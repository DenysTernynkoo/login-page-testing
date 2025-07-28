describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login.html')
  })

  it('should load login page with all elements', () => {
    // Check page title
    cy.title().should('eq', 'Login Page')
    
    // Check main heading
    cy.get('h1').should('contain.text', 'Welcome Back')
    
    // Check form elements exist
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    cy.contains('Forgot your password?').should('be.visible')
    
    // Check labels
    cy.get('label[for="email"]').should('contain.text', 'Email Address')
    cy.get('label[for="password"]').should('contain.text', 'Password')
  })

  it('should show error when submitting empty form', () => {
    // Click submit button without filling form
    cy.get('button[type="submit"]').click()
    
    // Check error message appears
    cy.get('#errorMessage').should('be.visible')
    cy.get('#errorMessage').should('contain.text', 'Please fill in all fields')
  })

  it('should show error for invalid email format', () => {
    // Fill form with invalid email
    cy.get('#email').type('invalid-email')
    cy.get('#password').type('password123')
    cy.get('button[type="submit"]').click()
    
    // Check error message
    cy.get('#errorMessage').should('be.visible')
    cy.get('#errorMessage').should('contain.text', 'Please enter a valid email address')
  })

  it('should show error for short password', () => {
    // Fill form with short password
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('123')
    cy.get('button[type="submit"]').click()
    
    // Check error message
    cy.get('#errorMessage').should('be.visible')
    cy.get('#errorMessage').should('contain.text', 'Password must be at least 6 characters long')
  })

  it('should show error when email is empty but password is filled', () => {
    // Fill only password
    cy.get('#password').type('password123')
    cy.get('button[type="submit"]').click()
    
    // Check error message
    cy.get('#errorMessage').should('be.visible')
    cy.get('#errorMessage').should('contain.text', 'Please fill in all fields')
  })

  it('should show error when password is empty but email is filled', () => {
    // Fill only email
    cy.get('#email').type('test@example.com')
    cy.get('button[type="submit"]').click()
    
    // Check error message
    cy.get('#errorMessage').should('be.visible')
    cy.get('#errorMessage').should('contain.text', 'Please fill in all fields')
  })

  it('should show success message for valid login', () => {
    // Fill form with valid data
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('password123')
    
    // Submit form
    cy.get('button[type="submit"]').click()
    
    // Check that button shows loading state
    cy.get('button[type="submit"]').should('contain.text', 'Signing In...')
    cy.get('button[type="submit"]').should('be.disabled')
    
    // Wait for success message (after the 1.5s timeout)
    cy.get('#successMessage', { timeout: 3000 }).should('be.visible')
    cy.get('#successMessage').should('contain.text', 'Login successful! Redirecting...')
    
    // Check that button returns to normal state
    cy.get('button[type="submit"]').should('contain.text', 'Sign In')
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  it('should handle forgot password click', () => {
    // Stub the alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('windowAlert')
    })
    
    // Click forgot password link
    cy.contains('Forgot your password?').click()
    
    // Check alert was called
    cy.get('@windowAlert').should('have.been.calledWith', 'Forgot password functionality would be implemented here')
  })

  it('should hide error message when form is resubmitted', () => {
    // First submit with invalid data
    cy.get('#email').type('invalid-email')
    cy.get('button[type="submit"]').click()
    cy.get('#errorMessage').should('be.visible')
    
    // Then submit with valid data
    cy.get('#email').clear().type('test@example.com')
    cy.get('#password').type('password123')
    cy.get('button[type="submit"]').click()
    
    // Error message should be hidden
    cy.get('#errorMessage').should('not.be.visible')
  })

  it('should allow typing in form fields', () => {
    const testEmail = 'user@example.com'
    const testPassword = 'mypassword123'
    
    // Type in email field
    cy.get('#email').type(testEmail)
    cy.get('#email').should('have.value', testEmail)
    
    // Type in password field
    cy.get('#password').type(testPassword)
    cy.get('#password').should('have.value', testPassword)
  })

  it('should validate multiple invalid email formats', () => {
    const invalidEmails = [
      'plainaddress',
      '@missingdomain.com',
      'missing@.com',
      'missing@domain',
      'spaces @domain.com'
    ]
    
    invalidEmails.forEach((email) => {
      cy.get('#email').clear().type(email)
      cy.get('#password').clear().type('password123')
      cy.get('button[type="submit"]').click()
      
      cy.get('#errorMessage').should('be.visible')
      cy.get('#errorMessage').should('contain.text', 'Please enter a valid email address')
    })
  })

  it('should have proper form structure and accessibility', () => {
    // Check form exists
    cy.get('#loginForm').should('be.visible')
    
    // Check inputs have proper labels
    cy.get('label[for="email"]').should('be.visible')
    cy.get('label[for="password"]').should('be.visible')
    
    // Check inputs have required attribute
    cy.get('#email').should('have.attr', 'required')
    cy.get('#password').should('have.attr', 'required')
    
    // Check input types
    cy.get('#email').should('have.attr', 'type', 'email')
    cy.get('#password').should('have.attr', 'type', 'password')
  })
})