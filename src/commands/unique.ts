import { logCommand, updateConsoleProps } from "../util/index.js";

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

const COMMAND_NAME = "unique";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: true },
  (subject: ArrayLike<unknown>, sorted: boolean = false) => {
    const log = logCommand(COMMAND_NAME, {
      message: sorted ? "sorted" : "",
      consoleProps: { subject, sorted },
    });

    const uniqueValues = Cypress._.uniq(subject);
    // sortBy compares values directly, so numbers are not sorted as strings like Array.prototype.sort does
    const yielded = sorted ? Cypress._.sortBy(uniqueValues) : uniqueValues;

    updateConsoleProps(log, { yielded });

    return yielded;
  },
);
