import { expectAssertionErrorOnFail } from 'cypress/support/e2e'

describe('The end.with method', () => {
  describe('In regular mode', () => {
    it('should not throw when string ends with substring', () => {
      expect('123abC').to.end.with('abC')
    })

    it('should throw when string does not end with substring', done => {
      expectAssertionErrorOnFail(done, "expected '123abC' to end with 'abc'")

      expect('123abC').to.end.with('abc')
    })
  })

  describe('In negative mode', () => {
    it('should not throw when string does not end with substring', () => {
      expect('123abC').not.to.end.with('abc')
    })

    it('should throw when string ends with substring', done => {
      expectAssertionErrorOnFail(done, "expected '123abC' to not end with 'abC'")

      expect('123abC').not.to.end.with('abC')
    })
  })
})
