import {
  logCommand,
  updateConsoleProps,
  updateLogMessage,
} from "../util/index.js";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get the value of a property for the first element in the set of matched elements. Invokes the jQuery prop method.
       *
       * @param propertyName The name of the property to get.
       */
      prop<T>(propertyName: string): Chainable<T | undefined>;

      /**
       * Set one property for the set of matched elements. Invokes the jQuery prop method.
       *
       * @param propertyName The name of the property to set.
       * @param value A value to set for the property.
       */
      prop<T>(propertyName: string, value: T): Chainable<Subject>;

      /**
       * Set one or more properties for the set of matched elements. Invokes the jQuery prop method.
       *
       * @param properties An object of property-value pairs to set.
       */
      prop(properties: Record<string, unknown>): Chainable<Subject>;
    }
  }
}

const COMMAND_NAME = "prop";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: true },
  (
    subject: JQuery,
    propertyName: string | Record<string, unknown>,
    value?: unknown,
  ) => {
    if (propertyName !== null && typeof propertyName === "object") {
      const log = logCommand(COMMAND_NAME, {
        consoleProps: { properties: propertyName },
        $el: subject,
      });

      updateLogMessage(log, propertyName);

      subject.prop(propertyName);

      updateConsoleProps(log, { yielded: subject });

      return subject;
    } else if (value !== undefined) {
      const log = logCommand(COMMAND_NAME, {
        message: `${propertyName} = ${value}`,
        consoleProps: { propertyName, value },
        $el: subject,
      });

      subject.prop(propertyName, value);

      updateConsoleProps(log, { yielded: subject });

      return subject;
    } else {
      const log = logCommand(COMMAND_NAME, {
        message: propertyName,
        consoleProps: { propertyName },
        $el: subject,
      });

      const yielded = subject.prop(propertyName);

      updateConsoleProps(log, { yielded });

      return yielded;
    }
  },
);

export {};
