describe('The sum command', () => {
  it('should return the sum of the subject elements', () => {
    cy.wrap([4, 2, 3, 1]).sum().should('eq', 10)
  })

  it('should return 0 for an empty array', () => {
    cy.wrap([]).sum().should('eq', 0)
  })
})
