Cypress.Commands.add("map", { prevSubject: true }, (subject, iteratee) => {
  let yielded = Cypress._.map(subject, iteratee);

  Cypress.log({
    name: "map",
    message: [subject],
    consoleProps: () => ({
      subject,
      iteratee,
      yielded,
    }),
  });

  return yielded;
});
