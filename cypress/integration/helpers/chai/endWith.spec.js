describe('The end.with method', function () {
  describe('In regular mode', function () {
    it('should not throw when string ends with substring', function () {
      expect('123abC').to.end.with('abC')
    })

    it('should throw when string does not end with substring', function (done) {
      expectAssertionErrorOnFail(done, "expected '123abC' to end with 'abc'")

      expect('123abC').to.end.with('abc')
    })
  })

  describe('In negative mode', function () {
    it('should not throw when string does not end with substring', function () {
      expect('123abC').not.to.end.with('abc')
    })

    it('should throw when string ends with substring', function (done) {
      expectAssertionErrorOnFail(done, "expected '123abC' to not end with 'abC'")

      expect('123abC').not.to.end.with('abC')
    })
  })
})
