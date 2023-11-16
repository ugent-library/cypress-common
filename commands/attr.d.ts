declare global {
  export namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get the value of a attribute for the first element in the set of matched elements. Invokes the jQuery attr method.
       *
       * @param attributeName The name of the attribute to get.
       */
      attr(attributeName: string): Chainable

      /**
       * Set one or more attributes for the set of matched elements. Invokes the jQuery attr method.
       *
       * @param attributeName The name of the attribute to set.
       * @param value A value to set for the attribute.
       */
      attr(attributeName: string, value: string | number | null): Chainable<Subject>

      // TODO: Add support for 2 more jQuery overloads .attr(attributes) and .attr(attributeName, function). See: https://api.jquery.com/attr/
    }
  }
}

export {}
