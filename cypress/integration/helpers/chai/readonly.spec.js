describe('The readonly property', function () {
  let $input

  beforeEach(function () {
    $input = Cypress.$('<input />', { readonly: true })
  })

  describe('In regular mode', function () {
    it('should not throw when a field is readonly', function () {
      expect($input).to.be.readonly
    })

    it('should throw when a field is not readonly', function (done) {
      $input.prop('readonly', false)

      expectAssertionErrorOnFail(done, "expected '<input>' to be read-only")

      expect($input).to.be.readonly
    })
  })

  describe('In negative mode', function () {
    it('should not throw when a field is not readonly', function () {
      $input.prop('readonly', false)

      expect($input).not.to.be.readonly
    })

    it('should throw when a field is not readonly', function (done) {
      expectAssertionErrorOnFail(done, "expected '<input>' to not be read-only")

      expect($input).not.to.be.readonly
    })
  })
})
