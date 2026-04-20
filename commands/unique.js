Cypress.Commands.add(
  "unique",
  { prevSubject: true },
  (subject, sorted = false) => {
    const yielded = Cypress._.uniq(subject);

    if (sorted) {
      yielded.sort();
    }

    Cypress.log({
      name: "unique",
      message: sorted ? "sorted" : "",
      consoleProps: () => ({ subject, sorted, yielded }),
    });

    return yielded;
  },
);
