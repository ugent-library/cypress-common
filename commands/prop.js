Cypress.Commands.add('prop', { prevSubject: true }, (subject, property, newValue = null) => {
  // Initiate command log
  const consoleProps = { property }
  const message = [property]

  if (newValue) {
    consoleProps.newValue = newValue
    message.push(newValue)
  }

  let log = Cypress.log({
    name: 'prop',
    message,
    consoleProps: () => {
      return consoleProps
    }
  })

  if (newValue) {
    return cy.wrap(subject.prop(property, newValue), { log: false })
  } else {
    return cy.wrap(subject.prop(property), { log: false }).then(result => {
      consoleProps.result = result

      log.snapshot().end()
    })
  }
})
