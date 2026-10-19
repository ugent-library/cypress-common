declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Yields the element at index n (zero-based) of "array-likes". If n is negative, the n-th element from the end is yielded.
       *
       * @param index The index of the element to yield.
       */
      at<T>(index: number): Chainable<T | undefined>;
    }
  }
}

Cypress.Commands.add(
  "at",
  { prevSubject: true },
  (subject: ArrayLike<unknown>, index: number) => {
    const yielded = Cypress._.nth(subject, index);

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
  },
);

export {};
