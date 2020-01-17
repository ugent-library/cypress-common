Cypress.Commands.add('random', { prevSubject: true }, (subject, lower = 0, upper = null) => {
  cy.wrap(subject, { log: false }).then(items => {
    if (!lower && !upper) {
      lower = 0
      upper = items.length - 1
    }

    const index = Cypress._.random(lower, upper)
    const result = items[index] || null

    Cypress.log({
      name: 'random',
      message: [`[${index}] => ${result}`],
      consoleProps: () => {
        return {
          lower,
          upper,
          subject,
          index,
          result
        }
      }
    })

    return result
  })
})
