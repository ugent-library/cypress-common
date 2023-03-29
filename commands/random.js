Cypress.Commands.add('random', { prevSubject: true }, (subject, lower = 0, upper = null) => {
  if (!lower && !upper) {
    lower = 0
    upper = subject.length - 1
  } else if (!upper) {
    upper = lower
    lower = 0
  }

  const index = Cypress._.random(lower, upper)
  const yielded = index in subject ? subject[index] : null

  Cypress.log({
    name: 'random',
    message: [`[${index}] => ${yielded}`],
    consoleProps: () => ({
      lower,
      upper,
      subject,
      index,
      yielded,
    }),
  })

  return yielded
})
