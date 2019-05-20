var getParam = require('./paramHelper').getParam

chai.Assertion.addMethod('param', function (name, value = null) {
  const negate = chai.util.flag(this, 'negate') || false
  if (negate && value) {
    throw new chai.AssertionError('chai method param does not support negation')
  }

  const param = getParam(this._obj, name)

  this.assert(param != null, `expected param '${name}' to exist`, `expected param '${name}' to not exist`)

  if (value) {
    this.assert(
      chai.util.eql(param, value),
      `expected param '${name}' to equal #{exp} but got #{act}`,
      null,
      value,
      param
    )
  }
})
