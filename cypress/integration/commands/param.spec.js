describe('The param command', function () {
  const path = '?query=test%20search&item=abc&count=123&item=def'

  describe('When chained directly of cy', function () {
    beforeEach(function () {
      cy.visit('https://www.google.com/' + path)
    })

    it('should use the current location', function () {
      cy.param('query').should('eq', 'test search')
      cy.param('item').should('eql', ['abc', 'def'])
      cy.param('count').should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.param('wrong', 'abc123').should('eq', 'abc123')

      cy.param('wrong').should('be.null')
    })
  })

  describe('When used on a subject with a toString method', function () {
    let subj

    beforeEach(function () {
      subj = {
        propA: 1,
        propB: true,
        toString: () => path
      }
    })

    it('should invoke the toString method', function () {
      cy.wrap(subj)
        .param('query')
        .should('eq', 'test search')
      cy.wrap(subj)
        .param('item')
        .should('eql', ['abc', 'def'])
      cy.wrap(subj)
        .param('count')
        .should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.wrap(subj)
        .param('wrong', 'abc123')
        .should('eq', 'abc123')

      cy.wrap(subj)
        .param('wrong')
        .should('be.null')
    })
  })

  describe('When used on a subject with a url property', function () {
    let subj

    beforeEach(() => {
      subj = {
        propA: 1,
        url: path,
        propB: true
      }
    })

    it('should get the url property', function () {
      cy.wrap(subj)
        .param('query')
        .should('eq', 'test search')
      cy.wrap(subj)
        .param('item')
        .should('eql', ['abc', 'def'])
      cy.wrap(subj)
        .param('count')
        .should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.wrap(subj)
        .param('wrong', 'abc123')
        .should('eq', 'abc123')

      cy.wrap(subj)
        .param('wrong')
        .should('be.null')
    })
  })

  describe('When used on a string subject', function () {
    it('should use the string as subject', function () {
      cy.wrap(path)
        .param('query')
        .should('eq', 'test search')
      cy.wrap(path)
        .param('item')
        .should('eql', ['abc', 'def'])
      cy.wrap(path)
        .param('count')
        .should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.wrap(path)
        .param('wrong', 'abc123')
        .should('eq', 'abc123')

      cy.wrap(path)
        .param('wrong')
        .should('be.null')
    })
  })

  describe('The alternate flow', function () {
    const assertFailure = (done, subject) => {
      cy.on('fail', function (error) {
        expect(error.constructor.name).to.eq('Error')
        expect(error.message).to.eq(`Cannot get query parameter for ${subject}`)

        done()
      })
    }

    it('should throw an error if subject is a number', function (done) {
      assertFailure(done, 123)

      cy.wrap(123).param('name')
    })

    it('should throw an error if subject is a boolean', function (done) {
      assertFailure(done, true)

      cy.wrap(true).param('name')
    })

    it('should throw an error if subject is an object without toString method', function (done) {
      assertFailure(done, '[object Object]')

      cy.wrap({ propA: 123, propB: false }).param('name')
    })
  })
})
