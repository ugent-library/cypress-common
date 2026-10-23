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

    const yielded = Cypress._.uniq(subject);

    if (sorted) {
      yielded.sort();
    }

    updateConsoleProps(log, { yielded });

    return yielded;
  },
);

export {};
