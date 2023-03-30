describe('The prop command', () => {
  let someLink = '<a id="someLink" href="abc" title="the title" data-id="987" data-type="link">test</a>'

  beforeEach(() => {
    cy.visit('https://www.google.com')

    cy.document().then(doc => {
      Cypress.$(someLink).appendTo(doc.body)
    })
  })

  it('should return a property from an object', () => {
    cy.get('#someLink').as('some-link').prop<string>('href').should('eq', 'https://www.google.com/abc')

    cy.get('@some-link').prop<string>('innerText').should('eq', 'test')

    cy.get('@some-link').prop<string>('outerHTML').should('eq', someLink)

    cy.get('@some-link')
      .prop<DOMStringMap>('dataset')
      .then(dataset => ({ ...dataset })) // Convert DOMStringMap to a plain object
      .should('eql', { id: '987', type: 'link' })
  })

  it('should be possible to set a property on an object', () => {
    cy.get('#someLink').as('some-link').prop<string>('title', 'some other title').prop<string>('href', '/def')

    cy.get('@some-link').should(sl => {
      // Check the DOM way
      expect(sl.get(0)).to.have.property('title', 'some other title')
      expect(sl.get(0)).to.have.property('href', 'https://www.google.com/def')

      // Check the JQuery way
      expect(sl.prop('title')).to.eq('some other title')
      expect(sl.prop('href')).to.eq('https://www.google.com/def')
    })

    cy.get('@some-link').prop<string>('title').should('eq', 'some other title')
    cy.get('@some-link').prop<string>('href').should('eq', 'https://www.google.com/def')
  })
})
