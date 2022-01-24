Cypress.Commands.add('split', { prevSubject: true }, (subject, separator = '', filterEmptyElements = false) => {
  let yielded = Cypress._.split(subject, separator)

  if (filterEmptyElements) {
    yielded = Cypress._.filter(yielded)
  }

  Cypress.log({
    name: 'split',
    message: [separator.toString()],
    consoleProps: () => ({
      subject,
      separator: separator.toString(),
      yielded,
      'Filter empty elements': filterEmptyElements,
    }),
  })

  return yielded
})
