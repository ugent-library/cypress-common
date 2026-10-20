import { logCommand, updateConsoleProps } from "../util";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get the value of a property for the first element in the set of matched elements. Invokes the jQuery prop method.
       *
       * @param propertyName The name of the property to get.
       */
      prop<T>(propertyName: string): Chainable<T>;

      /**
       * Set one or more properties for the set of matched elements. Invokes the jQuery prop method.
       *
       * @param propertyName The name of the property to set.
       * @param value A value to set for the property.
       */
      prop<T>(propertyName: string, value: T): Chainable<Subject>;

      // TODO: Add support for 2 more jQuery overloads .prop(properties) and .prop(propertyName, function). See: https://api.jquery.com/prop/
    }
  }
}

const COMMAND_NAME = "prop";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: true },
  (subject: JQuery, propertyName: string, value?: unknown) => {
    if (value !== undefined) {
      logCommand(COMMAND_NAME, {
        message: `${propertyName} = ${value}`,
        consoleProps: { propertyName, value },
        $el: subject,
      });

      subject.prop(propertyName, value);

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
