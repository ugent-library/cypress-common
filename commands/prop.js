Cypress.Commands.add('prop', { prevSubject: true }, (subject, propertyName, value = null) => {
  if (value) {
    subject.prop(propertyName, value)

    Cypress.log({
      name: 'prop',
      message: `${propertyName} = ${value}`,
      consoleProps: () => ({
        propertyName,
        value,
      }),
    })

    return subject
  } else {
    const yielded = subject.prop(propertyName)

    Cypress.log({
      name: 'prop',
      message: propertyName,
      consoleProps: () => ({
        propertyName,
        yielded,
      }),
    })

    return yielded
  }
})
