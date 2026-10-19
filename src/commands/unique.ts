declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Yields the subject without any duplicates.
       *
       * @param sorted Boolean indicating whether the yielded array should also be sorted. (default = false)
       */
      unique<T>(sorted?: boolean): Chainable<T[]>;
    }
  }
}

Cypress.Commands.add(
  "unique",
  { prevSubject: true },
  (subject: ArrayLike<unknown>, sorted: boolean = false) => {
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

export {};
