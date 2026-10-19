declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Yields the (aggregate) sum of the chained elements.
       */
      sum(): Chainable<number>;
    }
  }
}

Cypress.Commands.add(
  "sum",
  { prevSubject: true },
  (subject: ArrayLike<number>) => {
    const yielded = Cypress._.reduce(subject, Cypress._.add, 0);

    Cypress.log({
      name: "sum",
      message: [subject, yielded],
      consoleProps: () => ({
        subject: subject,
        result: yielded,
      }),
    });

    return yielded;
  },
);

export {};
