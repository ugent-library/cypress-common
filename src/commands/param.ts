import { getParam } from "../lib/param-helper";
import {
  logCommand,
  NO_LOG,
  updateConsoleProps,
  updateLogMessage,
} from "../util";
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
    const log = logCommand("param", {
      message: name,
      consoleProps: { name, default: defaultValue },
    });

    return urlSubject(subject).then((url) => {
      updateConsoleProps(log, (consoleProps) => {
        consoleProps.subject = url;
      });

      const yielded = getParam(url, name);

      updateLogMessage(log, yielded || "(default)");
      updateConsoleProps(log, (consoleProps) => {
        consoleProps.yielded = yielded;
      });

      return cy.wrap(yielded || defaultValue, NO_LOG);
    });
  },
);
