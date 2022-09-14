describe('The readonly property', () => {
  let $input

  beforeEach(() => {
    $input = Cypress.$('<input />', { readonly: true })
  })

  describe('In regular mode', () => {
    it('should not throw when a field is readonly', () => {
      expect($input).to.be.readonly
    })

    it('should throw when a field is not readonly', done => {
      $input.prop('readonly', false)

      expectAssertionErrorOnFail(done, "expected '<input>' to be read-only")

      expect($input).to.be.readonly
    })
  })

  describe('In negative mode', () => {
    it('should not throw when a field is not readonly', () => {
      $input.prop('readonly', false)

      expect($input).not.to.be.readonly
    })

    it('should throw when a field is not readonly', done => {
      expectAssertionErrorOnFail(done, "expected '<input>' to not be read-only")

      expect($input).not.to.be.readonly
    })
  })
})
