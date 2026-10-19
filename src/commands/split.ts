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
    let yielded = Cypress._.split(subject, separator);

    if (filterEmptyElements) {
      yielded = Cypress._.filter(yielded);
    }

    Cypress.log({
      name: "split",
      message: [separator.toString()],
      consoleProps: () => ({
        subject,
        separator: separator.toString(),
        yielded,
        "Filter empty elements": filterEmptyElements,
      }),
    });

    return yielded;
  },
);

export {};
