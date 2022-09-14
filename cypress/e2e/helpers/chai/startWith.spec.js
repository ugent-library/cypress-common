describe('The start.with method', () => {
  describe('In regular mode', () => {
    it('should not throw when string starts with substring', () => {
      expect('Abc123').to.start.with('Abc')
    })

    it('should throw when string does not start with substring', done => {
      expectAssertionErrorOnFail(done, "expected 'Abc123' to start with 'abc'")

      expect('Abc123').to.start.with('abc')
    })
  })

  describe('In negative mode', () => {
    it('should not throw when string does not start with substring', () => {
      expect('Abc123').not.to.start.with('abc')
    })

    it('should throw when string starts with substring', done => {
      expectAssertionErrorOnFail(done, "expected 'Abc123' to not start with 'Abc'")

      expect('Abc123').not.to.start.with('Abc')
    })
  })
})
