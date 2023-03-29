import { expectAssertionErrorOnFail, expectErrorOnFail } from 'cypress/support/e2e'

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

    it('should throw when invoked without the window argument', done => {
      expectErrorOnFail(
        done,
        'You should provide the window object, retrieved by "cy.window()", as an argument to the "inViewport" assertion.'
      )

      cy.window().then(w => {
        expect(Cypress.$('#test')).to.be.inViewport(undefined as unknown as Window)
      })
    })

    it('should throw when invoked with a non-window argument', done => {
      expectErrorOnFail(
        done,
        'You should provide the window object, retrieved by "cy.window()", as an argument to the "inViewport" assertion.'
      )

      cy.document().then(d => {
        expect(Cypress.$('#test')).to.be.inViewport(d as unknown as Window)
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
