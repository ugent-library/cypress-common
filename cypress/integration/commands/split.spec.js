describe('The split command', () => {
  describe('Without a separator argument', () => {
    it('should split the subject string into an array of each character', () => {
      cy.wrap('abc def').split().should('eql', ['a', 'b', 'c', ' ', 'd', 'e', 'f'])
    })
  })

  describe('With a separator string', () => {
    it('should split the subject string', () => {
      cy.wrap('a,b,c,d,e').split(',').should('eql', ['a', 'b', 'c', 'd', 'e'])
      cy.wrap('/en/tags/foo/bar/').split('/').should('eql', ['', 'en', 'tags', 'foo', 'bar', ''])
    })

    it('should be possible to filter empty elements', () => {
      cy.wrap('/en/tags/foo/bar/').split('/', true).should('eql', ['en', 'tags', 'foo', 'bar'])
    })
  })

  describe('With a separator RegExp', () => {
    it('should split the subject string', () => {
      cy.wrap('a§€b§çc§€d§çe').split(/§[€ç]/).should('eql', ['a', 'b', 'c', 'd', 'e'])
      cy.wrap('/en/tags/foo/bar/').split(/\//).should('eql', ['', 'en', 'tags', 'foo', 'bar', ''])
    })

    it('should be possible to filter empty elements', () => {
      cy.wrap('/en/tags/foo/bar/').split(/\//, true).should('eql', ['en', 'tags', 'foo', 'bar'])
    })
  })
})
