describe('The param command', function () {
  const query = '?query=test%20search&item=abc&count=123&item=def'
  const url = 'https://www.google.com/' + query

  describe('When chained directly of cy', function () {
    beforeEach(function () {
      cy.visit(url)
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
        toString: () => query
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

    it('should invoke the toString method (full url)', function () {
      subj.toString = () => url

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
        url: query,
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

    it('should get the url property (full url)', function () {
      subj.url = url

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
      cy.wrap(query)
        .param('query')
        .should('eq', 'test search')

      cy.wrap(query)
        .param('item')
        .should('eql', ['abc', 'def'])

      cy.wrap(query)
        .param('count')
        .should('eq', '123')
    })

    it('should use the string as subject (full url)', function () {
      cy.wrap(url)
        .param('query')
        .should('eq', 'test search')

      cy.wrap(url)
        .param('item')
        .should('eql', ['abc', 'def'])

      cy.wrap(url)
        .param('count')
        .should('eq', '123')
    })

    it('should return the default for an unknown parameter', function () {
      cy.wrap(query)
        .param('wrong', 'abc123')
        .should('eq', 'abc123')

      cy.wrap(query)
        .param('wrong')
        .should('be.null')
    })
  })

  describe('The alternate flow', function () {
    const assertFailure = (done, subject) => {
      cy.on('fail', function (error) {
        debugger
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

    it('should throw an error if subject is an object without toString method and url property', function (done) {
      assertFailure(done, '[object Object]')

      cy.wrap({ propA: 123, propB: false }).param('name')
    })
  })
})
