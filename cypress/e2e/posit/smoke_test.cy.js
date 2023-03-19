describe('Posit Cloud - Smoke Test', () => {
	beforeEach(() => {
		// set browser dimensions
		cy.viewport('macbook-15')
		// login
		cy.login()
	})

	function deleteSpace() {
		// click the new space tab
		cy.get('#navPanel')
			.contains('a', 'New Test Space')
			.click()
		// click the dropdown
		cy.get('#rStudioHeader')
			.find('.actionBar')
			.find('button.moreActions')
			.click()
		// click delete
		cy.contains('button', 'Delete Space')
			.click()
		// type the space name
		cy.get('#deleteSpaceTest')
			.type('Delete New Test Space')
		// click submit
		cy.get('button#deleteSpaceSubmit')
			.click()
		// assert the space no longer exists
		cy.contains('.spaceNameWithOwner', 'New Test Space')
			.should('not.exist')
	}

	function createSpace() {
		// click the new space button
		cy.contains('button', 'New Space')
			.click()
		// name the new space
		cy.get('.modalDialog')
			.find('#name')
			.type('New Test Space')
		// click create
		cy.get('.modalDialog')
			.contains('button', 'Create')
			.click()
		// assert the new space appears in the header and sidebar
		cy.contains('#headerTitle', 'New Test Space')
			.should('be.visible')
		cy.contains('.spaceNameWithOwner', 'New Test Space')
			.should('be.visible')
	}

	function waitForSidePanel() {
		// Intended to avoid the hard sleep.
		// However, there isn't an element to look for that is reliable enough for this.
		cy.get('.spaceMenu')
			.find('a')
			.first()
			.should('be.visible')
			.should('have.text', 'Your Workspace')
			.wait(1000) // Adding sleep because of time constraints, but would find a better solution long term.
	}

	function conditionallyAddSpace() {
		waitForSidePanel()
		// add space if it isn't already there
		cy.get('.spaceMenu')
			.find('a')
			.then((tabs) => {
				if (tabs.length == 1) {
					createSpace()
				}
			})
	}

	it('can create a space', () => {
		waitForSidePanel()
		// remove new space if it wasn't deleted previously
		cy.get('.spaceMenu')
			.find('a').then(($tabs) => {
				if ($tabs.length > 1) {
					deleteSpace()
				}
			})

		createSpace()
	})


	it('can create a Project within the space and confirm the IDE loads', () => {
		conditionallyAddSpace()
		// click new space tab
		cy.get('#navPanel')
			.contains('a', 'New Test Space')
			.click()
		// click new project button
		cy.contains('button', 'New Project')
			.click()
		// select (click) RStudio
		cy.contains('button', 'New RStudio Project')
			.click()
		// wait for 'Deploying Project' text to appear
		cy.contains('Deploying Project')
		// wait for 'Deploying Project' text to disappear
		cy.contains('Deploying Project', {timeout: 30000})
			.should('not.exist')
		// check for IDE
		// iframes get a little tricky in Cypress
		// this is as deep as I could go given the time constraints
		cy.get('iframe#contentIFrame', {timeout: 15000})
			.should('be.visible')
			.its('0.contentDocument').should('exist')
			.its('body').should('not.be.undefined')
	})

	it('can delete the space', () => {
		conditionallyAddSpace()

		deleteSpace()
	})

	it('can log out', () => {
		cy.logOut()
	})
})
