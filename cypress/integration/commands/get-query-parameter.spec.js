describe('The getQueryParameter command', function () {
  const path = '?query=test%20search&item=abc&count=123'

  describe('When chained directly of cy', function () {
    beforeEach(function () {
      cy.visit('https://www.google.com/' + path)
    })

    it('should use the current location', function () {
      cy.getQueryParameter('query').should('eq', 'test search')
      cy.getQueryParameter('item').should('eq', 'abc')
      cy.getQueryParameter('count').should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.getQueryParameter('wrong', 'abc123').should('eq', 'abc123')

      cy.getQueryParameter('wrong').should('be.null')
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
        .getQueryParameter('query')
        .should('eq', 'test search')
      cy.wrap(subj)
        .getQueryParameter('item')
        .should('eq', 'abc')
      cy.wrap(subj)
        .getQueryParameter('count')
        .should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.wrap(subj)
        .getQueryParameter('wrong', 'abc123')
        .should('eq', 'abc123')

      cy.wrap(subj)
        .getQueryParameter('wrong')
        .should('be.null')
    })
  })

  describe('When used on a string subject', function () {
    it('should use the string as subject', function () {
      cy.wrap(path)
        .getQueryParameter('query')
        .should('eq', 'test search')
      cy.wrap(path)
        .getQueryParameter('item')
        .should('eq', 'abc')
      cy.wrap(path)
        .getQueryParameter('count')
        .should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.wrap(path)
        .getQueryParameter('wrong', 'abc123')
        .should('eq', 'abc123')

      cy.wrap(path)
        .getQueryParameter('wrong')
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

      cy.wrap(123).getQueryParameter('name')
    })

    it('should throw an error if subject is a boolean', function (done) {
      assertFailure(done, true)

      cy.wrap(true).getQueryParameter('name')
    })

    it('should throw an error if subject is an object without toString method', function (done) {
      assertFailure(done, '[object Object]')

      cy.wrap({ propA: 123, propB: false }).getQueryParameter('name')
    })
  })
})
