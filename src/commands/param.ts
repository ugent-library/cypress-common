import { getParam } from "../lib/param-helper";
import { urlSubject } from "./url-subject";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Read a query parameter from the current location or from a chained string or object with `toString` method.
       *
       * @param name The name of the query parameter.
       * @param defaultValue The value to return if the query parameter is not present on the subject. (optional)
       */
      param(
        name: string,
        defaultValue?: string,
      ): Chainable<string | string[] | null>;
    }
  }
}

Cypress.Commands.add(
  "param",
  { prevSubject: "optional" },
  (subject: unknown, name: string, defaultValue: string | null = null) => {
    return urlSubject(subject).then((url) => {
      const yielded = getParam(url, name);

      Cypress.log({
        name: "param",
        message: [name, yielded || "(default)"],
        consoleProps: () => ({
          subject: url,
          name,
          yielded,
          default: defaultValue,
        }),
      });

      return cy.wrap(yielded || defaultValue, { log: false });
    });
  },
);
