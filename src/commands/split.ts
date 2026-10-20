import { logCommand, updateConsoleProps } from "../util";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Splits the subject string in multiple elements based on a delimiter.
       *
       * @param separator The separator pattern to split by. (default = empty string which splits every character)
       * @param filterEmptyElements Boolean indicating whether falsy values should be filtered from the yielded results. (default = false)
       */
      split(
        separator?: string | RegExp,
        filterEmptyElements?: boolean,
      ): Chainable<string[]>;
    }
  }
}

Cypress.Commands.add(
  "split",
  { prevSubject: true },
  (
    subject: string,
    separator: string | RegExp = "",
    filterEmptyElements: boolean = false,
  ) => {
    const log = logCommand("split", {
      message: separator.toString(),
      consoleProps: {
        subject,
        separator: separator.toString(),
        "Filter empty elements": filterEmptyElements,
      },
    });

    let yielded = Cypress._.split(subject, separator);

    if (filterEmptyElements) {
      yielded = Cypress._.filter(yielded);
    }

    updateConsoleProps(log, { yielded });

    return yielded;
  },
);

export {};
