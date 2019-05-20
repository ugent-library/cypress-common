var getParam = require('../helpers/chai/paramHelper').getParam

Cypress.Commands.add('param', { prevSubject: 'optional' }, (subject, name, _default = null) => {
  let subj = null
  let url = null

  if (Cypress._.isNil(subject)) {
    subj = cy.location('search', { log: false })
  } else if (Cypress._.isObject(subject) && subject.hasOwnProperty('toString')) {
    subj = cy.wrap(subject.toString(), { log: false })
  } else if (Cypress._.isObject(subject) && subject.hasOwnProperty('url')) {
    subj = cy.wrap(subject.url, { log: false })
  } else if (Cypress._.isString(subject)) {
    subj = cy.wrap(subject, { log: false })
  } else {
    throw new Error(`Cannot get query parameter for ${subject}`)
  }

  return subj
    .then(url => getParam(url, name))
    .then(result => {
      const message = [name, result || '(default)']

      Cypress.log({
        name: 'param',
        message: message,
        consoleProps: () => {
          return {
            subject: url,
            name: name,
            result: result,
            default: _default
          }
        }
      })

      return result || _default
    })
})
