Cypress.Commands.add('sum', { prevSubject: true }, subject => {
  let yielded = Cypress._.reduce(subject, Cypress._.add, 0)

  Cypress.log({
    name: 'sum',
    message: [subject, yielded],
    consoleProps: () => ({
      subject: subject,
      result: yielded
    })
  })

  return yielded
})
