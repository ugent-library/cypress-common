chai.Assertion.addMethod('inViewport', function(window) {
  if (!window || window.constructor.name !== 'Window') {
    throw new Error(
      'You should provide the window object, retrieved by "cy.window()" as the second ' +
        'argument for the "inViewport" assertion.'
    )
  }

  let el = this._obj

  if ('jquery' in el) {
    if (el.length === 1) {
      el = el[0]
    } else {
      throw new Error('The "inViewport" assertion cannot be used on multiple elements.')
    }
  }

  let rect = el.getBoundingClientRect()

  let visible =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || window.document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || window.document.documentElement.clientWidth)

  this.assert(
    visible,
    'expected #{this} to be visible inside viewport',
    'expected #{this} to not be visible inside viewport'
  )
})
