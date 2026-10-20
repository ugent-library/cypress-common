import { logCommand, updateConsoleProps } from "../util";

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
    const log = logCommand("unique", {
      message: sorted ? "sorted" : "",
      consoleProps: { subject, sorted },
    });

    const yielded = Cypress._.uniq(subject);

    if (sorted) {
      yielded.sort();
    }

    updateConsoleProps(log, (consoleProps) => {
      consoleProps.yielded = yielded;
    });

    return yielded;
  },
);

export {};
