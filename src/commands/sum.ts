import { logCommand, updateConsoleProps, updateLogMessage } from "../util";

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
    const log = logCommand("sum", {
      message: [subject],
      consoleProps: { subject },
    });

    const yielded = Cypress._.reduce(subject, Cypress._.add, 0);

    updateLogMessage(log, yielded);
    updateConsoleProps(log, { result: yielded });

    return yielded;
  },
);

export {};
