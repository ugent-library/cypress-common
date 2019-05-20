describe('The start.with method', function () {
  describe('In regular mode', function () {
    it('should not throw when string starts with substring', function () {
      expect('Abc123').to.start.with('Abc')
    })

    it('should throw when string does not start with substring', function (done) {
      expectAssertionErrorOnFail(done, "expected 'Abc123' to start with 'abc'")

      expect('Abc123').to.start.with('abc')
    })
  })

  describe('In negative mode', function () {
    it('should not throw when string does not start with substring', function () {
      expect('Abc123').not.to.start.with('abc')
    })

    it('should throw when string starts with substring', function (done) {
      expectAssertionErrorOnFail(done, "expected 'Abc123' to not start with 'Abc'")

      expect('Abc123').not.to.start.with('Abc')
    })
  })
})
