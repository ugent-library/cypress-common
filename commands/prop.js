Cypress.Commands.add('prop', { prevSubject: true }, (subject, property, newValue = null) => {
  if (newValue) {
    subject.prop(property, newValue)

    Cypress.log({
      name: 'prop',
      message: `${property} = ${newValue}`,
      consoleProps: () => ({
        property,
        newValue
      })
    })

    return subject
  } else {
    const yielded = subject.prop(property)

    Cypress.log({
      name: 'prop',
      message: property,
      consoleProps: () => ({
        property,
        yielded
      })
    })

    return yielded
  }
})
