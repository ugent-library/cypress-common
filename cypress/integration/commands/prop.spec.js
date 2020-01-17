describe('The prop command', function() {
  let someLink = '<a id="someLink" href="abc" title="the title">test</a>'

  beforeEach(() => {
    cy.visit('https://www.google.com')

    cy.document().then(function(doc) {
      Cypress.$(someLink).appendTo(doc.body)
    })
  })

  it('should return a property from an object', function() {
    cy.get('#someLink')
      .as('some-link')
      .prop('href')
      .should('eq', 'https://www.google.com/abc')

    cy.get('@some-link')
      .prop('innerText')
      .should('eq', 'test')

    cy.get('@some-link')
      .prop('outerHTML')
      .should('eq', someLink)
  })

  it('should be possible to set a property on an object', () => {
    cy.get('#someLink')
      .as('some-link')
      .prop('title', 'some other title')
      .prop('href', '/def')

    cy.get('@some-link').should(sl => {
      expect(sl[0].title).to.eq('some other title')
      expect(sl[0].href).to.eq('https://www.google.com/def')

      expect(sl.prop('title')).to.eq('some other title')
      expect(sl.prop('href')).to.eq('https://www.google.com/def')
    })

    cy.get('@some-link')
      .prop('title')
      .should('eq', 'some other title')

    cy.get('@some-link')
      .prop('href')
      .should('eq', 'https://www.google.com/def')
  })
})
