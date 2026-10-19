declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get the value of a attribute for the first element in the set of matched elements. Invokes the jQuery attr method.
       *
       * @param attributeName The name of the attribute to get.
       */
      attr(attributeName: string): Chainable<string>;

      /**
       * Set one or more attributes for the set of matched elements. Invokes the jQuery attr method.
       *
       * @param attributeName The name of the attribute to set.
       * @param value A value to set for the attribute.
       */
      attr(
        attributeName: string,
        value: string | number | null,
      ): Chainable<Subject>;

      // TODO: Add support for 2 more jQuery overloads .attr(attributes) and .attr(attributeName, function). See: https://api.jquery.com/attr/
    }
  }
}

Cypress.Commands.add(
  "attr",
  { prevSubject: true },
  (
    subject: JQuery,
    attributeName: string,
    value: string | number | null = null,
  ) => {
    if (value) {
      subject.attr(attributeName, value);

      Cypress.log({
        name: "attr",
        message: `${attributeName} = ${value}`,
        consoleProps: () => ({
          attributeName,
          value,
        }),
      });

      return subject;
    } else {
      const yielded = subject.attr(attributeName);

      Cypress.log({
        name: "attr",
        message: attributeName,
        consoleProps: () => ({
          attributeName,
          yielded,
        }),
      });

      return yielded;
    }
  },
);

export {};
