Cypress.Commands.add("at", { prevSubject: true }, (subject, index) => {
  let yielded = Cypress._.nth(subject, index);

  Cypress.log({
    name: "at",
    message: index,
    consoleProps: () => ({
      subject,
      index,
      yielded,
    }),
  });

  return yielded;
});
