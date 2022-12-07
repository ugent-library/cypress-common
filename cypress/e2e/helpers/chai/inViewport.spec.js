describe('The inViewport method', () => {
  beforeEach(() => {
    let $element = Cypress.$(`<button id="test" style="position: absolute">Test</button>`)

    cy.document().then(d => {
      $element.appendTo(d.body)
    })
  })

  describe('In regular mode', () => {
    it('should not throw when element is in viewport', () => {
      cy.get('#test').invoke('css', 'top', '100px')

      cy.window().then(w => {
        expect(Cypress.$('#test')).to.be.inViewport(w)
      })
    })

    it('should throw when element is not in viewport', done => {
      cy.get('#test').invoke('css', 'top', '5000px')

      expectAssertionErrorOnFail(done, "expected '<button#test>' to be visible inside viewport")

      cy.window().then(w => {
        expect(Cypress.$('#test')).to.be.inViewport(w)
      })
    })
  })

  describe('In negative mode', () => {
    it('should not throw when element is not in viewport', () => {
      cy.get('#test').invoke('css', 'top', '5000px')

      cy.window().then(w => {
        expect(Cypress.$('#test')).to.not.be.inViewport(w)
      })
    })

    it('should throw when element is in viewport', done => {
      cy.get('#test').invoke('css', 'top', '100px')

      expectAssertionErrorOnFail(done, "expected '<button#test>' to not be visible inside viewport")

      cy.window().then(w => {
        expect(Cypress.$('#test')).to.not.be.inViewport(w)
      })
    })
  })
})
