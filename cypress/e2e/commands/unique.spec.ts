describe('The unique command', () => {
  it('should return the subject without duplicates', () => {
    cy.wrap(['abc', 'def', 123, 'def', true, false, 'abc', 'xyz', true])
      .unique()
      .should('have.members', ['abc', 'def', 123, true, false, 'xyz'])
  })

  it('should return the subject without duplicates and sorted', () => {
    cy.wrap(['def', 'xyz', 'abc', 'def', 'abc', 'xyz']).unique(true).should('eql', ['abc', 'def', 'xyz'])
  })
})
