chai.Assertion.addProperty('end', function () {
  return {
    with: substring => {
      this.assert(
        Cypress._.endsWith(this._obj, substring),
        'expected #{this} to end with #{exp}',
        'expected #{this} to not end with #{exp}',
        substring
      )
    }
  }
})
