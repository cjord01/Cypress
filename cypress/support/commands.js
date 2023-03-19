Cypress.Commands.add('login', () => {
	// visit posit and click login
	cy.visit('https://posit.cloud')
	cy.contains('.bigButton', 'Already a User? Log In')
		.click()
	// enter email and password, and click login
	cy.get('[name=email]')
		.type(Cypress.env('email'))
	cy.contains('button', 'Continue')
		.click()
	cy.get('[type=password]')
		.type(Cypress.env('password'))
	cy.contains('button', 'Log In')
		.click()
	cy.get('.productLogo')
})

Cypress.Commands.add('logOut', () => {
	// click dropdown and click Log Out
	cy.get('#currentUser')
		.click()
	cy.contains('a', 'Log Out')
		.click()
	cy.contains('h1', 'Friction free data science')
})
