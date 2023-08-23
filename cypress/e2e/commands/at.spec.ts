describe('The at command', () => {
  const list = [...Array(10).keys()]

  it('should yield a specific item of an array', () => {
    cy.wrap(list).at<number>(0).should('equal', 0)
    cy.wrap(list).at<number>(2).should('equal', 2)
    cy.wrap(list).at<number>(5).should('equal', 5)
    cy.wrap(list).at<number>(-5).should('equal', 5)
    cy.wrap(list).at<number>(-2).should('equal', 8)
    cy.wrap(list).at<number>(-1).should('equal', 9)
  })

  it('should yield a specific item of a jQuery object (wrapped again by cypress)', () => {
    cy.visit('https://lib.ugent.be/')

    cy.get('img, a').as('items').its('length').should('be.above', 30)

    cy.get('@items').at<HTMLElement>(20).should('be.an', 'object').should('have.length', 1)

    cy.get('@items').at<HTMLElement>(-15).invoke('prop', 'tagName').should('be.oneOf', ['IMG', 'A'])
  })

  it('should yield a specific letter if the subject is a string', () => {
    cy.wrap('Hello World').at<string>(0).should('equal', 'H')
    cy.wrap('Hello World').at<string>(2).should('equal', 'l')
    cy.wrap('Hello World').at<string>(5).should('equal', ' ')
    cy.wrap('Hello World').at<string>(-5).should('equal', 'W')
    cy.wrap('Hello World').at<string>(-2).should('equal', 'l')
    cy.wrap('Hello World').at<string>(-1).should('equal', 'd')
  })

  it('should yield undefined if the index is out of the array bounds', () => {
    cy.wrap(list).at<number>(10).should('be.undefined')
  })

  it('should yield null if the source array is empty', () => {
    cy.wrap([]).at(1).should('be.undefined')
  })

  it('should yield null if the source is not an array-like', () => {
    cy.wrap({}).at(1).should('be.undefined')
    cy.wrap(new Date()).at(-2).should('be.undefined')
    cy.wrap(5).at(3).should('be.undefined')
    cy.wrap(true).at(-4).should('be.undefined')
    cy.wrap(null).at(5).should('be.undefined')
    cy.wrap(undefined).at(-6).should('be.undefined')
  })
})
