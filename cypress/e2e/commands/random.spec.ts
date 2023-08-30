describe('The random command', () => {
  const list = [...Array(100).keys()]

  it('should return a random item of an array', () => {
    cy.wrap(list)
      .random<number>()
      .should('not.be.an', 'array')
      .should('not.be.an', 'object')
      .should(Cypress._.isInteger)
      .should('be.oneOf', list)
  })

  it('should return a random item of a jQuery object (wrapped again by cypress)', () => {
    cy.origin('https://lib.ugent.be', () => {
      Cypress.require('../../../commands/random')

      cy.visit('/')

      cy.get('img, a').as('items').its('length').should('be.above', 30)

      cy.get('@items').random<HTMLElement>().should('be.an', 'object').should('have.length', 1)

      cy.get('@items').random<HTMLElement>().invoke('prop', 'tagName').should('be.oneOf', ['IMG', 'A'])
    })
  })

  it('should be possible to pass an upper bound', () => {
    for (let i = 0; i < 100; i++) {
      cy.wrap(list).random<number>(10).should('be.at.most', 10)
    }
  })

  it('should be possible to pass a lower and upper bound', () => {
    for (let i = 0; i < 100; i++) {
      cy.wrap(list).random<number>(30, 70).should('be.within', 30, 70)
    }
  })

  it('should yield null if the lower and upper parameters are out of the array bounds', () => {
    cy.wrap(list).random<number>(200, 300).should('be.null')
  })

  it('should yield null if the source array is empty', () => {
    cy.wrap([]).random().should('be.null')
  })
})
