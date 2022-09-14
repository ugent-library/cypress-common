// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '../../helpers'

import '../../commands'

global.expectAssertionErrorOnFail = (done, message) => {
  cy.on('fail', error => {
    expect(error.constructor.name).to.eq('AssertionError')
    expect(error.message).to.eq(message)

    done()
  })
}
