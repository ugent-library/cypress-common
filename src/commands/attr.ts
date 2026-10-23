import {
  logCommand,
  updateConsoleProps,
  updateLogMessage,
} from "../util/index.js";

type AttrValue =
  | string
  | number
  | null
  | ((index: number, attr: string) => string | number | void | undefined);

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get the value of a attribute for the first element in the set of matched elements. Invokes the jQuery attr method.
       *
       * @param attributeName The name of the attribute to get.
       */
      attr(attributeName: string): Chainable<string | undefined>;

      /**
       * Set one or more attributes for the set of matched elements. Invokes the jQuery attr method.
       *
       * @param attributeName The name of the attribute to set.
       * @param value A value to set for the attribute, or `null` to remove it.
       */
      attr(attributeName: string, value: AttrValue): Chainable<Subject>;

      /**
       * Set one or more attributes for the set of matched elements. Invokes the jQuery attr method.
       *
       * @param attributes An object of attribute-value pairs to set.
       */
      attr(attributes: Record<string, AttrValue>): Chainable<Subject>;
    }
  }
}

const COMMAND_NAME = "attr";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: true },
  (
    subject: JQuery,
    attributeName: string | Record<string, unknown>,
    value?: AttrValue,
  ) => {
    if (attributeName !== null && typeof attributeName === "object") {
      const log = logCommand(COMMAND_NAME, {
        consoleProps: { attributes: attributeName },
        $el: subject,
      });

      updateLogMessage(log, attributeName);

      subject.attr(attributeName);

      updateConsoleProps(log, { yielded: subject });

      return subject;
    } else if (value !== undefined) {
      const log = logCommand(COMMAND_NAME, {
        message: `${attributeName} = ${value}`,
        consoleProps: { attributeName, value },
        $el: subject,
      });

      subject.attr(attributeName, value);

      updateConsoleProps(log, { yielded: subject });

      return subject;
    } else {
      const log = logCommand(COMMAND_NAME, {
        message: attributeName,
        consoleProps: { attributeName },
        $el: subject,
      });

      const yielded = subject.attr(attributeName);

      updateConsoleProps(log, { yielded });

      return yielded;
    }
  },
);

export {};
