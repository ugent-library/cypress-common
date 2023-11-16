import chaiDom from 'chai-dom'

import '../../helpers'
import '../../commands'

chai.use(chaiDom)

export function expectErrorOnFail(done: Mocha.Done, message: string, errorTypeName: string = 'Error') {
  cy.on('fail', error => {
    expect(error.constructor.name).to.eq(errorTypeName)
    expect(error.message).to.eq(message)

    done()
  })
}

export function expectAssertionErrorOnFail(done: Mocha.Done, message: string) {
  expectErrorOnFail(done, message, 'AssertionError')
}
