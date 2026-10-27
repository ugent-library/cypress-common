import { getParam } from "../lib/param-helper.js";
import { urlSubject } from "../lib/url-subject.js";
import {
  logCommand,
  NO_LOG,
  updateConsoleProps,
  updateLogMessage,
} from "../util/index.js";

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

const COMMAND_NAME = "param";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: "optional" },
  (subject: unknown, name: string, defaultValue: string | null = null) => {
    const log = logCommand(COMMAND_NAME, {
      message: name,
      consoleProps: { name, default: defaultValue },
    });

    return urlSubject(subject).then((url) => {
      updateConsoleProps(log, { subject: url });

      const yielded = getParam(url, name);

      if (yielded !== null) {
        updateLogMessage(log, yielded === "" ? '""' : yielded);
      } else if (defaultValue !== null) {
        updateLogMessage(log, `(default: ${defaultValue})`);
      }

      updateConsoleProps(log, { yielded });

      return cy.wrap(yielded ?? defaultValue, NO_LOG);
    });
  },
);
