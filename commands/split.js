Cypress.Commands.add('split', { prevSubject: true }, (subject, separator) => {
  let yielded = Cypress._.split(subject, separator)

  Cypress.log({
    name: 'split',
    message: [separator],
    consoleProps: () => ({
      subject,
      separator,
      yielded
    })
  })

  return yielded
})
