Cypress.Commands.add(
  "attr",
  { prevSubject: true },
  (subject, attributeName, value = null) => {
    if (value) {
      subject.attr(attributeName, value);

      Cypress.log({
        name: "attr",
        message: `${attributeName} = ${value}`,
        consoleProps: () => ({
          attributeName,
          value,
        }),
      });

      return subject;
    } else {
      const yielded = subject.attr(attributeName);

      Cypress.log({
        name: "attr",
        message: attributeName,
        consoleProps: () => ({
          attributeName,
          yielded,
        }),
      });

      return yielded;
    }
  },
);
