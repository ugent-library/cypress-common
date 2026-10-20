import { logCommand, updateConsoleProps } from "../util";

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

const COMMAND_NAME = "at";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: true },
  (subject: ArrayLike<unknown>, index: number) => {
    const log = logCommand(COMMAND_NAME, {
      message: index,
      consoleProps: { subject, index },
    });

    const yielded = Cypress._.nth(subject, index);

    updateConsoleProps(log, { yielded });

    return yielded;
  },
);

export {};
