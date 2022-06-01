describe('The param method', function () {
  describe('In regular mode', function () {
    it('should not throw when the param exists', function () {
      expect('https://www.google.com/?test=abc123').to.have.param('test')
      expect('https://www.google.com/?test=abc123&ignore=true&test=def456').to.have.param('test')
    })

    it('should not throw when the param exists and equals the value', function () {
      expect('https://www.google.com/?test=abc123').to.have.param('test', 'abc123')
      expect('https://www.google.com/?test=abc123&ignore=true&test=def456').to.have.param('test', ['abc123', 'def456'])
    })

    it('should throw when the param does not exist', function (done) {
      expectAssertionErrorOnFail(done, "expected param 'other' to exist")

      expect('https://www.google.com/?test=abc123').to.have.param('other', 'abc123')
    })

    it('should throw when the param does not equal the argument', function (done) {
      expectAssertionErrorOnFail(done, "expected param 'test' to equal 'abc124' but got 'abc123'")

      expect('https://www.google.com/?test=abc123').to.have.param('test', 'abc124')
    })
  })

  describe('In negative  mode', function () {
    it('should not throw when the param does not exist', function () {
      expect('https://www.google.com/?test=abc123').to.not.have.param('other')
    })

    it('should throw when the param does exist', function (done) {
      expectAssertionErrorOnFail(done, "expected param 'test' to not exist")

      expect('https://www.google.com/?test=abc123').to.not.have.param('test')
    })

    it('should throw when negating the chain with a value', function (done) {
      expectAssertionErrorOnFail(done, 'chai method param does not support negation')

      expect('https://www.google.com/?test=abc123').to.not.have.param('other', 'abc123')
    })
  })
})
