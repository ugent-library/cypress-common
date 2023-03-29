describe('The map command', () => {
  it('should map all items of an array', () => {
    cy.wrap([2, 8, 11, 28, 29, 33])
      .map<number, number>(i => i - 1)
      .should('eql', [1, 7, 10, 27, 28, 32])
      .map<number, number>(i => i * 2)
      .should('eql', [2, 14, 20, 54, 56, 64])

    cy.wrap(['abc', 'Def', 'ghI']).map<string, string>(Cypress._.toUpper).should('eql', ['ABC', 'DEF', 'GHI'])
  })

  it('should map all elements in jQuery object', () => {
    cy.visit('https://lib.ugent.be/')

    cy.get('a')
      .as('links')
      .its('length')
      .should('be.above', 5)
      .then(length => {
        cy.get('@links')
          .each($a => expect($a).to.be.an('object'))
          .map<HTMLAnchorElement, string>('href')
          .each(href => expect(href).to.be.a('string'))
          .should('be.an', 'array')
          .should('have.length', length)
      })
  })
})
