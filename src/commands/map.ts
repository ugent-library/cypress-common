import type { IterateeShorthand } from "lodash";

declare global {
  namespace Cypress {
    type Iteratee<T, U> =
      | ((value: T, index: number | string, collection: T[]) => U)
      | IterateeShorthand<T>;

    interface Chainable {
      /**
       * Maps a set of chained elements using a lodash iteratee.
       *
       * @param iteratee The function invoked per iteration.
       */
      map<T, U>(iteratee: Iteratee<T, U>): Chainable<U[]>;
    }
  }
}

Cypress.Commands.add(
  "map",
  { prevSubject: true },
  (
    subject: ArrayLike<unknown>,
    iteratee: Cypress.Iteratee<unknown, unknown>,
  ) => {
    const yielded = Cypress._.map<unknown, unknown>(
      subject,
      Cypress._.iteratee(iteratee),
    );

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
  },
);
